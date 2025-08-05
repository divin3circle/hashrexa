// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

// Hedera HTS precompile address
address constant HTS_PRECOMPILE = address(0x167);
int64 constant HAPI_SUCCESS = 22;

// Interface for HTS transfer
interface IHTS {
    function transferToken(address token, address from, address to, int64 amount) external returns (int64 responseCode);
    function balanceOf(address token, address account) external view returns (uint256);
}

contract LendingPool {
    // Supported tokens
    address public constant dAAPL = 0x000000000000000000000000000000000062D297;
    address public constant HASH  = 0x0000000000000000000000000000000000631766;
    address public owner;

    int64 public interestRate = 500;      // 5% annual
    int64 public ltv = 7000;              // 70% Loan-To-Value
    int64 public liquidationThreshold = 8000; // 80% Liquidation threshold

    // User positions
    struct Position {
        int64 suppliedHASH;
        int64 borrowedHASH;
        int64 collateralDAAPL;
        uint256 lastInterestBlock;
    }
    mapping(address => Position) public positions;

    // Events
    event DepositHASH(address indexed user, int64 amount);
    event WithdrawHASH(address indexed user, int64 amount);
    event DepositCollateral(address indexed user, int64 amount);
    event BorrowHASH(address indexed user, int64 amount);
    event RepayHASH(address indexed user, int64 amount);
    event Liquidate(address indexed user, int64 repaid, int64 collateralSeized);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Deposit HASH to pool
    function depositHASH(int64 amount) external {
        require(amount > 0, "Amount required");
        require(_htsTransfer(HASH, msg.sender, address(this), amount), "HASH transfer failed");
        positions[msg.sender].suppliedHASH += amount;
        emit DepositHASH(msg.sender, amount);
    }

    // Withdraw supplied HASH
    function withdrawHASH(int64 amount) external {
        require(amount > 0, "Amount required");
        require(positions[msg.sender].suppliedHASH >= amount, "Insufficient supply");
        positions[msg.sender].suppliedHASH -= amount;
        require(_htsTransfer(HASH, address(this), msg.sender, amount), "HASH withdrawal failed");
        emit WithdrawHASH(msg.sender, amount);
    }

    // Deposit dAAPL as collateral
    function depositCollateral(int64 amount) external {
        require(amount > 0, "Amount required");
        require(_htsTransfer(dAAPL, msg.sender, address(this), amount), "dAAPL transfer failed");
        positions[msg.sender].collateralDAAPL += amount;
        emit DepositCollateral(msg.sender, amount);
    }

    // Borrow HASH against dAAPL collateral
    function borrowHASH(int64 amount) external {
        require(amount > 0, "Amount required");
        int64 maxBorrow = (positions[msg.sender].collateralDAAPL * int64(ltv)) / 10000;
        require(positions[msg.sender].borrowedHASH + amount <= maxBorrow, "Exceeds LTV");
        require(_htsTransfer(HASH, address(this), msg.sender, amount), "HASH borrow transfer failed");
        positions[msg.sender].borrowedHASH += amount;
        positions[msg.sender].lastInterestBlock = block.number;
        emit BorrowHASH(msg.sender, amount);
    }

    // Repay borrowed HASH
    function repayHASH(int64 amount) external {
        require(amount > 0, "Amount required");
        require(positions[msg.sender].borrowedHASH >= amount, "Too much repayment");
        require(_htsTransfer(HASH, msg.sender, address(this), amount), "HASH repay transfer failed");
        positions[msg.sender].borrowedHASH -= amount;
        emit RepayHASH(msg.sender, amount);
    }

    // Interest accrual (simple annual, block-based)
    // function accruedInterest(address user) public view returns (int64) {
    //     Position memory pos = positions[user];
    //     uint256 blocksElapsed = block.number - pos.lastInterestBlock;
    //     if (pos.borrowedHASH == 0 || blocksElapsed == 0) return 0;
    //     // 2102400 blocks/year (approx Hedera block rate)
    //     int64 blocksElapsedInt64 = int64(blocksElapsed);
    //     int64 interest = (pos.borrowedHASH * interestRate * blocksElapsedInt64) / (2102400 * 10000);
    //     return interest;
    // }

    // Liquidate undercollateralized positions (owner only)
    function liquidate(address user) external onlyOwner {
        Position storage pos = positions[user];
        int64 maxDebt = (pos.collateralDAAPL * liquidationThreshold) / 10000;
        require(pos.borrowedHASH > maxDebt, "Healthy position");

        int64 repayAmt = pos.borrowedHASH;
        int64 collateralSeized = pos.collateralDAAPL;

        // Repay debt and seize collateral
        require(_htsTransfer(HASH, address(this), owner, repayAmt), "HASH transfer failed");
        require(_htsTransfer(dAAPL, address(this), owner, collateralSeized), "dAAPL transfer failed");

        pos.borrowedHASH = 0;
        pos.collateralDAAPL = 0;

        emit Liquidate(user, repayAmt, collateralSeized);
    }

    // Owner can adjust config
    function setInterestRate(int64 rate) external onlyOwner {
        interestRate = rate;
    }
    function setLTV(int64 newLTV) external onlyOwner {
        ltv = newLTV;
    }
    function setLiquidationThreshold(int64 newThresh) external onlyOwner {
        liquidationThreshold = newThresh;
    }

    function _htsTransfer(address token, address from, address to, int64 amount) internal returns (bool) {
        (bool success, bytes memory result) = HTS_PRECOMPILE.call(
            abi.encodeWithSignature("transferToken(address,address,address,int64)", token, from, to, amount)
        );
        if (!success) return false;
        int64 responseCode = abi.decode(result, (int64));
        return responseCode == HAPI_SUCCESS;
    }
}