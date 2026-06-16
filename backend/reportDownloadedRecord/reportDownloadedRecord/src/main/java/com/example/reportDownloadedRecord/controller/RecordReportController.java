package com.example.reportDownloadedRecord.controller;

import com.example.reportDownloadedRecord.model.ReportRecord;
import com.example.reportDownloadedRecord.service.services.ReportRecordService;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/report-records")
@CrossOrigin(origins = "*")
public class RecordReportController {

    private final ReportRecordService reportRecordService;

    public RecordReportController(ReportRecordService reportRecordService) {
        this.reportRecordService = reportRecordService;
    }

    @GetMapping
    public ResponseEntity<List<ReportRecord>> getAllRecords() {
        return reportRecordService.getAllRecords();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReportRecord> getRecordById(@PathVariable Long id) {
        return reportRecordService.getRecordById(id);
    }

    @PostMapping
    public ResponseEntity<ReportRecord> createRecord(@RequestBody ReportRecord reportRecord) {
        return reportRecordService.saveRecord(reportRecord);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReportRecord> updateRecord(@PathVariable Long id, @RequestBody ReportRecord reportRecord) {
        reportRecord.setReportRecordId(id);
        return reportRecordService.saveRecord(reportRecord);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRecord(@PathVariable Long id) {
        return reportRecordService.deleteRecord(id);
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<ByteArrayResource> downloadReport(@PathVariable Long id) {
        // Fetch record including Excel data
        ReportRecord record = reportRecordService.getRecordForDownload(id);

        if (record.getReportData() == null) {
            throw new RuntimeException("No report data found for ID: " + id);
        }

        // Update download timestamp
        record.setReportRecordDownloadedDateTime(LocalDateTime.now());
        reportRecordService.saveRecord(record);

        ByteArrayResource resource = new ByteArrayResource(record.getReportData());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + record.getReportRecordName() + ".xlsx\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .contentLength(record.getReportData().length)
                .body(resource);
    }
}
