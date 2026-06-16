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

@Slf4j
@Service
@RequiredArgsConstructor
public class ReportService {

    private final AnnualPerformanceReportRepository annualReviewRepository;
    private final EmployeeApiClient employeeApiClient;

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
}