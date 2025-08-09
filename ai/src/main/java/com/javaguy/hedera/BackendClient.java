package com.javaguy.hedera;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class BackendClient {
    private final RestClient restClient;

    public BackendClient(RestClient backendRestClient) {
        this.restClient = backendRestClient;
    }

    public Map<String, Object> registerUser(String userAccountId, String topicId) {
        return restClient.post()
                .uri("/auth/register/{userAccountId}/{topicId}", userAccountId, topicId)
                .retrieve()
                .body(new ParameterizedTypeReference<Map<String, Object>>() {});
    }

    public Map<String, Object> getPortfolio(String userAccountId) {
        return restClient.get()
                .uri("/portfolio/{userAccountId}", userAccountId)
                .retrieve()
                .body(new ParameterizedTypeReference<Map<String, Object>>() {});
    }

    public List<Map<String, Object>> getTokenizedAssets(String userAccountId) {
        return restClient.get()
                .uri("/tokenized-assets/{userAccountId}", userAccountId)
                .retrieve()
                .body(new ParameterizedTypeReference<List<Map<String, Object>>>() {});
    }

    public Map<String, Object> tokenizePortfolio(String userAccountId) {
        return restClient.get()
                .uri("/tokenize-portfolio/{userAccountId}", userAccountId)
                .retrieve()
                .body(new ParameterizedTypeReference<Map<String, Object>>() {});
    }

    public Map<String, Object> checkTopicExists(String userAccountId) {
        return restClient.get()
                .uri("/topics/exists/{userAccountId}", userAccountId)
                .retrieve()
                .body(new ParameterizedTypeReference<Map<String, Object>>() {});
    }
}


