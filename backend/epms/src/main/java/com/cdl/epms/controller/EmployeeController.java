package com.cdl.epms.controller;

import com.cdl.epms.dto.employee.EmployeeFrontendDTO;
import com.cdl.epms.service.serviceImpl.EmployeeService;
import com.cdl.epms.util.CryptoUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin("*")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private CryptoUtil cryptoUtil;

    @GetMapping("performance/employees/{empCode}")
    public EmployeeFrontendDTO getEmployees(@PathVariable String empCode) {
        String decryptedEmpCode = cryptoUtil.decryptIfEncrypted(empCode);
        return employeeService.getAllEmployees(decryptedEmpCode);
    }
}