package com.cms.IT_DEC.mapper;


import com.cms.IT_DEC.co_pkg.IT_Declaration_MasterCO;
import com.cms.IT_DEC.dto.IT_Declaration_MasterDTO;
import com.cms.IT_DEC.model.IT_Declaration_Master;
import org.mapstruct.Mapper;

import java.util.List;
@Mapper(componentModel = "spring")
public interface IT_Declaration_MasterMapper {

    IT_Declaration_Master coToEntity(IT_Declaration_MasterCO itDeclarationMasterCO);
    IT_Declaration_MasterDTO entityToDto(IT_Declaration_Master itDeclarationMaster);
    List<IT_Declaration_MasterDTO> entityListToDtoList(List<IT_Declaration_Master> itDeclarationMasterList);
}
