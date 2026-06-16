package com.cms.IT_DEC.co_pkg;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class IT_Declaration_MasterCO {

    @NotBlank(message = "Declaration name cannot be blank")
    @Size(max = 100, message = "Declaration name must not exceed 300 characters")
    private String declarationName;

    @NotBlank(message = "Description cannot be blank")
    @Size(max = 255, message = "Description must not exceed 400 characters")
    private String description;

    @Size(max = 500, message = "Additional information must not exceed 500 characters")
    private String additionalInformation;
}
