package com.cms.IT_DEC.mapper;

import com.cms.IT_DEC.dto.IT_Dec_FileDTO;
import com.cms.IT_DEC.model.IT_Dec_File;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-06-17T12:34:17+0530",
    comments = "version: 1.5.3.Final, compiler: javac, environment: Java 17.0.12 (Oracle Corporation)"
)
@Component
public class IT_Dec_FileMapperImpl implements IT_Dec_FileMapper {

    @Override
    public List<IT_Dec_FileDTO> entityListToDtoList(List<IT_Dec_File> it_dec_fileList) {
        if ( it_dec_fileList == null ) {
            return null;
        }

        List<IT_Dec_FileDTO> list = new ArrayList<IT_Dec_FileDTO>( it_dec_fileList.size() );
        for ( IT_Dec_File iT_Dec_File : it_dec_fileList ) {
            list.add( iT_Dec_FileToIT_Dec_FileDTO( iT_Dec_File ) );
        }

        return list;
    }

    protected IT_Dec_FileDTO iT_Dec_FileToIT_Dec_FileDTO(IT_Dec_File iT_Dec_File) {
        if ( iT_Dec_File == null ) {
            return null;
        }

        IT_Dec_FileDTO iT_Dec_FileDTO = new IT_Dec_FileDTO();

        iT_Dec_FileDTO.setId( iT_Dec_File.getId() );
        iT_Dec_FileDTO.setEmployeeCode( iT_Dec_File.getEmployeeCode() );
        iT_Dec_FileDTO.setItDecId( iT_Dec_File.getItDecId() );
        iT_Dec_FileDTO.setItDecDocId( iT_Dec_File.getItDecDocId() );
        iT_Dec_FileDTO.setDocCaption( iT_Dec_File.getDocCaption() );

        return iT_Dec_FileDTO;
    }
}
