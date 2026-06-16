package com.cdl.epms.service.services;

import com.cdl.epms.dto.report.EmployeeResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmployeeApiClient {

    private final RestTemplate restTemplate;

    @Value("${employee.api.base.url}")
    private String employeeApiBaseUrl;

    public EmployeeResponseDTO getEmployeeByCode(String employeeCode) {
        if (employeeCode == null || employeeCode.trim().isEmpty()) {
            return null;
        }

        try {
            String url = employeeApiBaseUrl + "/employee/eCode/" + employeeCode;
            log.info("Calling employee API: {}", url);
            return restTemplate.getForObject(url, EmployeeResponseDTO.class);
        } catch (Exception e) {
            log.error("Error fetching employee details: {}", e.getMessage());
            return null;
        }
    }
}