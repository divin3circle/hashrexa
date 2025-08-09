package com.javaguy.hedera;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class BackendConfig {

    @Bean
    public RestClient backendRestClient(@Value("${backend.base-url:http://localhost:8080}") String baseUrl) {
        return RestClient.builder().baseUrl(baseUrl).build();
    }
}


