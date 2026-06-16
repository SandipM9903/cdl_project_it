package com.example.reportDownloadedRecord.service.services;

import com.example.reportDownloadedRecord.exception.ReportRecordException;
import com.example.reportDownloadedRecord.model.ReportRecord;
import com.example.reportDownloadedRecord.repository.ReportRecordRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReportRecordService {

    private final ReportRecordRepository reportRecordRepository;

    public ReportRecordService(ReportRecordRepository reportRecordRepository) {
        this.reportRecordRepository = reportRecordRepository;
    }

    public ResponseEntity<List<ReportRecord>> getAllRecords() {
        List<ReportRecord> records = reportRecordRepository.findAll();
        if (records.isEmpty()) {
            throw new ReportRecordException("No report records found");
        }
        return ResponseEntity.ok(records);
    }

    public ReportRecord getRecordForDownload(Long id) {
        return reportRecordRepository.findById(id)
                .orElseThrow(() -> new ReportRecordException("Record not found with ID: " + id));
    }

    public ResponseEntity<ReportRecord> getRecordById(Long id) {
        ReportRecord record = reportRecordRepository.findById(id)
                .orElseThrow(() -> new ReportRecordException("Record not found with ID: " + id));
        return ResponseEntity.ok(record);
    }

    public ResponseEntity<ReportRecord> saveRecord(ReportRecord reportRecord) {
        if (reportRecord.getReportRecordName() == null || reportRecord.getReportRecordName().isEmpty()) {
            throw new ReportRecordException("Report name cannot be empty");
        }

        if (reportRecord.getReportData() == null || reportRecord.getReportData().length == 0) {
            throw new ReportRecordException("Report data cannot be empty");
        }

        reportRecord.setReportRecordDownloadedDateTime(LocalDateTime.now());

        ReportRecord saved = reportRecordRepository.save(reportRecord);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    public ResponseEntity<String> deleteRecord(Long id) {
        if (!reportRecordRepository.existsById(id)) {
            throw new ReportRecordException("Cannot delete. Record not found with ID: " + id);
        }

        reportRecordRepository.deleteById(id);
        return ResponseEntity.ok("Record deleted successfully");
    }
}
