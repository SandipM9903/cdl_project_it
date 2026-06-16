package com.cdl.epms.dto.employee;

import lombok.Data;

@Data
public class EmployeeFrontendDTO {
    private Long id;
    private String empCode;
    private String firstName;
    private String middleName;
    private String lastName;
    private String fullNameAsAadhaar;
    private String emailId;
    private String designationName;
    private String mainDepartment;
    private String employmentStatus;
    private String reportingManager;
    private String reportingManagerEmailId;
    private String projectName;
    private String subDept;
}