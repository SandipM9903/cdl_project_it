package com.cms.IT_DEC.co_pkg;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class IT_Proof_InvestmentCO {

    private Long documentProfId;

    @NotNull(message = "Employee ID cannot be null")
    @Positive(message = "Employee ID must be a positive number")
//    private Long empId;
    private String empCode;


    @NotNull(message = "Revised amount cannot be null")
    @Positive(message = "Revised amount must be greater than zero")
    private Double revisedAmount;


    @NotBlank(message = "Financial year cannot be blank")
    @Size(max = 9, message = "Financial year must be in the format YYYY-YYYY")
    private String financialYear;

    @NotNull(message = "IT Declaration ID cannot be null")
    @Positive(message = "IT Declaration ID must be a positive number")
    private Long itDecId;

    @Size(max = 500, message = "Remarks must not exceed 500 characters")
    private String remarks;

    @Size(max = 75, message = "Landlord name must not exceed 75 characters")
    private String landLordName;

    @Pattern(regexp = "[A-Z]{5}[0-9]{4}[A-Z]{1}", message = "Invalid PAN number format")
    @Size(max = 10, message = "Landlord PAN number must not exceed 10 characters")
    private String landLordPanNo;

    @Size(max = 500, message = "HR rejection remarks must not exceed 500 characters")
    private String hrRejectionRemarks;

    @Size(max = 500, message = "Additional information must not exceed 500 characters")
    private String additionalInformation;

    @Size(max = 75, message = "HR signature place must not exceed 75 characters")
    private String hrSignaturePlace;

    @PastOrPresent(message = "HR signature date cannot be in the future")
    private LocalDate hrSignatureDate;

   // @NotNull(message = "File entry ID cannot be null")
//    @Positive(message = "File entry ID must be a positive number")
    private String fileEntryId;
    private Long itInfoId;

//    @NotNull(message = "Status cannot be null")
    private Boolean status;

   // @NotNull(message = "Submission status cannot be null")
    private Boolean isSubmitted;
}
