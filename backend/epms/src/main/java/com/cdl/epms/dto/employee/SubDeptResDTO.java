package com.cdl.epms.dto.employee;

import lombok.Data;

@Data
public class SubDeptResDTO {
    private Long subDeptId;
    private String subDept;
    private String description;
    private String orgUnits;
}