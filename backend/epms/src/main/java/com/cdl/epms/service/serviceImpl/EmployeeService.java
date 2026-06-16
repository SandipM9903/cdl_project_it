package com.cdl.epms.service.serviceImpl;

import com.cdl.epms.dto.employee.EmpResDTO;
import com.cdl.epms.dto.employee.EmployeeFrontendDTO;
import com.cdl.epms.dto.employee.ExternalResponse;
import com.cms.cdl.common_dtos.beans.emp_user_bean.EmpAndUserTypeResponse;
import com.cms.cdl.common_dtos.util.employee.EmployeeOperations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    @Autowired
    EmployeeOperations employeeOperations;

    private final RestTemplate restTemplate = new RestTemplate();
    private final String EXTERNAL_API_URL = "http://43.205.24.208:9020/employee/eCode/{empCode}";

    public EmployeeFrontendDTO getAllEmployees(String empCode) {
        // ExternalResponse[] responses = restTemplate.getForObject(EXTERNAL_API_URL,
        // ExternalResponse[].class, empCode);
        EmpAndUserTypeResponse empAndUserTypeResponse = employeeOperations.fetchEmployeeDataByEmpCode(empCode);
        com.cms.cdl.common_dtos.dto.response_dto.emp_full_response.EmpResDTO responses = empAndUserTypeResponse
                .getFileAndObjectTypeBean().getEmpResDTO();

        if (responses == null)
            return null;

        return convertToFrontendDTO(responses);
    }

    private EmployeeFrontendDTO convertToFrontendDTO(
            com.cms.cdl.common_dtos.dto.response_dto.emp_full_response.EmpResDTO source) {
        // EmpResDTO source = external.getEmpResDTO();
        EmployeeFrontendDTO dto = new EmployeeFrontendDTO();

        dto.setId(source.getEmpId());
        dto.setEmpCode(source.getEmpCode());
        dto.setFirstName(source.getFirstName());
        dto.setMiddleName(source.getMiddleName());
        dto.setLastName(source.getLastName());
        dto.setFullNameAsAadhaar(source.getFullNameAsAadhaar());
        dto.setEmailId(source.getEmailId());
        dto.setReportingManager(source.getReportingManager());
        dto.setReportingManagerEmailId(source.getReportingManagerEmailId());

        // Nested objects with null checks
        if (source.getDesignationResDTO() != null) {
            dto.setDesignationName(source.getDesignationResDTO().getDesignationName());
        }
        if (source.getMainDeptResDTO() != null) {
            dto.setMainDepartment(source.getMainDeptResDTO().getMainDepartment());
        }
        if (source.getEmploymentStatusResDTO() != null) {
            dto.setEmploymentStatus(source.getEmploymentStatusResDTO().getEmploymentStatus());
        }
        if (source.getProjectResDTO() != null) {
            dto.setProjectName(source.getProjectResDTO().getProjectName());
        }
        if (source.getSubDeptResDTO() != null) {
            dto.setSubDept(source.getSubDeptResDTO().getSubDept());
        }

        return dto;
    }
}