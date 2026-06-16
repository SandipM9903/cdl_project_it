package com.cms.IT_DEC.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class IT_Declaration_InfoDTO {

    private Long itInfoId;
//    private Long empId;
private String empCode;

    private Long itDecId;
    private Double declarationAmount;  // total amount of declaration
    private String signaturePlace;
    private LocalDate signatureDate;
    private String hrSignaturePlace;
    private LocalDate hrSignatureDate;
    private String financialYear;
    private Integer taxRegime;
    private Boolean is_submitted; // status  // integer

    // house loan info

    private String instituteName;
    private Double loanAmount;
    private LocalDate loanDate;
    private Double interest;

    // Regime
    private String regime;
}

