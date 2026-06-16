package com.cdl.epms.dto.hr;

import lombok.Data;

@Data
public class HrProgressStatusResponseDto {

    private String quarter;

    private long notStartedCount;
    private long draftCount;
    private long pendingApprovalCount;
    private long sentBackCount;
    private long approvedCount;
    private long selfReviewedCount;
    private long managerReviewedCount;
    private long acceptedByEmployeeCount;
    private long finalSubmittedToHrCount;
}