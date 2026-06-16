package com.cms.IT_DEC.dto.report;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeITReportDTO {
    private String empCode;
    private String empName;
    private String dateOfJoining;
    private String address;
    private String panNo;
    private String createdDate;
    private List<ITDeclarationReportDTO> declarations;
}