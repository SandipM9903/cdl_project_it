package com.cdl.epms.dto.email;

import lombok.Data;

@Data
public class EmployeeDto {
    private String emailId;
    private String reportingManagerEmailId;
    private String firstName;
    private String lastName;
    private String employeeId;
}