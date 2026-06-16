package com.cdl.epms.dto.employee;

import lombok.Data;

@Data
public class AllEmpRes {
    private Long empId;
    private String empCode;
    private String firstName;
    private String middleName;
    private String lastName;
    private String emailId;
    private String fullNameAsAadhaar;
    private String reportingManagerEmailId;
    private String reportingManager;
    private String reportTo;

    private DesignationResDTO designationResDTO;
    private MainDeptResDTO mainDeptResDTO;
    private SubDeptResDTO subDeptResDTO;
    private EmploymentStatusResDTO employmentStatusResDTO;
    private ProjectResDTO projectResDTO;
}
