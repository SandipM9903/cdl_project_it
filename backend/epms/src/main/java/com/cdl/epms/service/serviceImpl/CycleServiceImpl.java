package com.cdl.epms.service.serviceImpl;

import com.cdl.epms.common.enums.CycleStatus;
import com.cdl.epms.common.enums.CycleType;
import com.cdl.epms.common.enums.Quarter;
import com.cdl.epms.exception.ConflictException;
import com.cdl.epms.exception.ResourceNotFoundException;
import com.cdl.epms.exception.ValidationException;
import com.cdl.epms.model.AnnualReview;
import com.cdl.epms.model.Certification;
import com.cdl.epms.model.PerformanceCycle;
import com.cdl.epms.repository.*;
import com.cdl.epms.service.services.CycleService;
import com.cdl.epms.service.services.EmailerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CycleServiceImpl implements CycleService {

    private final PerformanceCycleRepository cycleRepository;
    private final GoalRepository goalRepository;
    private final DevelopmentGoalRepository developmentGoalRepository;
    private final AnnualReviewRepository annualReviewRepository;
    private final CertificationRepository certificationRepository;
    private final EmployeeCertificationRepository employeeCertificationRepository;
    private final PoshRepository poshRepository;
    private final ResetEmployeeDataLogRepository resetEmployeeDataLogRepository;
    private final ModelMapper modelMapper;
    private final EmailerService emailerService;

    @Override
    public PerformanceCycle createCycle(
            CycleType cycleType,
            Integer year,
            Quarter quarter,
            Integer reminderDays,
            LocalDate startDate,
            LocalDate endDate,
            String financialYear,
            CycleStatus status
    ) {

        validateCycleInput(cycleType, year, quarter, startDate, endDate);

        // Validate financial year
        if (financialYear == null || financialYear.trim().isEmpty()) {
            throw new ValidationException("Financial year is required");
        }

        if (cycleType == CycleType.QUARTERLY) {
            // Check if cycle already exists for this financial year and quarter
            Optional<PerformanceCycle> existing =
                    cycleRepository.findByFinancialYearAndQuarterAndCycleType(
                            financialYear, quarter, cycleType
                    );

            if (existing.isPresent()) {
                throw new ConflictException("Cycle already exists for " + quarter + " " + financialYear);
            }

            // Check if previous quarter exists before creating new quarter
            if (quarter != Quarter.Q1) {
                Quarter previousQuarter = getPreviousQuarter(quarter);
                Optional<PerformanceCycle> previousCycle =
                        cycleRepository.findByFinancialYearAndQuarterAndCycleType(
                                financialYear, previousQuarter, CycleType.QUARTERLY);

                if (!previousCycle.isPresent()) {
                    throw new ValidationException("Previous quarter " + previousQuarter + " does not exist for financial year " + financialYear);
                }
            }
        }

        PerformanceCycle cycle = new PerformanceCycle();

        cycle.setCycleType(cycleType);
        cycle.setYear(year);
        cycle.setQuarter(quarter);
        cycle.setReminderDays(reminderDays);
        cycle.setStartDate(startDate);
        cycle.setEndDate(endDate);
        CycleStatus targetStatus = status != null ? status : CycleStatus.NOT_STARTED;
        cycle.setStatus(targetStatus);
        if (targetStatus == CycleStatus.ACTIVE) {
            cycle.setPublishedDate(LocalDate.now());
        }
        cycle.setFinancialYear(financialYear);

        return cycleRepository.save(cycle);
    }

    @Transactional
    @Override
    public String publishCycle(Long cycleId, String customSubject, String customBody) {

        log.info("========== PUBLISH CYCLE CALLED ==========");
        log.info("Cycle ID: {}", cycleId);
        log.info("Custom Subject: {}", customSubject);
        log.info("Custom Body length: {}", customBody != null ? customBody.length() : 0);

        if (cycleId == null) {
            throw new ValidationException("Cycle ID is required");
        }

        PerformanceCycle cycle = cycleRepository.findById(cycleId)
                .orElseThrow(() -> new ResourceNotFoundException("Cycle not found"));

        if (cycle.getStatus() != CycleStatus.NOT_STARTED) {
            throw new ConflictException("Only NOT_STARTED cycles can be published");
        }

        cycle.setStatus(CycleStatus.ACTIVE);
        cycle.setPublishedDate(LocalDate.now());
        cycleRepository.save(cycle);

        // Send emails with custom subject and body (if provided)
        try {
            log.info("Publishing launch email to ALL employees for cycle (DISABLED): {} {} / {}",
                    cycle.getQuarter(), cycle.getFinancialYear(), cycle.getYear());
            log.info("Passing custom subject to emailer: {}", customSubject);
            // emailerService.publishEmailToAllEmployees(cycle.getId(), customSubject, customBody);
        } catch (Exception e) {
            log.error("Failed to send launch emails: ", e);
            // Don't throw exception - cycle is already active
        }

        log.info("========== PUBLISH CYCLE COMPLETED ==========");
        return "Performance cycle ACTIVE successfully and launch email sent to all employees.";
    }

    @Override
    public PerformanceCycle getActiveCycle() {
        return cycleRepository.findFirstByStatusOrderByIdDesc(CycleStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("No active cycle found"));
    }

    @Override
    public void closeCycle(Long cycleId) {
        if (cycleId == null) {
            throw new ValidationException("Cycle ID is required");
        }

        PerformanceCycle cycle = cycleRepository.findById(cycleId)
                .orElseThrow(() -> new ResourceNotFoundException("Cycle not found"));

        if (cycle.getStatus() != CycleStatus.ACTIVE) {
            throw new ConflictException("Only ACTIVE cycles can be closed");
        }

        cycle.setStatus(CycleStatus.CLOSED);
        cycleRepository.save(cycle);
    }

    @Override
    @Transactional
    public PerformanceCycle extendExpiryDate(Long cycleId, LocalDate newEndDate) {
        if (cycleId == null) {
            throw new ValidationException("Cycle ID is required");
        }

        if (newEndDate == null) {
            throw new ValidationException("New expiry date is required");
        }

        PerformanceCycle cycle = cycleRepository.findById(cycleId)
                .orElseThrow(() -> new ResourceNotFoundException("Cycle not found"));

        if (cycle.getStatus() != CycleStatus.ACTIVE) {
            throw new ConflictException("Only ACTIVE cycles can have their expiry date extended");
        }

        if (newEndDate.isBefore(LocalDate.now())) {
            throw new ValidationException("New expiry date cannot be in the past");
        }

        if (cycle.getEndDate() != null && newEndDate.isBefore(cycle.getEndDate())) {
            throw new ValidationException("New expiry date cannot be earlier than current expiry date");
        }

        cycle.setEndDate(newEndDate);
        return cycleRepository.save(cycle);
    }

    @Override
    @Transactional
    public PerformanceCycle reopenQuarter(Long cycleId, LocalDate newEndDate) {
        if (cycleId == null) {
            throw new ValidationException("Cycle ID is required");
        }

        if (newEndDate == null) {
            throw new ValidationException("New expiry date is required");
        }

        PerformanceCycle cycle = cycleRepository.findById(cycleId)
                .orElseThrow(() -> new ResourceNotFoundException("Cycle not found"));

        if (cycle.getCycleType() != CycleType.QUARTERLY) {
            throw new ValidationException("Only quarterly cycles can be reopened");
        }

        if (cycle.getStatus() != CycleStatus.CLOSED) {
            throw new ConflictException("Only CLOSED cycles can be reopened. Current status: " + cycle.getStatus());
        }

        // Check if any later quarter exists for the same financial year
        boolean hasLaterQuarter = checkIfLaterQuarterExists(cycle.getFinancialYear(), cycle.getQuarter());

        if (hasLaterQuarter) {
            throw new ConflictException(
                    "Cannot reopen " + cycle.getQuarter() + " because a later quarter has already been created for financial year " + cycle.getFinancialYear()
            );
        }

        if (newEndDate.isBefore(LocalDate.now())) {
            throw new ValidationException("New expiry date cannot be in the past");
        }

        cycle.setStatus(CycleStatus.ACTIVE);
        cycle.setEndDate(newEndDate);

        return cycleRepository.save(cycle);
    }

    @Override
    @Transactional
    public PerformanceCycle sendReminder(Long cycleId) {
        if (cycleId == null) {
            throw new ValidationException("Cycle ID is required");
        }

        PerformanceCycle cycle = cycleRepository.findById(cycleId)
                .orElseThrow(() -> new ResourceNotFoundException("Cycle not found"));

        if (cycle.getStatus() != CycleStatus.ACTIVE) {
            throw new ConflictException("Reminders can only be sent for ACTIVE cycles. Current status: " + cycle.getStatus());
        }

        try {
            log.info("Sending reminder email to ALL employees for cycle (DISABLED): {} {} / {}",
                    cycle.getQuarter(), cycle.getFinancialYear(), cycle.getYear());

            // emailerService.sendReminderToAllEmployees(cycle.getId());
            cycle.setLastReminderDate(LocalDateTime.now());

            log.info("Reminder sent successfully (bypassed) for cycle ID: {} at {}", cycleId, cycle.getLastReminderDate());

            return cycleRepository.save(cycle);

        } catch (Exception e) {
            log.error("Failed to send reminder emails: ", e);
            throw new RuntimeException("Failed to send reminder emails: " + e.getMessage());
        }
    }

    private void validateCycleInput(
            CycleType cycleType,
            Integer year,
            Quarter quarter,
            LocalDate startDate,
            LocalDate endDate
    ) {
        if (cycleType == null) {
            throw new ValidationException("Cycle type is required");
        }

        if (year == null || year <= 0) {
            throw new ValidationException("Valid year is required");
        }

        if (startDate == null) {
            throw new ValidationException("Start date is required");
        }

        if (endDate == null) {
            throw new ValidationException("End date is required");
        }

        if (startDate.isAfter(endDate)) {
            throw new ValidationException("Start date cannot be after end date");
        }

        if (cycleType == CycleType.QUARTERLY && quarter == null) {
            throw new ValidationException("Quarter is mandatory for quarterly cycle");
        }

        if (cycleType == CycleType.ANNUAL && quarter != null) {
            throw new ValidationException("Quarter should not be provided for annual cycle");
        }
    }

    @Override
    public List<PerformanceCycle> getCyclesByYear(Integer year) {
        return cycleRepository.findByYear(year);
    }

    @Override
    public List<PerformanceCycle> getCyclesByFinancialYear(String financialYear) {
        if (financialYear == null || financialYear.trim().isEmpty()) {
            throw new ValidationException("Financial year is required");
        }
        return cycleRepository.findByFinancialYear(financialYear);
    }

    @Override
    public PerformanceCycle createAnnualCycle(
            Integer year,
            Integer reminderDays,
            LocalDate startDate,
            LocalDate endDate,
            String financialYear
    ) {
        if (year == null) {
            throw new ValidationException("Year is required");
        }

        if (financialYear == null || financialYear.trim().isEmpty()) {
            throw new ValidationException("Financial year is required for annual cycle");
        }

        if (startDate == null || endDate == null) {
            throw new ValidationException("Start and End date required");
        }

        if (startDate.isAfter(endDate)) {
            throw new ValidationException("Start date cannot be after end date");
        }

        // Check if annual cycle already exists for this financial year
        Optional<PerformanceCycle> existing =
                cycleRepository.findByFinancialYearAndCycleType(financialYear, CycleType.ANNUAL);

        if (existing.isPresent()) {
            throw new ConflictException("Annual cycle already exists for financial year " + financialYear);
        }

        PerformanceCycle cycle = new PerformanceCycle();

        cycle.setCycleType(CycleType.ANNUAL);
        cycle.setYear(year);
        cycle.setQuarter(null);
        cycle.setReminderDays(reminderDays);
        cycle.setStartDate(startDate);
        cycle.setEndDate(endDate);
        cycle.setStatus(CycleStatus.NOT_STARTED);
        cycle.setFinancialYear(financialYear);

        return cycleRepository.save(cycle);
    }

    private Quarter getPreviousQuarter(Quarter current) {
        switch (current) {
            case Q2:
                return Quarter.Q1;
            case Q3:
                return Quarter.Q2;
            case Q4:
                return Quarter.Q3;
            default:
                return null;
        }
    }

    private int getQuarterOrder(Quarter quarter) {
        if (quarter == null) return 0;
        switch (quarter) {
            case Q1:
                return 1;
            case Q2:
                return 2;
            case Q3:
                return 3;
            case Q4:
                return 4;
            default:
                return 0;
        }
    }

    private boolean checkIfLaterQuarterExists(String financialYear, Quarter currentQuarter) {
        List<PerformanceCycle> allQuarters = cycleRepository.findByFinancialYearAndCycleTypeOrderByQuarterAsc(
                financialYear, CycleType.QUARTERLY
        );

        int currentOrder = getQuarterOrder(currentQuarter);

        return allQuarters.stream()
                .anyMatch(q -> getQuarterOrder(q.getQuarter()) > currentOrder);
    }

    @Override
    @Transactional
    public void resetEmployeeData(String financialYear, String quarterStr, String employeeId, String scope, String resetBy) {
        log.info("========== RESET EMPLOYEE DATA CALLED ==========");
        log.info("Financial Year: {}, Quarter: {}, EmployeeId: {}, Scope: {}, ResetBy: {}", financialYear, quarterStr, employeeId, scope, resetBy);

        if (financialYear == null || financialYear.trim().isEmpty()) {
            throw new ValidationException("Financial year is required for resetting data");
        }

        Integer startYear = extractYearFromFinancialYear(financialYear);
        boolean hasEmpId = employeeId != null && !employeeId.trim().isEmpty();
        String cleanEmpId = hasEmpId ? employeeId.trim() : null;

        Quarter quarter = null;
        if (quarterStr != null && !quarterStr.trim().isEmpty()) {
            try {
                quarter = Quarter.valueOf(quarterStr.trim().toUpperCase());
            } catch (IllegalArgumentException e) {
                log.warn("Invalid quarter format provided: {}", quarterStr);
            }
        }

        boolean resetQuarterly = "QUARTER".equalsIgnoreCase(scope) || "ALL".equalsIgnoreCase(scope);
        boolean resetAnnual = "ANNUAL".equalsIgnoreCase(scope) || "ALL".equalsIgnoreCase(scope);

        // 1. Reset Quarterly Data (goal, development_goal)
        if (resetQuarterly) {
            if (quarter != null) {
                if (hasEmpId) {
                    log.info("Deleting goals and dev goals for emp: {}, quarter: {}, FY: {}", cleanEmpId, quarter, financialYear);
                    goalRepository.deleteByEmployeeIdAndQuarterAndFinancialYear(cleanEmpId, quarter, financialYear, startYear);
                    developmentGoalRepository.deleteByEmployeeIdAndQuarterAndFinancialYear(cleanEmpId, quarter, financialYear, startYear);
                } else {
                    log.info("Deleting goals and dev goals for ALL employees, quarter: {}, FY: {}", quarter, financialYear);
                    goalRepository.deleteByQuarterAndFinancialYear(quarter, financialYear, startYear);
                    developmentGoalRepository.deleteByQuarterAndFinancialYear(quarter, financialYear, startYear);
                }
            } else {
                if (hasEmpId) {
                    log.info("Deleting goals and dev goals for emp: {}, ALL quarters, FY: {}", cleanEmpId, financialYear);
                    goalRepository.deleteByEmployeeIdAndFinancialYear(cleanEmpId, financialYear, startYear);
                    developmentGoalRepository.deleteByEmployeeIdAndFinancialYear(cleanEmpId, financialYear, startYear);
                } else {
                    log.info("Deleting goals and dev goals for ALL employees, ALL quarters, FY: {}", financialYear);
                    goalRepository.deleteByFinancialYear(financialYear, startYear);
                    developmentGoalRepository.deleteByFinancialYear(financialYear, startYear);
                }
            }
        }

        // 2. Reset Annual Review Data (annual_reviews, certification, employee_certification, posh)
        if (resetAnnual) {
            List<AnnualReview> reviewsToReset;
            if (hasEmpId) {
                reviewsToReset = annualReviewRepository.findAllByEmployeeIdAndFinancialYear(cleanEmpId, financialYear);
            } else {
                reviewsToReset = annualReviewRepository.findAllByFinancialYear(financialYear);
            }

            log.info("Found {} annual_reviews records to reset for FY: {}, EmpId: {}", reviewsToReset.size(), financialYear, cleanEmpId);

            for (AnnualReview review : reviewsToReset) {
                Long arId = review.getId();

                // Delete POSH records
                poshRepository.deleteByAnnualReviewId(arId);

                // Find & delete certifications & employee_certifications
                List<Certification> certs = certificationRepository.findByAnnualReviewId(arId);
                if (certs != null && !certs.isEmpty()) {
                    List<Long> certIds = certs.stream().map(Certification::getId).collect(Collectors.toList());
                    employeeCertificationRepository.deleteByCertificationIdIn(certIds);
                    certificationRepository.deleteByAnnualReviewId(arId);
                }

                // Delete the annual review record
                annualReviewRepository.delete(review);
            }

            // Also cleanup employee_certification by year/empId
            if (startYear != null) {
                if (hasEmpId) {
                    employeeCertificationRepository.deleteByEmployeeIdAndYear(cleanEmpId, startYear);
                } else {
                    employeeCertificationRepository.deleteByYear(startYear);
                }
            }
        }

        // 3. Save Audit Log Entry to reset_employee_data_log table
        try {
            com.cdl.epms.model.ResetEmployeeDataLog logEntry = com.cdl.epms.model.ResetEmployeeDataLog.builder()
                    .employeeId(hasEmpId ? cleanEmpId : "ALL")
                    .financialYear(financialYear)
                    .resetScope(scope != null ? scope.toUpperCase() : "ALL")
                    .quarter(quarterStr != null && !quarterStr.trim().isEmpty() ? quarterStr.trim().toUpperCase() : ("ANNUAL".equalsIgnoreCase(scope) ? "ANNUAL" : "ALL"))
                    .resetBy(resetBy != null && !resetBy.trim().isEmpty() ? resetBy.trim() : "HR_ADMIN")
                    .resetAt(LocalDateTime.now())
                    .build();

            resetEmployeeDataLogRepository.save(logEntry);
            log.info("Saved audit log entry to reset_employee_data_log table: {}", logEntry);
        } catch (Exception e) {
            log.error("Failed to save reset employee data audit log", e);
        }

        log.info("========== RESET EMPLOYEE DATA COMPLETED ==========");
    }

    @Override
    public List<com.cdl.epms.model.ResetEmployeeDataLog> getResetLogs(String financialYear) {
        if (financialYear != null && !financialYear.trim().isEmpty()) {
            return resetEmployeeDataLogRepository.findByFinancialYearOrderByIdDesc(financialYear.trim());
        }
        return resetEmployeeDataLogRepository.findAllByOrderByIdDesc();
    }

    private Integer extractYearFromFinancialYear(String financialYear) {
        if (financialYear == null || !financialYear.contains("-")) return null;
        try {
            return Integer.parseInt(financialYear.split("-")[0]);
        } catch (Exception e) {
            return null;
        }
    }
}