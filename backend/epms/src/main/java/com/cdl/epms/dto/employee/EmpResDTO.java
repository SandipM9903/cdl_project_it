package com.cdl.epms.dto.employee;

import lombok.Data;

@Data
public class EmpResDTO {
    private Long empId;
    private String empCode;
    private String firstName;
    private String middleName;
    private String lastName;
    private String fullNameAsAadhaar;
    private String emailId;
    private String reportingManager;
    private String reportingManagerEmailId;
    private MainDeptResDTO mainDeptResDTO;
    private DesignationResDTO designationResDTO;
    private EmploymentStatusResDTO employmentStatusResDTO;

    // ADD THESE TWO FIELDS
    private ProjectResDTO projectResDTO;
    private SubDeptResDTO subDeptResDTO;
}