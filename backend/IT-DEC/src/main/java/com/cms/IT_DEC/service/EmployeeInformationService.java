package com.cms.IT_DEC.service;

import com.cms.IT_DEC.model.EmployeeInformation;
import java.util.List;

public interface EmployeeInformationService {

    EmployeeInformation saveEmployee(EmployeeInformation employeeInformation);

    List<EmployeeInformation> getAllEmployees();

    EmployeeInformation getEmployeeById(Long id);

    void deleteEmployee(Long id);

    EmployeeInformation getByEmpCode(String empCode);

    EmployeeInformation updatePan(String empCode, EmployeeInformation request);

    // Add these two new methods for landlord details
    EmployeeInformation updateLandlordDetails(String empCode, EmployeeInformation request);

    EmployeeInformation getLandlordDetails(String empCode);
}