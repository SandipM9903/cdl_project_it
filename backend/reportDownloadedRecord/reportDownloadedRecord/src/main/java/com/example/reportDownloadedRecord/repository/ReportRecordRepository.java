package com.example.reportDownloadedRecord.repository;

import com.example.reportDownloadedRecord.model.ReportRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportRecordRepository extends JpaRepository<ReportRecord, Long> {
}
