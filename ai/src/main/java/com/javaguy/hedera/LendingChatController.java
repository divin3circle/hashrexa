package com.javaguy.hedera;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
@Tag(name = "HashRexa AI Assistant", description = "AI endpoints for lending and portfolio operations using Go backend")
public class LendingChatController {

    private static final Logger logger = LoggerFactory.getLogger(LendingChatController.class);

    private final ChatClient chat;
    private final LoanTools loanTools;

    public LendingChatController(ChatModel chatModel, LoanTools loanTools) {
        this.loanTools = loanTools;
        this.chat = ChatClient.builder(chatModel)
                .defaultSystem("""
                        You are HashRexa AI. Always use functions to fetch real data:
                        - getUserPortfolio
                        - calculateBorrowingPower
                        - registerUser
                        - tokenizePortfolio
                        """)
                .build();
    }

    @PostMapping("/lending")
    @Operation(summary = "Chat with AI lending assistant")
    public ResponseEntity<ChatResponse> lending(@RequestBody ChatRequest req) {
        try {
            String content = chat.prompt()
                    .user(req.message())
                    .tools(loanTools)
                    .call()
                    .content();
            return ResponseEntity.ok(new ChatResponse(content, true, "lending"));
        } catch (Exception e) {
            logger.error("AI chat error: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(new ChatResponse("Error: " + e.getMessage(), false, "lending"));
        }
    }

    // Simple REST wrappers if needed by frontend
    @GetMapping("/portfolio/{accountId}")
    public ResponseEntity<GenericResponse> portfolio(@PathVariable String accountId) {
        return ResponseEntity.ok(new GenericResponse(loanTools.getUserPortfolio(accountId), true));
    }

    @PostMapping("/register")
    public ResponseEntity<GenericResponse> register(@RequestBody RegistrationRequest r) {
        String msg = loanTools.registerUser(r.accountId(), r.email(), r.topicId());
        return ResponseEntity.ok(new GenericResponse(msg, msg.startsWith("✅")));
    }

    public record ChatRequest(String message) {}
    public record ChatResponse(String response, boolean success, String type) {}
    public record GenericResponse(String data, boolean success) {}
    public record RegistrationRequest(String accountId, String email, String topicId) {}
}


