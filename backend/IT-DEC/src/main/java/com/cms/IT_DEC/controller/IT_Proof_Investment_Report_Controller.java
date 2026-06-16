package com.cms.IT_DEC.controller;

import com.cms.IT_DEC.dto.report.ITProofInvestmentReportDTO;
import com.cms.IT_DEC.service.IT_Proof_Investment_Report_Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/it-proof-investment-report")
@CrossOrigin(origins = "*")
public class IT_Proof_Investment_Report_Controller {

    private static final Logger logger = LoggerFactory.getLogger(IT_Proof_Investment_Report_Controller.class);

    @Autowired
    private IT_Proof_Investment_Report_Service proofInvestmentReportService;

    @GetMapping("/simple-test")
    public ResponseEntity<String> simpleTest() {
        return ResponseEntity.ok("Controller is working at: " + new java.util.Date());
    }

    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "IT Proof Investment Report API",
                "timestamp", System.currentTimeMillis()
        ));
    }

    @GetMapping("/by-financial-year")
    public ResponseEntity<?> getReportsByFinancialYear(@RequestParam String financialYear) {
        logger.info("REST request to get reports for financial year: {}", financialYear);

        try {
            List<ITProofInvestmentReportDTO> reportData =
                    proofInvestmentReportService.getInvestmentProofReportByFinancialYear(financialYear);

            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("data", reportData);
            response.put("totalRecords", reportData.size());
            response.put("financialYear", financialYear);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error fetching reports: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "message", "Failed to fetch reports: " + e.getMessage()
                    ));
        }
    }

    @GetMapping("/report")
    public ResponseEntity<?> getInvestmentProofReport(
            @RequestParam(required = false) String empCode,
            @RequestParam(required = false) String financialYear) {

        logger.info("REST request to get report for empCode: {}, financialYear: {}", empCode, financialYear);

        try {
            List<ITProofInvestmentReportDTO> reportData =
                    proofInvestmentReportService.getInvestmentProofReport(empCode, financialYear);

            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("data", reportData);
            response.put("totalRecords", reportData.size());
            response.put("empCode", empCode);
            response.put("financialYear", financialYear);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error fetching report: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "message", "Failed to fetch report: " + e.getMessage()
                    ));
        }
    }
}