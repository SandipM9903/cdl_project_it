package com.example.reportDownloadedRecord.repository;

import com.example.reportDownloadedRecord.model.DocumentAck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentAckRepository extends JpaRepository<DocumentAck, String> {
    List<DocumentAck> findByEmpCode(String empCode);

    @Query("SELECT d.ackId FROM DocumentAck d ORDER BY d.ackTime DESC LIMIT 1")
    String findLastAckId();
}
