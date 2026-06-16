package com.cms.IT_DEC.controller;


import com.cms.IT_DEC.co_pkg.IT_Proof_InvestmentCO;
import com.cms.IT_DEC.dto.IT_Proof_InvestmentDTO;
import com.cms.IT_DEC.model.IT_Proof_Investment;
import com.cms.IT_DEC.repository.IT_Proof_Investment_Repo;
import com.cms.IT_DEC.service.IT_Proof_Investment_Service;
import com.cms.IT_DEC.util.ResponseUtil;
import com.cms.cdl.common_dtos.AES_enc_decy.SimpleEncryptorDecryptor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@CrossOrigin
@RequestMapping("/proof-of-investment")
@Slf4j
public class IT_Proof_Investment_Controller {

    @Autowired
    private IT_Proof_Investment_Service itProofInvestmentService;

    @Autowired
    private IT_Proof_Investment_Repo itProofInvestmentRepo;

    @Autowired
    SimpleEncryptorDecryptor simpleEncryptorDecryptor;

    @PostMapping("/add")
    public ResponseEntity<?> createProofOfInvestment(@RequestBody List<IT_Proof_InvestmentCO> itProofInvestmentCOList) {
        List<IT_Proof_InvestmentDTO> itProofInvestmentDTOList = itProofInvestmentService.createProofOfInvestment(itProofInvestmentCOList);
        ResponseUtil<List<IT_Proof_InvestmentDTO>> response = ResponseUtil.<List<IT_Proof_InvestmentDTO>>builder()
                .status(HttpStatus.CREATED.value())
                .success(true)
                .message("All Proof-of-investment created successfully")
                .data(itProofInvestmentDTOList)
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/set-status-proof/{empCode}/{financialYear}/{state}")
    public ResponseEntity<?> setStatusForProofOfInvestment(@PathVariable String empCode, @PathVariable String financialYear, @PathVariable Boolean state) {
        String decEmpCode = simpleEncryptorDecryptor.simpleDecrypt(empCode);
        IT_Proof_InvestmentDTO itProofInvestmentDTO = itProofInvestmentService.setStatusForProofOfInvestment(decEmpCode, financialYear, state);
        ResponseUtil<IT_Proof_InvestmentDTO> response = ResponseUtil.<IT_Proof_InvestmentDTO>builder()
                .status(HttpStatus.CREATED.value())
                .success(true)
                .message("proof save info saved successfully")
                .data(itProofInvestmentDTO)
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/get-status-proof/{empCode}/{financialYear}")
    public ResponseEntity<?> getStatusForProofOfInvestment(@PathVariable String empCode, @PathVariable String financialYear) {
        String decEmpCode = simpleEncryptorDecryptor.simpleDecrypt(empCode);
        Boolean result = itProofInvestmentService.getStatusForProofOfInvestment(decEmpCode, financialYear);
        ResponseUtil<Boolean> response = ResponseUtil.<Boolean>builder()
                .status(HttpStatus.CREATED.value())
                .success(true)
                .message("proof save info fetched successfully")
                .data(result)
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/set-submit-status-proof/{empCode}/{financialYear}/{state}")
    public ResponseEntity<?> setStatusForSubmitProofOfInvestment(@PathVariable String empCode, @PathVariable String financialYear, @PathVariable Boolean state) {
        String decEmpCode = simpleEncryptorDecryptor.simpleDecrypt(empCode);
        IT_Proof_InvestmentDTO itProofInvestmentDTO = itProofInvestmentService.setStatusForSubmitProofOfInvestment(decEmpCode, financialYear, state);
        ResponseUtil<IT_Proof_InvestmentDTO> response = ResponseUtil.<IT_Proof_InvestmentDTO>builder()
                .status(HttpStatus.CREATED.value())
                .success(true)
                .message("proof submit info saved successfully")
                .data(itProofInvestmentDTO)
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/get-submit-status-proof/{empCode}/{financialYear}")
    public ResponseEntity<?> getStatusForSubmitProofOfInvestment(@PathVariable String empCode, @PathVariable String financialYear) {
        String decEmpCode = simpleEncryptorDecryptor.simpleDecrypt(empCode);
        Boolean result = itProofInvestmentService.getStatusForSubmitProofOfInvestment(decEmpCode, financialYear);
        ResponseUtil<Boolean> response = ResponseUtil.<Boolean>builder()
                .status(HttpStatus.CREATED.value())
                .success(true)
                .message("proof submit info fetched successfully")
                .data(result)
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/get-all-proof/{empCode}/{financialYear}")
    public ResponseEntity<?> getAllProofOfInvestmentByEmpIdAndFinancialYear(@PathVariable String empCode, @PathVariable String financialYear) {
        String decEmpCode = simpleEncryptorDecryptor.simpleDecrypt(empCode);
        List<IT_Proof_InvestmentDTO> itProofInvestmentDTOList = itProofInvestmentService.getAllProofOfInvestmentByEmpIdAndFinancialYear(decEmpCode, financialYear);
        ResponseUtil<List<IT_Proof_InvestmentDTO>> response = ResponseUtil.<List<IT_Proof_InvestmentDTO>>builder()
                .status(HttpStatus.CREATED.value())
                .success(true)
                .message("All Proof-of-investment fetched successfully")
                .data(itProofInvestmentDTOList)
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{documentProfId}/comment")
    public ResponseEntity<IT_Proof_Investment> addComment(
            @PathVariable String documentProfId,
            @RequestBody Map<String, String> body) {

        String decDocumentProfId =
                simpleEncryptorDecryptor.simpleDecrypt(documentProfId);

        String comment = body.get("comment");

        return itProofInvestmentRepo
                .findById(Long.valueOf(decDocumentProfId))
                .map(proof -> {
                    proof.setComments(comment);
                    itProofInvestmentRepo.save(proof);
                    return ResponseEntity.ok(proof);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/update-bulk")
    public ResponseEntity<List<IT_Proof_InvestmentDTO>> updateBulkProofOfInvestment(@RequestBody List<IT_Proof_InvestmentCO> updatedList) {
        List<IT_Proof_InvestmentDTO> updatedRecords = itProofInvestmentService.updateBulkProofOfInvestment(updatedList);
        return ResponseEntity.ok(updatedRecords);
    }
}


