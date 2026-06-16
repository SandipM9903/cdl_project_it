package com.cms.IT_DEC.service.impl;

import com.cms.IT_DEC.exception.ResourceNotFoundException;
import com.cms.IT_DEC.model.EmployeeInformation;
import com.cms.IT_DEC.repository.EmployeeInformationRepository;
import com.cms.IT_DEC.service.EmployeeInformationService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeInformationServiceImpl
        implements EmployeeInformationService {

    private final EmployeeInformationRepository employeeInformationRepository;

    public EmployeeInformationServiceImpl(
            EmployeeInformationRepository employeeInformationRepository) {
        this.employeeInformationRepository = employeeInformationRepository;
    }

    @Override
    public EmployeeInformation saveEmployee(
            EmployeeInformation employeeInformation) {

        return employeeInformationRepository.save(employeeInformation);
    }

    @Override
    public List<EmployeeInformation> getAllEmployees() {

        List<EmployeeInformation> employees =
                employeeInformationRepository.findAll();

        if (employees.isEmpty()) {
            throw new ResourceNotFoundException(
                    "No employee information found");
        }

        return employees;
    }

    @Override
    public EmployeeInformation getEmployeeById(Long id) {

        return employeeInformationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee not found with id: " + id));
    }

    @Override
    public void deleteEmployee(Long id) {

        EmployeeInformation employee =
                employeeInformationRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Employee not found with id: " + id));

        employeeInformationRepository.delete(employee);
    }

    @Override
    public EmployeeInformation getByEmpCode(String empCode) {

        return employeeInformationRepository
                .findByEmpCode(empCode)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee not found for empCode: " + empCode));
    }

    @Override
    public EmployeeInformation updatePan(
            String empCode,
            EmployeeInformation request) {

        EmployeeInformation emp =
                employeeInformationRepository
                        .findByEmpCode(empCode)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Employee not found with empCode: " + empCode));

        emp.setPanNumber(request.getPanNumber());

        return employeeInformationRepository.save(emp);
    }

    @Override
    public EmployeeInformation updateLandlordDetails(
            String empCode,
            EmployeeInformation request) {

        // Try to find existing record with this empCode
        EmployeeInformation emp = employeeInformationRepository
                .findByEmpCode(empCode)
                .orElse(null);

        if (emp == null) {
            // If no existing record, create a new one
            emp = new EmployeeInformation();
            emp.setEmpCode(empCode);
        }

        // Update landlord details
        emp.setLandlordName(request.getLandlordName());
        emp.setLandlordPanNumber(request.getLandlordPanNumber());

        // Keep existing PAN number if it exists, otherwise set from request if provided
        if (emp.getPanNumber() == null && request.getPanNumber() != null) {
            emp.setPanNumber(request.getPanNumber());
        }

        // Keep existing employee name if it exists, otherwise set from request if provided
        if (emp.getEmpName() == null && request.getEmpName() != null) {
            emp.setEmpName(request.getEmpName());
        }

        return employeeInformationRepository.save(emp);
    }

    @Override
    public EmployeeInformation getLandlordDetails(String empCode) {

        return employeeInformationRepository
                .findByEmpCode(empCode)
                .orElse(null);
    }
}