package com.cms.IT_DEC.dto.employee_dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DesignationResDTO {
    private long designationId;
    private String designationName;
    private String description;
}
