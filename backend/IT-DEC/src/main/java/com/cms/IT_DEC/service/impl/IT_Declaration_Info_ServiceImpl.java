package com.cms.IT_DEC.service.impl;

import com.cms.IT_DEC.co_pkg.IT_Declaration_InfoCO;
import com.cms.IT_DEC.dto.IT_Declaration_InfoDTO;
import com.cms.IT_DEC.dto.report.EmployeeDTO;
import com.cms.IT_DEC.dto.report.EmployeeITReportDTO;
import com.cms.IT_DEC.dto.report.ITDeclarationReportDTO;
import com.cms.IT_DEC.mapper.IT_Declaration_InfoMapper;
import com.cms.IT_DEC.model.IT_Declaration_Info;
import com.cms.IT_DEC.repository.IT_Declaration_Info_Repo;
import com.cms.IT_DEC.service.EmployeeClientService;
import com.cms.IT_DEC.service.IT_Declaration_Info_Service;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Slf4j
@Service
public class IT_Declaration_Info_ServiceImpl implements IT_Declaration_Info_Service {

    @Autowired
    private EmployeeClientService employeeClientService;

    @Autowired
    private IT_Declaration_Info_Repo itDeclarationInfoRepo;

    @Autowired
    private IT_Declaration_InfoMapper itDeclarationInfoMapper;

    private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    // Cache for employee details to avoid repeated API calls
    private final Map<String, EmployeeDTO> employeeCache = new ConcurrentHashMap<>();

    @Override
    @Transactional
    @CacheEvict(value = {"employeeReports", "employeeReportByYear",
            "decInfoByEidAndFinYr", "saveStatusForSec80c",
            "decAmtForSec80c", "saveStatusForSec80d", "decAmtForSec80d"},
            allEntries = true)
    public List<IT_Declaration_InfoDTO> createDeclarationInfo(List<IT_Declaration_InfoCO> itDeclarationInfoCOList) {
        List<IT_Declaration_Info> itDeclarationInfoList = itDeclarationInfoMapper.coListToEntityList(itDeclarationInfoCOList);
        itDeclarationInfoList = itDeclarationInfoRepo.saveAll(itDeclarationInfoList);
        clearReportCache();
        return itDeclarationInfoMapper.entityListToDtoList(itDeclarationInfoList);
    }

