package com.cdl.employee.controller;

import com.cdl.employee.entity.Employee;
import com.cdl.employee.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/employees")
@CrossOrigin(origins = "http://localhost:3000")
public class EmployeeController {

    private final EmployeeService employeeService;

    @Autowired
    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    // Create employee
    @PostMapping
    public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee) {
        Employee savedEmployee = employeeService.saveEmployee(employee);
        return ResponseEntity.ok(savedEmployee);
    }

    // Get all employees
    @GetMapping
    public List<Employee> getAllEmployees() {
        return employeeService.getAllEmployees();
    }

    // Get employee by DB id
    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        Optional<Employee> employee = employeeService.getEmployeeById(id);
        return employee.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get employee by empCode
    @GetMapping("/emp/{empCode}")
    public ResponseEntity<Employee> getEmployeeByempCode(@PathVariable Integer empCode) {
        Optional<Employee> employee = employeeService.getEmployeeByempCode(empCode);
        return employee.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get employee by email
    @GetMapping("/email/{email}")
    public ResponseEntity<Employee> getEmployeeByEmail(@PathVariable String email) {
        Optional<Employee> employee = employeeService.getEmployeeByEmail(email);
        return employee.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get employees by reporting manager
    @GetMapping("/manager/{managerName}")
    public List<Employee> getEmployeesByManager(@PathVariable String managerName) {
        return employeeService.getEmployeesByReportingManager(managerName);
    }

    // Delete employee
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/emails")
    public ResponseEntity<List<String>> getAllEmailIds() {
        List<String> emailIds = employeeService.getAllEmailIds();
        return ResponseEntity.ok(emailIds);
    }
}