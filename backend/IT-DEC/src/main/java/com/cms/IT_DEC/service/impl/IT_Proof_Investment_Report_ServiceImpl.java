package com.cms.IT_DEC.service.impl;

import com.cms.IT_DEC.dto.report.ITProofInvestmentReportDTO;
import com.cms.IT_DEC.repository.IT_Proof_Investment_Report_Repo;
import com.cms.IT_DEC.service.IT_Proof_Investment_Report_Service;
import com.cms.IT_DEC.service.EmployeeService;  // ADD THIS IMPORT
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class IT_Proof_Investment_Report_ServiceImpl implements IT_Proof_Investment_Report_Service {

    private static final Logger logger = LoggerFactory.getLogger(IT_Proof_Investment_Report_ServiceImpl.class);

    @Autowired
    private IT_Proof_Investment_Report_Repo proofInvestmentRepo;

    @Autowired
    private EmployeeService employeeService;  // ADD THIS - Autowire EmployeeService

    // Cache for department data
    private Map<String, String> departmentMap = null;
    private long lastFetchTime = 0;
    private static final long CACHE_DURATION = 3600000; // 1 hour in milliseconds

    private Map<String, String> getDepartmentMap() {
        long currentTime = System.currentTimeMillis();

        // Fetch new data if cache is expired or empty
        if (departmentMap == null || (currentTime - lastFetchTime) > CACHE_DURATION) {
            logger.info("Cache expired or empty, fetching fresh department data");
            departmentMap = employeeService.fetchDepartmentMap();  // USE EmployeeService HERE
            lastFetchTime = currentTime;

            // Log sample mappings to verify
            logger.info("=== DEPARTMENT MAPPING SAMPLE ===");
            departmentMap.entrySet().stream()
                    .limit(5)
                    .forEach(entry -> logger.info("EmpCode: {} -> Department: {}", entry.getKey(), entry.getValue()));
        } else {
            logger.info("Using cached department data with {} entries", departmentMap.size());
        }

        return departmentMap;
    }

    @Override
    public List<ITProofInvestmentReportDTO> getInvestmentProofReport(String empCode, String financialYear) {
        logger.info("Fetching investment proof report for empCode: {}, financialYear: {}", empCode, financialYear);

        List<Object[]> results = proofInvestmentRepo.getInvestmentProofReport(empCode, financialYear);
        logger.info("Retrieved {} records from database", results.size());

        Map<String, String> departmentMap = getDepartmentMap();
        logger.info("Retrieved department data for {} employees", departmentMap.size());

        return mapToDTOList(results, departmentMap);
    }

    @Override
    public List<ITProofInvestmentReportDTO> getAllInvestmentProofReports() {
        logger.info("Fetching all investment proof reports");
        return getInvestmentProofReport(null, null);
    }

    @Override
    public List<ITProofInvestmentReportDTO> getInvestmentProofReportByFinancialYear(String financialYear) {
        logger.info("Fetching investment proof reports for financial year: {}", financialYear);
        return getInvestmentProofReport(null, financialYear);
    }

    @Override
    public List<ITProofInvestmentReportDTO> getInvestmentProofReportByEmployee(String empCode) {
        logger.info("Fetching investment proof reports for employee: {}", empCode);
        return getInvestmentProofReport(empCode, null);
    }

    private List<ITProofInvestmentReportDTO> mapToDTOList(List<Object[]> results, Map<String, String> departmentMap) {
        List<ITProofInvestmentReportDTO> reportList = new ArrayList<>();

        if (results == null || results.isEmpty()) {
            logger.info("No results to map to DTOs");
            return reportList;
        }

        logger.info("Mapping {} results to DTOs", results.size());

        for (Object[] row : results) {
            try {
                ITProofInvestmentReportDTO dto = new ITProofInvestmentReportDTO();

                // Index mapping based on the SELECT order in repository query
                dto.setEmployeeName(row[0] != null ? row[0].toString() : "");
                dto.setEmployeeCode(row[1] != null ? row[1].toString() : "");
                dto.setPanNo(row[2] != null ? row[2].toString() : "");
                dto.setFinancialYear(row[3] != null ? row[3].toString() : "");

                // Set department from cached map
                String empCode = dto.getEmployeeCode();
                if (empCode != null && !empCode.isEmpty() && departmentMap.containsKey(empCode)) {
                    String department = departmentMap.get(empCode);
                    dto.setDepartment(department);
                    logger.debug("Set department '{}' for employee {}", department, empCode);
                } else {
                    dto.setDepartment("N/A");
                    if (empCode != null && !empCode.isEmpty()) {
                        logger.debug("No department found for employee {} in departmentMap", empCode);
                    }
                }

                dto.setSection(row[4] != null ? row[4].toString() : "");
                dto.setComponent(row[5] != null ? row[5].toString() : "");
                dto.setParticular(row[6] != null ? row[6].toString() : "");

                // Handle numeric values
                if (row[7] != null) {
                    dto.setRevisedAmount(((Number) row[7]).doubleValue());
                } else {
                    dto.setRevisedAmount(0.0);
                }

                // Handle date
                dto.setModifiedDate(row[8] != null ? row[8].toString() : "");

                dto.setRemarks(row[9] != null ? row[9].toString() : "");
                dto.setLandlordName(row[10] != null ? row[10].toString() : "");
                dto.setLandlordPanNumber(row[11] != null ? row[11].toString() : "");
                dto.setUploadedDocs(row[12] != null ? row[12].toString() : "No");
                dto.setDocumentIds(row[13] != null ? row[13].toString() : "");
                dto.setDocumentCaption(row[14] != null ? row[14].toString() : "");

                reportList.add(dto);

            } catch (Exception e) {
                logger.error("Error mapping row to DTO: {}", Arrays.toString(row), e);
            }
        }

        logger.info("Successfully mapped {} DTOs", reportList.size());
        return reportList;
    }
}