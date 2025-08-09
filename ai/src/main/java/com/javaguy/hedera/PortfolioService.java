package com.javaguy.hedera;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class PortfolioService {
    private static final Logger logger = LoggerFactory.getLogger(PortfolioService.class);
    private final BackendClient backendClient;

    public PortfolioService(BackendClient backendClient) {
        this.backendClient = backendClient;
    }

    public LoanModels.Portfolio getUserPortfolio(String accountId) {
        try {
            Map<String, Object> resp = backendClient.getPortfolio(accountId);
            @SuppressWarnings("unchecked")
            Map<String, Object> p = resp != null ? (Map<String, Object>) resp.get("portfolio") : null;
            if (p == null) {
                return emptyPortfolio(accountId);
            }

            BigDecimal total = toBig(p.get("PortfolioValueUSD"));
            BigDecimal available = total.multiply(new BigDecimal("0.40"));
            BigDecimal locked = BigDecimal.ZERO;

            List<LoanModels.TokenizedAsset> tokenized = mapTokenized(accountId);

            return new LoanModels.Portfolio(
                    accountId,
                    total,
                    available,
                    locked,
                    List.of(),
                    tokenized,
                    Instant.now()
            );
        } catch (Exception e) {
            logger.error("Failed to fetch portfolio: {}", e.getMessage(), e);
            return emptyPortfolio(accountId);
        }
    }

    public boolean tokenizePortfolio(String accountId) {
        try {
            Map<String, Object> resp = backendClient.tokenizePortfolio(accountId);
            return resp != null && Boolean.TRUE.equals(resp.get("success"));
        } catch (Exception e) {
            logger.warn("Tokenize portfolio failed: {}", e.getMessage());
            return false;
        }
    }

    public List<LoanModels.TokenizedAsset> mapTokenized(String accountId) {
        try {
            List<Map<String, Object>> list = backendClient.getTokenizedAssets(accountId);
            List<LoanModels.TokenizedAsset> out = new ArrayList<>();
            if (list == null) return out;
            for (Map<String, Object> m : list) {
                String symbol = str(m.get("stockSymbol"));
                BigDecimal amount = toBig(m.get("tokenizedAmount"));
                BigDecimal price = toBig(m.get("stockPrice"));
                out.add(new LoanModels.TokenizedAsset(
                        symbol,
                        symbol,
                        amount,
                        amount.multiply(price),
                        Instant.now(),
                        null
                ));
            }
            return out;
        } catch (Exception e) {
            logger.warn("Fetch tokenized assets failed: {}", e.getMessage());
            return List.of();
        }
    }

    private LoanModels.Portfolio emptyPortfolio(String accountId) {
        return new LoanModels.Portfolio(
                accountId,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                List.of(),
                List.of(),
                Instant.now()
        );
    }

    private static String str(Object v) { return v == null ? null : v.toString(); }
    private static BigDecimal toBig(Object v) {
        if (v == null) return BigDecimal.ZERO;
        if (v instanceof Number n) return new BigDecimal(n.toString());
        try { return new BigDecimal(v.toString()); } catch (Exception e) { return BigDecimal.ZERO; }
    }
}


