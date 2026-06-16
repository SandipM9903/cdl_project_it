package com.cms.IT_DEC.service;

import com.cms.IT_DEC.dto.report.ITProofInvestmentReportDTO;

import java.util.List;

public interface IT_Proof_Investment_Report_Service {
    List<ITProofInvestmentReportDTO> getInvestmentProofReport(String empCode, String financialYear);
    List<ITProofInvestmentReportDTO> getAllInvestmentProofReports();
    List<ITProofInvestmentReportDTO> getInvestmentProofReportByFinancialYear(String financialYear);
    List<ITProofInvestmentReportDTO> getInvestmentProofReportByEmployee(String empCode);
}