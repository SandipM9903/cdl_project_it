package com.cms.IT_DEC.service.impl;

import com.cms.IT_DEC.dto.IT_Dec_FileDTO;
import com.cms.IT_DEC.dto.IT_Proof_InvestmentDTO;
import com.cms.IT_DEC.mapper.IT_Dec_FileMapper;
import com.cms.IT_DEC.mapper.IT_Proof_InvestmentMapper;
import com.cms.IT_DEC.model.IT_Dec_File;
import com.cms.IT_DEC.model.IT_Proof_Investment;
import com.cms.IT_DEC.repository.IT_Dec_File_Repo;
import com.cms.IT_DEC.repository.IT_Proof_Investment_Repo;
import com.cms.IT_DEC.service.IT_Dec_File_Service;

import com.cms.cdl.common_dtos.AES_enc_decy.SimpleEncryptorDecryptor;

import com.cms.cdl.common_dtos.beans.file_bean.FileAndContentTypeBean;
import com.cms.cdl.common_dtos.dto.document_dto.DocumentDTO;
import com.cms.cdl.common_dtos.util.dms.DocumentOperations;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;


@Service
public class IT_Dec_File_ServiceImpl implements IT_Dec_File_Service {
    @Autowired
    private IT_Dec_File_Repo itDecFileRepo;
    @Autowired
    DocumentOperations documentOperations;
    @Autowired
    SimpleEncryptorDecryptor simpleEncryptorDecryptor;

    @Override
    public List<IT_Dec_File> uploadFile(List<MultipartFile> files, String employeeCode,String submitFinancialYear, List<Long> itDecId) throws IOException {
        if(files!=null){
            return handleDocumentUpload(employeeCode, submitFinancialYear,files, itDecId);
        }
        return null;
    }

    @Override
    public List<IT_Proof_InvestmentDTO> getByEmployeeIdAndFinancialYear(String employeeCode, String financialYear) {
        List<IT_Dec_File> itDecFileList = itDecFileRepo.findByEmployeeCodeAndFinancialYear(employeeCode, financialYear);

        Map<Long, String> fileDataMap = itDecFileList.stream()
                .collect(Collectors.groupingBy(
                        IT_Dec_File::getItDecId,
                        Collectors.mapping(file -> String.valueOf(file.getItDecDocId()), Collectors.joining(","))
                ));


        List<IT_Proof_Investment> result = new ArrayList<>();

        List<IT_Proof_Investment> itProofInvestmentList = itProofInvestmentRepo.findByEmpCodeAndFinancialYear(employeeCode, financialYear);

        for (IT_Proof_Investment investment:itProofInvestmentList) {

            IT_Proof_Investment itProofInvestment = itProofInvestmentRepo
                    .findByEmpCodeAndFinancialYearAndItDecId(employeeCode, financialYear, investment.getItDecId());

            if (itProofInvestment != null) {
                itProofInvestment.setFileEntryId(fileDataMap.getOrDefault(itProofInvestment.getItDecId(), null)); // Setting the comma-separated docIds
                result.add(itProofInvestment);
            }
        }

        return itProofInvestmentMapper.entityListToDtoList(result);
    }



    public List<IT_Dec_File> handleDocumentUpload(String empCode, String submitFinancialYear,
                                                  List<MultipartFile> files, List<Long> itDecId) throws IOException {
        List<IT_Dec_File> uploadedFiles = new ArrayList<>();

        // ✅ Validate input
        if (files == null || files.isEmpty()) {
            throw new IllegalArgumentException("No files provided for upload.");
        }
        if (itDecId == null || itDecId.isEmpty()) {
            throw new IllegalArgumentException("No IT Declaration IDs provided.");
        }

        // ✅ Prepare DocumentDTO for upload
        DocumentDTO documentData = new DocumentDTO();
        documentData.setEmpCode(empCode);

        // ✅ Upload documents to DMS
        List<DocumentDTO> docDTOList = documentOperations.uploadMultipleDocuments(documentData, files);
        System.out.println("itDecId size: " + itDecId.size() + " | docDTOList size: " + docDTOList.size());

        if (docDTOList != null && !docDTOList.isEmpty()) {
            Long itDecIdToUse = itDecId.get(0); // ✅ Use first IT Declaration ID (or apply your own logic)

            for (int i = 0; i < docDTOList.size(); i++) {
                DocumentDTO documentDTO = docDTOList.get(i);
                MultipartFile currentFile = files.get(i); // ✅ Get the corresponding uploaded file

                IT_Dec_File itDeclarationFile = new IT_Dec_File();
                itDeclarationFile.setEmployeeCode(empCode);
                itDeclarationFile.setItDecDocId(documentDTO.getDocId());
                itDeclarationFile.setItDecId(itDecIdToUse); // ✅ Link all files to the same IT Declaration ID
                itDeclarationFile.setFinancialYear(submitFinancialYear);

                // ✅ Set fileName (from MultipartFile original name)
                itDeclarationFile.setDocCaption(currentFile.getOriginalFilename());

                IT_Dec_File savedFile = itDecFileRepo.save(itDeclarationFile);
                uploadedFiles.add(savedFile);
            }
        }

        return uploadedFiles;
    }

