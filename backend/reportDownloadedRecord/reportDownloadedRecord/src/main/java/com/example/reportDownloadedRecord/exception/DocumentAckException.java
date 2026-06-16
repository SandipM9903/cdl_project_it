package com.example.reportDownloadedRecord.exception;

public class DocumentAckException extends RuntimeException {

    public DocumentAckException(String message) {
        super(message);
    }

    public DocumentAckException(String message, Throwable cause) {
        super(message, cause);
    }
}
