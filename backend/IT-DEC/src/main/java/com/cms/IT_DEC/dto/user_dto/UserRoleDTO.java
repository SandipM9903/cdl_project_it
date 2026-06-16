package com.cms.IT_DEC.dto.user_dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRoleDTO {
    private long id;
    @JsonProperty("roleResDTO")
    private RoleDTO roleDTO;
}
