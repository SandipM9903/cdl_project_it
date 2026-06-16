package com.cdl.epms.dto.annualReview;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAnnualReviewDto {
    private Long id;
    private String managerRating;
    private String achievementLevel;
    private String potential;
    private String performance;
    private String talentResource;
    private String matrixCategory;
    private String financialYear;

    // Legacy fields
    private String nineBoxResult;
    private Boolean talentFlag;
    private Boolean criticalFlag;

    private String managerRemarks;
    private String performanceRating;
    private String potentialRating;
}