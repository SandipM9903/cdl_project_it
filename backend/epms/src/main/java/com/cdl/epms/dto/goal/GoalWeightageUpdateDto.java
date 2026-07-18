package com.cdl.epms.dto.goal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GoalWeightageUpdateDto {
    private Long goalId;
    private Integer weightage;
}
