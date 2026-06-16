package com.cdl.epms.dto.goal;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ManagerFinalReviewRequestDto {

    @NotNull(message = "Manager ID is required")
    private String managerId;

    @NotNull(message = "Employee ID is required")
    private String employeeId;

    @NotNull(message = "Quarter is required")
    private String quarter;

    @NotNull(message = "Year is required")
    private Integer year;

    // Talent Matrix Fields
    private String achievementLevel;
    private String potential;
    private String performance;
    private String talentOrCriticalResource;

    // Manager Rating (A+, A, B+, B, C) - auto-populated from 9-box grid
    private String managerRating;

    // Overall Rating Popup
    @Min(value = 1, message = "Overall rating must be at least 1")
    @Max(value = 5, message = "Overall rating cannot be greater than 5")
    private Integer managerOverallSelfAssessmentRating;

    private String managerOverallSelfReviewComments;

    @NotEmpty(message = "Goals list cannot be empty")
    private List<ManagerFinalReviewGoalDto> goals;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ManagerFinalReviewGoalDto {
        @NotNull(message = "Goal ID is required")
        private Long id;

        @Min(value = 0, message = "Manager assessment score must be at least 0")
        @Max(value = 100, message = "Manager assessment score cannot be greater than 100")
        private Integer managerAssessmentScore;

        private String managerComment;
    }
}