package com.cms.IT_DEC.mapper;


import com.cms.IT_DEC.co_pkg.IT_Declaration_InfoCO;
import com.cms.IT_DEC.dto.IT_Declaration_InfoDTO;
import com.cms.IT_DEC.model.IT_Declaration_Info;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface IT_Declaration_InfoMapper {

    IT_Declaration_Info coToEntity(IT_Declaration_InfoCO itDeclarationInfoCO);

    List<IT_Declaration_Info> coListToEntityList(List<IT_Declaration_InfoCO> itDeclarationInfoCOList);
    IT_Declaration_InfoDTO entityToDto(IT_Declaration_Info itDeclarationInfo);
    List<IT_Declaration_InfoDTO> entityListToDtoList(List<IT_Declaration_Info> itDeclarationInfoList);
}
