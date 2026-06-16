package com.cms.IT_DEC.service;

import com.cms.IT_DEC.co_pkg.IT_Proof_InvestmentCO;
import com.cms.IT_DEC.dto.IT_Proof_InvestmentDTO;
import com.cms.IT_DEC.model.IT_Proof_Investment;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public interface IT_Proof_Investment_Service {

   // IT_Proof_Investment_Service createProofOfInvestment
   List<IT_Proof_InvestmentDTO>createProofOfInvestment(List<IT_Proof_InvestmentCO> itProofInvestmentCOList);

   // set status for save for proof of investment
   IT_Proof_InvestmentDTO setStatusForProofOfInvestment(String empCode,String financialYear,Boolean state);

   // get status for proof of investment
   Boolean getStatusForProofOfInvestment(String empCode,String financialYear);

   // set status for submit for proof of investment
   IT_Proof_InvestmentDTO setStatusForSubmitProofOfInvestment(String empCode,String financialYear,Boolean state);

   // get status for submit proof of investment
   Boolean getStatusForSubmitProofOfInvestment(String empCode,String financialYear);

   // get all list of proof of investment by empId and financial year
   List<IT_Proof_InvestmentDTO> getAllProofOfInvestmentByEmpIdAndFinancialYear(String empCode, String financialYear);

   public IT_Proof_Investment addComment(Long documentProofId, String comment);

   List<IT_Proof_InvestmentDTO> updateBulkProofOfInvestment(List<IT_Proof_InvestmentCO> updatedList);

}
