package com.cdl.epms.config;

import com.cms.cdl.common_dtos.util.dms.DocumentOperations;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class DocumentOperationsConfig {
    @Bean
    public DocumentOperations documentOperations(
            WebClient webClient,
            @Value("${document.upload.API}") String api,
            @Value("${document.upload.directory}") String dir,
            @Value("${document.access.API}") String docAccessAPI,
            @Value("${document.delete.API}") String docDeleteAPI
    ) {
        return new DocumentOperations(webClient, api, dir, docAccessAPI, docDeleteAPI);
    }
}
