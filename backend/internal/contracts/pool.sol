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

    // Pool config (industry standard; can be changed by owner)
    uint256 public interestRate = 500;      // 5% annual
    uint256 public ltv = 7000;              // 70% Loan-To-Value
    uint256 public liquidationThreshold = 8000; // 80% Liquidation threshold

    // User positions
    struct Position {
        uint256 suppliedHASH;
        uint256 borrowedHASH;
        uint256 collateralDAAPL;
        uint256 lastInterestBlock;
    }
    mapping(address => Position) public positions;

    // Events
    event DepositHASH(address indexed user, uint256 amount);
    event WithdrawHASH(address indexed user, uint256 amount);
    event DepositCollateral(address indexed user, uint256 amount);
    event BorrowHASH(address indexed user, uint256 amount);
    event RepayHASH(address indexed user, uint256 amount);
    event Liquidate(address indexed user, uint256 repaid, uint256 collateralSeized);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Deposit HASH to pool
    function depositHASH(uint256 amount) external {
        require(amount > 0, "Amount required");
        require(_htsTransfer(HASH, msg.sender, address(this), amount), "HASH transfer failed");
        positions[msg.sender].suppliedHASH += amount;
        emit DepositHASH(msg.sender, amount);
    }

    // Withdraw supplied HASH
    function withdrawHASH(uint256 amount) external {
        require(amount > 0, "Amount required");
        require(positions[msg.sender].suppliedHASH >= amount, "Insufficient supply");
        positions[msg.sender].suppliedHASH -= amount;
        require(_htsTransfer(HASH, address(this), msg.sender, amount), "HASH withdrawal failed");
        emit WithdrawHASH(msg.sender, amount);
    }

    // Deposit dAAPL as collateral
    function depositCollateral(uint256 amount) external {
        require(amount > 0, "Amount required");
        require(_htsTransfer(dAAPL, msg.sender, address(this), amount), "dAAPL transfer failed");
        positions[msg.sender].collateralDAAPL += amount;
        emit DepositCollateral(msg.sender, amount);
    }

    // Borrow HASH against dAAPL collateral
    function borrowHASH(uint256 amount) external {
        require(amount > 0, "Amount required");
        uint256 maxBorrow = (positions[msg.sender].collateralDAAPL * ltv) / 10000;
        require(positions[msg.sender].borrowedHASH + amount <= maxBorrow, "Exceeds LTV");
        require(_htsTransfer(HASH, address(this), msg.sender, amount), "HASH borrow transfer failed");
        positions[msg.sender].borrowedHASH += amount;
        positions[msg.sender].lastInterestBlock = block.number;
        emit BorrowHASH(msg.sender, amount);
    }

    // Repay borrowed HASH
    function repayHASH(uint256 amount) external {
        require(amount > 0, "Amount required");
        require(positions[msg.sender].borrowedHASH >= amount, "Too much repayment");
        require(_htsTransfer(HASH, msg.sender, address(this), amount), "HASH repay transfer failed");
        positions[msg.sender].borrowedHASH -= amount;
        emit RepayHASH(msg.sender, amount);
    }

    // Interest accrual (simple annual, block-based)
    function accruedInterest(address user) public view returns (uint256) {
        Position memory pos = positions[user];
        uint256 blocksElapsed = block.number - pos.lastInterestBlock;
        if (pos.borrowedHASH == 0 || blocksElapsed == 0) return 0;
        // 2102400 blocks/year (approx Hedera block rate)
        uint256 interest = (pos.borrowedHASH * interestRate * blocksElapsed) / (2102400 * 10000);
        return interest;
    }

    // Liquidate undercollateralized positions (owner only)
    function liquidate(address user) external onlyOwner {
        Position storage pos = positions[user];
        uint256 maxDebt = (pos.collateralDAAPL * liquidationThreshold) / 10000;
        require(pos.borrowedHASH > maxDebt, "Healthy position");

        uint256 repayAmt = pos.borrowedHASH;
        uint256 collateralSeized = pos.collateralDAAPL;

        // Repay debt and seize collateral
        require(_htsTransfer(HASH, address(this), owner, repayAmt), "HASH transfer failed");
        require(_htsTransfer(dAAPL, address(this), owner, collateralSeized), "dAAPL transfer failed");

        pos.borrowedHASH = 0;
        pos.collateralDAAPL = 0;

        emit Liquidate(user, repayAmt, collateralSeized);
    }

    // Owner can adjust config
    function setInterestRate(uint256 rate) external onlyOwner {
        interestRate = rate;
    }
    function setLTV(uint256 newLTV) external onlyOwner {
        ltv = newLTV;
    }
    function setLiquidationThreshold(uint256 newThresh) external onlyOwner {
        liquidationThreshold = newThresh;
    }

    // Internal HTS transfer
    function _htsTransfer(address token, address from, address to, uint256 amount) internal returns (bool) {
        (bool success, bytes memory result) = HTS_PRECOMPILE.call(
            abi.encodeWithSignature("transferToken(address,address,address,int64)", token, from, to, int64(int256(amount)))
        );
        if (!success) return false;
        int64 responseCode = abi.decode(result, (int64));
        return responseCode == HAPI_SUCCESS;
    }
}