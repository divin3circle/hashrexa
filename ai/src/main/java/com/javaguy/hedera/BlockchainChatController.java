package com.javaguy.hedera;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
@Tag(name = "AI Chat Assistant", description = "AI-powered chat interface for blockchain operations")
class BlockchainChatController {

    private static final Logger logger = LoggerFactory.getLogger(BlockchainChatController.class);

    private final ChatClient chatClient;
    private final BlockchainTools blockchainTools;
    private final LoanAssistanceService loanAssistanceService;

    public BlockchainChatController(ChatModel chatModel, BlockchainTools blockchainTools, LoanAssistanceService loanAssistanceService) {
        this.blockchainTools = blockchainTools;
        this.loanAssistanceService = loanAssistanceService;
        this.chatClient = ChatClient.builder(chatModel)
                .defaultSystem("""
                    You are a Hedera blockchain assistant. You MUST use the available functions for ALL blockchain operations.
                    
                    IMPORTANT: When users ask about blockchain operations, you MUST call the appropriate function:
                    
                    1. For balance checking: ALWAYS call checkBalance function with the account ID
                    2. For token creation: ALWAYS call createToken function  
                    3. For token transfers: ALWAYS call transferTokens function
                    4. For account creation: ALWAYS call createAccount function
                    
                    DO NOT provide generic responses. ALWAYS use the functions to get real data.
                    If a function returns an error, please show the user the exact error message.
                    
                    Available functions:
                    - checkBalance: Use this for ANY balance inquiry
                    - createToken: Use this for token creation
                    - transferTokens: Use this for token transfers  
                    - createAccount: Use this for new account creation
                    """)
                .build();
    }

    @PostMapping
    @Operation(summary = "Chat with Blockchain Assistant",
            description = "Send messages to AI assistant for blockchain operations")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Chat response received"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public AIChatResponse chat(@RequestBody AIChatRequest request) {
        try {
            logger.info("Received chat request: {}", request.message());

            String response = chatClient.prompt()
                    .user(request.message())
                    .tools(blockchainTools)
                    .call()
                    .content();

            logger.info("Chat response: {}", response);
            return new AIChatResponse(response, true);

        } catch (Exception e) {
            logger.error("Error processing chat request: {}", e.getMessage(), e);
            return new AIChatResponse(
                    "Sorry, I encountered an error: " + e.getMessage(),
                    false
            );
        }
    }

    @PostMapping("/loan/{userId}")
    @Operation(summary = "Loan Assistance Chat",
            description = "Specialized chat for loan-related inquiries")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Loan chat response received"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<LoanAssistanceService.ChatResponse> chatAboutLoan(
            @Parameter(description = "User ID", example = "user123")
            @PathVariable String userId,
            @RequestBody AIChatRequest request
    ) {
        try {
            logger.info("Processing loan chat for user: {}", userId);
            var response = loanAssistanceService.handleLoanQuery(userId, request.message());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error in loan chat: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @Schema(description = "Chat request")
    public record AIChatRequest(
            @Schema(description = "User message", example = "What's the balance of account 0.0.5800339?")
            String message
    ) {}

    @Schema(description = "Chat response")
    public record AIChatResponse(
            @Schema(description = "AI response")
            String response,
            @Schema(description = "Success status")
            boolean success
    ) {}
}