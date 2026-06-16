package com.cdl.employee.service;

import com.cdl.employee.entity.Employee;
import com.cdl.employee.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    @Autowired
    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    // Create or Update Employee
    public Employee saveEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    // Get all employees
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    // Get employee by database ID
    public Optional<Employee> getEmployeeById(Long id) {
        return employeeRepository.findById(id);
    }

    // Get employee by employee ID
    public Optional<Employee> getEmployeeByempCode(Integer empCode) {
        return employeeRepository.findByempCode(empCode);
    }

    // Get employee by email
    public Optional<Employee> getEmployeeByEmail(String email) {
        return employeeRepository.findByEmailId(email);
    }

    // Get employees under a reporting manager
    public List<Employee> getEmployeesByReportingManager(String managerName) {
        return employeeRepository.findByReportingManager(managerName);
    }

    // Delete employee by ID
    public void deleteEmployee(Long id) {
        employeeRepository.deleteById(id);
    }

    public List<String> getAllEmailIds() {
        return employeeRepository.findAllEmailIds();
    }
}