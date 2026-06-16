package com.cdl.epms.dto.employee;

import lombok.Data;

@Data
public class ProjectResDTO {
    private Long projectId;
    private String projectName;
    private String projectShortName;
    private String projectCode;
    private String wbsName;
}