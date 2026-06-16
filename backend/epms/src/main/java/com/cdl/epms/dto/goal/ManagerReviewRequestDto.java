package com.cdl.epms.dto.goal;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class ManagerReviewRequestDto {

    @NotNull
    private String managerId;

    @NotNull
    private String employeeId;

    @NotNull
    private String quarter;

    @NotNull
    private Integer year;

    private String achievementLevel;
    private String potential;
    private String performance;
    private String talentOrCriticalResource;

    @Min(value = 1, message = "Overall rating must be at least 1")
    @Max(value = 5, message = "Overall rating cannot be greater than 5")
    private Integer managerOverallSelfAssessmentRating;

    private String managerOverallSelfReviewComments;

    @NotNull
    private List<ManagerReviewGoalDto> goals;

    @Data
    public static class ManagerReviewGoalDto {
        @NotNull
        private Long id;

        // ✅ Manager Assessment (Out of 100)
        @Min(value = 0, message = "Manager assessment score must be at least 0")
        @Max(value = 100, message = "Manager assessment score cannot be greater than 100")
        private Integer managerAssessmentScore;

        // ✅ Manager Comments for each goal
        private String managerComment;
    }
}