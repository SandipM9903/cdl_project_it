package com.cdl.epms.model;

import com.cdl.epms.common.enums.EmailerStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class EmailJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String toEmail;
    private String subject;

    @Column(columnDefinition = "TEXT")
    private String body;

    private boolean sent = false;

    private LocalDateTime scheduledTime;

    @Enumerated(EnumType.STRING)
    private EmailerStatus status = EmailerStatus.NOT_STARTED;

    private LocalDateTime processedAt;

    private Long cycleId;
    private String reminderType;

    @Column(unique = true)
    private String uniqueKey;


}