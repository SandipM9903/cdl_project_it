package com.cdl.epms.dto.report;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportWithEmployeeDTO {
    // Report fields
    private Long id;
    private String employeeId;
    private String managerId;
    private Integer year;
    private String financialYear;
    private String status;
    private String keyAccomplishment;
    private String managerRating;
    private String achievementLevel;
    private String potential;
    private String performance;
    private String talentResource;
    private String matrixCategory;
    private String nineBoxResult;
    private Boolean talentFlag;
    private Boolean criticalFlag;
    private String managerRemarks;
    private String performanceRating;
    private String potentialRating;
    private LocalDateTime submittedAt;
    private LocalDateTime managerAnnualReviewSubmissionDate;
    private Boolean discussedWithR1;
    private Boolean employeeComment;
    private String employeeCommentText;
    private LocalDateTime submittedToHrDate;
    private String submittedToHrBy;
    private String hrRemarks;
    private Integer sendBackCount;
    private LocalDateTime lastSendBackAt;
    private String sendBackRemarks;
    private String employeeFeeling;
    private String additionalFeedback;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Employee fields
    private String employeeFullName;
    private String mainDepartment;
    private String subDepartment;
    private String locationName;

    // Manager fields (from reportTo and reportingManager)
    private String managerEmpCode;      // From reportTo field
    private String managerFullName;     // From reportingManager field
    private String managerEmailId;      // From reportingManagerEmailId field
}