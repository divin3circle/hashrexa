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

// Supra Oracle interface
interface ISupraOracle {
    function getLatestPrice(uint256 pairId) external view returns (uint256 price, uint256 timestamp);
}

contract LendingPool {
    // Supported tokens
    address public constant dAAPL = 0x000000000000000000000000000000000062D297;
    address public constant HASH  = 0x0000000000000000000000000000000000631766;
    address public owner;

    int64 public interestRate = 500;      // 5% annual
    int64 public ltv = 7000;              // 70% Loan-To-Value
    int64 public liquidationThreshold = 8000; // 80% Liquidation threshold

    // Supra Oracle address for Hedera testnet
    address public supraOracleAddress = 0x6bf7b21145Cbd7BB0b9916E6eB24EDA8A675D7C0;
    // Storage Contract: 0x6Cd59830AAD978446e6cc7f6cc173aF7656Fb917
    
    // Pair IDs for Supra Oracle
    uint256 public constant AAPL_USD_PAIR_ID = 6004; // AAPL_USD from Supra
    uint256 public constant USDC_USDT_PAIR_ID = 47;  // USDC_USDT from Supra
    
    // Fallback prices (in USD cents) - used if oracle fails
    int64 public constant FALLBACK_AAPL_PRICE = 20417; 
    int64 public constant FALLBACK_HASH_PRICE = 100;   

    // User positions
    struct Position {
        int64 suppliedHASH;
        int64 borrowedHASH;
        int64 collateralDAAPL;
        uint256 lastInterestBlock;
    }
    mapping(address => Position) public positions;

    // Pool parameters struct
    struct PoolParameters {
        int64 ltv;
        int64 interestRate;
        int64 liquidationThreshold;
    }

    // Address details struct
    struct AddressDetails {
        int64 loanHealth;        // Percentage (0-10000, where 10000 = 100%)
        int64 userPosition;      // Net position value in USD cents
        int64 feesEarned;        // Fees earned from supplying HASH
        int64 suppliedHASH;
        int64 borrowedHASH;
        int64 collateralDAAPL;
    }

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

    function getAAPLPrice() public view returns (int64) {
        if (supraOracleAddress == address(0)) {
            return FALLBACK_AAPL_PRICE;
        }
        
        try ISupraOracle(supraOracleAddress).getLatestPrice(AAPL_USD_PAIR_ID) returns (uint256 price, uint256) {
            // Convert price to cents (assuming 8 decimals from oracle)
            return int64(uint64(price / 1e6)); // Convert to cents
        } catch {
            
            return FALLBACK_AAPL_PRICE;
        }
    }

    function getHASHPrice() public view returns (int64) {
        if (supraOracleAddress == address(0)) {
            return FALLBACK_HASH_PRICE;
        }
        
        try ISupraOracle(supraOracleAddress).getLatestPrice(USDC_USDT_PAIR_ID) returns (uint256 price, uint256) {
            // Convert price to cents (assuming 8 decimals from oracle)
            return int64(uint64(price / 1e6)); // Convert to cents
        } catch {
            return FALLBACK_HASH_PRICE;
        }
    }

    // Calculate accrued interest for a user
    function accruedInterest(address user) public view returns (int64) {
        Position memory pos = positions[user];
        int64 blocksElapsed = int64(uint64(block.number - pos.lastInterestBlock));
        if (pos.borrowedHASH == 0 || blocksElapsed <= 0) return 0;
        // 2102400 blocks/year (approx Hedera block rate)
        int64 interest = (pos.borrowedHASH * interestRate * blocksElapsed) / (2102400 * 10000);
        return interest;
    }

    function getPoolBalances() external view returns (int64 dAAPLBalance, int64 hashBalance) {
        IHTS hts = IHTS(HTS_PRECOMPILE);
        dAAPLBalance = int64(uint64(hts.balanceOf(dAAPL, address(this))));
        hashBalance = int64(uint64(hts.balanceOf(HASH, address(this))));
    }

    function getPoolParameters() external view returns (PoolParameters memory) {
        return PoolParameters({
            ltv: ltv,
            interestRate: interestRate,
            liquidationThreshold: liquidationThreshold
        });
    }

    function getAddressDetails(address user) external view returns (AddressDetails memory) {
        Position memory pos = positions[user];
        
        // Get real-time prices from Supra Oracle
        int64 currentAAPLPrice = getAAPLPrice();
        int64 currentHASHPrice = getHASHPrice();
        
        // Calculate values in USD cents using real-time prices
        int64 collateralValue = (pos.collateralDAAPL * currentAAPLPrice) / 100; // dAAPL has 2 decimals
        // int64 borrowedValue = (pos.borrowedHASH * currentHBARPrice) / 1_000_000; // HASH has 6 decimals
        
        // Include accrued interest in borrowed amount
        int64 totalBorrowed = pos.borrowedHASH + accruedInterest(user);
        int64 totalBorrowedValue = (totalBorrowed * currentHASHPrice) / 1_000_000;
        
        // Calculate loan health with real-time prices and accrued interest
        int64 loanHealth = 10000; 
        if (totalBorrowedValue > 0 && collateralValue > 0) {
            int64 healthRatio = (collateralValue * liquidationThreshold) / (totalBorrowedValue * 10000);
            loanHealth = healthRatio;
            if (loanHealth > 10000) loanHealth = 10000; 
            if (loanHealth < 0) loanHealth = 0;
        }
        
        int64 userPosition = collateralValue - totalBorrowedValue;

        int64 feesEarned = 0;
        if (pos.suppliedHASH > 0) {
            int64 blocksElapsed = int64(uint64(block.number - pos.lastInterestBlock));
            if (blocksElapsed > 0) {
                feesEarned = (pos.suppliedHASH * interestRate * blocksElapsed) / (2102400 * 10000);
            }
        }
        
        return AddressDetails({
            loanHealth: loanHealth,
            userPosition: userPosition,
            feesEarned: feesEarned,
            suppliedHASH: pos.suppliedHASH,
            borrowedHASH: pos.borrowedHASH,
            collateralDAAPL: pos.collateralDAAPL
        });
    }

    function getPoolAndUserData(address user) external view returns (
        int64 dAAPLBalance,
        int64 hashBalance,
        PoolParameters memory poolParams,
        AddressDetails memory userDetails
    ) {
        (dAAPLBalance, hashBalance) = this.getPoolBalances();
        poolParams = this.getPoolParameters();
        userDetails = this.getAddressDetails(user);
    }

    function depositHASH(int64 amount) external {
        require(amount > 0, "Amount required");
        require(_htsTransfer(HASH, msg.sender, address(this), amount), "HASH transfer failed");
        positions[msg.sender].suppliedHASH += amount;
        emit DepositHASH(msg.sender, amount);
    }

    function withdrawHASH(int64 amount) external {
        require(amount > 0, "Amount required");
        require(positions[msg.sender].suppliedHASH >= amount, "Insufficient supply");
        positions[msg.sender].suppliedHASH -= amount;
        require(_htsTransfer(HASH, address(this), msg.sender, amount), "HASH withdrawal failed");
        emit WithdrawHASH(msg.sender, amount);
    }

    function depositCollateral(int64 amount) external {
        require(amount > 0, "Amount required");
        require(_htsTransfer(dAAPL, msg.sender, address(this), amount), "dAAPL transfer failed");
        positions[msg.sender].collateralDAAPL += amount;
        emit DepositCollateral(msg.sender, amount);
    }

    function borrowHASH(int64 amount) external {
        require(amount > 0, "Amount required");
        int64 maxBorrow = (positions[msg.sender].collateralDAAPL * int64(ltv)) / 10000;
        require(positions[msg.sender].borrowedHASH + amount <= maxBorrow, "Exceeds LTV");
        require(_htsTransfer(HASH, address(this), msg.sender, amount), "HASH borrow transfer failed");
        positions[msg.sender].borrowedHASH += amount;
        positions[msg.sender].lastInterestBlock = block.number;
        emit BorrowHASH(msg.sender, amount);
    }

    function repayHASH(int64 amount) external {
        require(amount > 0, "Amount required");
        require(positions[msg.sender].borrowedHASH >= amount, "Too much repayment");
        require(_htsTransfer(HASH, msg.sender, address(this), amount), "HASH repay transfer failed");
        positions[msg.sender].borrowedHASH -= amount;
        emit RepayHASH(msg.sender, amount);
    }

    
    function liquidate(address user) external onlyOwner {
        Position storage pos = positions[user];
        int64 maxDebt = (pos.collateralDAAPL * liquidationThreshold) / 10000;
        require(pos.borrowedHASH > maxDebt, "Healthy position");

        int64 repayAmt = pos.borrowedHASH;
        int64 collateralSeized = pos.collateralDAAPL;

        require(_htsTransfer(HASH, address(this), owner, repayAmt), "HASH transfer failed");
        require(_htsTransfer(dAAPL, address(this), owner, collateralSeized), "dAAPL transfer failed");

        pos.borrowedHASH = 0;
        pos.collateralDAAPL = 0;

        emit Liquidate(user, repayAmt, collateralSeized);
    }

    function setInterestRate(int64 rate) external onlyOwner {
        interestRate = rate;
    }
    function setLTV(int64 newLTV) external onlyOwner {
        ltv = newLTV;
    }
    function setLiquidationThreshold(int64 newThresh) external onlyOwner {
        liquidationThreshold = newThresh;
    }

    function setSupraOracleAddress(address oracleAddress) external onlyOwner {
        supraOracleAddress = oracleAddress;
    }

    function testPriceFeeds() external view returns (
        int64 aaplPrice,
        int64 usdcPrice,
        bool aaplOracleWorking,
        bool usdcOracleWorking,
        uint256 aaplTimestamp,
        uint256 usdcTimestamp
    ) {
        if (supraOracleAddress == address(0)) {
            aaplPrice = FALLBACK_AAPL_PRICE;
            aaplOracleWorking = false;
            aaplTimestamp = 0;
        } else {
            try ISupraOracle(supraOracleAddress).getLatestPrice(AAPL_USD_PAIR_ID) returns (uint256 price, uint256) {
                aaplPrice = int64(uint64(price / 1e6));
                aaplOracleWorking = true;
                aaplTimestamp = block.timestamp;
            } catch {
                aaplPrice = FALLBACK_AAPL_PRICE;
                aaplOracleWorking = false;
                aaplTimestamp = 0;
            }
        }

        if (supraOracleAddress == address(0)) {
            usdcPrice = FALLBACK_HASH_PRICE;
            usdcOracleWorking = false;
            usdcTimestamp = 0;
        } else {
            try ISupraOracle(supraOracleAddress).getLatestPrice(USDC_USDT_PAIR_ID) returns (uint256 price, uint256) {
                usdcPrice = int64(uint64(price / 1e6));
                usdcOracleWorking = true;
                usdcTimestamp = block.timestamp;
            } catch {
                usdcPrice = FALLBACK_HASH_PRICE;
                usdcOracleWorking = false;
                usdcTimestamp = 0;
            }
        }
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