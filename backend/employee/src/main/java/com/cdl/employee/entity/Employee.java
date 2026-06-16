package com.cdl.employee.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "emp_code")
    private Integer empCode;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "email_id", unique = true)
    private String emailId;

    @Column(name = "designation_name")
    private String designationName;

    @Column(name = "main_department")
    private String mainDepartment;

    @Column(name = "employment_status")
    private String employmentStatus;

    @Column(name = "reporting_manager")
    private String reportingManager;

    @Column(name = "reporting_manager_email_id")
    private String reportingManagerEmailId;
}