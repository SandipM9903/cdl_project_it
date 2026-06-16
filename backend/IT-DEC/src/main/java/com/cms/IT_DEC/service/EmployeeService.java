package com.cms.IT_DEC.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmployeeService {

    private static final Logger logger = LoggerFactory.getLogger(EmployeeService.class);

    @Autowired
    private RestTemplate restTemplate;

    private final String DEPARTMENT_API_URL = "http://43.205.24.208:9020/employee/getAll/0";

    public Map<String, String> fetchDepartmentMap() {

        Map<String, String> departmentMap = new HashMap<>();

        try {
            logger.info("Fetching department data from API: {}", DEPARTMENT_API_URL);

            ResponseEntity<List> response =
                    restTemplate.getForEntity(DEPARTMENT_API_URL, List.class);

            List<Map<String, Object>> employees = response.getBody();

            if (employees != null && !employees.isEmpty()) {

                logger.info("Received {} employees from API", employees.size());

                for (Map<String, Object> wrapper : employees) {
                    try {

                        // 👇 Step 1: Get empResDTO
                        Map<String, Object> empResDTO =
                                (Map<String, Object>) wrapper.get("empResDTO");

                        if (empResDTO == null) {
                            continue;
                        }

                        // 👇 Step 2: Get empCode
                        String empCode = empResDTO.get("empCode") != null
                                ? empResDTO.get("empCode").toString().trim()
                                : null;

                        // 👇 Step 3: Get mainDeptResDTO
                        Map<String, Object> mainDept =
                                (Map<String, Object>) empResDTO.get("mainDeptResDTO");

                        if (mainDept != null && mainDept.get("mainDepartment") != null) {

                            String department =
                                    mainDept.get("mainDepartment").toString().trim();

                            if (empCode != null && !empCode.isEmpty()) {
                                departmentMap.put(empCode, department);
                            }
                        }

                    } catch (Exception e) {
                        logger.error("Error processing employee record", e);
                    }
                }
            }

            logger.info("Successfully mapped {} employees to departments",
                    departmentMap.size());

        } catch (Exception e) {
            logger.error("Failed to fetch department data", e);
        }

        return departmentMap;
    }
}