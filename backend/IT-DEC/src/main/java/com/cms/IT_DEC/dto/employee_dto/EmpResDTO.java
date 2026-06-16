package com.cms.IT_DEC.dto.employee_dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmpResDTO {
    private long empId;
    private String empCode;
    private String firstName;
    private String lastName;
    private String age;
    private String emailId;
    private boolean status;
    private LocalDate dateOfJoining;
    private String dateOfBirth;
    private String bloodGroup;
    private String reportTo;
    private String reportingManager;
    private String buHeadName;
    private String reportingManagerEmailId;
    private String aboutEmp;
    private String gender;
    private long locationId;
    private int yearsCompleted;
    private LocalDate createdDate;
    private String createdBy;
    private String primaryContactNo;
    private String secondaryContactNo;
    private String emergencyContactNo;
    private String emergencyContactName;
    private String relationWithEmergencyContact;
    private String personalEmailId;
    private String passportNumber;
    private String maritalStatus;
    private String description;
    private String expWithCurrentCompany;
    private String hiringHr;

    private MainDeptResDTO mainDeptResDTO;
    private SubDeptResDTO subDeptResDTO;
    private List<DependentDetailsResDTO> dependentDetailsResDTOS;
    private SalaryAccDetailsResDTO salaryAccDetailsResDTO;
    private DesignationResDTO designationResDTO;
    private OrganizationResDTO organizationResDTO;
    private ProjectResDTO projectResDTO;
    private OrgHierarchyResDTO orgHierarchyResDTO;

 }
