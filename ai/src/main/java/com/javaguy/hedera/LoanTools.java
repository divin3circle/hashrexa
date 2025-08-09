package com.javaguy.hedera;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class LoanTools {
    private final BackendClient backendClient;
    private final PortfolioService portfolioService;

    public LoanTools(BackendClient backendClient, PortfolioService portfolioService) {
        this.backendClient = backendClient;
        this.portfolioService = portfolioService;
    }

    @Tool(description = "Register user by Hedera account and HCS topic (calls Go backend)")
    public String registerUser(
            @ToolParam(description = "Hedera account ID") String accountId,
            @ToolParam(description = "User email") String email,
            @ToolParam(description = "HCS topic ID") String topicId
    ) {
        var resp = backendClient.registerUser(accountId, topicId);
        boolean ok = resp != null && Boolean.TRUE.equals(resp.get("success"));
        return ok ? "✅ Registration successful" : "❌ Registration failed";
    }

    @Tool(description = "Get user's portfolio via Go backend")
    public String getUserPortfolio(@ToolParam(description = "Hedera account ID") String accountId) {
        var p = portfolioService.getUserPortfolio(accountId);
        StringBuilder sb = new StringBuilder();
        sb.append("Portfolio for ").append(accountId).append("\n");
        sb.append("Total: $").append(p.totalValue()).append("\n");
        sb.append("Available Collateral: $").append(p.availableCollateral()).append("\n");
        sb.append("Tokenized assets: ").append(p.tokenizedAssets().size());
        return sb.toString();
    }

    @Tool(description = "Calculate borrowing power using available collateral")
    public String calculateBorrowingPower(@ToolParam(description = "Hedera account ID") String accountId) {
        var p = portfolioService.getUserPortfolio(accountId);
        BigDecimal a = p.availableCollateral();
        return "Borrowing Power\n" +
                "50% LTV: $" + a.multiply(new BigDecimal("0.50")) + "\n" +
                "60% LTV: $" + a.multiply(new BigDecimal("0.60")) + "\n" +
                "67% LTV: $" + a.multiply(new BigDecimal("0.67"));
    }

    @Tool(description = "Get user's active loans and their current status (demo)")
    public String getUserLoans(@ToolParam(description = "Hedera account ID") String accountId) {
        // No loan storage in current Go backend; return a helpful default
        return "No active loans found for " + accountId + ".";
    }

    @Tool(description = "Tokenize eligible assets via Go backend")
    public String tokenizePortfolio(@ToolParam(description = "Hedera account ID") String accountId) {
        boolean ok = portfolioService.tokenizePortfolio(accountId);
        return ok ? "✅ Tokenization started" : "❌ Tokenization failed";
    }
}


