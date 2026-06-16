package com.cms.IT_DEC.dto.user_dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExperienceDTO {
    private long experienceId;
    private String experience;
    private String companyName;
    private String companyAddress;
    private LocalDate dateOfJoining;
    private LocalDate dateOfReliving;
    private String jobTitle;
    private String certification;
}
