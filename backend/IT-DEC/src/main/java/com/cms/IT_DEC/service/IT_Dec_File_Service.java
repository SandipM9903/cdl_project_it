//package com.cms.IT_DEC.service;
//
//import com.cms.IT_DEC.dto.IT_Proof_InvestmentDTO;
//import com.cms.IT_DEC.model.IT_Dec_File;
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.util.List;
//
//@Service
//public interface IT_Dec_File_Service {
//
//    List<IT_Dec_File> uploadFile(List<MultipartFile> files, Long employeeId,List<Long> itDecId) throws IOException;
//
//    List<IT_Proof_InvestmentDTO> getByEmployeeIdAndItDecIdAndFinancialYear(Long employeeId, Long itDecId, String financialYear);
//
//
//}


package com.cms.IT_DEC.service;

import com.cms.IT_DEC.dto.IT_Dec_FileDTO;
import com.cms.IT_DEC.dto.IT_Proof_InvestmentDTO;
import com.cms.IT_DEC.model.IT_Dec_File;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public interface IT_Dec_File_Service {

    List<IT_Dec_File> uploadFile(List<MultipartFile> files, String employeeCode, String submitFinancialYear,List<Long> itDecId) throws IOException;

    List<IT_Proof_InvestmentDTO> getByEmployeeIdAndFinancialYear(String employeeCode, String financialYear);
    List<IT_Proof_InvestmentDTO> getByEmployeeIdAndItDecIdAndFinancialYear(String employeeCode, Long itDecId, String financialYear);
    ResponseEntity<?> downloadDocument(String encDocId);
//    List<IT_Dec_FileDTO> getByEmployeeIdAndItDecIdAndFinancialYear(Long employeeId, Long itDecId, String financialYear);

    List<IT_Dec_FileDTO> getFilesByEmployeeCodeAndItDecIdAndFinancialYear(String empCode, Long itDecId, String financialYear);
    int getFileCountByEmployeeCodeAndItDecIdAndFinancialYear(String empCode, Long itDecId, String financialYear);
    public void deleteByDocId(Long docId);
}
