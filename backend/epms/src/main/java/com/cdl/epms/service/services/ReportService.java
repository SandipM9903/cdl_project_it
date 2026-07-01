package com.cdl.epms.service.services;

import com.cdl.epms.dto.report.EmployeeResponseDTO;
import com.cdl.epms.dto.report.ReportWithEmployeeDTO;
import com.cdl.epms.exception.ReportGenerationException;
import com.cdl.epms.model.AnnualReview;
import com.cdl.epms.repository.AnnualPerformanceReportRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import com.cdl.epms.dto.reports.ReportGoalResponseDto;
import com.cdl.epms.repository.GoalRepository;
import com.cdl.epms.model.Goal;
import com.cdl.epms.common.enums.Quarter;
import com.cdl.epms.repository.DevelopmentGoalRepository;
import com.cdl.epms.model.DevelopmentGoal;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReportService {

    private final AnnualPerformanceReportRepository annualReviewRepository;
    private final EmployeeApiClient employeeApiClient;
    private final GoalRepository goalRepository;
    private final DevelopmentGoalRepository developmentGoalRepository;

    public List<ReportWithEmployeeDTO> searchByDateRangeWithEmployee(LocalDateTime startDate,
                                                                     LocalDateTime endDate,
                                                                     String status) {
        log.info("Searching by date range: startDate={}, endDate={}, status={}", startDate, endDate, status);

        if (startDate == null || endDate == null) {
            throw new ReportGenerationException("Start date and end date are required");
        }

        if (startDate.isAfter(endDate)) {
            throw new ReportGenerationException("Start date cannot be after end date");
        }

        List<AnnualReview> reports;

        if (status == null || status.equalsIgnoreCase("ALL")) {
            reports = annualReviewRepository.findByDateRange(startDate, endDate);
            log.info("Found {} reports (ALL statuses)", reports.size());
        } else {
            String statusUpper = status.toUpperCase();
            reports = annualReviewRepository.findByDateRangeAndStatus(startDate, endDate, statusUpper);
            log.info("Found {} reports with status: {}", reports.size(), statusUpper);
        }

        return reports.stream()
                .map(this::convertToDTOWithEmployee)
                .collect(Collectors.toList());
    }

    public List<ReportWithEmployeeDTO> searchByFinancialYearWithEmployee(String financialYear, String status) {
        log.info("Searching by financial year: {}, status={}", financialYear, status);

        if (financialYear == null || financialYear.trim().isEmpty()) {
            throw new ReportGenerationException("Financial year is required");
        }

        if (!financialYear.matches("^\\d{4}-\\d{4}$")) {
            throw new ReportGenerationException("Financial year must be in format YYYY-YYYY (e.g., 2025-2026)");
        }

        List<AnnualReview> reports;

        if (status == null || status.equalsIgnoreCase("ALL")) {
            reports = annualReviewRepository.findByFinancialYear(financialYear);
            log.info("Found {} reports (ALL statuses)", reports.size());
        } else {
            String statusUpper = status.toUpperCase();
            reports = annualReviewRepository.findByFinancialYearAndStatus(financialYear, statusUpper);
            log.info("Found {} reports with status: {}", reports.size(), statusUpper);
        }

        return reports.stream()
                .map(this::convertToDTOWithEmployee)
                .collect(Collectors.toList());
    }

    private ReportWithEmployeeDTO convertToDTOWithEmployee(AnnualReview review) {
        log.debug("Converting review for employee: {}", review.getEmployeeId());

        ReportWithEmployeeDTO.ReportWithEmployeeDTOBuilder builder = ReportWithEmployeeDTO.builder()
                .id(review.getId())
                .employeeId(review.getEmployeeId())
                .managerId(review.getManagerId())
                .year(review.getYear())
                .financialYear(review.getFinancialYear())
                .status(review.getStatus() != null ? review.getStatus().name() : null)
                .keyAccomplishment(review.getKeyAccomplishment())
                .managerRating(review.getManagerRating())
                .achievementLevel(review.getAchievementLevel())
                .potential(review.getPotential())
                .performance(review.getPerformance())
                .talentResource(review.getTalentResource())
                .matrixCategory(review.getMatrixCategory())
                .nineBoxResult(review.getNineBoxResult())
                .talentFlag(review.getTalentFlag())
                .criticalFlag(review.getCriticalFlag())
                .managerRemarks(review.getManagerRemarks())
                .performanceRating(review.getPerformanceRating())
                .potentialRating(review.getPotentialRating())
                .submittedAt(review.getSubmittedAt())
                .managerAnnualReviewSubmissionDate(review.getManagerAnnualReviewSubmissionDate())
                .discussedWithR1(review.getDiscussedWithR1())
                .employeeComment(review.getEmployeeComment())
                .employeeCommentText(review.getEmployeeCommentText())
                .submittedToHrDate(review.getSubmittedToHrDate())
                .submittedToHrBy(review.getSubmittedToHrBy())
                .hrRemarks(review.getHrRemarks())
                .sendBackCount(review.getSendBackCount())
                .lastSendBackAt(review.getLastSendBackAt())
                .sendBackRemarks(review.getSendBackRemarks())
                .employeeFeeling(review.getEmployeeFeeling())
                .additionalFeedback(review.getAdditionalFeedback())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt());

        try {
            EmployeeResponseDTO employee = employeeApiClient.getEmployeeByCode(review.getEmployeeId());
            if (employee != null) {
                builder.employeeFullName(getValueOrDefault(employee.getFullName(), "N/A"))
                        .mainDepartment(getValueOrDefault(employee.getMainDepartment(), "N/A"))
                        .subDepartment(getValueOrDefault(employee.getSubDepartment(), "N/A"))
                        .locationName(getValueOrDefault(employee.getLocationName(), "N/A"))
                        .managerEmpCode(getValueOrDefault(employee.getManagerEmpCode(), "N/A"))
                        .managerFullName(getValueOrDefault(employee.getManagerFullName(), "N/A"))
                        .managerEmailId(getValueOrDefault(employee.getManagerEmailId(), "N/A"));
            } else {
                setDefaultValues(builder);
            }
        } catch (Exception e) {
            log.error("Failed to fetch employee details for {}: {}", review.getEmployeeId(), e.getMessage());
            setDefaultValues(builder);
        }

        return builder.build();
    }

    private String getValueOrDefault(String value, String defaultValue) {
        return (value != null && !value.trim().isEmpty()) ? value : defaultValue;
    }

    private void setDefaultValues(ReportWithEmployeeDTO.ReportWithEmployeeDTOBuilder builder) {
        builder.employeeFullName("N/A")
                .mainDepartment("N/A")
                .subDepartment("N/A")
                .locationName("N/A")
                .managerEmpCode("N/A")
                .managerFullName("N/A")
                .managerEmailId("N/A");
    }

    public List<ReportGoalResponseDto> getDetailedGoalsQuarterWiseReport(Integer year, String quarterStr) {
        log.info("Searching detailed goals quarter wise: year={}, quarter={}", year, quarterStr);

        if (year == null || year <= 0) {
            throw new ReportGenerationException("Year is required");
        }

        if (quarterStr == null || quarterStr.trim().isEmpty()) {
            throw new ReportGenerationException("Quarter is required");
        }

        Quarter quarter;
        try {
            quarter = Quarter.valueOf(quarterStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ReportGenerationException("Invalid quarter: " + quarterStr);
        }

        // Fetch regular goals
        List<Goal> goals = goalRepository.findByQuarterAndPerformanceCycle_Year(quarter, year);
        log.info("Found {} goals for quarter {} and year {}", goals.size(), quarter, year);

        // Fetch development goals
        List<DevelopmentGoal> devGoals = developmentGoalRepository.findByQuarterAndYear(quarter, year);
        log.info("Found {} development goals for quarter {} and year {}", devGoals.size(), quarter, year);

        // Map and merge
        List<ReportGoalResponseDto> mappedGoals = goals.stream()
                .map(this::convertToGoalDTOWithEmployee)
                .collect(Collectors.toList());

        List<ReportGoalResponseDto> mappedDevGoals = devGoals.stream()
                .map(this::convertToGoalDTOWithEmployee)
                .collect(Collectors.toList());

        mappedGoals.addAll(mappedDevGoals);

        return mappedGoals;
    }

    private ReportGoalResponseDto convertToGoalDTOWithEmployee(Goal goal) {
        ReportGoalResponseDto dto = new ReportGoalResponseDto();
        dto.setGoalId(goal.getId());
        dto.setEmployeeId(goal.getEmployeeId());
        dto.setManagerId(goal.getManagerId());
        if (goal.getPerformanceCycle() != null) {
            dto.setYear(goal.getPerformanceCycle().getYear());
        } else {
            dto.setYear(goal.getYear());
        }
        dto.setQuarter(goal.getQuarter());
        dto.setGoalType(goal.getGoalType());
        dto.setTitle(goal.getTitle());
        dto.setTarget(goal.getTarget());
        dto.setTrainingName("N/A");
        dto.setWeightage(goal.getWeightage());
        dto.setRemarks(goal.getRemarks());
        dto.setSelfAssessmentScore(goal.getSelfAssessmentScore());
        dto.setManagerAssessmentScore(goal.getManagerAssessmentScore());
        dto.setManagerComment(goal.getManagerComment());
        dto.setManagerApprovalComment(goal.getManagerApprovalComment());
        dto.setStatus(goal.getStatus());
        dto.setCreatedAt(goal.getCreatedAt());

        try {
            EmployeeResponseDTO employee = employeeApiClient.getEmployeeByCode(goal.getEmployeeId());
            if (employee != null) {
                dto.setEmployeeFullName(getValueOrDefault(employee.getFullName(), "N/A"));
                dto.setMainDepartment(getValueOrDefault(employee.getMainDepartment(), "N/A"));
                dto.setSubDepartment(getValueOrDefault(employee.getSubDepartment(), "N/A"));
                dto.setLocationName(getValueOrDefault(employee.getLocationName(), "N/A"));
                dto.setManagerEmpCode(getValueOrDefault(employee.getManagerEmpCode(), "N/A"));
                dto.setManagerFullName(getValueOrDefault(employee.getManagerFullName(), "N/A"));
                dto.setManagerEmailId(getValueOrDefault(employee.getManagerEmailId(), "N/A"));
            } else {
                setGoalDefaultValues(dto);
            }
        } catch (Exception e) {
            log.error("Failed to fetch employee details for {}: {}", goal.getEmployeeId(), e.getMessage());
            setGoalDefaultValues(dto);
        }

        return dto;
    }

    private ReportGoalResponseDto convertToGoalDTOWithEmployee(DevelopmentGoal dg) {
        ReportGoalResponseDto dto = new ReportGoalResponseDto();
        dto.setGoalId(dg.getId());
        dto.setEmployeeId(dg.getEmployeeId());
        dto.setManagerId(dg.getManagerId());
        if (dg.getPerformanceCycle() != null) {
            dto.setYear(dg.getPerformanceCycle().getYear());
        } else {
            dto.setYear(dg.getYear());
        }
        dto.setQuarter(dg.getQuarter());
        dto.setGoalType(com.cdl.epms.common.enums.GoalType.DEVELOPMENT);
        dto.setTitle(dg.getTitle());
        dto.setTrainingName(dg.getTrainingName());
        dto.setTarget(dg.getDescription());
        dto.setWeightage(null);
        dto.setRemarks(null);
        dto.setSelfAssessmentScore(dg.getSelfAssessmentScore());
        dto.setManagerAssessmentScore(dg.getManagerAssessmentScore());
        dto.setManagerComment(dg.getManagerComment());
        dto.setManagerApprovalComment(dg.getManagerApprovalComment());
        dto.setStatus(dg.getStatus());
        dto.setCreatedAt(dg.getCreatedAt());

        try {
            EmployeeResponseDTO employee = employeeApiClient.getEmployeeByCode(dg.getEmployeeId());
            if (employee != null) {
                dto.setEmployeeFullName(getValueOrDefault(employee.getFullName(), "N/A"));
                dto.setMainDepartment(getValueOrDefault(employee.getMainDepartment(), "N/A"));
                dto.setSubDepartment(getValueOrDefault(employee.getSubDepartment(), "N/A"));
                dto.setLocationName(getValueOrDefault(employee.getLocationName(), "N/A"));
                dto.setManagerEmpCode(getValueOrDefault(employee.getManagerEmpCode(), "N/A"));
                dto.setManagerFullName(getValueOrDefault(employee.getManagerFullName(), "N/A"));
                dto.setManagerEmailId(getValueOrDefault(employee.getManagerEmailId(), "N/A"));
            } else {
                setGoalDefaultValues(dto);
            }
        } catch (Exception e) {
            log.error("Failed to fetch employee details for {}: {}", dg.getEmployeeId(), e.getMessage());
            setGoalDefaultValues(dto);
        }

        return dto;
    }

    private void setGoalDefaultValues(ReportGoalResponseDto dto) {
        dto.setEmployeeFullName("N/A");
        dto.setMainDepartment("N/A");
        dto.setSubDepartment("N/A");
        dto.setLocationName("N/A");
        dto.setManagerEmpCode("N/A");
        dto.setManagerFullName("N/A");
        dto.setManagerEmailId("N/A");
    }
}