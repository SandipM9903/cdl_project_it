package com.cms.IT_DEC.dto.user_dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EducationDTO {
    private long educationId;
    private String name;
    private String fieldOfStudy;
    private String instituteName;
    private String instituteAddress;
    private Date academicStartYear;
    private Date academicEndYear;
    private String status;
    private String certificate;
    private String docName;
    private long educationDocId;
    private String qualification;
}
