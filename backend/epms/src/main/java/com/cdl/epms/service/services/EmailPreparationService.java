package com.cdl.epms.service.services;

import com.cdl.epms.common.enums.EmailerStatus;
import com.cdl.epms.dto.email.EmailRequest;
import com.cdl.epms.model.EmailJob;
import com.cdl.epms.model.EmailTemplate;
import com.cdl.epms.repository.EmailJobRepository;
import com.cdl.epms.repository.EmailTemplateRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailPreparationService {

    private final EmailTemplateRepository templateRepo;
    private final TemplateService templateService;
    private final EmailJobRepository jobRepository;
    private final EmailService emailService;

    public EmailJob prepareEmail(EmailRequest request) {

        log.info("========== EMAIL PREPARATION STARTED ==========");
        log.info("To: {}, TemplateId: {}, UniqueKey: {}", request.getTo(), request.getTemplateId(), request.getUniqueKey());
        log.info("Has custom subject: {}, Has custom body: {}",
                request.getSubject() != null && !request.getSubject().isEmpty(),
                request.getBody() != null && !request.getBody().isEmpty());

        String rawBody;
        String rawSubject;

        // PRIORITY 1: Use custom subject/body if provided directly in request
        if (request.getSubject() != null && !request.getSubject().trim().isEmpty() &&
                request.getBody() != null && !request.getBody().trim().isEmpty()) {

            log.info("✅ Using CUSTOM subject and body provided directly in request");
            log.info("Custom Subject: {}", request.getSubject());
            rawSubject = request.getSubject();
            rawBody = request.getBody();

        }
        // PRIORITY 2: Use custom values OR fallback to template from database
        else {
            log.info("Fetching template from database (ID: {}) as fallback", request.getTemplateId());
            EmailTemplate template = templateRepo.findById(request.getTemplateId())
                    .orElseThrow(() -> new RuntimeException("Template not found with id: " + request.getTemplateId()));

            rawSubject = (request.getSubject() != null && !request.getSubject().isEmpty())
                    ? request.getSubject()
                    : template.getSubject();

            rawBody = (request.getBody() != null && !request.getBody().isEmpty())
                    ? request.getBody()
                    : template.getBody();

            log.info("Using subject from: {}", (request.getSubject() != null && !request.getSubject().isEmpty()) ? "CUSTOM" : "TEMPLATE");
            log.info("Using body from: {}", (request.getBody() != null && !request.getBody().isEmpty()) ? "CUSTOM" : "TEMPLATE");
        }

        // Process template with variables (replace placeholders like {{employeeName}} etc.)
        String processedBody = templateService.processTemplate(rawBody, request.getVariables());
        String processedSubject = templateService.processTemplate(rawSubject, request.getVariables());

        log.info("Final processed subject to be sent: {}", processedSubject);
        log.info("Processed body starts with: {}", processedBody != null && processedBody.length() > 100 ? processedBody.substring(0, 100) : processedBody);

        // SEND EMAIL IMMEDIATELY
        try {
            // Check if the body contains HTML tags - more comprehensive check
            boolean isHtml = processedBody != null && (
                    processedBody.trim().startsWith("<!DOCTYPE html>") ||
                            processedBody.trim().startsWith("<html") ||
                            processedBody.contains("<body") ||
                            processedBody.contains("<div") ||
                            processedBody.contains("<p") ||
                            processedBody.contains("<table") ||
                            processedBody.contains("<strong") ||
                            processedBody.contains("<h1") ||
                            processedBody.contains("<h2") ||
                            processedBody.contains("<h3") ||
                            processedBody.contains("<ul") ||
                            processedBody.contains("<ol")
            );

            if (isHtml) {
                log.info("Detected HTML content, sending as HTML email to: {}", request.getTo());
                emailService.sendHtmlEmail(request.getTo(), processedSubject, processedBody);
            } else {
                log.info("Detected plain text content, sending as plain text email to: {}", request.getTo());
                emailService.sendEmail(request.getTo(), processedSubject, processedBody);
            }
            log.info("✅ EMAIL SENT SUCCESSFULLY to: {}", request.getTo());
        } catch (Exception e) {
            log.error("❌ FAILED to send email to: {}", request.getTo(), e);
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }

        // Save to database for record keeping
        EmailJob job = new EmailJob();
        job.setToEmail(request.getTo());
        job.setSubject(processedSubject);
        job.setBody(processedBody);
        job.setScheduledTime(LocalDateTime.now());
        job.setStatus(EmailerStatus.NOT_STARTED);
        job.setSent(true);
        job.setProcessedAt(LocalDateTime.now());

        if (request.getCycleId() != null) {
            job.setCycleId(request.getCycleId());
            job.setReminderType(request.getReminderType());
            job.setUniqueKey(request.getUniqueKey());
        }

        EmailJob savedJob = jobRepository.save(job);
        log.info("Email record saved to database with id: {}", savedJob.getId());
        log.info("========== EMAIL PREPARATION COMPLETED ==========");

        return savedJob;
    }
}