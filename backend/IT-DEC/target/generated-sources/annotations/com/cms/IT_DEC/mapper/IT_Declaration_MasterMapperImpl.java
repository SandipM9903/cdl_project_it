package com.cms.IT_DEC.mapper;

import com.cms.IT_DEC.co_pkg.IT_Declaration_MasterCO;
import com.cms.IT_DEC.dto.IT_Declaration_MasterDTO;
import com.cms.IT_DEC.model.IT_Declaration_Master;
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
public class IT_Declaration_MasterMapperImpl implements IT_Declaration_MasterMapper {

    @Override
    public IT_Declaration_Master coToEntity(IT_Declaration_MasterCO itDeclarationMasterCO) {
        if ( itDeclarationMasterCO == null ) {
            return null;
        }

        IT_Declaration_Master iT_Declaration_Master = new IT_Declaration_Master();

        iT_Declaration_Master.setDeclarationName( itDeclarationMasterCO.getDeclarationName() );
        iT_Declaration_Master.setDescription( itDeclarationMasterCO.getDescription() );
        iT_Declaration_Master.setAdditionalInformation( itDeclarationMasterCO.getAdditionalInformation() );

        return iT_Declaration_Master;
    }

    @Override
    public IT_Declaration_MasterDTO entityToDto(IT_Declaration_Master itDeclarationMaster) {
        if ( itDeclarationMaster == null ) {
            return null;
        }

        IT_Declaration_MasterDTO iT_Declaration_MasterDTO = new IT_Declaration_MasterDTO();

        iT_Declaration_MasterDTO.setItDecId( itDeclarationMaster.getItDecId() );
        iT_Declaration_MasterDTO.setDeclarationName( itDeclarationMaster.getDeclarationName() );
        iT_Declaration_MasterDTO.setDescription( itDeclarationMaster.getDescription() );
        iT_Declaration_MasterDTO.setAdditionalInformation( itDeclarationMaster.getAdditionalInformation() );

        return iT_Declaration_MasterDTO;
    }

    @Override
    public List<IT_Declaration_MasterDTO> entityListToDtoList(List<IT_Declaration_Master> itDeclarationMasterList) {
        if ( itDeclarationMasterList == null ) {
            return null;
        }

        List<IT_Declaration_MasterDTO> list = new ArrayList<IT_Declaration_MasterDTO>( itDeclarationMasterList.size() );
        for ( IT_Declaration_Master iT_Declaration_Master : itDeclarationMasterList ) {
            list.add( entityToDto( iT_Declaration_Master ) );
        }

        return list;
    }
}
