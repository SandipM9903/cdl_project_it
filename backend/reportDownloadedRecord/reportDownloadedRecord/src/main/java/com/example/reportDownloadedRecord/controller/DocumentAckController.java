package com.example.reportDownloadedRecord.controller;

import com.cms.cdl.common_dtos.AES_enc_decy.SimpleEncryptorDecryptor;
import com.example.reportDownloadedRecord.model.DocumentAck;
import com.example.reportDownloadedRecord.service.services.DocumentAckService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/document-ack")
@CrossOrigin(origins = "*")
public class DocumentAckController {

    @Autowired
    SimpleEncryptorDecryptor simpleEncryptorDecryptor;

    private final DocumentAckService documentAckService;

    public DocumentAckController(DocumentAckService documentAckService) {
        this.documentAckService = documentAckService;
    }

    @PostMapping
    public ResponseEntity<DocumentAck> save(
            @RequestBody DocumentAck documentAck,
            HttpServletRequest request
    ) {
        DocumentAck saved = documentAckService.save(documentAck, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }


    @GetMapping
    public ResponseEntity<List<DocumentAck>> findAll() {
        return ResponseEntity.ok(documentAckService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocumentAck> findById(@PathVariable("id") String id) {
        String decId = simpleEncryptorDecryptor.simpleDecrypt(id);
        return ResponseEntity.ok(documentAckService.findById(decId));
    }

    @GetMapping("/employee/{empCode}")
    public ResponseEntity<List<DocumentAck>> findByEmpCode(@PathVariable String empCode) {
        String decEmpCode = simpleEncryptorDecryptor.simpleDecrypt(empCode);
        return ResponseEntity.ok(documentAckService.findByEmpCode(decEmpCode));
    }
}