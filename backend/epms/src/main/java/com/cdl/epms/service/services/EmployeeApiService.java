package com.cdl.epms.service.services;

import com.cdl.epms.dto.email.EmployeeDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeApiService {

    private final RestTemplate restTemplate;

    public List<EmployeeDto> getEmployees() {

        String url = "http://localhost:9020/api/v1/employees";

        ResponseEntity<EmployeeDto[]> response =
                restTemplate.getForEntity(url, EmployeeDto[].class);

        return Arrays.asList(response.getBody());
    }
}