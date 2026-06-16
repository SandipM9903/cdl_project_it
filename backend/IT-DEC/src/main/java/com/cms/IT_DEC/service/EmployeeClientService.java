package com.cms.IT_DEC.service;

import com.cms.IT_DEC.dto.report.EmployeeDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmployeeClientService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    private static final String EMP_URL =
            "http://43.205.24.208:9020/employee/getAll";
    private static final String EMP_DETAIL_URL =
            "http://43.205.24.208:9020/employee/eCode/";

    // Cache for employee details by empCode
    private final ConcurrentHashMap<String, EmployeeDTO> employeeDetailsCache = new ConcurrentHashMap<>();

    /**
     * Get all employees with caching
     * Cache will be invalidated every hour or when manually cleared
     */
    @Cacheable(value = "allEmployees", unless = "#result == null || #result.isEmpty()")
    public List<EmployeeDTO> getAllEmployees() {
        log.info("Fetching all employees from external API (CACHE MISS)");

        ResponseEntity<String> response = restTemplate.getForEntity(EMP_URL, String.class);
        List<EmployeeDTO> employees = new ArrayList<>();

        try {
            JsonNode root = objectMapper.readTree(response.getBody());

            for (JsonNode node : root) {
                JsonNode emp = node.path("empResDTO");

                EmployeeDTO dto = new EmployeeDTO();
                dto.setEmpCode(emp.path("empCode").asText());

                String name = emp.path("firstName").asText("") + " " + emp.path("lastName").asText("");
                dto.setEmpName(name.trim());
                dto.setDateOfJoining(emp.path("dateOfJoining").asText());

                employees.add(dto);
            }

            log.info("Fetched {} employees from external API", employees.size());

        } catch (Exception e) {
            log.error("Employee parsing failed", e);
            throw new RuntimeException("Employee parsing failed", e);
        }

        return employees;
    }

    /**
     * Get employee by ID with caching
     */
    public EmployeeDTO getEmployeeById(String empCode) {
        log.debug("Fetching employee by ID: {} (CACHE CHECK)", empCode);

        // Check local cache first
        if (employeeDetailsCache.containsKey(empCode)) {
            log.debug("Returning employee from local cache: {}", empCode);
            return employeeDetailsCache.get(empCode);
        }

        try {
            // First try to get from the getAll list (already cached)
            List<EmployeeDTO> allEmployees = getAllEmployees();

            EmployeeDTO employee = allEmployees.stream()
                    .filter(emp -> empCode.equals(emp.getEmpCode()))
                    .findFirst()
                    .orElse(null);

            if (employee != null) {
                // Also fetch address for this employee
                String address = getEmployeeAddress(empCode);
                employee.setAddress(address);

                // Store in local cache
                employeeDetailsCache.put(empCode, employee);
                log.debug("Employee found and cached: {}", empCode);
                return employee;
            }

            log.warn("Employee not found with code: {}", empCode);
            return null;

        } catch (Exception e) {
            log.error("Failed to fetch employee by ID: {}", empCode, e);
            return null;
        }
    }

    /**
     * Get employee address with caching per employee
     */
    @Cacheable(value = "employeeAddress", key = "#empCode", unless = "#result == null || #result.isEmpty()")
    public String getEmployeeAddress(String empCode) {
        log.debug("Fetching address for employee {} from external API (CACHE MISS)", empCode);

        try {
            ResponseEntity<String> response = restTemplate.getForEntity(
                    EMP_DETAIL_URL + empCode,
                    String.class);

            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode addressArray = root.path("userDTO").path("addressResDTOs");

            if (addressArray.isArray() && addressArray.size() > 0) {
                JsonNode addr = addressArray.get(0);
                String city = addr.path("city").asText("");
                String state = addr.path("state").asText("");
                String country = addr.path("country").asText("");

                String address = city + ", " + state + ", " + country;
                log.debug("Address found for {}: {}", empCode, address);
                return address;
            }

        } catch (Exception e) {
            log.error("Failed to fetch address for employee: {}", empCode, e);
        }

        return "";
    }

    /**
     * Get employee details with address (single employee)
     */
    public EmployeeDTO getEmployeeWithAddress(String empCode) {
        EmployeeDTO employee = getEmployeeById(empCode);
        if (employee != null && (employee.getAddress() == null || employee.getAddress().isEmpty())) {
            String address = getEmployeeAddress(empCode);
            employee.setAddress(address);
        }
        return employee;
    }

    /**
     * Get employees with their addresses pre-loaded (batch processing)
     */
    public List<EmployeeDTO> getAllEmployeesWithAddresses() {
        List<EmployeeDTO> employees = getAllEmployees();

        ExecutorService executor = Executors.newFixedThreadPool(10);

        try {
            List<CompletableFuture<Void>> futures = new ArrayList<>();

            for (EmployeeDTO emp : employees) {
                CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
                    String address = getEmployeeAddress(emp.getEmpCode());
                    emp.setAddress(address);
                    // Also store in local cache
                    employeeDetailsCache.put(emp.getEmpCode(), emp);
                }, executor);
                futures.add(future);
            }

            CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]))
                    .get(30, TimeUnit.SECONDS);

        } catch (Exception e) {
            log.error("Error fetching addresses in parallel", e);
        } finally {
            executor.shutdown();
        }

        return employees;
    }

    /**
     * Clear all employee-related caches
     */
    @CacheEvict(value = {"allEmployees", "employeeAddress"}, allEntries = true)
    public void clearEmployeeCache() {
        log.info("Cleared all employee caches");
        employeeDetailsCache.clear(); // Also clear local cache
    }

    /**
     * Clear cache for specific employee
     */
    @CacheEvict(value = "employeeAddress", key = "#empCode")
    public void clearEmployeeAddressCache(String empCode) {
        log.info("Cleared address cache for employee: {}", empCode);
        employeeDetailsCache.remove(empCode); // Also remove from local cache
    }

    /**
     * Scheduled cache refresh - runs every hour
     */
    @Scheduled(cron = "0 0 * * * ?")
    public void refreshEmployeeCache() {
        log.info("Scheduled cache refresh started");
        clearEmployeeCache();
        // Pre-load cache
        getAllEmployees();
        log.info("Scheduled cache refresh completed");
    }
}