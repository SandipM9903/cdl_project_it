package com.cms.IT_DEC.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class IT_Declaration_MasterDTO {
    private Long itDecId;
    private String declarationName;
    private String description;
    private String additionalInformation;
}
