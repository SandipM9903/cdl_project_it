package com.cdl.epms.dto.goal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class ManagerApprovalRequestDto {

    @NotBlank(message = "Manager ID is required")
    private String managerId;

    @NotBlank(message = "Employee ID is required")
    private String employeeId;

    @NotBlank(message = "Quarter is required")
    private String quarter;

    @NotNull(message = "Year is required")
    private Integer year;

    @NotNull(message = "Action is required (APPROVE or SEND_BACK)")
    private ApprovalAction action;

    // This is the comment box that opens if the manager clicks "Send Back"
    private String managerApprovalComment;

    @NotNull(message = "At least one goal ID is required")
    private List<Long> goalIds;

    public enum ApprovalAction {
        APPROVE,
        SEND_BACK
    }
}