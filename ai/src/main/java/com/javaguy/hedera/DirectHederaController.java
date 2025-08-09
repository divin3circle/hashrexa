package com.javaguy.hedera;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/direct")
@CrossOrigin(origins = "*")
@Tag(name = "Direct Hedera Operations", description = "Direct blockchain operations for Hedera network")
public class DirectHederaController {

    private static final Logger logger = LoggerFactory.getLogger(DirectHederaController.class);
    private final HederaService hederaService;

    public DirectHederaController(HederaService hederaService) {
        this.hederaService = hederaService;
    }

    @GetMapping("/balance/{accountId}")
    @Operation(summary = "Check Account Balance", description = "Retrieves the HBAR balance for a specified Hedera account ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Balance retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid account ID format"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseWrapper checkBalance(
            @Parameter(description = "Hedera account ID in format 0.0.xxxxx", example = "0.0.5800339")
            @PathVariable String accountId
    ) {
        try {
            logger.info("Direct test: Checking balance for account: {}", accountId);
            BlockchainModels.BalanceQuery request = new BlockchainModels.BalanceQuery(accountId);
            BlockchainModels.OperationResult result = hederaService.getAccountBalance(request);

            return new ResponseWrapper(
                    result.success(),
                    result.success() ? result.message() : result.error(),
                    result.transactionId(),
                    result.data()
            );
        } catch (Exception e) {
            logger.error("Direct balance test failed: {}", e.getMessage(), e);
            return new ResponseWrapper(false, "Exception: " + e.getMessage(), null, null);
        }
    }

    @PostMapping("/token/create")
    @Operation(summary = "Create New Token", description = "Creates a new fungible token on the Hedera network")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Token created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid token parameters"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseWrapper createToken(@RequestBody CreateTokenRequest request) {
        try {
            logger.info("Direct test: Creating token {} ({})", request.name(), request.symbol());
            BlockchainModels.TokenCreateRequest tokenRequest = new BlockchainModels.TokenCreateRequest(
                    request.name(),
                    request.symbol(),
                    request.initialSupply(),
                    request.decimals()
            );
            BlockchainModels.OperationResult result = hederaService.createToken(tokenRequest);

            return new ResponseWrapper(
                    result.success(),
                    result.success() ? result.message() : result.error(),
                    result.transactionId(),
                    result.data()
            );
        } catch (Exception e) {
            logger.error("Direct token creation test failed: {}", e.getMessage(), e);
            return new ResponseWrapper(false, "Exception: " + e.getMessage(), null, null);
        }
    }

    @PostMapping("/token/transfer")
    @Operation(summary = "Transfer Tokens", description = "Transfers tokens from operator account to another account")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Token transfer completed successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid transfer parameters"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseWrapper transferTokens(@RequestBody TransferTokenRequest request) {
        try {
            logger.info("Direct test: Transferring {} of token {} to {}",
                    request.amount(), request.tokenId(), request.toAccountId());
            BlockchainModels.TransferRequest transferRequest = new BlockchainModels.TransferRequest(
                    request.tokenId(),
                    request.toAccountId(),
                    request.amount()
            );
            BlockchainModels.OperationResult result = hederaService.transferTokens(transferRequest);

            return new ResponseWrapper(
                    result.success(),
                    result.success() ? result.message() : result.error(),
                    result.transactionId(),
                    result.data()
            );
        } catch (Exception e) {
            logger.error("Direct token transfer test failed: {}", e.getMessage(), e);
            return new ResponseWrapper(false, "Exception: " + e.getMessage(), null, null);
        }
    }

    @PostMapping("/account/create")
    @Operation(summary = "Create New Account", description = "Creates a new Hedera account")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Account created successfully"),
            @ApiResponse(responseCode = "400", description = "Account creation failed"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseWrapper createAccount() {
        try {
            logger.info("Direct test: Creating new Hedera account");
            BlockchainModels.OperationResult result = hederaService.createAccount();

            return new ResponseWrapper(
                    result.success(),
                    result.success() ? result.message() : result.error(),
                    result.transactionId(),
                    result.data()
            );
        } catch (Exception e) {
            logger.error("Direct account creation test failed: {}", e.getMessage(), e);
            return new ResponseWrapper(false, "Exception: " + e.getMessage(), null, null);
        }
    }

    @GetMapping("/health")
    @Operation(summary = "Health Check", description = "Verifies connectivity to the Hedera network")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Health check completed")
    })
    public ResponseWrapper healthCheck() {
        try {
            String operatorAccount = "0.0.5800339";
            BlockchainModels.BalanceQuery request = new BlockchainModels.BalanceQuery(operatorAccount);
            BlockchainModels.OperationResult result = hederaService.getAccountBalance(request);

            return new ResponseWrapper(
                    result.success(),
                    result.success() ? "Hedera connection is healthy" : "Hedera connection failed: " + result.error(),
                    null,
                    result.success() ? result.message() : null
            );
        } catch (Exception e) {
            logger.error("Health check failed: {}", e.getMessage(), e);
            return new ResponseWrapper(false, "Health check failed: " + e.getMessage(), null, null);
        }
    }

    // DTOs with basic Schema annotations
    @Schema(description = "Token creation request")
    public record CreateTokenRequest(
            @Schema(description = "Token name", example = "MyToken")
            String name,
            @Schema(description = "Token symbol", example = "MTK")
            String symbol,
            @Schema(description = "Initial supply", example = "1000000")
            int initialSupply,
            @Schema(description = "Decimal places", example = "2")
            Integer decimals
    ) {}

    @Schema(description = "Token transfer request")
    public record TransferTokenRequest(
            @Schema(description = "Token ID", example = "0.0.9876543")
            String tokenId,
            @Schema(description = "Recipient account", example = "0.0.1234567")
            String toAccountId,
            @Schema(description = "Transfer amount", example = "1000")
            long amount
    ) {}

    @Schema(description = "API response wrapper")
    public record ResponseWrapper(
            @Schema(description = "Operation success status")
            boolean success,
            @Schema(description = "Response message")
            String message,
            @Schema(description = "Transaction ID")
            String transactionId,
            @Schema(description = "Response data")
            Object data
    ) {}
}