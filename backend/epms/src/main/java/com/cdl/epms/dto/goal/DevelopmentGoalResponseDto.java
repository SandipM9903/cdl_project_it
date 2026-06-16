package com.cdl.epms.dto.goal;

import com.cdl.epms.common.enums.GoalStatus;
import com.cdl.epms.common.enums.Quarter;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DevelopmentGoalResponseDto {
    private Long id;
    private Integer year;
    private Quarter quarter;
    private String employeeId;
    private String managerId;
    private String title;
    private String trainingName;
    private String description;
    private Integer selfAssessmentScore;
    private Integer managerAssessmentScore;
    private String managerComment;
    private String managerApprovalComment;
    private GoalStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime submittedToEmployeeAt;
    private LocalDateTime selfReviewSubmittedDate;
    private LocalDateTime reviewedAt;
    private LocalDateTime selfAcceptedDate;
}