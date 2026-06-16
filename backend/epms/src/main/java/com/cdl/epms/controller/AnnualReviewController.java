package com.cdl.epms.controller;

import com.cdl.epms.common.enums.AnnualReviewStatus;
import com.cdl.epms.dto.annualReview.AnnualReviewRequestDto;
import com.cdl.epms.dto.annualReview.DraftToSubmitDto;
import com.cdl.epms.dto.annualReview.HrSubmissionDto;
import com.cdl.epms.dto.annualReview.UpdateAnnualReviewDto;
import com.cdl.epms.model.AnnualReview;
import com.cdl.epms.model.Certification;
import com.cdl.epms.model.Posh;
import com.cdl.epms.repository.AnnualReviewRepository;
import com.cdl.epms.repository.CertificationRepository;
import com.cdl.epms.repository.PoshRepository;
import com.cdl.epms.service.serviceImpl.AnnualReviewServiceImpl;
import com.cdl.epms.service.services.AnnualReviewService;
import com.cdl.epms.service.services.EmailerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/annual-review")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AnnualReviewController {

    private final AnnualReviewService annualReviewService;
    private final AnnualReviewRepository annualReviewRepository;
    private final EmailerService emailerService;
    private final PoshRepository poshRepository;
    private final CertificationRepository certificationRepository;

    @PostMapping(value = "/draft/save", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> saveDraft(@RequestPart(value = "dto") AnnualReviewRequestDto dto,
                                       @RequestPart(value = "poshCertificate", required = false)MultipartFile poshCertificate,
                                       @RequestPart(value = "certificateFiles", required = false)List<MultipartFile> certificatesFiles) throws IOException {
        log.info("Received draft save request - Employee: {}, FinancialYear: {}", dto.getEmployeeId(), dto.getFinancialYear());
        annualReviewService.saveDraft(dto, poshCertificate, certificatesFiles);
        return ResponseEntity.ok(Map.of("success", true, "message", "Draft saved successfully"));
    }

    @PostMapping(value = "/submit", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> submitReview(@RequestPart(value = "dto") AnnualReviewRequestDto dto,
                                          @RequestPart(value = "poshCertificate", required = true)MultipartFile poshCertificate,
                                          @RequestPart(value = "certificateFiles", required = false) List<MultipartFile> certificatesFiles) throws IOException {
        log.info("Received submit request - Employee: {}, FinancialYear: {}", dto.getEmployeeId(), dto.getFinancialYear());

        // Submit the review and get the review ID
        Long reviewId = annualReviewService.submitReview(dto, poshCertificate, certificatesFiles);

        // Send notification to EMPLOYEE (Template 11)
        try {
            emailerService.sendEmployeeGSSubmissionNotification(
                    reviewId,
                    dto.getEmployeeId(),
                    dto.getManagerId(),
                    dto.getFinancialYear()
            );
            log.info("Employee submission confirmation sent to: {}", dto.getEmployeeId());
        } catch (Exception e) {
            log.error("Failed to send employee confirmation email: {}", e.getMessage());
        }

        // Send notification to MANAGER (Template 12)
        try {
            emailerService.sendManagerGSSubmissionNotification(
                    reviewId,
                    dto.getEmployeeId(),
                    dto.getManagerId(),
                    dto.getFinancialYear()
            );
            log.info("Manager notification sent for employee: {}", dto.getEmployeeId());
        } catch (Exception e) {
            log.error("Failed to send manager notification email: {}", e.getMessage());
        }

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Goal Setting submitted to R1 successfully",
                "reviewId", reviewId
        ));
    }

    @GetMapping("/draft/employee/{empId}")
    public ResponseEntity<?> getDraft(
            @PathVariable String empId,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String financialYear) {

        log.info("Fetching draft - Employee: {}, Year: {}, FinancialYear: {}", empId, year, financialYear);

        Object result;
        if (financialYear != null) {
            // Use the new method if financialYear is provided
            result = ((AnnualReviewServiceImpl) annualReviewService).getDraftByFinancialYear(empId, financialYear);
        } else {
            result = annualReviewService.getDraft(empId, year);
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{empId}/{year}")
    public ResponseEntity<?> getFullReview(
            @PathVariable String empId,
            @PathVariable Integer year) {
        log.info("Fetching full review - Employee: {}, Year: {}", empId, year);
        return ResponseEntity.ok(annualReviewService.getFullReview(empId, year));
    }

    // New endpoint to get full review by financial year
    @GetMapping("/by-financial-year/{empId}/{financialYear}")
    public ResponseEntity<?> getFullReviewByFinancialYear(
            @PathVariable String empId,
            @PathVariable String financialYear) {
        log.info("Fetching full review - Employee: {}, FinancialYear: {}", empId, financialYear);
        Object result = ((AnnualReviewServiceImpl) annualReviewService).getFullReviewByFinancialYear(empId, financialYear);
        return ResponseEntity.ok(result);
    }

    // Manager endpoints
    @GetMapping("/manager/draft/{reviewId}")
    public ResponseEntity<?> getManagerDraft(@PathVariable Long reviewId) {
        return ResponseEntity.ok(annualReviewService.getManagerDraft(reviewId));
    }

    @GetMapping("/manager/{empId}/{year}")
    public ResponseEntity<?> getManagerReview(
            @PathVariable String empId,
            @PathVariable Integer year) {
        return ResponseEntity.ok(annualReviewService.getManagerReview(empId, year));
    }

    // New endpoint to get manager review by financial year
    @GetMapping("/manager/by-financial-year/{empId}/{financialYear}")
    public ResponseEntity<?> getManagerReviewByFinancialYear(
            @PathVariable String empId,
            @PathVariable String financialYear) {
        log.info("Fetching manager review - Employee: {}, FinancialYear: {}", empId, financialYear);
        return ResponseEntity.ok(((AnnualReviewServiceImpl) annualReviewService).getFullReviewByFinancialYear(empId, financialYear));
    }

    @PutMapping("/manager/draft/save")
    public ResponseEntity<?> saveManagerDraft(@RequestBody UpdateAnnualReviewDto dto) {
        annualReviewService.saveManagerDraft(dto);
        return ResponseEntity.ok("Manager draft saved successfully");
    }

    @PutMapping("/manager/submit-to-employee")
    public ResponseEntity<?> submitToEmployee(@RequestBody UpdateAnnualReviewDto dto) {
        log.info("Submitting manager review to employee for review ID: {}", dto.getId());

        annualReviewService.submitToEmployee(dto);

        // Send email notification to employee
        try {
            // Get the review to get employee and manager details
            AnnualReview review = annualReviewRepository.findById(dto.getId())
                    .orElseThrow(() -> new RuntimeException("Review not found with ID: " + dto.getId()));

            // Use financialYear from DTO first, then from review, then construct from year
            String financialYear = dto.getFinancialYear();
            if (financialYear == null) {
                financialYear = review.getFinancialYear();
            }
            if (financialYear == null && review.getYear() != null) {
                financialYear = review.getYear() + "-" + (review.getYear() + 1);
            }

            log.info("Sending email notification - Review ID: {}, Employee ID: {}, Financial Year: {}",
                    dto.getId(), review.getEmployeeId(), financialYear);

            emailerService.sendManagerReviewSubmittedToEmployeeNotification(
                    dto.getId(),
                    review.getEmployeeId(),
                    review.getManagerId(),
                    financialYear
            );
            log.info("Email notification sent to employee: {}", review.getEmployeeId());
        } catch (Exception e) {
            log.error("Failed to send email notification to employee: {}", e.getMessage());
            // Don't fail the submission if email fails
        }

        return ResponseEntity.ok("Manager review submitted to employee successfully");
    }

    @PutMapping("/manager/update")
    public ResponseEntity<?> updateManagerReview(@RequestBody UpdateAnnualReviewDto dto) {
        return ResponseEntity.ok(annualReviewService.updateManagerReview(dto));
    }

    @PutMapping("/submit-to-hr/{reviewId}")
    public ResponseEntity<?> submitToHr(@PathVariable Long reviewId, @RequestBody HrSubmissionDto dto) {
        log.info("Submitting annual review to HR for review ID: {}", reviewId);

        dto.setId(reviewId);
        annualReviewService.submitToHr(dto);

        // Send email notification to Employee about successful HR submission
        try {
            AnnualReview review = annualReviewRepository.findById(reviewId)
                    .orElseThrow(() -> new RuntimeException("Review not found with ID: " + reviewId));

            String financialYear = review.getFinancialYear();
            if (financialYear == null && review.getYear() != null) {
                financialYear = review.getYear() + "-" + (review.getYear() + 1);
            }

            emailerService.sendHRSubmissionNotification(
                    reviewId,
                    review.getEmployeeId(),
                    financialYear
            );
            log.info("HR submission confirmation email sent to employee: {}", review.getEmployeeId());
        } catch (Exception e) {
            log.error("Failed to send HR submission email: {}", e.getMessage());
            // Don't fail the submission if email fails
        }

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Review submitted to HR successfully",
                "data", Map.of("reviewId", reviewId)
        ));
    }

    @GetMapping("/hr/reviews")
    public ResponseEntity<?> getHrReviews(@RequestParam(required = false) Integer year) {
        return ResponseEntity.ok(annualReviewService.getHrReviews(year));
    }

    // New endpoint to get HR reviews by financial year
    @GetMapping("/hr/reviews/by-financial-year")
    public ResponseEntity<?> getHrReviewsByFinancialYear(@RequestParam String financialYear) {
        log.info("Fetching HR reviews for financialYear: {}", financialYear);
        return ResponseEntity.ok(annualReviewService.getHrReviews(null)); // Will filter in service
    }

    @GetMapping("/hr/review/{reviewId}")
    public ResponseEntity<?> getHrReviewDetails(@PathVariable Long reviewId) {
        return ResponseEntity.ok(annualReviewService.getHrReviewDetails(reviewId));
    }

    @PutMapping("/hr/approve/{reviewId}")
    public ResponseEntity<?> hrApproveReview(
            @PathVariable Long reviewId,
            @RequestParam Boolean approved,
            @RequestParam(required = false) String remarks) {
        annualReviewService.hrApproveOrReject(reviewId, approved, remarks);
        return ResponseEntity.ok(approved ? "Review approved successfully" : "Review rejected successfully");
    }

    @PutMapping("/send-back-to-r1/{reviewId}")
    public ResponseEntity<?> sendBackToR1(
            @PathVariable Long reviewId,
            @RequestParam(required = false) String remarks,
            @RequestParam(required = false) Boolean discussedWithR1,
            @RequestParam(required = false) Integer sendBackCount) {

        log.info("Received send-back request for review ID: {}, Remarks: {}, SendBackCount: {}",
                reviewId, remarks, sendBackCount);

        try {
            AnnualReview review = annualReviewRepository.findById(reviewId)
                    .orElseThrow(() -> new RuntimeException("Review not found with ID: " + reviewId));

            int currentCount = review.getSendBackCount() != null ? review.getSendBackCount() : 0;
            int newCount = sendBackCount != null ? sendBackCount : currentCount + 1;

            if (newCount > 2) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Maximum send back limit of 2 reached. Please submit directly to HR.",
                        "sendBackCount", currentCount,
                        "isAllowed", false
                ));
            }

            boolean isLastAttempt = newCount == 2;

            // Update send back count and remarks
            review.setSendBackCount(newCount);
            review.setLastSendBackAt(LocalDateTime.now());
            review.setSendBackRemarks(remarks);
            review.setDiscussedWithR1(discussedWithR1 != null ? discussedWithR1 : false);
            review.setEmployeeComment(false);
            review.setEmployeeCommentText(null);
            review.setHrRemarks(remarks);
            review.setUpdatedAt(LocalDateTime.now());

            annualReviewRepository.save(review);
            log.info("Send back count increased to {}/2 for review ID: {}. Status unchanged: {}",
                    newCount, reviewId, review.getStatus());

            // Send email notifications to both Manager and Employee
            try {
                String financialYear = review.getFinancialYear();
                if (financialYear == null && review.getYear() != null) {
                    financialYear = review.getYear() + "-" + (review.getYear() + 1);
                }

                emailerService.sendSendBackNotifications(
                        reviewId,
                        review.getEmployeeId(),
                        review.getManagerId(),
                        financialYear,
                        remarks,
                        newCount
                );
                log.info("Send back email notifications sent for review: {}", reviewId);
            } catch (Exception e) {
                log.error("Failed to send email notifications for review: {}", reviewId, e);
            }

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", String.format("Send back count increased to %d/2", newCount),
                    "data", Map.of(
                            "reviewId", reviewId,
                            "sendBackCount", newCount,
                            "remainingAttempts", 2 - newCount,
                            "isLastAttempt", isLastAttempt,
                            "isAllowed", true
                    )
            ));

        } catch (Exception e) {
            log.error("Error in sendBackToR1: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @PutMapping("/update-discussion-status/{reviewId}")
    public ResponseEntity<?> updateDiscussionStatus(
            @PathVariable Long reviewId,
            @RequestBody Map<String, Object> payload) {
        Boolean discussedWithR1 = (Boolean) payload.get("discussedWithR1");
        String status = (String) payload.get("status");

        AnnualReview review = annualReviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (discussedWithR1 != null) {
            review.setDiscussedWithR1(discussedWithR1);
        }
        if (status != null) {
            review.setStatus(AnnualReviewStatus.valueOf(status));
        }
        review.setUpdatedAt(LocalDateTime.now());

        annualReviewRepository.save(review);
        return ResponseEntity.ok("Discussion status updated successfully");
    }

    @GetMapping("/all/{annualReviewId}")
    public ResponseEntity<?> getAllDocumentIds(@PathVariable Long annualReviewId) {
        log.info("Fetching all document IDs (POSH and Certifications) for annualReviewId: {}", annualReviewId);

        try {
            // Get POSH document - FIXED: Handle Optional correctly
            Optional<Posh> poshOptional = poshRepository.findByAnnualReviewId(annualReviewId);
            Posh posh = poshOptional.orElse(null);
            Long poshDocId = posh != null ? posh.getPoshDocId() : null;

            // Get certification documents
            List<Certification> certifications = certificationRepository.findByAnnualReviewId(annualReviewId);

            List<Map<String, Object>> certificationList = certifications != null ?
                    certifications.stream()
                            .map(cert -> {
                                Map<String, Object> certMap = new HashMap<>();
                                certMap.put("id", cert.getId());
                                certMap.put("name", cert.getName());
                                certMap.put("type", cert.getType());
                                certMap.put("fileName", cert.getFileName());
                                certMap.put("certificateDocId", cert.getCertificateDocId());
                                return certMap;
                            })
                            .collect(Collectors.toList()) : List.of();

            Map<String, Object> responseData = new HashMap<>();
            responseData.put("annualReviewId", annualReviewId);
            responseData.put("poshDocId", poshDocId);
            responseData.put("certifications", certificationList);
            responseData.put("totalCertifications", certificationList.size());

            if (posh != null) {
                responseData.put("poshId", posh.getId());
                responseData.put("poshCreatedAt", posh.getCreatedAt());
            }

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "All document IDs retrieved successfully",
                    "data", responseData
            ));

        } catch (Exception e) {
            log.error("Error fetching document IDs: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "message", "Failed to fetch document IDs: " + e.getMessage()
            ));
        }
    }

    @PostMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateDraft(
            @PathVariable Long id,
            @RequestPart(value = "dto") AnnualReviewRequestDto dto,
            @RequestPart(value = "poshCertificate", required = false) MultipartFile poshCertificate,
            @RequestPart(value = "certificateFiles", required = false) List<MultipartFile> certificatesFiles) throws IOException {
        log.info("Received update request - Employee: {}, ReviewId: {}", dto.getEmployeeId(), id);
        dto.setId(id);
        annualReviewService.updateDraft(id, dto, poshCertificate, certificatesFiles);
        return ResponseEntity.ok(Map.of("success", true, "message", "Draft updated successfully"));
    }

    @PostMapping("/update-and-submit")
    public ResponseEntity<?> draftToSubmit(@RequestBody DraftToSubmitDto draftToSubmitDto) {
        AnnualReview dto = annualReviewService.draftToSubmit(draftToSubmitDto);
        // Send notification to EMPLOYEE (Template 11)
        try {
            emailerService.sendEmployeeGSSubmissionNotification(
                    draftToSubmitDto.getId(),
                    dto.getEmployeeId(),
                    dto.getManagerId(),
                    dto.getFinancialYear()
            );
            log.info("Employee submission confirmation sent to: {}", dto.getEmployeeId());
        } catch (Exception e) {
            log.error("Failed to send employee confirmation email: {}", e.getMessage());
        }

        // Send notification to MANAGER (Template 12)
        try {
            emailerService.sendManagerGSSubmissionNotification(
                    draftToSubmitDto.getId(),
                    dto.getEmployeeId(),
                    dto.getManagerId(),
                    dto.getFinancialYear()
            );
            log.info("Manager notification sent for employee: {}", dto.getEmployeeId());
        } catch (Exception e) {
            log.error("Failed to send manager notification email: {}", e.getMessage());
        }

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Goal Setting submitted to R1 successfully",
                "reviewId", draftToSubmitDto.getId()
        ));
    }
}