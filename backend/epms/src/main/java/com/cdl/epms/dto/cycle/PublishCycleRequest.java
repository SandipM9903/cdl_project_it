package com.cdl.epms.dto.cycle;

import lombok.Data;

@Data
public class PublishCycleRequest {
    private String subject;
    private String body;
    private Long templateId;  // Optional, for reference
}