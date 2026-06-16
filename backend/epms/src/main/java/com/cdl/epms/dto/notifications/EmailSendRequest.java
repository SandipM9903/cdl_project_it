package com.cdl.epms.dto.notifications;

import com.cdl.epms.common.enums.CycleType;
import com.cdl.epms.common.enums.EmailTemplateType;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailSendRequest {
    private CycleType cycleType;
    private EmailTemplateType templateType;
    private List<EmployeeDto> employees;
    private List<EmployeeDto> managers;
    private String subject;
    private String content;
    private LocalDate deadline;
    private Integer pendingTeamMembers;

    // NEW FIELDS FOR UNIFIED EMAIL
    private String actionType;        // LAUNCH, CLOSE, EXTEND, REMINDER, REOPEN
    private Long cycleId;             // Cycle ID for reference
    private String customSubject;     // Custom subject from HR
    private String customBody;        // Custom body from HR
    private String newExpiryDate;     // For EXTEND/REOPEN actions
    private Map<String, String> variables;  // Dynamic variables like employeeName, quarter, etc.
}