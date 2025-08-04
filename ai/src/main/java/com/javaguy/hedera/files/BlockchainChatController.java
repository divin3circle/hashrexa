package com.javaguy.hedera.files;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class BlockchainChatController {

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
    public ResponseEntity<LoanAssistanceService.ChatResponse> chatAboutLoan(
            @PathVariable String userId,
            @RequestBody AIChatRequest request) {
        try {
            logger.info("Processing loan chat for user: {}", userId);
            var response = loanAssistanceService.handleLoanQuery(userId, request.message());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error in loan chat: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
    public record AIChatRequest(String message) {}
    public record AIChatResponse(String response, boolean success) {}
}