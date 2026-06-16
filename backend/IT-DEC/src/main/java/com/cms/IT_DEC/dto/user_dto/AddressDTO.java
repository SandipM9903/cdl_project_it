package com.cms.IT_DEC.dto.user_dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddressDTO {
    private long addressId;
    private String houseNo;
    private String street1;
    private String street2;
    private String landmark;
    private String country;
    private String state;
    private String district;
    private String city;
    private Integer pinCode;
}
