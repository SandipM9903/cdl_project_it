package com.cms.IT_DEC.mapper;

import com.cms.IT_DEC.co_pkg.IT_Declaration_InfoCO;
import com.cms.IT_DEC.dto.IT_Declaration_InfoDTO;
import com.cms.IT_DEC.model.IT_Declaration_Info;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-27T15:24:31+0530",
    comments = "version: 1.5.3.Final, compiler: javac, environment: Java 17.0.12 (Oracle Corporation)"
)
@Component
public class IT_Declaration_InfoMapperImpl implements IT_Declaration_InfoMapper {

    @Override
    public IT_Declaration_Info coToEntity(IT_Declaration_InfoCO itDeclarationInfoCO) {
        if ( itDeclarationInfoCO == null ) {
            return null;
        }

        IT_Declaration_Info iT_Declaration_Info = new IT_Declaration_Info();

        iT_Declaration_Info.setItInfoId( itDeclarationInfoCO.getItInfoId() );
        iT_Declaration_Info.setEmpCode( itDeclarationInfoCO.getEmpCode() );
        iT_Declaration_Info.setItDecId( itDeclarationInfoCO.getItDecId() );
        iT_Declaration_Info.setDeclarationAmount( itDeclarationInfoCO.getDeclarationAmount() );
        iT_Declaration_Info.setSignaturePlace( itDeclarationInfoCO.getSignaturePlace() );
        iT_Declaration_Info.setSignatureDate( itDeclarationInfoCO.getSignatureDate() );
        iT_Declaration_Info.setHrSignaturePlace( itDeclarationInfoCO.getHrSignaturePlace() );
        iT_Declaration_Info.setHrSignatureDate( itDeclarationInfoCO.getHrSignatureDate() );
        iT_Declaration_Info.setFinancialYear( itDeclarationInfoCO.getFinancialYear() );
        iT_Declaration_Info.setTaxRegime( itDeclarationInfoCO.getTaxRegime() );
        iT_Declaration_Info.setIs_submitted( itDeclarationInfoCO.getIs_submitted() );
        iT_Declaration_Info.setInstituteName( itDeclarationInfoCO.getInstituteName() );
        iT_Declaration_Info.setLoanAmount( itDeclarationInfoCO.getLoanAmount() );
        iT_Declaration_Info.setLoanDate( itDeclarationInfoCO.getLoanDate() );
        iT_Declaration_Info.setInterest( itDeclarationInfoCO.getInterest() );

        return iT_Declaration_Info;
    }

    @Override
    public List<IT_Declaration_Info> coListToEntityList(List<IT_Declaration_InfoCO> itDeclarationInfoCOList) {
        if ( itDeclarationInfoCOList == null ) {
            return null;
        }

        List<IT_Declaration_Info> list = new ArrayList<IT_Declaration_Info>( itDeclarationInfoCOList.size() );
        for ( IT_Declaration_InfoCO iT_Declaration_InfoCO : itDeclarationInfoCOList ) {
            list.add( coToEntity( iT_Declaration_InfoCO ) );
        }

        return list;
    }

    @Override
    public IT_Declaration_InfoDTO entityToDto(IT_Declaration_Info itDeclarationInfo) {
        if ( itDeclarationInfo == null ) {
            return null;
        }

        IT_Declaration_InfoDTO iT_Declaration_InfoDTO = new IT_Declaration_InfoDTO();

        iT_Declaration_InfoDTO.setItInfoId( itDeclarationInfo.getItInfoId() );
        iT_Declaration_InfoDTO.setEmpCode( itDeclarationInfo.getEmpCode() );
        iT_Declaration_InfoDTO.setItDecId( itDeclarationInfo.getItDecId() );
        iT_Declaration_InfoDTO.setDeclarationAmount( itDeclarationInfo.getDeclarationAmount() );
        iT_Declaration_InfoDTO.setSignaturePlace( itDeclarationInfo.getSignaturePlace() );
        iT_Declaration_InfoDTO.setSignatureDate( itDeclarationInfo.getSignatureDate() );
        iT_Declaration_InfoDTO.setHrSignaturePlace( itDeclarationInfo.getHrSignaturePlace() );
        iT_Declaration_InfoDTO.setHrSignatureDate( itDeclarationInfo.getHrSignatureDate() );
        iT_Declaration_InfoDTO.setFinancialYear( itDeclarationInfo.getFinancialYear() );
        iT_Declaration_InfoDTO.setTaxRegime( itDeclarationInfo.getTaxRegime() );
        iT_Declaration_InfoDTO.setIs_submitted( itDeclarationInfo.getIs_submitted() );
        iT_Declaration_InfoDTO.setInstituteName( itDeclarationInfo.getInstituteName() );
        iT_Declaration_InfoDTO.setLoanAmount( itDeclarationInfo.getLoanAmount() );
        iT_Declaration_InfoDTO.setLoanDate( itDeclarationInfo.getLoanDate() );
        iT_Declaration_InfoDTO.setInterest( itDeclarationInfo.getInterest() );

        return iT_Declaration_InfoDTO;
    }

    @Override
    public List<IT_Declaration_InfoDTO> entityListToDtoList(List<IT_Declaration_Info> itDeclarationInfoList) {
        if ( itDeclarationInfoList == null ) {
            return null;
        }

        List<IT_Declaration_InfoDTO> list = new ArrayList<IT_Declaration_InfoDTO>( itDeclarationInfoList.size() );
        for ( IT_Declaration_Info iT_Declaration_Info : itDeclarationInfoList ) {
            list.add( entityToDto( iT_Declaration_Info ) );
        }

        return list;
    }
}
