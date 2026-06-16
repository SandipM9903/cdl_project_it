package com.cms.IT_DEC.dto.report;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ITDeclarationReportDTO {
    private Long itDecId;
    private String declarationName;
    private String empCode;
    private String empName;
    private String panNumber;
    private Double declarationAmount;
    private LocalDateTime createdDate;

    // Additional fields for complete report
    private String signatureDate;
    private String financialYear;
    private Boolean isSubmitted;
    private Double loanAmount;
    private String loanDate;
    private String interest;
    private String instituteName;
    private Integer taxRegime;
    private String regime;
    private String signaturePlace;
    private String hrSignatureDate;
    private String hrSignaturePlace;
    private LocalDateTime modifiedDate;
    private Long itInfoId;

    // Constructor for basic report
    public ITDeclarationReportDTO(Long itDecId, String declarationName, String empCode,
                                  String firstName, String lastName, String panNumber,
                                  Double declarationAmount, LocalDateTime createdDate) {
        this.itDecId = itDecId;
        this.declarationName = declarationName;
        this.empCode = empCode;
        this.empName = (firstName != null ? firstName : "") + " " + (lastName != null ? lastName : "");
        this.empName = this.empName.trim();
        this.panNumber = panNumber != null ? panNumber : "Not Available";
        this.declarationAmount = declarationAmount != null ? declarationAmount : 0.0;
        this.createdDate = createdDate;
    }
}