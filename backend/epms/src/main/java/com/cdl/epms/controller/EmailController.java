package com.cdl.epms.controller;

import com.cdl.epms.dto.email.EmailRequest;
import com.cdl.epms.model.EmailTemplate;
import com.cdl.epms.repository.EmailJobRepository;
import com.cdl.epms.repository.EmailTemplateRepository;
import com.cdl.epms.service.services.EmailPreparationService;
import com.cdl.epms.service.services.EmailerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.cdl.epms.dto.notifications.EmailSendRequest;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import java.util.HashMap;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
public class EmailController {

    private final EmailPreparationService preparationService;
    private final EmailJobRepository jobRepository;
    private final EmailTemplateRepository templateRepository;
    private final EmailerService emailerService;

    @PostMapping("/send")
    public String sendMail(@RequestBody EmailRequest request) {
        // Log to verify what React is sending
        // System.out.println("Received Subject: " + request.getSubject());

        preparationService.prepareEmail(request);
        return "Email sent successfully";
    }

    @PostMapping("/unified/send")
    public ResponseEntity<Map<String, Object>> sendUnifiedEmail(@RequestBody EmailSendRequest request) {
        // Validate required fields
        if (request.getCycleId() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Cycle ID is required"));
        }

        if (request.getActionType() == null || request.getActionType().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Action Type is required"));
        }

        try {
            // Call the service to send emails asynchronously (DISABLED)
            // emailerService.sendUnifiedCycleEmail(
            //         request.getCycleId(),
            //         request.getActionType(),
            //         request.getCustomSubject(),
            //         request.getCustomBody(),
            //         request.getNewExpiryDate()
            // );

            Map<String, Object> response = new HashMap<>();
            response.put("status", "DISABLED");
            response.put("message", String.format("Bulk email notifications are disabled for action: %s", request.getActionType()));
            response.put("actionType", request.getActionType());
            response.put("cycleId", request.getCycleId());

            return ResponseEntity.accepted().body(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/acceptance-notification")
    public ResponseEntity<?> sendAcceptanceNotification(@RequestBody Map<String, String> payload) {
//        log.info("Received acceptance notification request for employee: {}", payload.get("employeeId"));

        emailerService.sendAcceptanceNotification(
                payload.get("employeeId"),
                payload.get("managerEmailId"),
                payload.get("employeeName"),
                payload.get("managerName"),
                payload.get("quarter"),
                payload.get("year"),
                payload.get("financialYear"),
                payload.get("acceptanceDate"),
                payload.get("acceptanceTime")
        );

        return ResponseEntity.ok(Map.of("success", true, "message", "Acceptance notification sent"));
    }

    @GetMapping("/template/{id}")
    public EmailTemplate getTemplate(@PathVariable Long id) {
        return templateRepository.findById(id).orElseThrow();
    }
}