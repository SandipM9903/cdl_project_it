package com.cms.IT_DEC.co_pkg;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.time.LocalDate;

@Data
public class IT_Declaration_InfoCO {

    private Long itInfoId;

    @NotNull(message = "Employee ID cannot be null")
    private String empCode;

    @NotNull(message = "IT Declaration ID cannot be null")
    private Long itDecId;

    @NotNull(message = "Declaration Amount cannot be null")
    @PositiveOrZero(message = "Declaration Amount must be zero or positive")
    private Double declarationAmount;

  //  @NotBlank(message = "Signature place cannot be blank")
    private String signaturePlace;

  //  @NotNull(message = "Signature date cannot be null")
    private LocalDate signatureDate;

  //  @NotBlank(message = "HR Signature place cannot be blank")
    private String hrSignaturePlace;

  //  @NotNull(message = "HR Signature date cannot be null")
    private LocalDate hrSignatureDate;

 //   @NotBlank(message = "Financial year cannot be blank")
    private String financialYear;

    @NotNull(message = "Tax regime cannot be null")
    @Min(value = 0, message = "Tax regime must be a valid integer")
    private Integer taxRegime;

  //  @NotNull(message = "Submission status cannot be null")
    private Boolean is_submitted;

    // House loan info

  //  @NotBlank(message = "Institute name cannot be blank")
    private String instituteName;

  //  @NotNull(message = "Loan amount cannot be null")
 //   @Positive(message = "Loan amount must be positive")
    private Double loanAmount;

 //   @NotNull(message = "Loan date cannot be null")
    private LocalDate loanDate;

//    @NotNull(message = "Interest cannot be null")
//    @PositiveOrZero(message = "Interest must be zero or positive")
    private Double interest;
}
