package com.cdl.epms.controller;

import com.cdl.epms.dto.cycle.CreateCycleRequestDto;
import com.cdl.epms.dto.cycle.PublishCycleRequest;
import com.cdl.epms.model.PerformanceCycle;
import com.cdl.epms.payload.ApiResponse;
import com.cdl.epms.service.services.CycleService;
import jakarta.validation.Valid;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cycles")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CycleController {

    private final CycleService cycleService;

    @PostMapping
    public ResponseEntity<ApiResponse<PerformanceCycle>> save(
            @Valid @RequestBody CreateCycleRequestDto requestDto
    ) {
        PerformanceCycle savedCycle = cycleService.createCycle(
                requestDto.getCycleType(),
                requestDto.getYear(),
                requestDto.getQuarter(),
                requestDto.getReminderDays(),
                requestDto.getStartDate(),
                requestDto.getEndDate(),
                requestDto.getFinancialYear()  // Pass financial year
        );

        ApiResponse<PerformanceCycle> response = ApiResponse.<PerformanceCycle>builder()
                .success(true)
                .message("Performance cycle created successfully")
                .data(savedCycle)
                .build();

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/{cycleId}/publish")
    public ResponseEntity<ApiResponse<String>> publishCycle(
            @PathVariable Long cycleId,
            @RequestBody(required = false) PublishCycleRequest request) {

        System.out.println("=== PUBLISH CYCLE REQUEST ===");
        System.out.println("Cycle ID: " + cycleId);
        if (request != null) {
            System.out.println("Subject from request: " + request.getSubject());
            System.out.println("Body from request length: " + (request.getBody() != null ? request.getBody().length() : 0));
        } else {
            System.out.println("Request body is null");
        }

        String subject = request != null ? request.getSubject() : null;
        String body = request != null ? request.getBody() : null;

        String message = cycleService.publishCycle(cycleId, subject, body);

        ApiResponse<String> response = ApiResponse.<String>builder()
                .success(true)
                .message(message)
                .data(message)
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<PerformanceCycle>> findActive() {
        PerformanceCycle activeCycle = cycleService.getActiveCycle();

        ApiResponse<PerformanceCycle> response = ApiResponse.<PerformanceCycle>builder()
                .success(true)
                .message("Active performance cycle fetched successfully")
                .data(activeCycle)
                .build();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/close")
    public ResponseEntity<ApiResponse<String>> close(@PathVariable Long id) {
        cycleService.closeCycle(id);

        ApiResponse<String> response = ApiResponse.<String>builder()
                .success(true)
                .message("Performance cycle closed successfully")
                .data("Performance cycle closed successfully")
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PerformanceCycle>>> getByYear(
            @RequestParam Integer year
    ) {
        List<PerformanceCycle> cycles = cycleService.getCyclesByYear(year);

        ApiResponse<List<PerformanceCycle>> response = ApiResponse.<List<PerformanceCycle>>builder()
                .success(true)
                .message("Performance cycles fetched successfully")
                .data(cycles)
                .build();

        return ResponseEntity.ok(response);
    }

    // NEW ENDPOINT: Get cycles by financial year
    @GetMapping("/financial-year/{financialYear}")
    public ResponseEntity<ApiResponse<List<PerformanceCycle>>> getByFinancialYear(
            @PathVariable String financialYear
    ) {
        List<PerformanceCycle> cycles = cycleService.getCyclesByFinancialYear(financialYear);

        ApiResponse<List<PerformanceCycle>> response = ApiResponse.<List<PerformanceCycle>>builder()
                .success(true)
                .message("Performance cycles fetched successfully for financial year: " + financialYear)
                .data(cycles)
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/annual")
    public ResponseEntity<ApiResponse<PerformanceCycle>> createAnnualCycle(
            @RequestBody CreateCycleRequestDto requestDto
    ) {
        try {
            System.out.println("=== BACKEND: Received Annual Cycle Request ===");
            System.out.println("Request DTO: " + requestDto);
            System.out.println("Financial Year: " + requestDto.getFinancialYear());
            System.out.println("Year: " + requestDto.getYear());
            System.out.println("Start Date: " + requestDto.getStartDate());
            System.out.println("End Date: " + requestDto.getEndDate());
            System.out.println("Reminder Days: " + requestDto.getReminderDays());

            // Validate required fields
            if (requestDto.getFinancialYear() == null) {
                System.out.println("ERROR: Financial year is null");
                throw new ValidationException("Financial year is required");
            }

            if (requestDto.getYear() == null) {
                System.out.println("ERROR: Year is null");
                throw new ValidationException("Year is required");
            }

            if (requestDto.getStartDate() == null) {
                System.out.println("ERROR: Start date is null");
                throw new ValidationException("Start date is required");
            }

            if (requestDto.getEndDate() == null) {
                System.out.println("ERROR: End date is null");
                throw new ValidationException("End date is required");
            }

            PerformanceCycle savedCycle = cycleService.createAnnualCycle(
                    requestDto.getYear(),
                    requestDto.getReminderDays(),
                    requestDto.getStartDate(),
                    requestDto.getEndDate(),
                    requestDto.getFinancialYear()
            );

            System.out.println("Annual cycle created successfully with ID: " + savedCycle.getId());

            ApiResponse<PerformanceCycle> response = ApiResponse.<PerformanceCycle>builder()
                    .success(true)
                    .message("Annual cycle created successfully for financial year: " + requestDto.getFinancialYear())
                    .data(savedCycle)
                    .build();

            return new ResponseEntity<>(response, HttpStatus.CREATED);

        } catch (Exception e) {
            System.out.println("=== ERROR in createAnnualCycle ===");
            System.out.println("Exception type: " + e.getClass().getName());
            System.out.println("Exception message: " + e.getMessage());
            e.printStackTrace(); // This will print full stack trace
            throw e;
        }
    }

    @PutMapping("/{cycleId}/extend-expiry")
    public ResponseEntity<ApiResponse<PerformanceCycle>> extendExpiryDate(
            @PathVariable Long cycleId,
            @RequestBody Map<String, String> request) {

        String newEndDateStr = request.get("endDate");
        if (newEndDateStr == null) {
            throw new IllegalArgumentException("endDate is required");
        }

        LocalDate newEndDate = LocalDate.parse(newEndDateStr);
        PerformanceCycle updatedCycle = cycleService.extendExpiryDate(cycleId, newEndDate);

        ApiResponse<PerformanceCycle> response = ApiResponse.<PerformanceCycle>builder()
                .success(true)
                .message("Expiry date extended successfully")
                .data(updatedCycle)
                .build();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{cycleId}/reopen")
    public ResponseEntity<ApiResponse<PerformanceCycle>> reopenQuarter(
            @PathVariable Long cycleId,
            @RequestBody Map<String, String> request) {

        String newEndDateStr = request.get("endDate");
        if (newEndDateStr == null) {
            throw new IllegalArgumentException("endDate is required");
        }

        LocalDate newEndDate = LocalDate.parse(newEndDateStr);
        PerformanceCycle reopenedCycle = cycleService.reopenQuarter(cycleId, newEndDate);

        ApiResponse<PerformanceCycle> response = ApiResponse.<PerformanceCycle>builder()
                .success(true)
                .message("Quarter reopened successfully")
                .data(reopenedCycle)
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{cycleId}/send-reminder")
    public ResponseEntity<ApiResponse<PerformanceCycle>> sendReminder(
            @PathVariable Long cycleId) {

        PerformanceCycle updatedCycle = cycleService.sendReminder(cycleId);

        ApiResponse<PerformanceCycle> response = ApiResponse.<PerformanceCycle>builder()
                .success(true)
                .message("Reminder sent successfully to all employees")
                .data(updatedCycle)
                .build();

        return ResponseEntity.ok(response);
    }
}