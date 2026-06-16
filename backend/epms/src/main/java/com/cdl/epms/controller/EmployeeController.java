package com.cdl.epms.controller;

import com.cdl.epms.dto.employee.EmployeeFrontendDTO;
import com.cdl.epms.service.serviceImpl.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin("*")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping("performance/employees/{empCode}")
    public EmployeeFrontendDTO getEmployees(@PathVariable String empCode) {
        // Pass the empCode into your service method to filter the results
        return employeeService.getAllEmployees(empCode);
    }
}