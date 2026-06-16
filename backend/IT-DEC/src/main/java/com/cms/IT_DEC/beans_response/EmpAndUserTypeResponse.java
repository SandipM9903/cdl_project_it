package com.cms.IT_DEC.beans_response;

import com.cms.IT_DEC.dto.user_dto.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor

public class EmpAndUserTypeResponse {
    private FileAndObjectTypeBean fileAndObjectTypeBean;
    private UserDTO userDTO;
}
