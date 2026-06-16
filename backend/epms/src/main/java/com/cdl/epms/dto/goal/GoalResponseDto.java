package com.cdl.epms.dto.goal;

import com.cdl.epms.common.enums.GoalStatus;
import com.cdl.epms.common.enums.GoalType;
import com.cdl.epms.common.enums.Quarter;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class GoalResponseDto {

    private Long id;
    private String employeeId;
    private String managerId;

    // 1. Goal/ Objective
    private String title;

    // 2. Target
    private String target;

    // 3. Weightage
    private Integer weightage;

    private GoalType goalType;
    private GoalStatus status;

    private Quarter quarter;
    private Integer year;

    // 4. Remarks (Employee)
    private String remarks;

    // 5. Self Assessment (Out of 100)
    private Integer selfAssessmentScore;

    // 6. Manager Assessment (Out of 100)
    private Integer managerAssessmentScore;

    // 7. Manager Comments
    private String managerComment;

    // Manager Approval Comment (Step 5 - Send Back)
    private String managerApprovalComment;

    private String goalCategory;
    private LocalDateTime submittedToEmployeeAt;
    private LocalDateTime approvedAt;
    private LocalDateTime selfReviewSubmittedDate;

    private LocalDateTime reviewedAt;
    private LocalDateTime selfAcceptedDate;

    // Overall Ratings
    private Integer overallSelfAssessmentRating;
    private String overallSelfReviewComments;
    private Integer managerOverallSelfAssessmentRating;
    private String managerOverallSelfReviewComments;

    // Talent Matrix Fields
    private String achievementLevel;
    private String potential;
    private String performance;
    private String talentOrCriticalResource;
    private String talentMatrixCategory;

    private String timeline;
}