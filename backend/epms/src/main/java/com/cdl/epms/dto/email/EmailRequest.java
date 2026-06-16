package com.cdl.epms.dto.email;

import lombok.Data;
import java.util.Map;

@Data
public class EmailRequest {
    private Long templateId;
    private String to;
    private String subject;
    private String body;
    private Map<String, String> variables;
    private Long cycleId;
    private String reminderType;
    private String uniqueKey;
}