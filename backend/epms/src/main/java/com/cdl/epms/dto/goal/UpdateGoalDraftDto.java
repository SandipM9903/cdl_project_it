package com.cdl.epms.dto.goal;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UpdateGoalDraftDto {

    @NotBlank(message = "Employee ID cannot be empty.")
    private String employeeId;

    @NotBlank(message = "Manager ID cannot be empty.")
    private String managerId;

    @NotBlank(message = "Goal/Objective cannot be empty.")
    @Size(max = 1000, message = "Objective/Title cannot be more than 1000 characters.")
    private String title;

    private String target;

    @Min(value = 0, message = "Weightage must be at least 0.")
    @Max(value = 100, message = "Weightage cannot be more than 100.")
    private Integer weightage;
}