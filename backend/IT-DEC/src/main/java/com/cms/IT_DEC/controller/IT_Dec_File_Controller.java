//package com.cms.IT_DEC.controller;
//
//
//import com.cms.IT_DEC.dto.IT_Proof_InvestmentDTO;
//import com.cms.IT_DEC.model.IT_Dec_File;
//import com.cms.IT_DEC.service.IT_Dec_File_Service;
//import com.cms.IT_DEC.util.ResponseUtil;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.util.List;
//
//@CrossOrigin
//@RestController
//@RequestMapping("/it-declaration-file")
//public class IT_Dec_File_Controller {
//
//    @Autowired
//    private IT_Dec_File_Service itDecFileService;
//
//
//    @PostMapping(value = "/upload/{empId}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE, MediaType.ALL_VALUE})
/// /@PostMapping(value = "/upload/{empId}", consumes = {MediaType.APPLICATION_OCTET_STREAM})
//
//// @PostMapping("/upload/{empId}")
//    public ResponseEntity<?> uploadFile(@RequestPart(name = "files", required = false) List<MultipartFile> files, @PathVariable Long empId,@RequestParam List<Long> itDecId) throws IOException {
//
//        List<IT_Dec_File> itDecFiles = itDecFileService.uploadFile(files,empId,itDecId);
//      if(!itDecFiles.isEmpty()){
//          return ResponseEntity.status(HttpStatus.CREATED).body(itDecFiles);
//      }
//      else {
//          return ResponseEntity.badRequest().build();
//      }
//    }
//
//
//
//    @GetMapping("/getFile/{empId}/{itDecId}/{financialYear}")
//    public ResponseEntity<ResponseUtil<List<IT_Proof_InvestmentDTO>>>getByEmployeeIdAndItDecIdAndFinancialYear(@PathVariable Long empId, @PathVariable Long itDecId , @PathVariable String financialYear){
//        List<IT_Proof_InvestmentDTO> it_dec_fileDTOS=itDecFileService.getByEmployeeIdAndItDecIdAndFinancialYear(empId,itDecId,financialYear);
//        ResponseUtil<List<IT_Proof_InvestmentDTO>> response = ResponseUtil.<List<IT_Proof_InvestmentDTO>>builder()
//                .status(HttpStatus.CREATED.value())
//                .success(true)
//                .message("Declarations files are fetched successfully")
//                .data(it_dec_fileDTOS)
//                .build();
//
//        return ResponseEntity.ok(response);
//    }
//
//}
package com.cms.IT_DEC.controller;


import com.cms.IT_DEC.dto.IT_Dec_FileDTO;
import com.cms.IT_DEC.dto.IT_Proof_InvestmentDTO;
import com.cms.IT_DEC.dto.it_dec_dto.DownloadFileReqDto;
import com.cms.IT_DEC.model.IT_Dec_File;
import com.cms.IT_DEC.service.IT_Dec_File_Service;
import com.cms.IT_DEC.util.ResponseUtil;
import com.cms.cdl.common_dtos.AES_enc_decy.SimpleEncryptorDecryptor;
import com.cms.cdl.common_dtos.beans.file_bean.FileAndContentTypeBean;
import com.cms.cdl.common_dtos.util.dms.DocumentOperations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/it-declaration-file")
public class IT_Dec_File_Controller {

    @Autowired
    private IT_Dec_File_Service itDecFileService;

    @Autowired
    private DocumentOperations documentOperations;

    @Autowired
    SimpleEncryptorDecryptor simpleEncryptorDecryptor;


