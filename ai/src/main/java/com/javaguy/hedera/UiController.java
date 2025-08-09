package com.javaguy.hedera;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class UiController {

    private final LoanTools loanTools;
    private final HederaService hederaService;
    private final BlockchainTools blockchainTools;
    private final ChatModel chatModel;
    private final LoanAssistanceService loanAssistanceService;

    public UiController(LoanTools loanTools,
                        HederaService hederaService,
                        BlockchainTools blockchainTools,
                        ChatModel chatModel,
                        LoanAssistanceService loanAssistanceService) {
        this.loanTools = loanTools;
        this.hederaService = hederaService;
        this.blockchainTools = blockchainTools;
        this.chatModel = chatModel;
        this.loanAssistanceService = loanAssistanceService;
    }

    @GetMapping("/")
    public String home() {
        return "index";
    }

    @PostMapping("/ui/register")
    public String register(@RequestParam String accountId,
                           @RequestParam String email,
                           @RequestParam String topicId,
                           Model model) {
        String msg = loanTools.registerUser(accountId, email, topicId);
        model.addAttribute("result", msg);
        return "result";
    }

    @PostMapping("/ui/portfolio")
    public String portfolio(@RequestParam String accountId, Model model) {
        String data = loanTools.getUserPortfolio(accountId);
        model.addAttribute("result", data);
        return "result";
    }

    @PostMapping("/ui/borrowing-power")
    public String borrowing(@RequestParam String accountId, Model model) {
        String data = loanTools.calculateBorrowingPower(accountId);
        model.addAttribute("result", data);
        return "result";
    }

    @PostMapping("/ui/tokenize")
    public String tokenize(@RequestParam String accountId, Model model) {
        String data = loanTools.tokenizePortfolio(accountId);
        model.addAttribute("result", data);
        return "result";
    }

    @PostMapping("/ui/create-topic")
    public String createTopic(@RequestParam(required = false) String memo, Model model) {
        String topicId = hederaService.createTopic(memo);
        model.addAttribute("result", "Created Topic ID: " + topicId);
        return "result";
    }

    // --- Blockchain tools UI handlers ---

    @PostMapping("/ui/check-balance")
    public String checkBalance(@RequestParam String accountId, Model model) {
        String data = blockchainTools.checkBalance(accountId);
        model.addAttribute("result", data);
        return "result";
    }

    @PostMapping("/ui/create-account")
    public String createAccount(Model model) {
        String data = blockchainTools.createAccount();
        model.addAttribute("result", data);
        return "result";
    }

    @PostMapping("/ui/create-token")
    public String createToken(@RequestParam String name,
                              @RequestParam String symbol,
                              @RequestParam int initialSupply,
                              @RequestParam(required = false) Integer decimals,
                              Model model) {
        String data = blockchainTools.createToken(name, symbol, initialSupply, decimals);
        model.addAttribute("result", data);
        return "result";
    }

    @PostMapping("/ui/transfer")
    public String transfer(@RequestParam String tokenId,
                           @RequestParam String toAccountId,
                           @RequestParam long amount,
                           Model model) {
        String data = blockchainTools.transferTokens(tokenId, toAccountId, amount);
        model.addAttribute("result", data);
        return "result";
    }

    // --- AI chat UI handlers ---

    @PostMapping("/ui/chat-blockchain")
    public String chatBlockchain(@RequestParam("message") String message, Model model) {
        String system = """
                You are a Hedera blockchain assistant. You MUST use the available functions for ALL blockchain operations.
                IMPORTANT: When users ask about blockchain operations, you MUST call the appropriate function:
                1. checkBalance  2. createToken  3. transferTokens  4. createAccount
                DO NOT provide generic responses. ALWAYS use the functions to get real data.
                """;
        String content = ChatClient.builder(chatModel)
                .defaultSystem(system)
                .build()
                .prompt()
                .user(message)
                .tools(blockchainTools)
                .call()
                .content();
        model.addAttribute("result", content);
        return "result";
    }

    @PostMapping("/ui/chat-loan")
    public String chatLoan(@RequestParam("userId") String userId,
                           @RequestParam("message") String message,
                           Model model) {
        var resp = loanAssistanceService.handleLoanQuery(userId, message);
        String combined = resp.message() + "\n\nIntent: " + resp.intent();
        model.addAttribute("result", combined);
        return "result";
    }

    @GetMapping("/chat")
    public String chatPage() {
        return "chat";
    }

    @PostMapping("/ui/chat-send")
    @ResponseBody
    public ChatReply chatSend(@RequestParam("mode") String mode,
                              @RequestParam("message") String message,
                              @RequestParam(value = "userId", required = false) String userId) {
        try {
            if ("blockchain".equalsIgnoreCase(mode)) {
                String system = """
                        You are a Hedera blockchain assistant. You MUST use the available functions for ALL blockchain operations.
                        IMPORTANT: call: checkBalance, createToken, transferTokens, createAccount for respective requests.
                        """;
                String content = ChatClient.builder(chatModel)
                        .defaultSystem(system)
                        .build()
                        .prompt()
                        .user(message)
                        .tools(blockchainTools)
                        .call()
                        .content();
                if (content == null || content.isBlank()) {
                    content = "(no content returned by model)";
                }
                return new ChatReply(content, null, true, "blockchain");
            } else if ("loan".equalsIgnoreCase(mode)) {
                String uid = (userId == null || userId.isBlank()) ? "guest" : userId;
                // Tool-first short-circuit: detect portfolio/loan intents and use tools for deterministic output
                String lower = message.toLowerCase();
                if (lower.contains("portfolio") || lower.contains("collateral") || lower.contains("borrowing")) {
                    try {
                        String reply = lower.contains("borrowing")
                                ? loanTools.calculateBorrowingPower(uid)
                                : loanTools.getUserPortfolio(uid);
                        return new ChatReply(reply, null, true, "loan");
                    } catch (Exception ex) {
                        // fall back to model
                    }
                } else if (lower.contains("loan") && (lower.contains("status") || lower.contains("any"))) {
                    try {
                        String reply = loanTools.getUserLoans(uid);
                        return new ChatReply(reply, null, true, "loan");
                    } catch (Exception ex) {
                        // fall back to model
                    }
                }

                var resp = loanAssistanceService.handleLoanQuery(uid, message);
                String reply = resp != null ? resp.message() : "(no content returned by model)";
                String intent = resp != null ? resp.intent() : null;
                return new ChatReply(reply, intent, true, "loan");
            }
            return new ChatReply("Unsupported mode: " + mode, null, false, mode);
        } catch (Exception e) {
            String msg = (e.getMessage() == null || e.getMessage().isBlank())
                    ? "The model blocked this request. Please rephrase."
                    : e.getMessage();
            return new ChatReply("Error: " + msg, null, false, mode);
        }
    }

    public record ChatReply(String reply, String intent, boolean ok, String mode) {}
    
}


