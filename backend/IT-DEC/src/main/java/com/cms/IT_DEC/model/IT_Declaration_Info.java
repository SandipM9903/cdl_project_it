package com.cms.IT_DEC.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@Entity
public class IT_Declaration_Info extends BaseModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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
}
