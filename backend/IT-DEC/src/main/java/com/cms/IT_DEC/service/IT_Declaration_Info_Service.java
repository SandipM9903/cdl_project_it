package com.cms.IT_DEC.service;

import com.cms.IT_DEC.co_pkg.IT_Declaration_InfoCO;
import com.cms.IT_DEC.dto.IT_Declaration_InfoDTO;
import com.cms.IT_DEC.dto.report.EmployeeITReportDTO;
import com.cms.IT_DEC.dto.report.ITDeclarationReportDTO;
import com.cms.IT_DEC.model.IT_Declaration_Info;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface IT_Declaration_Info_Service {

    List<IT_Declaration_InfoDTO> createDeclarationInfo(List<IT_Declaration_InfoCO> itDeclarationInfoCOList);

    List<IT_Declaration_InfoDTO> getDeclarationInfoByEmpIdAndFinancialYear(String empCode, String financialYear);

    // section80c
    IT_Declaration_InfoDTO setSaveStatusForSection80c(String empCode, String financialYear);
    Boolean getSaveStatusForSection80c(String empCode, String financialYear);
    IT_Declaration_InfoDTO setDeclarationAmountForSection80c(String empCode, String financialYear, IT_Declaration_Info itDeclarationInfo);
    Double getDeclarationAmountForSection80c(String empCode, String financialYear);

    // section80d
    IT_Declaration_InfoDTO setSaveStatusForSection80d(String empCode, String financialYear);
    Boolean getSaveStatusForSection80d(String empCode, String financialYear);
    IT_Declaration_InfoDTO setDeclarationAmountForSection80d(String empCode, String financialYear, IT_Declaration_Info itDeclarationInfo);
    Double getDeclarationAmountForSection80d(String empCode, String financialYear);

    // For Report
    Page<IT_Declaration_InfoDTO> getAllDeclarationInfo(int page, int size);
    List<ITDeclarationReportDTO> getEmployeeReport(String empCode, String financialYear);
    List<EmployeeITReportDTO> getAllEmployeeReports(String financialYear);

    // Get distinct financial years from declarations
    List<String> getDistinctFinancialYears();

    // Clear report cache
    void clearReportCache();

    // Clear cache for specific financial year
    void clearReportCacheForYear(String financialYear);
}