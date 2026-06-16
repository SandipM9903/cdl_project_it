package com.cms.IT_DEC.model;

import jakarta.persistence.*;
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
public class IT_Proof_Investment extends BaseModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long documentProfId;

//    private Long empId;

    private String empCode;

    private Double revisedAmount;
    private String financialYear;
    private Long itDecId;

    // Remarks field mapped to TEXT type in PostgreSQL
    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "comments", columnDefinition = "TEXT")
    private String comments;

    private String landLordName;
    private String landLordPanNo;
    private String additionalInformation;
    private String hrRejectionRemarks;
    private String hrSignaturePlace;
    private LocalDate hrSignatureDate;
    private String fileEntryId;
    private Long itInfoId;

    private Boolean status;  // integer
    private Boolean isSubmitted;
}
