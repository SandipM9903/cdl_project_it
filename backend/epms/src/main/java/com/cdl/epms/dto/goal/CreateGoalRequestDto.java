package com.cdl.epms.dto.goal;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateGoalRequestDto {

    @NotBlank(message = "Employee ID is required")
    private String employeeId;

    @NotBlank(message = "Manager ID is required")
    private String managerId;

    @NotBlank(message = "Goal title is required")
    private String title;

    @NotBlank(message = "Target is required")
    private String target;

    @NotNull(message = "Weightage is required")
    @Min(value = 0, message = "Weightage must be at least 0")
    @Max(value = 100, message = "Weightage cannot be more than 100")
    private Integer weightage;
}