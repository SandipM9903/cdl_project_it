package com.cdl.epms.service.services;

import java.util.List;
import java.util.Map;

public interface EmailService {
    void sendEmail(String to, String subject, String body);
    void sendHtmlEmail(String to, String subject, String htmlBody);
}