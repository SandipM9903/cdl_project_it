package com.cms.IT_DEC.dto.employee_dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DependentDetailsResDTO {
    private long dependentDetailsId;
    private String dependentName;
    private String dependentRelationship;
    private LocalDate dependentDateOfBirth;
}
