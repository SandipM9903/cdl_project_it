package com.cms.IT_DEC.dto.employee_dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrganizationResDTO {
    private long orgCode;
    private String organizationName;
    private String organizationHierarchy;
}
