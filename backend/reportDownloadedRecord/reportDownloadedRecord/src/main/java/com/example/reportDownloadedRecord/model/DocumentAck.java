package com.example.reportDownloadedRecord.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "document_acknowledgement")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentAck {

    @Id
    @Column(name = "ack_id")
    private String ackId;

    @Column(name = "document_name", nullable = false)
    private String documentName;

    @Column(name = "emp_code", nullable = false)
    private String empCode;

    @Column(name = "ip_address")
    private String ipAddress;

    @Column(name = "ack_time")
    private LocalDateTime ackTime;

    @Column(name = "ack_status", nullable = false)
    private String ackStatus;
}

