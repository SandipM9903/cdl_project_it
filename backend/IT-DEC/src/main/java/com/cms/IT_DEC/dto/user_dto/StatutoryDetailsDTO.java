package com.cms.IT_DEC.dto.user_dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StatutoryDetailsDTO {
    private long statutoryDetailsId;

    private String panNumber;

    private long panCopyDocumentId;

    private String aadhaarNumber;

    private long aadhaarCopyDocumentId;

    private String nameAsPerPanCard;

    private String uan;

    private String pfNo;

    private String esicNo;

    private String fatherOrHusbandName;

    private String relationshipWithPerson;

    private String earlierMemberOfPF;

    private String internationalWorker;

    private String speciallyAbled;

    private String pfLinkedBankName;

    private String pfLinkedBankAccountNo;

    private String pfLinkedBankIfsc;

    private String lwdOfPreviousCompany;
}
