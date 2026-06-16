package com.cdl.epms.config;


import com.cms.cdl.common_dtos.util.employee.EmployeeOperations;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class EmployeeOperationsConfig {
    @Bean
    public EmployeeOperations employeeOperations(
            WebClient webClient,
            @Value("${employee.fetch.eCode.API}") String empECodeAPI,
            @Value("${employee.fetch.email.API}") String empEmailAPI
    ) {
        return new EmployeeOperations(webClient, empECodeAPI, empEmailAPI, null, null);
    }
}
