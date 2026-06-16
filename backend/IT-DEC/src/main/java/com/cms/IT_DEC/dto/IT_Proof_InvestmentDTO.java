package com.cms.IT_DEC.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor


public class IT_Proof_InvestmentDTO {
    private Long documentProfId;
//    private Long empId;
private String empCode;

    private Double revisedAmount;
    private String financialYear;
    private Long itDecId;
    private String remarks;
    private String landLordName;
    private String landLordPanNo;
    private String hrRejectionRemarks;
    private String additionalInformation;
    private String hrSignaturePlace;
    private LocalDate hrSignatureDate;
    private String fileEntryId;
    private Long itInfoId;
    private String comments;


    private Boolean status;  // integer
    private Boolean isSubmitted;

}
