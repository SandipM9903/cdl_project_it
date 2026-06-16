package com.cdl.epms.dto.reports;

import com.cdl.epms.common.enums.GoalStatus;
import com.cdl.epms.common.enums.GoalType;
import com.cdl.epms.common.enums.Quarter;
import lombok.Data;

@Data
public class ReportGoalResponseDto {
    private Long goalId;
    private String employeeId;
    private String managerId;
    private Integer year;
    private Quarter quarter;
    private GoalType goalType;

    private String title;
    private String target;          // Replaces description
    private Integer weightage;
    private String remarks;         // New field

    private Integer selfAssessmentScore;     // New 0-100 score
    private Integer managerAssessmentScore;  // Replaces managerRating

    private String managerComment;
    private String managerApprovalComment;   // New field for Step 5

    private GoalStatus status;
}