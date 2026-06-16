package com.cms.IT_DEC.controller;

import com.cms.IT_DEC.co_pkg.IT_Declaration_InfoCO;
import com.cms.IT_DEC.dto.IT_Declaration_InfoDTO;
import com.cms.IT_DEC.dto.report.EmployeeITReportDTO;
import com.cms.IT_DEC.dto.report.ITDeclarationReportDTO;
import com.cms.IT_DEC.model.IT_Declaration_Info;
import com.cms.IT_DEC.service.IT_Declaration_Info_Service;
import com.cms.IT_DEC.util.ResponseUtil;
import com.cms.cdl.common_dtos.AES_enc_decy.SimpleEncryptorDecryptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/it-declaration-info")
public class IT_Declaration_Info_Controller {

    @Autowired
    private IT_Declaration_Info_Service itDeclarationInfoService;

    @Autowired
    SimpleEncryptorDecryptor simpleEncryptorDecryptor;

    @PostMapping("/add")
    public ResponseEntity<ResponseUtil<List<IT_Declaration_InfoDTO>>> createDeclarationInfo(@Validated @RequestBody List<IT_Declaration_InfoCO> itDeclarationInfoCOList) {
        itDeclarationInfoCOList.forEach(co -> co.setIs_submitted(true));
        List<IT_Declaration_InfoDTO> itDeclarationInfoDTOList = itDeclarationInfoService.createDeclarationInfo(itDeclarationInfoCOList);
        ResponseUtil<List<IT_Declaration_InfoDTO>> response = ResponseUtil.<List<IT_Declaration_InfoDTO>>builder()
                .status(HttpStatus.CREATED.value())
                .success(true)
                .message("Declarations created successfully")
                .data(itDeclarationInfoDTOList)
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/get/{empCode}/{financialYear}")
    public ResponseEntity<ResponseUtil<List<IT_Declaration_InfoDTO>>> getDeclarationInfoByEmpIdAndFinancialYear(@PathVariable String empCode, @PathVariable String financialYear) {
        String decEmpCode = simpleEncryptorDecryptor.simpleDecrypt(empCode);
        List<IT_Declaration_InfoDTO> itDeclarationInfoDTOList = itDeclarationInfoService.getDeclarationInfoByEmpIdAndFinancialYear(decEmpCode, financialYear);
        ResponseUtil<List<IT_Declaration_InfoDTO>> response = ResponseUtil.<List<IT_Declaration_InfoDTO>>builder()
                .status(HttpStatus.CREATED.value())
                .success(true)
                .message("Declarations fetched successfully")
                .data(itDeclarationInfoDTOList)
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/save-status/{empCode}/{financialYear}")
    public ResponseEntity<ResponseUtil<IT_Declaration_InfoDTO>> setSaveStatusForSection80c(@PathVariable String empCode, @PathVariable String financialYear) {
        String decEmpCode = simpleEncryptorDecryptor.simpleDecrypt(empCode);
        IT_Declaration_InfoDTO itDeclarationInfoDTO = itDeclarationInfoService.setSaveStatusForSection80c(decEmpCode, financialYear);
        ResponseUtil<IT_Declaration_InfoDTO> response = ResponseUtil.<IT_Declaration_InfoDTO>builder()
                .status(HttpStatus.CREATED.value())
                .success(true)
                .message("Declaration status saved successfully")
                .data(itDeclarationInfoDTO)
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/get-save-status/{empCode}/{financialYear}")
    public ResponseEntity<ResponseUtil<Boolean>> getSaveStatusForSection80c(@PathVariable String empCode, @PathVariable String financialYear) {
        String decEmpCode = simpleEncryptorDecryptor.simpleDecrypt(empCode);
        Boolean result = itDeclarationInfoService.getSaveStatusForSection80c(decEmpCode, financialYear);
        ResponseUtil<Boolean> response = ResponseUtil.<Boolean>builder()
                .status(HttpStatus.CREATED.value())
                .success(true)
                .message("Declaration save status fetched successfully")
                .data(result)
                .build();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/total-amount-80c/{empCode}/{financialYear}")
    public ResponseEntity<?> setDeclarationAmountForSection80c(@PathVariable String empCode, @PathVariable String financialYear, @RequestBody IT_Declaration_Info itDeclarationInfo) {
        String decEmpCode = simpleEncryptorDecryptor.simpleDecrypt(empCode);
        IT_Declaration_InfoDTO itDeclarationInfoDTO = itDeclarationInfoService.setDeclarationAmountForSection80c(decEmpCode, financialYear, itDeclarationInfo);
        ResponseUtil<IT_Declaration_InfoDTO> response = ResponseUtil.<IT_Declaration_InfoDTO>builder()
                .status(HttpStatus.CREATED.value())
                .success(true)
                .message("total amount for section 80c saved successfully")
                .data(itDeclarationInfoDTO)
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/get-total-amount-80c/{empCode}/{financialYear}")
    public ResponseEntity<ResponseUtil<Double>> getDeclarationAmountForSection80c(@PathVariable String empCode, @PathVariable String financialYear) {
        String decEmpCode = simpleEncryptorDecryptor.simpleDecrypt(empCode);
        Double result = itDeclarationInfoService.getDeclarationAmountForSection80c(decEmpCode, financialYear);
        ResponseUtil<Double> response = ResponseUtil.<Double>builder()
                .status(HttpStatus.CREATED.value())
                .success(true)
                .message("total amount for section 80c fetched successfully")
                .data(result)
                .build();
        return ResponseEntity.ok(response);
    }

    // ================ section 80d

    @PostMapping("/save-status-80d/{empCode}/{financialYear}")
    public ResponseEntity<?> setSaveStatusForSection80d(@PathVariable String empCode, @PathVariable String financialYear) {
        String decEmpCode = simpleEncryptorDecryptor.simpleDecrypt(empCode);
        IT_Declaration_InfoDTO itDeclarationInfoDTO = itDeclarationInfoService.setSaveStatusForSection80d(decEmpCode, financialYear);
        ResponseUtil<IT_Declaration_InfoDTO> response = ResponseUtil.<IT_Declaration_InfoDTO>builder()
                .status(HttpStatus.CREATED.value())
                .success(true)
                .message("Declaration status saved successfully")
                .data(itDeclarationInfoDTO)
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/get-save-status-80d/{empCode}/{financialYear}")
    public ResponseEntity<?> getSaveStatusForSection80d(@PathVariable String empCode, @PathVariable String financialYear) {
        String decEmpCode = simpleEncryptorDecryptor.simpleDecrypt(empCode);
        Boolean result = itDeclarationInfoService.getSaveStatusForSection80d(decEmpCode, financialYear);
        ResponseUtil<Boolean> response = ResponseUtil.<Boolean>builder()
                .status(HttpStatus.CREATED.value())
                .success(true)
                .message("Declaration save status fetched successfully")
                .data(result)
                .build();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/total-amount-80d/{empCode}/{financialYear}")
    public ResponseEntity<ResponseUtil<IT_Declaration_InfoDTO>> setDeclarationAmountForSection80d(@PathVariable String empCode, @PathVariable String financialYear, @RequestBody IT_Declaration_Info itDeclarationInfo) {
        String decEmpCode = simpleEncryptorDecryptor.simpleDecrypt(empCode);
        IT_Declaration_InfoDTO itDeclarationInfoDTO = itDeclarationInfoService.setDeclarationAmountForSection80d(decEmpCode, financialYear, itDeclarationInfo);
        ResponseUtil<IT_Declaration_InfoDTO> response = ResponseUtil.<IT_Declaration_InfoDTO>builder()
                .status(HttpStatus.CREATED.value())
                .success(true)
                .message("total amount for section 80d saved successfully")
                .data(itDeclarationInfoDTO)
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/get-total-amount-80d/{empCode}/{financialYear}")
    public ResponseEntity<?> getDeclarationAmountForSection80d(@PathVariable String empCode, @PathVariable String financialYear) {
        String decEmpCode = simpleEncryptorDecryptor.simpleDecrypt(empCode);
        Double result = itDeclarationInfoService.getDeclarationAmountForSection80d(decEmpCode, financialYear);
        ResponseUtil<Double> response = ResponseUtil.<Double>builder()
                .status(HttpStatus.CREATED.value())
                .success(true)
                .message("total amount for section 80d fetched successfully")
                .data(result)
                .build();
        return ResponseEntity.ok(response);
    }

    //For Report

    @GetMapping("/get-all")
    public ResponseEntity<ResponseUtil<Page<IT_Declaration_InfoDTO>>> getAllDeclarationInfo(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {

        Page<IT_Declaration_InfoDTO> result = itDeclarationInfoService.getAllDeclarationInfo(page, size);

        ResponseUtil<Page<IT_Declaration_InfoDTO>> response = ResponseUtil.<Page<IT_Declaration_InfoDTO>>builder()
                .status(HttpStatus.OK.value())
                .success(true)
                .message("Declarations fetched successfully")
                .data(result)
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/report/{empCode}/{financialYear}")
    public ResponseEntity<ResponseUtil<List<ITDeclarationReportDTO>>> getEmployeeReport(
            @PathVariable String empCode,
            @PathVariable String financialYear) {

        String decEmpCode = empCode;
        List<ITDeclarationReportDTO> report = itDeclarationInfoService.getEmployeeReport(decEmpCode, financialYear);

        ResponseUtil<List<ITDeclarationReportDTO>> response = ResponseUtil.<List<ITDeclarationReportDTO>>builder()
                .status(HttpStatus.OK.value())
                .success(true)
                .message("Report fetched successfully")
                .data(report)
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/report/all/{financialYear}")
    public ResponseEntity<ResponseUtil<List<EmployeeITReportDTO>>> getAllEmployeeReport(
            @PathVariable String financialYear) {

        List<EmployeeITReportDTO> report = itDeclarationInfoService.getAllEmployeeReports(financialYear);

        if (report.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }

        ResponseUtil<List<EmployeeITReportDTO>> response = ResponseUtil.<List<EmployeeITReportDTO>>builder()
                .status(HttpStatus.OK.value())
                .success(true)
                .message("IT declaration reports fetched for year: " + financialYear)
                .data(report)
                .build();

        return ResponseEntity.ok(response);
    }

    // NEW: Get distinct financial years
    @GetMapping("/financial-years")
    public ResponseEntity<ResponseUtil<List<String>>> getDistinctFinancialYears() {
        List<String> years = itDeclarationInfoService.getDistinctFinancialYears();
        ResponseUtil<List<String>> response = ResponseUtil.<List<String>>builder()
                .status(HttpStatus.OK.value())
                .success(true)
                .message("Financial years fetched successfully")
                .data(years)
                .build();
        return ResponseEntity.ok(response);
    }
}