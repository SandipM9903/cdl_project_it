package com.cdl.epms.dto.goal;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateDevelopmentGoalRequestDto {

    @NotBlank(message = "Employee ID is required")
    private String employeeId;

    @NotBlank(message = "Manager ID is required")
    private String managerId;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Training name is required")
    private String trainingName;

    @NotBlank(message = "Description is required")
    private String description;

    @Min(value = 0, message = "Self assessment score must be at least 0")
    @Max(value = 100, message = "Self assessment score cannot be greater than 100")
    private Integer selfAssessmentScore;
}