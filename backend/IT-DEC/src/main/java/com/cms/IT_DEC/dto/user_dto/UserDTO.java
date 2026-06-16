package com.cms.IT_DEC.dto.user_dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String primaryContactNo;
    private String secondaryContactNo;
    private String gender;
    private LocalDate dateOfBirth;
    private String totalExperience;

    @JsonProperty("addressResDTOS")
    private List<AddressDTO> addressDTOS;

    @JsonProperty("educationResDTOS")
    private List<EducationDTO> educationDTOS;

    @JsonProperty("experienceResDTOS")
    private List<ExperienceDTO> experienceDTOS;

    @JsonProperty("locationResDTO")
    private LocationDTO locationDTO;

    @JsonProperty("skillResDTOS")
    private List<SkillDTO> skillDTOS;

    @JsonProperty("statutoryDetailsResDTO")
    private StatutoryDetailsDTO statutoryDetailsDTO;

    @JsonProperty("userRoleResDTOS")
    private List<UserRoleDTO> userRoleDTOS;

}
