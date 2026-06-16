package com.example.reportDownloadedRecord.service.services;

import com.example.reportDownloadedRecord.model.DocumentAck;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

public interface DocumentAckService {

    DocumentAck save(DocumentAck documentAck, HttpServletRequest request);

    List<DocumentAck> findAll();

    List<DocumentAck> findByEmpCode(String empCode);

    DocumentAck findById(String ackId);
}
