package com.cdl.epms.controller;

import com.cdl.epms.dto.report.ReportWithEmployeeDTO;
import com.cdl.epms.service.services.ReportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS})
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/search-by-date")
    public ResponseEntity<List<ReportWithEmployeeDTO>> searchByDateRange(
            @RequestParam @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDate startDate,
            @RequestParam @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDate endDate,
            @RequestParam(required = false, defaultValue = "ALL") String status) {

        log.info("REST API request: search by date range with status: {}, startDate={}, endDate={}", status, startDate, endDate);

        // Convert LocalDate to LocalDateTime (start of day to end of day)
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);

        List<ReportWithEmployeeDTO> reports = reportService.searchByDateRangeWithEmployee(startDateTime, endDateTime, status);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/search-by-year")
    public ResponseEntity<List<ReportWithEmployeeDTO>> searchByFinancialYear(
            @RequestParam String financialYear,
            @RequestParam(required = false, defaultValue = "ALL") String status) {

        log.info("REST API request: search by financial year: {} with status: {}", financialYear, status);
        List<ReportWithEmployeeDTO> reports = reportService.searchByFinancialYearWithEmployee(financialYear, status);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Service is running");
    }
}