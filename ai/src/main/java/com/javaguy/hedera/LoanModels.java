package com.javaguy.hedera;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;

public class LoanModels {

    // User and Account Models
    public record UserAccount(
            String hederaAccountId,
            String privateKey,
            String publicKey,
            String topicId,
            Instant createdAt,
            UserProfile profile,
            Portfolio portfolio
    ) {}

    public record UserProfile(
            String userId,
            String email,
            CreditScore creditScore,
            RiskProfile riskProfile,
            List<String> verifiedAssets
    ) {}

    public record Portfolio(
            String accountId,
            BigDecimal totalValue,
            BigDecimal availableCollateral,
            BigDecimal lockedCollateral,
            List<Asset> assets,
            List<TokenizedAsset> tokenizedAssets,
            Instant lastUpdated
    ) {}

    public record Asset(
            String symbol,
            String name,
            BigDecimal quantity,
            BigDecimal currentPrice,
            BigDecimal totalValue,
            AssetType type,
            boolean isCollateralEligible,
            BigDecimal collateralRatio
    ) {}

    public record TokenizedAsset(
            String tokenId,
            String originalAssetSymbol,
            BigDecimal tokenizedAmount,
            BigDecimal backingValue,
            Instant tokenizationDate,
            String tokenizationTransactionId
    ) {}

    // Loan Models
    public record LoanRequest(
            String borrowerAccountId,
            BigDecimal requestedAmount,
            String collateralTokenId,
            BigDecimal collateralAmount,
            Integer termDays,
            BigDecimal maxAcceptableAPY,
            LoanPurpose purpose
    ) {}

    public record LoanOffer(
            String lenderAccountId,
            BigDecimal amount,
            BigDecimal apy,
            Integer termDays,
            BigDecimal requiredCollateralRatio,
            List<String> acceptedCollateralTokens,
            Instant expiresAt
    ) {}

    public record ActiveLoan(
            String loanId,
            String borrowerAccountId,
            String lenderAccountId,
            BigDecimal principalAmount,
            BigDecimal currentBalance,
            BigDecimal apy,
            String collateralTokenId,
            BigDecimal collateralAmount,
            BigDecimal collateralValue,
            Instant startDate,
            Instant dueDate,
            LoanStatus status,
            List<PaymentSchedule> paymentSchedule,
            String loanContractId,
            String auditTopicId
    ) {}

    public record PaymentSchedule(
            String paymentId,
            BigDecimal amount,
            Instant dueDate,
            boolean isPaid,
            String transactionId
    ) {}

    // HCS Integration Models
    public record LoanEvent(
            String eventId,
            String loanId,
            String userAccountId,
            LoanEventType eventType,
            Map<String, Object> eventData,
            Instant timestamp,
            String transactionId
    ) {}

    public record CollateralEvent(
            String eventId,
            String loanId,
            String tokenId,
            BigDecimal amount,
            BigDecimal value,
            CollateralEventType eventType,
            Instant timestamp,
            String transactionId
    ) {}

    // Enums
    public enum AssetType {
        STOCK, CRYPTO, COMMODITY, REAL_ESTATE, TOKEN
    }

    public enum LoanPurpose {
        INVESTMENT, PERSONAL, BUSINESS, REFINANCING, OTHER
    }

    public enum LoanStatus {
        PENDING, ACTIVE, DEFAULTED, LIQUIDATING, PAID_OFF, CANCELLED
    }

    public enum CreditScore {
        EXCELLENT(750, 850),
        GOOD(700, 749),
        FAIR(650, 699),
        POOR(600, 649),
        VERY_POOR(300, 599);

        private final int min;
        private final int max;

        CreditScore(int min, int max) {
            this.min = min;
            this.max = max;
        }

        public int getMin() { return min; }
        public int getMax() { return max; }
    }

    public enum RiskProfile {
        CONSERVATIVE, MODERATE, AGGRESSIVE, VERY_AGGRESSIVE
    }

    public enum LoanEventType {
        LOAN_REQUESTED,
        LOAN_APPROVED,
        LOAN_FUNDED,
        PAYMENT_MADE,
        PAYMENT_MISSED,
        COLLATERAL_ADDED,
        COLLATERAL_LIQUIDATED,
        LOAN_DEFAULTED,
        LOAN_PAID_OFF
    }

    public enum CollateralEventType {
        DEPOSITED,
        WITHDRAWN,
        LIQUIDATED,
        VALUE_UPDATED,
        MARGIN_CALL_TRIGGERED
    }

    // Request/Response Models for API
    public record UserRegistrationRequest(
            String hederaAccountId,
            String email,
            String topicId
    ) {}

    public record TokenizePortfolioRequest(
            String userAccountId,
            List<AssetTokenizationRequest> assets
    ) {}

    public record AssetTokenizationRequest(
            String assetSymbol,
            BigDecimal amount,
            String tokenName,
            String tokenSymbol
    ) {}

    public record LoanApplicationRequest(
            String borrowerAccountId,
            BigDecimal requestedAmount,
            String collateralAssetSymbol,
            BigDecimal collateralAmount,
            int termDays,
            LoanPurpose purpose
    ) {}

    public record CollateralDepositRequest(
            String loanId,
            String tokenId,
            BigDecimal amount
    ) {}

    public record LoanPaymentRequest(
            String loanId,
            BigDecimal amount,
            String paymentTokenId
    ) {}
}


