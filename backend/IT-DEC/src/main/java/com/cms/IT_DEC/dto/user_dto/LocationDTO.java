package com.cms.IT_DEC.dto.user_dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LocationDTO {
    private long locationId;
    private String country;
    private String region;
    private String state;
    private String zone;
    private String district;
    private String city;
    private String locationName;
    private Integer pinCode;
    private double latitude;
    private double longitude;
}
