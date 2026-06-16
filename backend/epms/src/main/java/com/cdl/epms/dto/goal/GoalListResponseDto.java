package com.cdl.epms.dto.goal;

import com.cdl.epms.common.enums.GoalStatus;
import com.cdl.epms.common.enums.GoalType;
import com.cdl.epms.common.enums.Quarter;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class GoalListResponseDto {
    private Long id;
    private Integer year;
    private Quarter quarter;
    private String employeeId;
    private String managerId;
    private GoalType goalType;
    private String title;
    private String target;
    private Integer weightage;
    private GoalStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime approvedAt;

    private String remarks;
    private Integer selfAssessmentScore;
    private Integer managerAssessmentScore;
    private String managerComment;
    private String managerApprovalComment;
    private LocalDateTime reviewedAt;
    private String goalCategory;
    private LocalDateTime submittedToEmployeeAt;
    private LocalDateTime selfReviewSubmittedDate;
    private Integer overallSelfAssessmentRating;
    private String overallSelfReviewComments;
    private Integer managerOverallSelfAssessmentRating;
    private String managerOverallSelfReviewComments;
    private String achievementLevel;
    private String potential;
    private String performance;
    private String talentOrCriticalResource;
    private String talentMatrixCategory;
    private LocalDateTime selfAcceptedDate;
    private String timeline;
}