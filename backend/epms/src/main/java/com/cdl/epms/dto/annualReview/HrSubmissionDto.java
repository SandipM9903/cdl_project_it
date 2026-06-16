package com.cdl.epms.dto.annualReview;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HrSubmissionDto {
    private Long id;
    private String employeeId;
    private Integer year;
    private Boolean discussedWithR1;
    private Boolean employeeComment;
    private String employeeCommentText;
    private String submittedBy;
    private String employeeFeeling;
    private String additionalFeedback;
}