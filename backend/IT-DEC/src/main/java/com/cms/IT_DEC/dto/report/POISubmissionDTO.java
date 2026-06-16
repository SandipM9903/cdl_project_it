package com.cms.IT_DEC.dto.report;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class POISubmissionDTO {
    private Long itDecId;
    private String declarationName;
    private String empCode;
    private Double declarationAmount;
}
