package com.example.reportDownloadedRecord.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "report_record")
@Data
public class ReportRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reportRecordId;

    private String reportRecordName;

    private LocalDateTime reportRecordDownloadedDateTime;

    @Lob
    private byte[] reportData;
}