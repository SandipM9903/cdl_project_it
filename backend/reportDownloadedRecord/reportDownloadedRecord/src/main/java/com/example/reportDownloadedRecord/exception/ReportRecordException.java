package com.example.reportDownloadedRecord.exception;

public class ReportRecordException extends RuntimeException {

    public ReportRecordException(String message) {
        super(message);
    }

    public ReportRecordException(String message, Throwable cause) {
        super(message, cause);
    }
}