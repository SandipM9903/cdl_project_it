//package com.cms.IT_DEC.mapper;
//
//public class IT_Dec_FileMapper {
//}


package com.cms.IT_DEC.mapper;

import com.cms.IT_DEC.dto.IT_Dec_FileDTO;
import com.cms.IT_DEC.model.IT_Dec_File;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface IT_Dec_FileMapper {
    List<IT_Dec_FileDTO> entityListToDtoList(List<IT_Dec_File> it_dec_fileList);
}
