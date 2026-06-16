package com.example.reportDownloadedRecord.service.serviceImpl;

import com.example.reportDownloadedRecord.exception.DocumentAckException;
import com.example.reportDownloadedRecord.model.DocumentAck;
import com.example.reportDownloadedRecord.repository.DocumentAckRepository;
import com.example.reportDownloadedRecord.service.services.DocumentAckService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DocumentAckServiceImpl implements DocumentAckService {

    private final DocumentAckRepository documentAckRepository;

    public DocumentAckServiceImpl(DocumentAckRepository documentAckRepository) {
        this.documentAckRepository = documentAckRepository;
    }

    private String generateAckId() {
        String lastAckId = documentAckRepository.findLastAckId();

        if (lastAckId == null) {
            return "ACK1";
        }

        int number = Integer.parseInt(lastAckId.replace("ACK", ""));
        return "ACK" + (number + 1);
    }

    @Override
    public DocumentAck save(DocumentAck documentAck, HttpServletRequest request) {
        try {
            documentAck.setAckId(generateAckId());
            documentAck.setAckTime(LocalDateTime.now());
            documentAck.setIpAddress(getClientIp(request));
            documentAck.setAckStatus("ACKNOWLEDGED");

            return documentAckRepository.save(documentAck);
        } catch (Exception ex) {
            throw new DocumentAckException("Unable to save document acknowledgment", ex);
        }
    }



    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");

        if (ip != null && !ip.isBlank() && !"unknown".equalsIgnoreCase(ip)) {
            ip = ip.split(",")[0];
        } else {
            ip = request.getRemoteAddr();
        }

        // Convert IPv6 localhost to IPv4
        if ("0:0:0:0:0:0:0:1".equals(ip) || "::1".equals(ip)) {
            ip = "127.0.0.1";
        }

        return ip;
    }

    @Override
    public List<DocumentAck> findAll() {
        List<DocumentAck> list = documentAckRepository.findAll();

        if (list.isEmpty()) {
            throw new DocumentAckException("No document acknowledgment records found");
        }

        return list;
    }

    @Override
    public DocumentAck findById(String ackId) {
        return documentAckRepository.findById(ackId)
                .orElseThrow(() ->
                        new DocumentAckException("Document acknowledgment not found for id: " + ackId)
                );
    }

    @Override
    public List<DocumentAck> findByEmpCode(String empCode) {
        return documentAckRepository.findByEmpCode(empCode);
    }
}
