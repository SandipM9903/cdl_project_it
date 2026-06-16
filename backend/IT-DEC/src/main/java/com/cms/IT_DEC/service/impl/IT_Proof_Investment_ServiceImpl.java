package com.cms.IT_DEC.service.impl;

import com.cms.IT_DEC.co_pkg.IT_Proof_InvestmentCO;
import com.cms.IT_DEC.dto.IT_Proof_InvestmentDTO;
import com.cms.IT_DEC.mapper.IT_Proof_InvestmentMapper;
import com.cms.IT_DEC.model.IT_FileEntry_Mapping;
import com.cms.IT_DEC.model.IT_Proof_Investment;
import com.cms.IT_DEC.repository.IT_FileEntry_Mapping_Repo;
import com.cms.IT_DEC.repository.IT_Proof_Investment_Repo;
import com.cms.IT_DEC.service.IT_Proof_Investment_Service;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class IT_Proof_Investment_ServiceImpl implements IT_Proof_Investment_Service {

    @Autowired
    private IT_Proof_Investment_Repo itProofInvestmentRepo;

    @Autowired
    private IT_Proof_InvestmentMapper itProofInvestmentMapper;

    @Override
    public List<IT_Proof_InvestmentDTO> createProofOfInvestment(List<IT_Proof_InvestmentCO> itProofInvestmentCOList) {
        List<IT_Proof_Investment> itProofInvestmentList= itProofInvestmentMapper.coListToEntityList(itProofInvestmentCOList);
        itProofInvestmentList=itProofInvestmentRepo.saveAll(itProofInvestmentList);
        return itProofInvestmentMapper.entityListToDtoList(itProofInvestmentList);
    }

    @Override
    public IT_Proof_InvestmentDTO setStatusForProofOfInvestment(String empCode, String financialYear,Boolean state) {
        Long itDecId=3L;
        IT_Proof_Investment itProofInvestmentObj=itProofInvestmentRepo.findByEmpCodeAndFinancialYearAndItDecId(empCode, financialYear,itDecId);
        itProofInvestmentObj.setStatus(state);
        itProofInvestmentObj=itProofInvestmentRepo.save(itProofInvestmentObj);
        return itProofInvestmentMapper.entityToDto(itProofInvestmentObj);
    }

    @Override
    public Boolean getStatusForProofOfInvestment(String empCode, String financialYear) {
        Long itDecId=3L;
        IT_Proof_Investment itProofInvestmentObj=itProofInvestmentRepo.findByEmpCodeAndFinancialYearAndItDecId(empCode, financialYear,itDecId);
        if (itProofInvestmentObj != null && itProofInvestmentObj.getStatus() != null) {
            return itProofInvestmentObj.getStatus();
        }
        return false;
    }

    @Override
    public IT_Proof_InvestmentDTO setStatusForSubmitProofOfInvestment(String empCode, String financialYear,Boolean state) {
        Long itDecId=3L;
        IT_Proof_Investment itProofInvestmentObj=itProofInvestmentRepo.findByEmpCodeAndFinancialYearAndItDecId(empCode, financialYear,itDecId);
        itProofInvestmentObj.setIsSubmitted(state);
        itProofInvestmentObj=itProofInvestmentRepo.save(itProofInvestmentObj);
        return itProofInvestmentMapper.entityToDto(itProofInvestmentObj);
    }

    @Override
    public Boolean getStatusForSubmitProofOfInvestment(String empCode, String financialYear) {
        Long itDecId=3L;
        IT_Proof_Investment itProofInvestmentObj=itProofInvestmentRepo.findByEmpCodeAndFinancialYearAndItDecId(empCode, financialYear,itDecId);
        if (itProofInvestmentObj != null && itProofInvestmentObj.getIsSubmitted() != null) {
            return itProofInvestmentObj.getIsSubmitted();
        }
        return false;
    }

    @Autowired
    private IT_FileEntry_Mapping_Repo itFileEntryMappingRepo;


//    @Override
//    public List<IT_Proof_InvestmentDTO> getAllProofOfInvestmentByEmpIdAndFinancialYear(Long empId, String financialYear) {
//        List<IT_Proof_Investment> itProofInvestmentList = itProofInvestmentRepo.findByEmpIdAndFinancialYear(empId, financialYear);
//        System.out.println(itProofInvestmentList.size() + " itProofInvestmentList");
//        return itProofInvestmentMapper.entityListToDtoList(itProofInvestmentList);
//    }



    @Override
    public List<IT_Proof_InvestmentDTO> getAllProofOfInvestmentByEmpIdAndFinancialYear(String empCode, String financialYear) {

        List<IT_Proof_Investment> itProofInvestmentList = itProofInvestmentRepo.findByEmpCodeAndFinancialYear(empCode, financialYear);

        for (IT_Proof_Investment investment : itProofInvestmentList) {
            List<IT_FileEntry_Mapping> fileEntryMappings = itFileEntryMappingRepo
                    .findByItDecIdAndIsFSubmitInfoId(
                            investment.getItDecId(),
                            String.valueOf(investment.getItInfoId())
                    );

            System.out.println( investment.getItDecId()+" "+investment.getItInfoId());

            // Ensure null safety and avoid redundant checks
            if (fileEntryMappings != null && !fileEntryMappings.isEmpty()) {
                List<String> fileEntryIds = fileEntryMappings.stream()
                        .map(IT_FileEntry_Mapping::getFileEntryId)
                        .filter(Objects::nonNull) // Filter out null IDs
                        .collect(Collectors.toList());

                System.out.println(fileEntryIds+"fileEntryIds^^^^^^^^^^^");

                // Convert list to comma-separated string
                if (!fileEntryIds.isEmpty()) {
                    String fileEntryIdsString = String.join(",", fileEntryIds);
                    investment.setFileEntryId(fileEntryIdsString); // Assuming setFileEntryId accepts a String now
                }
            }
        }
        return itProofInvestmentMapper.entityListToDtoList(itProofInvestmentList);
    }





   /* @Override
    public List<IT_Proof_InvestmentDTO> getAllProofOfInvestmentByEmpIdAndFinancialYear(Long empId, String financialYear) {
        List<IT_Proof_Investment> itProofInvestmentList=itProofInvestmentRepo.findByEmpIdAndFinancialYear(empId, financialYear);
        return itProofInvestmentMapper.entityListToDtoList(itProofInvestmentList);
    }*/

    //Add Comment
    @Override
    public IT_Proof_Investment addComment(Long documentProfId, String comment) {
        IT_Proof_Investment proof = itProofInvestmentRepo.findById(documentProfId)
                .orElseThrow(() -> new RuntimeException("Proof Investment not found"));

        proof.setComments(comment);
        return itProofInvestmentRepo.save(proof);
    }

    @Override
    @Transactional
    public List<IT_Proof_InvestmentDTO> updateBulkProofOfInvestment(List<IT_Proof_InvestmentCO> updatedList) {
        List<IT_Proof_InvestmentDTO> updatedResults = new ArrayList<>();

        for (IT_Proof_InvestmentCO co : updatedList) {

            IT_Proof_Investment entity = itProofInvestmentRepo.findById(co.getDocumentProfId())
                    .orElseThrow(() -> new RuntimeException("Record not found for ID: " + co.getDocumentProfId()));

            // Update only fields that can change
            if (co.getRevisedAmount() != null) {
                entity.setRevisedAmount(co.getRevisedAmount());
            }
            if (co.getRemarks() != null) {
                entity.setRemarks(co.getRemarks());
            }
            if (co.getLandLordName() != null) {
                entity.setLandLordName(co.getLandLordName());
            }
            if (co.getLandLordPanNo() != null) {
                entity.setLandLordPanNo(co.getLandLordPanNo());
            }
            if (co.getAdditionalInformation() != null) {
                entity.setAdditionalInformation(co.getAdditionalInformation());
            }
            if (co.getHrSignaturePlace() != null) {
                entity.setHrSignaturePlace(co.getHrSignaturePlace());
            }
            if (co.getHrSignatureDate() != null) {
                entity.setHrSignatureDate(co.getHrSignatureDate());
            }
            if (co.getEmpCode() != null) {
                entity.setEmpCode(co.getEmpCode());
            }
            if (co.getItDecId() != null) {
                entity.setItDecId(co.getItDecId());
            }
            if (co.getFinancialYear() != null) {
                entity.setFinancialYear(co.getFinancialYear());
            }

            IT_Proof_Investment savedEntity = itProofInvestmentRepo.save(entity);

            updatedResults.add(itProofInvestmentMapper.entityToDto(savedEntity));
        }

        return updatedResults;
    }



}
