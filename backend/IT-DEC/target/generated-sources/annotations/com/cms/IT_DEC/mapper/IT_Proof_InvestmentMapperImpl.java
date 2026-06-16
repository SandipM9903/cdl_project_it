package com.cms.IT_DEC.mapper;

import com.cms.IT_DEC.co_pkg.IT_Proof_InvestmentCO;
import com.cms.IT_DEC.dto.IT_Proof_InvestmentDTO;
import com.cms.IT_DEC.model.IT_Proof_Investment;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-27T15:24:32+0530",
    comments = "version: 1.5.3.Final, compiler: javac, environment: Java 17.0.12 (Oracle Corporation)"
)
@Component
public class IT_Proof_InvestmentMapperImpl implements IT_Proof_InvestmentMapper {

    @Override
    public IT_Proof_Investment coToEntity(IT_Proof_InvestmentCO itProofInvestmentCO) {
        if ( itProofInvestmentCO == null ) {
            return null;
        }

        IT_Proof_Investment iT_Proof_Investment = new IT_Proof_Investment();

        iT_Proof_Investment.setDocumentProfId( itProofInvestmentCO.getDocumentProfId() );
        iT_Proof_Investment.setEmpCode( itProofInvestmentCO.getEmpCode() );
        iT_Proof_Investment.setRevisedAmount( itProofInvestmentCO.getRevisedAmount() );
        iT_Proof_Investment.setFinancialYear( itProofInvestmentCO.getFinancialYear() );
        iT_Proof_Investment.setItDecId( itProofInvestmentCO.getItDecId() );
        iT_Proof_Investment.setRemarks( itProofInvestmentCO.getRemarks() );
        iT_Proof_Investment.setLandLordName( itProofInvestmentCO.getLandLordName() );
        iT_Proof_Investment.setLandLordPanNo( itProofInvestmentCO.getLandLordPanNo() );
        iT_Proof_Investment.setAdditionalInformation( itProofInvestmentCO.getAdditionalInformation() );
        iT_Proof_Investment.setHrRejectionRemarks( itProofInvestmentCO.getHrRejectionRemarks() );
        iT_Proof_Investment.setHrSignaturePlace( itProofInvestmentCO.getHrSignaturePlace() );
        iT_Proof_Investment.setHrSignatureDate( itProofInvestmentCO.getHrSignatureDate() );
        iT_Proof_Investment.setFileEntryId( itProofInvestmentCO.getFileEntryId() );
        iT_Proof_Investment.setItInfoId( itProofInvestmentCO.getItInfoId() );
        iT_Proof_Investment.setStatus( itProofInvestmentCO.getStatus() );
        iT_Proof_Investment.setIsSubmitted( itProofInvestmentCO.getIsSubmitted() );

        return iT_Proof_Investment;
    }

    @Override
    public List<IT_Proof_Investment> coListToEntityList(List<IT_Proof_InvestmentCO> itProofInvestmentCOList) {
        if ( itProofInvestmentCOList == null ) {
            return null;
        }

        List<IT_Proof_Investment> list = new ArrayList<IT_Proof_Investment>( itProofInvestmentCOList.size() );
        for ( IT_Proof_InvestmentCO iT_Proof_InvestmentCO : itProofInvestmentCOList ) {
            list.add( coToEntity( iT_Proof_InvestmentCO ) );
        }

        return list;
    }

    @Override
    public IT_Proof_InvestmentDTO entityToDto(IT_Proof_Investment itProofInvestment) {
        if ( itProofInvestment == null ) {
            return null;
        }

        IT_Proof_InvestmentDTO iT_Proof_InvestmentDTO = new IT_Proof_InvestmentDTO();

        iT_Proof_InvestmentDTO.setDocumentProfId( itProofInvestment.getDocumentProfId() );
        iT_Proof_InvestmentDTO.setEmpCode( itProofInvestment.getEmpCode() );
        iT_Proof_InvestmentDTO.setRevisedAmount( itProofInvestment.getRevisedAmount() );
        iT_Proof_InvestmentDTO.setFinancialYear( itProofInvestment.getFinancialYear() );
        iT_Proof_InvestmentDTO.setItDecId( itProofInvestment.getItDecId() );
        iT_Proof_InvestmentDTO.setRemarks( itProofInvestment.getRemarks() );
        iT_Proof_InvestmentDTO.setLandLordName( itProofInvestment.getLandLordName() );
        iT_Proof_InvestmentDTO.setLandLordPanNo( itProofInvestment.getLandLordPanNo() );
        iT_Proof_InvestmentDTO.setHrRejectionRemarks( itProofInvestment.getHrRejectionRemarks() );
        iT_Proof_InvestmentDTO.setAdditionalInformation( itProofInvestment.getAdditionalInformation() );
        iT_Proof_InvestmentDTO.setHrSignaturePlace( itProofInvestment.getHrSignaturePlace() );
        iT_Proof_InvestmentDTO.setHrSignatureDate( itProofInvestment.getHrSignatureDate() );
        iT_Proof_InvestmentDTO.setFileEntryId( itProofInvestment.getFileEntryId() );
        iT_Proof_InvestmentDTO.setItInfoId( itProofInvestment.getItInfoId() );
        iT_Proof_InvestmentDTO.setComments( itProofInvestment.getComments() );
        iT_Proof_InvestmentDTO.setStatus( itProofInvestment.getStatus() );
        iT_Proof_InvestmentDTO.setIsSubmitted( itProofInvestment.getIsSubmitted() );

        return iT_Proof_InvestmentDTO;
    }

    @Override
    public List<IT_Proof_InvestmentDTO> entityListToDtoList(List<IT_Proof_Investment> itProofInvestmentList) {
        if ( itProofInvestmentList == null ) {
            return null;
        }

        List<IT_Proof_InvestmentDTO> list = new ArrayList<IT_Proof_InvestmentDTO>( itProofInvestmentList.size() );
        for ( IT_Proof_Investment iT_Proof_Investment : itProofInvestmentList ) {
            list.add( entityToDto( iT_Proof_Investment ) );
        }

        return list;
    }
}