    @Autowired
    private IT_Dec_FileMapper itDecFileMapper;


    @Autowired
    private IT_Proof_Investment_Repo itProofInvestmentRepo;

    @Autowired
    private IT_Proof_InvestmentMapper itProofInvestmentMapper;

    @Override
    @Transactional
    public List<IT_Proof_InvestmentDTO> getByEmployeeIdAndItDecIdAndFinancialYear(String employeeId, Long itDecId, String financialYear) {
        // Fetching data in one call to avoid redundancy
        List<IT_Dec_File> itDecFileList = itDecFileRepo.findByEmployeeCodeAndItDecIdAndFinancialYear(employeeId, itDecId, financialYear);
        System.out.println(itDecFileList+"itDecFileList666");

        // Extracting IT Document IDs from the fetched list
        List<Long> itDecDocIdList = itDecFileList.stream()
                .map(IT_Dec_File::getItDecDocId)
                .toList();

        System.out.println(itDecDocIdList+"itDecDocIdList7778");

        // Fetching related investment proofs
//        List<IT_Proof_Investment> itProofInvestmentList = itProofInvestmentRepo.findByEmpIdAndFinancialYearAndItDecId(employeeId, financialYear, itDecId);

        List<IT_Proof_Investment> itProofInvestmentList = itProofInvestmentRepo.findByEmpCodeAndFinancialYear(employeeId, financialYear);

        System.out.println(itProofInvestmentList+"itProofInvestmentList222");

        // Index-wise mapping of fileEntryId
        for (int i = 0; i < itProofInvestmentList.size(); i++) {
            IT_Proof_Investment investment = itProofInvestmentList.get(i);
//            System.out.println();
            System.out.println(investment+"investment111");

            // Ensure the index is within bounds
            if (i < itDecDocIdList.size()) {
                investment.setFileEntryId(String.valueOf(itDecDocIdList.get(i)));
            } else {
                // Handle cases where there are more investments than documents
                investment.setFileEntryId(null); // Or some default value
            }
        }

        System.out.println(itProofInvestmentList+"itProofInvestmentList 777");

        // Mapping entity list to DTO list
//        return itDecFileMapper.entityListToDtoList(itDecFileList);

        return itProofInvestmentMapper.entityListToDtoList(itProofInvestmentList);
    }


//    @Override
//    public List<IT_Dec_File> uploadFile(List<MultipartFile> files, Long employeeId,List<Long> itDecId) throws IOException {
//        List<IT_Dec_File> uploadedFiles = new ArrayList<>();
//
//        for (MultipartFile file : files) {
//            String fileName = file.getOriginalFilename();
//            Path filePath = Path.of(uploadDir, fileName);
//            Files.createDirectories(filePath.getParent());
//            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
//
//            // Set file name and employeeId
//            IT_Dec_File itDeclarationFile = new IT_Dec_File();
//            itDeclarationFile.setName(fileName);
//            itDeclarationFile.setEmployeeId(employeeId); // Set employeeId
//            itDeclarationFile.setItDecId(itDecId);
//            uploadedFiles.add(itDeclarationFile);
//        }
//
//        List<IT_Dec_File> itDeclarationFileList = itDecFileRepo.saveAll(uploadedFiles);
//        return itDeclarationFileList;
//    }

    @Override
    public ResponseEntity<?> downloadDocument(String encDocId) {
        String docId = simpleEncryptorDecryptor.simpleDecrypt(encDocId);
        FileAndContentTypeBean fileData = documentOperations.fetchDocument(docId);

        if (fileData == null || fileData.getFile() == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=document_" )
                .contentType(MediaType.parseMediaType(fileData.getContentType()))
                .body(fileData.getFile());
    }

    @Override
    public List<IT_Dec_FileDTO> getFilesByEmployeeCodeAndItDecIdAndFinancialYear(String empCode, Long itDecId, String financialYear) {
        List<IT_Dec_File> files = itDecFileRepo.findByEmployeeCodeAndItDecIdAndFinancialYear(empCode, itDecId, financialYear);

        List<IT_Dec_FileDTO> fileDTOs = new ArrayList<>();
        for (IT_Dec_File file : files) {
            IT_Dec_FileDTO dto = new IT_Dec_FileDTO();
            org.springframework.beans.BeanUtils.copyProperties(file, dto); // ✅ This copies docCaption too
            fileDTOs.add(dto);
        }
        return fileDTOs;
    }

    @Override
    public int getFileCountByEmployeeCodeAndItDecIdAndFinancialYear(String empCode, Long itDecId, String financialYear) {
        return itDecFileRepo.countByEmployeeCodeAndItDecIdAndFinancialYear(empCode, itDecId, financialYear);
    }

    @Override
    public void deleteByDocId(Long docId) {
        IT_Dec_File file = itDecFileRepo.findByItDecDocId(docId)
                .orElseThrow(() -> new RuntimeException("File not found"));
        itDecFileRepo.delete(file);
    }


}