    @PostMapping(value = "/upload/{empCode}/{submitFinancialYear}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadFile(@RequestPart(name = "files", required = false) List<MultipartFile> files, @PathVariable String empCode, @PathVariable String submitFinancialYear, @RequestParam List<Long> itDecId) throws IOException {
        String decEmpCode = simpleEncryptorDecryptor.simpleDecrypt(empCode);
        List<IT_Dec_File> itDecFiles = itDecFileService.uploadFile(files, decEmpCode, submitFinancialYear, itDecId);
        if (!itDecFiles.isEmpty()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(itDecFiles);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }


    @GetMapping("/getAllFile/{empCode}/{financialYear}")
    public ResponseEntity<ResponseUtil<List<IT_Proof_InvestmentDTO>>> getByEmployeeIdAndFinancialYear(@PathVariable String empCode, @PathVariable String financialYear) {
        String decEmpCode = simpleEncryptorDecryptor.simpleDecrypt(empCode);
        List<IT_Proof_InvestmentDTO> it_dec_fileDTOS = itDecFileService.getByEmployeeIdAndFinancialYear(decEmpCode, financialYear);
        ResponseUtil<List<IT_Proof_InvestmentDTO>> response = ResponseUtil.<List<IT_Proof_InvestmentDTO>>builder()
                .status(HttpStatus.CREATED.value())
                .success(true)
                .message("Declarations files are fetched successfully")
                .data(it_dec_fileDTOS)
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/getFile/{empCode}/{itDecId}/{financialYear}")
    public ResponseEntity<ResponseUtil<List<IT_Proof_InvestmentDTO>>> getByEmployeeIdAndItDecIdAndFinancialYear(@PathVariable String empCode, @PathVariable Long itDecId, @PathVariable String financialYear) {
        String decEmpCode = simpleEncryptorDecryptor.simpleDecrypt(empCode);
        List<IT_Proof_InvestmentDTO> it_dec_fileDTOS = itDecFileService.getByEmployeeIdAndItDecIdAndFinancialYear(decEmpCode, itDecId, financialYear);
        ResponseUtil<List<IT_Proof_InvestmentDTO>> response = ResponseUtil.<List<IT_Proof_InvestmentDTO>>builder()
                .status(HttpStatus.CREATED.value())
                .success(true)
                .message("Declarations files are fetched successfully")
                .data(it_dec_fileDTOS)
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/download")
    public ResponseEntity<?> downloadDocument(@RequestBody DownloadFileReqDto downloadFileReqDto) {
        try {
            return itDecFileService.downloadDocument(downloadFileReqDto.getEncDocId());
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/files/{empCode}/{financialYear}/{itDecId}")
    public ResponseEntity<ResponseUtil<List<IT_Dec_FileDTO>>> getFilesBySection(
            @PathVariable String empCode,
            @PathVariable String financialYear,
            @PathVariable Long itDecId) {
        String decEmpCode = simpleEncryptorDecryptor.simpleDecrypt(empCode);

        try {
            List<IT_Dec_FileDTO> files = itDecFileService.getFilesByEmployeeCodeAndItDecIdAndFinancialYear(decEmpCode, itDecId, financialYear);

            ResponseUtil<List<IT_Dec_FileDTO>> response = ResponseUtil.<List<IT_Dec_FileDTO>>builder()
                    .status(HttpStatus.OK.value())
                    .success(true)
                    .message("Files fetched successfully")
                    .data(files)
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ResponseUtil<List<IT_Dec_FileDTO>> response = ResponseUtil.<List<IT_Dec_FileDTO>>builder()
                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .success(false)
                    .message("Error fetching files: " + e.getMessage())
                    .data(null)
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/count/{empCode}/{financialYear}/{itDecId}")
    public ResponseEntity<ResponseUtil<Integer>> getFileCount(
            @PathVariable String empCode,
            @PathVariable String financialYear,
            @PathVariable Long itDecId) {
        String decEmpCode = simpleEncryptorDecryptor.simpleDecrypt(empCode);
        try {
            int count = itDecFileService.getFileCountByEmployeeCodeAndItDecIdAndFinancialYear(decEmpCode, itDecId, financialYear);

            ResponseUtil<Integer> response = ResponseUtil.<Integer>builder()
                    .status(HttpStatus.OK.value())
                    .success(true)
                    .message("File count fetched successfully")
                    .data(count)
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ResponseUtil<Integer> response = ResponseUtil.<Integer>builder()
                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .success(false)
                    .message("Error fetching file count: " + e.getMessage())
                    .data(0)
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteFile(@PathVariable Long id) {
        String decId = simpleEncryptorDecryptor.simpleDecrypt(String.valueOf(id));
        itDecFileService.deleteByDocId(Long.valueOf(decId));
        return ResponseEntity.ok("File deleted successfully");
    }

    @GetMapping("/doc-details/{docId}")
    public ResponseEntity<?> getDocumentDetails(@PathVariable Long docId) {
        String documentId = simpleEncryptorDecryptor.simpleEncrypt(docId.toString());
        FileAndContentTypeBean documentDetails = documentOperations.fetchDocument(documentId);
        return ResponseEntity.ok(documentDetails);
    }
}
