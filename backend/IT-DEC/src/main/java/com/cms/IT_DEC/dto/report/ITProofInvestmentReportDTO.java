package com.cms.IT_DEC.dto.report;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ITProofInvestmentReportDTO {
    private String employeeName;
    private String employeeCode;
    private String panNo;
    private String financialYear;
    private String department;
    private String section;
    private String component;
    private String particular;
    private Double revisedAmount;
    private String modifiedDate;
    private String remarks;
    private String landlordName;
    private String landlordPanNumber;
    private String uploadedDocs;
    private String documentIds;
    private String documentCaption;
}