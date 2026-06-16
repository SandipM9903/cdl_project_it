package com.cms.IT_DEC.mapper;

import com.cms.IT_DEC.co_pkg.IT_Proof_InvestmentCO;
import com.cms.IT_DEC.dto.IT_Proof_InvestmentDTO;
import com.cms.IT_DEC.model.IT_Proof_Investment;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface IT_Proof_InvestmentMapper {

    IT_Proof_Investment coToEntity(IT_Proof_InvestmentCO itProofInvestmentCO);

    List<IT_Proof_Investment> coListToEntityList(List<IT_Proof_InvestmentCO> itProofInvestmentCOList);

    IT_Proof_InvestmentDTO entityToDto(IT_Proof_Investment itProofInvestment);

    List<IT_Proof_InvestmentDTO> entityListToDtoList(List<IT_Proof_Investment> itProofInvestmentList);
}
