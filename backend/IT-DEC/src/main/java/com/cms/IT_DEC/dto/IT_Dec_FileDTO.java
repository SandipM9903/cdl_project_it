package com.cms.IT_DEC.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class IT_Dec_FileDTO {
    private Long id;
    private String employeeCode;
    private Long itDecId;
    private Long itDecDocId;
    private String docCaption;
}