    @Override
    @Cacheable(value = "decInfoByEidAndFinYr", key = "#empCode + '_' + #financialYear")
    public List<IT_Declaration_InfoDTO> getDeclarationInfoByEmpIdAndFinancialYear(String empCode, String financialYear) {
        log.debug("Fetching declaration info from DB for emp: {}, year: {}", empCode, financialYear);
        List<IT_Declaration_Info> itDeclarationInfo = itDeclarationInfoRepo.findByEmpCodeAndFinancialYear(empCode, financialYear);
        return itDeclarationInfoMapper.entityListToDtoList(itDeclarationInfo);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"saveStatusForSec80c", "decAmtForSec80c", "employeeReports", "employeeReportByYear"}, allEntries = true)
    public IT_Declaration_InfoDTO setSaveStatusForSection80c(String empCode, String financialYear) {
        Long deductionUnderSection80cId = 3L;
        IT_Declaration_Info itDeclarationInfo = itDeclarationInfoRepo.findByEmpCodeAndFinancialYearAndItDecId(empCode, financialYear, deductionUnderSection80cId);
        if (itDeclarationInfo != null) {
            itDeclarationInfo.setIs_submitted(true);
            itDeclarationInfo = itDeclarationInfoRepo.save(itDeclarationInfo);
        }
        return itDeclarationInfoMapper.entityToDto(itDeclarationInfo);
    }

    @Override
    @Cacheable(value = "saveStatusForSec80c", key = "#empCode + '_' + #financialYear")
    public Boolean getSaveStatusForSection80c(String empCode, String financialYear) {
        Long deductionUnderSection80cId = 3L;
        IT_Declaration_Info declarationInfo = itDeclarationInfoRepo.findByEmpCodeAndFinancialYearAndItDecId(empCode, financialYear, deductionUnderSection80cId);
        if (declarationInfo != null && declarationInfo.getIs_submitted() != null) {
            return declarationInfo.getIs_submitted();
        }
        return false;
    }

    @Override
    @Transactional
    @CacheEvict(value = {"decAmtForSec80c", "employeeReports", "employeeReportByYear"}, allEntries = true)
    public IT_Declaration_InfoDTO setDeclarationAmountForSection80c(String empCode, String financialYear, IT_Declaration_Info itDeclarationInfo) {
        Long deductionUnderSection80cId = 3L;
        IT_Declaration_Info itDeclarationInfoObj = itDeclarationInfoRepo.findByEmpCodeAndFinancialYearAndItDecId(empCode, financialYear, deductionUnderSection80cId);
        if (itDeclarationInfoObj != null) {
            itDeclarationInfoObj.setDeclarationAmount(itDeclarationInfo.getDeclarationAmount());
            itDeclarationInfoObj = itDeclarationInfoRepo.save(itDeclarationInfoObj);
        }
        return itDeclarationInfoMapper.entityToDto(itDeclarationInfoObj);
    }

    @Override
    @Cacheable(value = "decAmtForSec80c", key = "#empCode + '_' + #financialYear")
    public Double getDeclarationAmountForSection80c(String empCode, String financialYear) {
        Long deductionUnderSection80cId = 3L;
        IT_Declaration_Info declarationInfo = itDeclarationInfoRepo.findByEmpCodeAndFinancialYearAndItDecId(empCode, financialYear, deductionUnderSection80cId);
        if (declarationInfo != null && declarationInfo.getDeclarationAmount() != null) {
            return declarationInfo.getDeclarationAmount();
        }
        return 0.0;
    }

    // Section 80d methods
    @Override
    @Transactional
    @CacheEvict(value = {"saveStatusForSec80d", "decAmtForSec80d", "employeeReports", "employeeReportByYear"}, allEntries = true)
    public IT_Declaration_InfoDTO setSaveStatusForSection80d(String empCode, String financialYear) {
        Long deductionUnderSection80dId = 6L;
        IT_Declaration_Info itDeclarationInfo = itDeclarationInfoRepo.findByEmpCodeAndFinancialYearAndItDecId(empCode, financialYear, deductionUnderSection80dId);
        if (itDeclarationInfo != null) {
            itDeclarationInfo.setIs_submitted(true);
            itDeclarationInfo = itDeclarationInfoRepo.save(itDeclarationInfo);
        }
        return itDeclarationInfoMapper.entityToDto(itDeclarationInfo);
    }

    @Override
    @Cacheable(value = "saveStatusForSec80d", key = "#empCode + '_' + #financialYear")
    public Boolean getSaveStatusForSection80d(String empCode, String financialYear) {
        Long deductionUnderSection80dId = 6L;
        IT_Declaration_Info declarationInfo = itDeclarationInfoRepo.findByEmpCodeAndFinancialYearAndItDecId(empCode, financialYear, deductionUnderSection80dId);
        if (declarationInfo != null && declarationInfo.getIs_submitted() != null) {
            return declarationInfo.getIs_submitted();
        }
        return false;
    }

    @Override
    @Transactional
    @CacheEvict(value = {"decAmtForSec80d", "employeeReports", "employeeReportByYear"}, allEntries = true)
    public IT_Declaration_InfoDTO setDeclarationAmountForSection80d(String empCode, String financialYear, IT_Declaration_Info itDeclarationInfo) {
        Long deductionUnderSection80dId = 6L;
        IT_Declaration_Info itDeclarationInfoObj = itDeclarationInfoRepo.findByEmpCodeAndFinancialYearAndItDecId(empCode, financialYear, deductionUnderSection80dId);
        if (itDeclarationInfoObj != null) {
            itDeclarationInfoObj.setDeclarationAmount(itDeclarationInfo.getDeclarationAmount());
            itDeclarationInfoObj = itDeclarationInfoRepo.save(itDeclarationInfoObj);
        }
        return itDeclarationInfoMapper.entityToDto(itDeclarationInfoObj);
    }

    @Override
    @Cacheable(value = "decAmtForSec80d", key = "#empCode + '_' + #financialYear")
    public Double getDeclarationAmountForSection80d(String empCode, String financialYear) {
        Long deductionUnderSection80dId = 6L;
        IT_Declaration_Info declarationInfo = itDeclarationInfoRepo.findByEmpCodeAndFinancialYearAndItDecId(empCode, financialYear, deductionUnderSection80dId);
        if (declarationInfo != null && declarationInfo.getDeclarationAmount() != null) {
            return declarationInfo.getDeclarationAmount();
        }
        return 0.0;
    }

    @Override
    public Page<IT_Declaration_InfoDTO> getAllDeclarationInfo(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<IT_Declaration_Info> entityPage = itDeclarationInfoRepo.findAll(pageable);
        return entityPage.map(itDeclarationInfoMapper::entityToDto);
    }

    @Override
    public List<ITDeclarationReportDTO> getEmployeeReport(String empCode, String financialYear) {
        List<Object[]> rows = itDeclarationInfoRepo.getEmployeeReport(empCode, financialYear);
        List<ITDeclarationReportDTO> reports = new ArrayList<>();

        // Get employee details from API
        EmployeeDTO employee = getEmployeeDetails(empCode);
        String panNumber = getPanNumber(empCode);

        for (Object[] row : rows) {
            ITDeclarationReportDTO dto = new ITDeclarationReportDTO();
            dto.setItDecId(((Number) row[0]).longValue());
            dto.setDeclarationName((String) row[1]);
            dto.setEmpCode((String) row[2]);
            dto.setEmpName(employee != null ? employee.getEmpName() : empCode);
            dto.setPanNumber(panNumber);
            dto.setDeclarationAmount(row[3] != null ? ((Number) row[3]).doubleValue() : 0.0);

            if (row[4] != null) {
                dto.setCreatedDate(((Timestamp) row[4]).toLocalDateTime());
            }

            reports.add(dto);
        }

        return reports;
    }

    @Override
    @Cacheable(value = "employeeReports", key = "#financialYear", unless = "#result == null || #result.isEmpty()")
    public List<EmployeeITReportDTO> getAllEmployeeReports(String financialYear) {
        log.info("Generating employee report for year: {} (CACHE MISS)", financialYear);

        // Get all distinct employee codes from declarations
        List<String> empCodes = itDeclarationInfoRepo.findDistinctEmpCodesByFinancialYear(financialYear);

        if (empCodes.isEmpty()) {
            log.warn("No employees found with declarations for year: {}", financialYear);
            return new ArrayList<>();
        }

        List<EmployeeITReportDTO> reports = new ArrayList<>();

        for (String empCode : empCodes) {
            try {
                // Get employee details from API (with caching)
                EmployeeDTO employee = getEmployeeDetails(empCode);
                String panNumber = getPanNumber(empCode);

                String empName = employee != null ? employee.getEmpName() : empCode;
                String dateOfJoining = employee != null ? employee.getDateOfJoining() : "";
                String address = employee != null ? employee.getAddress() : "";

                // Get declarations for this employee
                List<Object[]> declarationRows = itDeclarationInfoRepo.getEmployeeReport(empCode, financialYear);
                List<ITDeclarationReportDTO> declarations = new ArrayList<>();

                for (Object[] decRow : declarationRows) {
                    ITDeclarationReportDTO dto = new ITDeclarationReportDTO();
                    dto.setItDecId(((Number) decRow[0]).longValue());
                    dto.setDeclarationName((String) decRow[1]);
                    dto.setEmpCode((String) decRow[2]);
                    dto.setEmpName(empName);
                    dto.setPanNumber(panNumber);
                    dto.setDeclarationAmount(decRow[3] != null ? ((Number) decRow[3]).doubleValue() : 0.0);

                    if (decRow[4] != null) {
                        dto.setCreatedDate(((Timestamp) decRow[4]).toLocalDateTime());
                    }

                    declarations.add(dto);
                }

                EmployeeITReportDTO employeeReport = new EmployeeITReportDTO(
                        empCode,
                        empName,
                        dateOfJoining,
                        address,
                        panNumber,
                        null,
                        declarations
                );

                reports.add(employeeReport);

            } catch (Exception e) {
                log.error("Error processing employee: {}", empCode, e);
            }
        }

        log.info("Generated report for {} employees for year: {}", reports.size(), financialYear);
        return reports;
    }

    // Helper method to get employee details with caching
    private EmployeeDTO getEmployeeDetails(String empCode) {
        if (employeeCache.containsKey(empCode)) {
            return employeeCache.get(empCode);
        }

        try {
            EmployeeDTO employee = employeeClientService.getEmployeeById(empCode);
            if (employee != null) {
                employeeCache.put(empCode, employee);
            }
            return employee;
        } catch (Exception e) {
            log.error("Failed to fetch employee details for: {}", empCode, e);
            return null;
        }
    }

    // Helper method to get PAN number
    private String getPanNumber(String empCode) {
        try {
            String panNumber = itDeclarationInfoRepo.findPanNumberByEmpCode(empCode);
            return panNumber != null ? panNumber : "Not Available";
        } catch (Exception e) {
            log.debug("PAN not found for employee: {}", empCode);
            return "Not Available";
        }
    }

    @Override
    public List<String> getDistinctFinancialYears() {
        return itDeclarationInfoRepo.findDistinctFinancialYears();
    }

    @Override
    @CacheEvict(value = {"employeeReports", "employeeReportByYear",
            "decInfoByEidAndFinYr", "saveStatusForSec80c",
            "decAmtForSec80c", "saveStatusForSec80d", "decAmtForSec80d"},
            allEntries = true)
    public void clearReportCache() {
        log.info("Cleared all report caches");
        employeeCache.clear(); // Also clear employee cache
    }

    @Override
    @CacheEvict(value = "employeeReports", key = "#financialYear")
    public void clearReportCacheForYear(String financialYear) {
        log.info("Cleared report cache for year: {}", financialYear);
    }
}