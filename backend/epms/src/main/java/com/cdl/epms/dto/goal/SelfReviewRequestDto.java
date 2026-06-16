package com.cdl.epms.dto.goal;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class SelfReviewRequestDto {

    @NotNull(message = "Employee ID is required")
    private String employeeId;

    @NotNull(message = "Quarter is required")
    private String quarter;

    @NotNull(message = "Year is required")
    private Integer year;

    // ✅ Overall rating and comment at the DTO level (popup fields)
    @Min(value = 1, message = "Overall rating must be at least 1")
    @Max(value = 5, message = "Overall rating cannot be greater than 5")
    private Integer overallSelfAssessmentRating;

    private String overallSelfReviewComments;

    @NotNull(message = "Goals list is required")
    private List<SelfReviewGoalDto> goals;

    @Data
    public static class SelfReviewGoalDto {

        @NotNull(message = "Goal ID is required")
        private Long id;

        // Employee Remarks for each goal
        private String remarks;

        // Self Assessment for each goal (Out of 100)
        @Min(value = 0, message = "Self assessment score must be at least 0")
        @Max(value = 100, message = "Self assessment score cannot be greater than 100")
        private Integer selfAssessmentScore;
    }
}