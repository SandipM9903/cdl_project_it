package com.cms.IT_DEC.beans_response;

import com.cms.IT_DEC.dto.employee_dto.EmpResDTO;
import com.cms.cdl.common_dtos.beans.file_bean.FileAndContentTypeBean;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor

public class FileAndObjectTypeBean {
    FileAndContentTypeBean fileAndContentTypeBean;
    EmpResDTO empResDTO;
}
