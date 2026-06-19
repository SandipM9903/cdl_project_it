package com.cdl.epms.service.serviceImpl;

import com.cdl.epms.common.enums.AnnualReviewStatus;
import com.cdl.epms.dto.annualReview.*;
import com.cdl.epms.model.*;
import com.cdl.epms.repository.*;
import com.cdl.epms.service.services.AnnualReviewService;
import com.cms.cdl.common_dtos.dto.document_dto.DocumentDTO;
import com.cms.cdl.common_dtos.util.dms.DocumentOperations;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AnnualReviewServiceImpl implements AnnualReviewService {

    private final AnnualReviewRepository annualReviewRepository;
    private final CertificationRepository certificationRepository;
    private final DocumentOperations documentOperations;
    private final PoshRepository poshRepository;

    private Integer extractYearFromFinancialYear(String financialYear) {
        if (financialYear == null || financialYear.trim().isEmpty()) {
            return null;
        }
        if (financialYear.contains("-")) {
            try {
                return Integer.parseInt(financialYear.split("-")[0]);
            } catch (NumberFormatException e) {
                log.warn("Failed to parse year from financialYear: {}", financialYear);
                return null;
            }
        }
        return null;
    }

    @Override
    @Transactional
    public Long saveDraft(AnnualReviewRequestDto dto, MultipartFile poshCertificate, List<MultipartFile> certificatesFiles) throws IOException {
        if (dto.getManagerId() == null || dto.getManagerId().trim().isEmpty()) {
            log.error("Manager ID is required but was null for employee: {}", dto.getEmployeeId());
            throw new RuntimeException("Manager ID is required to save draft");
        }

        if (dto.getFinancialYear() == null || dto.getFinancialYear().trim().isEmpty()) {
            log.error("Financial year is required for employee: {}", dto.getEmployeeId());
            throw new RuntimeException("Financial year is required to save draft");
        }

        return saveOrUpdate(dto, poshCertificate, certificatesFiles, AnnualReviewStatus.DRAFT);
    }

    @Override
    @Transactional
    public Long updateDraft(Long id,
                            AnnualReviewRequestDto dto,
                            MultipartFile poshCertificate,
                            List<MultipartFile> certificatesFiles)
            throws IOException {

        AnnualReview review = annualReviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));

        // ================= BASIC UPDATE =================
        review.setManagerId(dto.getManagerId());
        review.setKeyAccomplishment(dto.getKeyAccomplishment());
        review.setUseNAOption(dto.getUseNAOption() != null ? dto.getUseNAOption() : false);

        annualReviewRepository.save(review);

        DocumentDTO documentDTO = new DocumentDTO();
        documentDTO.setEmpCode(dto.getEmployeeId());

        // =====================================================
        // POSH UPDATE (Same as before)
        // =====================================================
        if (poshCertificate != null && !poshCertificate.isEmpty()) {
            Optional<Posh> poshOpt = poshRepository.findByAnnualReviewId(review.getId());
            Posh posh;

            if (poshOpt.isPresent()) {
                posh = poshOpt.get();
                if (posh.getPoshDocId() != null) {
                    documentOperations.deleteDocument(posh.getPoshDocId());
                }
            } else {
                posh = new Posh();
                posh.setAnnualReviewId(review.getId());
            }

            Long newDocId = documentOperations
                    .uploadDocument(documentDTO, poshCertificate)
                    .get(0)
                    .getDocId();

            posh.setPoshDocId(newDocId);
            poshRepository.save(posh);
        }

        // =====================================================
        // CERTIFICATION UPDATE - FIXED: ONLY ADD NEW, NEVER DELETE EXISTING
        // =====================================================

        List<AnnualReviewRequestDto.CertificationDto> certDtos = dto.getCertifications();

        // If NA option is selected, delete ALL certifications
        if (dto.getUseNAOption() != null && dto.getUseNAOption()) {
            List<Certification> existingCerts = certificationRepository.findByAnnualReviewId(review.getId());
            for (Certification existing : existingCerts) {
                if (existing.getCertificateDocId() != null) {
                    documentOperations.deleteDocument(existing.getCertificateDocId());
                }
            }
            certificationRepository.deleteByAnnualReviewId(review.getId());
            return review.getId();
        }

        // Process certifications - ONLY ADD NEW ONES, DON'T DELETE EXISTING
        if (certDtos != null && !certDtos.isEmpty()) {
            int fileIndex = 0;

            for (AnnualReviewRequestDto.CertificationDto certDto : certDtos) {
                // Get the corresponding file for this certification
                MultipartFile certFile = (certificatesFiles != null && fileIndex < certificatesFiles.size())
                        ? certificatesFiles.get(fileIndex) : null;
                fileIndex++;

                // Handle existing certification (has ID)
                if (certDto.getId() != null) {
                    log.info("Updating existing certification ID: {} with potential new file/details", certDto.getId());
                    Optional<Certification> existingCertOpt = certificationRepository.findById(certDto.getId());
                    if (existingCertOpt.isPresent()) {
                        Certification existingCert = existingCertOpt.get();
                        
                        // Update basic details if changed/provided
                        if (certDto.getName() != null && !certDto.getName().trim().isEmpty()) {
                            existingCert.setName(certDto.getName().trim());
                        }
                        if (certDto.getType() != null && !certDto.getType().trim().isEmpty()) {
                            existingCert.setType(certDto.getType().trim());
                        }
                        
                        // If a new file is attached/reuploaded, replace the old doc
                        if (certFile != null && !certFile.isEmpty()) {
                            if (existingCert.getCertificateDocId() != null) {
                                try {
                                    documentOperations.deleteDocument(existingCert.getCertificateDocId());
                                    log.info("Deleted old certificate document ID: {}", existingCert.getCertificateDocId());
                                } catch (Exception e) {
                                    log.error("Failed to delete old certificate document: {}", e.getMessage());
                                }
                            }
                            
                            Long newDocId = documentOperations
                                    .uploadDocument(documentDTO, certFile)
                                    .get(0)
                                    .getDocId();
                            
                            existingCert.setCertificateDocId(newDocId);
                            existingCert.setFileName(certFile.getOriginalFilename());
                            log.info("Uploaded new certificate file: {} with doc ID: {}", certFile.getOriginalFilename(), newDocId);
                        }
                        
                        certificationRepository.save(existingCert);
                    } else {
                        log.warn("Certification with ID {} not found", certDto.getId());
                    }
                    continue; // Done with this one, move to next DTO
                }

                // Only process NEW certifications (id is null)
                if (certDto.getName() == null || certDto.getName().trim().isEmpty()) {
                    log.warn("Skipping new certification with missing name");
                    continue;
                }

                if (certDto.getType() == null || certDto.getType().trim().isEmpty()) {
                    log.warn("Skipping new certification with missing type for name: {}", certDto.getName());
                    continue;
                }

                if (certFile == null || certFile.isEmpty()) {
                    log.warn("Skipping new certification without file: {}", certDto.getName());
                    continue;
                }

                // Create BRAND NEW certification
                Certification certification = new Certification();
                certification.setAnnualReviewId(review.getId());
                certification.setName(certDto.getName().trim());
                certification.setType(certDto.getType().trim());

                // Upload file
                Long docId = documentOperations
                        .uploadDocument(documentDTO, certFile)
                        .get(0)
                        .getDocId();

                certification.setCertificateDocId(docId);
                certification.setFileName(certFile.getOriginalFilename());

                certificationRepository.save(certification);
                log.info("Added NEW certification: {} with document ID: {}", certification.getName(), docId);
            }
        }

        log.info("Successfully updated draft for review ID: {} - kept all existing certifications, added new ones", review.getId());
        return review.getId();
    }

    @Override
    @Transactional
    public Long submitReview(AnnualReviewRequestDto dto, MultipartFile poshCertificate, List<MultipartFile> certificatesFiles) throws IOException {
        if (dto.getManagerId() == null || dto.getManagerId().trim().isEmpty()) {
            log.error("Manager ID is required but was null for employee: {}", dto.getEmployeeId());
            throw new RuntimeException("Manager ID is required to submit review");
        }

        if (dto.getFinancialYear() == null || dto.getFinancialYear().trim().isEmpty()) {
            log.error("Financial year is required for employee: {}", dto.getEmployeeId());
            throw new RuntimeException("Financial year is required to submit review");
        }

        if (dto.getKeyAccomplishment() == null || dto.getKeyAccomplishment().trim().isEmpty()) {
            throw new RuntimeException("Key accomplishment is required for submission");
        }

        return saveOrUpdate(dto, poshCertificate, certificatesFiles, AnnualReviewStatus.SUBMITTED_TO_R1);
    }

    private Long saveOrUpdate(AnnualReviewRequestDto dto, MultipartFile poshCertificate, List<MultipartFile> certificatesFiles, AnnualReviewStatus status) throws IOException {

        log.info("Saving annual review for employee: {}, financialYear: {}, status: {}, managerId: {}",
                dto.getEmployeeId(), dto.getFinancialYear(), status, dto.getManagerId());

        if (dto.getManagerId() == null || dto.getManagerId().trim().isEmpty()) {
            throw new RuntimeException("Manager ID is required");
        }

        if (dto.getFinancialYear() == null || dto.getFinancialYear().trim().isEmpty()) {
            throw new RuntimeException("Financial year is required");
        }

        if (status != AnnualReviewStatus.DRAFT) {
            if (poshCertificate == null || poshCertificate.isEmpty()) {
                log.error("POSH certificate is required but was null or empty for employee: {}", dto.getEmployeeId());
                throw new RuntimeException("POSH certificate is required");
            }
        }

        Integer year = extractYearFromFinancialYear(dto.getFinancialYear());

        Optional<AnnualReview> existingReviewOpt =
                annualReviewRepository.findByEmployeeIdAndFinancialYear(
                        dto.getEmployeeId(),
                        dto.getFinancialYear()
                );

        AnnualReview review;

        if (existingReviewOpt.isPresent()) {
            review = existingReviewOpt.get();
            log.info("Found existing review with ID: {} for financialYear: {}",
                    review.getId(),
                    dto.getFinancialYear());
        } else {
            review = new AnnualReview();
            log.info("Creating new review for employee: {}, financialYear: {}",
                    dto.getEmployeeId(),
                    dto.getFinancialYear());
        }

        review.setEmployeeId(dto.getEmployeeId());
        review.setManagerId(dto.getManagerId());
        review.setFinancialYear(dto.getFinancialYear());
        review.setYear(year);
        review.setStatus(status);
        review.setUseNAOption(dto.getUseNAOption() != null ? dto.getUseNAOption() : false);

        if (dto.getKeyAccomplishment() != null) {
            review.setKeyAccomplishment(dto.getKeyAccomplishment());
        }

        if (status == AnnualReviewStatus.SUBMITTED_TO_R1) {
            review.setSubmittedAt(LocalDateTime.now());
        }

        final AnnualReview savedReview = annualReviewRepository.save(review);

        log.info("Saved annual review with ID: {}", savedReview.getId());

        // Delete old certifications and POSH
        certificationRepository.deleteByAnnualReviewId(savedReview.getId());
        if (poshCertificate != null && !poshCertificate.isEmpty()) {
            poshRepository.findByAnnualReviewId(savedReview.getId()).ifPresent(poshRepository::delete);
        }

        DocumentDTO documentDTO = new DocumentDTO();
        documentDTO.setEmpCode(dto.getEmployeeId());

        if (poshCertificate != null && !poshCertificate.isEmpty()) {
            // Save POSH Certificate
            log.info("Uploading POSH document for employee: {}", dto.getEmployeeId());

            Long poshDocId = documentOperations
                    .uploadDocument(documentDTO, poshCertificate)
                    .get(0)
                    .getDocId();

            log.info("POSH uploaded successfully. DocId: {}", poshDocId);

            Posh posh = new Posh();
            posh.setAnnualReviewId(savedReview.getId());
            posh.setPoshDocId(poshDocId);
            poshRepository.save(posh);

            log.info("POSH saved successfully with docId: {}", poshDocId);
        }

        // Save Certifications
        List<AnnualReviewRequestDto.CertificationDto> certDtos = dto.getCertifications();

        if (certDtos != null && !certDtos.isEmpty()) {
            if (certificatesFiles == null || certificatesFiles.size() != certDtos.size()) {
                log.error("Mismatch: Found {} certification DTOs but {} files provided",
                        certDtos.size(), certificatesFiles == null ? 0 : certificatesFiles.size());
                throw new RuntimeException("Mismatch between number of certification details and uploaded files");
            }

            List<Certification> certs = new ArrayList<>();

            for (int i = 0; i < certDtos.size(); i++) {
                AnnualReviewRequestDto.CertificationDto certDto = certDtos.get(i);
                MultipartFile certFile = certificatesFiles.get(i);

                if (certDto == null) continue;

                if (certDto.getName() == null || certDto.getName().trim().isEmpty()) {
                    log.warn("Skipping certification at index {} with missing name", i);
                    continue;
                }

                if (certDto.getType() == null || certDto.getType().trim().isEmpty()) {
                    log.warn("Skipping certification with missing type for name: {}", certDto.getName());
                    continue;
                }

                Long docId = null;
                String fileName = null;

                if (certFile != null && !certFile.isEmpty()) {
                    try {
                        fileName = certFile.getOriginalFilename();

                        if (certFile.getSize() > 1024L * 1024 * 1024) {
                            log.warn("File too large for certification: {}, size: {} bytes", certDto.getName(), certFile.getSize());
                            throw new RuntimeException("File size exceeds 1GB limit for certification: " + certDto.getName());
                        }

                        docId = documentOperations
                                .uploadDocument(documentDTO, certFile)
                                .get(0)
                                .getDocId();

                        log.info("Uploaded certification file for {} with docId: {}", certDto.getName(), docId);
                    } catch (Exception e) {
                        log.error("Failed to upload certification file for {}: {}", certDto.getName(), e.getMessage());
                        throw new RuntimeException("Failed to upload certification file for: " + certDto.getName(), e);
                    }
                } else {
                    log.warn("No file found for certification: {}", certDto.getName());
                    throw new RuntimeException("Certificate file is required for: " + certDto.getName());
                }

                Certification certification = Certification.builder()
                        .annualReviewId(savedReview.getId())
                        .name(certDto.getName().trim())
                        .type(certDto.getType().trim())
                        .fileName(fileName)
                        .certificateDocId(docId)
                        .build();

                certs.add(certification);
            }

            if (!certs.isEmpty()) {
                certificationRepository.saveAll(certs);
                log.info("Saved {} certifications", certs.size());
            }
        } else {
            log.info("No certifications to save for review ID: {}", savedReview.getId());
        }

        log.info("Successfully completed annual review save/update for ID: {}", savedReview.getId());

        return savedReview.getId();
    }

    @Override
    @Transactional
    public void saveManagerDraft(UpdateAnnualReviewDto dto) {
        log.info("Saving manager draft for review ID: {}", dto.getId());

        AnnualReview review = annualReviewRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Annual review not found with ID: " + dto.getId()));

        updateManagerFields(review, dto);
        review.setStatus(AnnualReviewStatus.DRAFT);
        review.setUpdatedAt(LocalDateTime.now());

        annualReviewRepository.save(review);
        log.info("Manager draft saved successfully for review ID: {}", review.getId());
    }

    @Override
    @Transactional
    public void submitToEmployee(UpdateAnnualReviewDto dto) {
        log.info("Submitting manager review to employee for review ID: {}", dto.getId());

        // Validate required fields
        if (dto.getManagerRating() == null || dto.getManagerRating().trim().isEmpty()) {
            throw new RuntimeException("Manager Rating is required");
        }

        // Validate Manager Rating value
        String managerRating = dto.getManagerRating();
        if (!Arrays.asList("A+", "A", "B+", "B", "C").contains(managerRating)) {
            throw new RuntimeException("Invalid Manager Rating value. Must be one of: A+, A, B+, B, C");
        }

        if (dto.getAchievementLevel() == null || dto.getAchievementLevel().trim().isEmpty()) {
            throw new RuntimeException("Achievement Level is required");
        }
        if (dto.getPotential() == null || dto.getPotential().trim().isEmpty()) {
            throw new RuntimeException("Potential is required");
        }
        if (dto.getPerformance() == null || dto.getPerformance().trim().isEmpty()) {
            throw new RuntimeException("Performance is required");
        }
        if (dto.getTalentResource() == null || dto.getTalentResource().trim().isEmpty()) {
            throw new RuntimeException("Talent Resource status is required");
        }
        if (dto.getManagerRemarks() == null || dto.getManagerRemarks().trim().isEmpty()) {
            throw new RuntimeException("Manager remarks are required");
        }

        // Calculate matrix category if not provided
        String matrixCategory = dto.getMatrixCategory();
        if (matrixCategory == null || matrixCategory.isEmpty()) {
            matrixCategory = calculateCategory(dto.getPotential(), dto.getPerformance());
        }

        AnnualReview review = annualReviewRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Annual review not found with ID: " + dto.getId()));

        updateManagerFields(review, dto);
        review.setManagerRating(dto.getManagerRating());
        review.setMatrixCategory(matrixCategory);
        review.setStatus(AnnualReviewStatus.SUBMITTED_TO_EMPLOYEE);
        review.setManagerAnnualReviewSubmissionDate(LocalDateTime.now());
        review.setUpdatedAt(LocalDateTime.now());

        annualReviewRepository.save(review);
        log.info("Manager review submitted to employee successfully for review ID: {}", review.getId());
    }

    @Override
    @Transactional
    public Object updateManagerReview(UpdateAnnualReviewDto dto) {
        log.info("Updating manager review for review ID: {}", dto.getId());

        AnnualReview review = annualReviewRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Annual review not found with ID: " + dto.getId()));

        updateManagerFields(review, dto);

        // Recalculate category if potential or performance changed
        if (dto.getPotential() != null || dto.getPerformance() != null) {
            String currentPotential = dto.getPotential() != null ? dto.getPotential() : review.getPotential();
            String currentPerformance = dto.getPerformance() != null ? dto.getPerformance() : review.getPerformance();
            review.setMatrixCategory(calculateCategory(currentPotential, currentPerformance));
        }

        review.setUpdatedAt(LocalDateTime.now());

        AnnualReview savedReview = annualReviewRepository.save(review);

        return getFullReviewResponse(savedReview);
    }

    @Override
    public Object getHrReviews(Integer year) {
        log.info("Fetching HR reviews for year: {}", year);

        String financialYear = year != null ? year + "-" + (year + 1) : null;

        List<AnnualReview> reviews;
        if (financialYear != null) {
            reviews = annualReviewRepository.findByStatusAndFinancialYear(AnnualReviewStatus.SUBMITTED_TO_HR, financialYear);
        } else {
            reviews = annualReviewRepository.findByStatus(AnnualReviewStatus.SUBMITTED_TO_HR);
        }

        List<Map<String, Object>> hrReviewList = new ArrayList<>();
        for (AnnualReview review : reviews) {
            Map<String, Object> hrReview = new HashMap<>();
            hrReview.put("id", review.getId());
            hrReview.put("employeeId", review.getEmployeeId());
            hrReview.put("financialYear", review.getFinancialYear());
            hrReview.put("year", review.getYear());
            hrReview.put("status", review.getStatus());
            hrReview.put("keyAccomplishment", review.getKeyAccomplishment());
            hrReview.put("managerRating", review.getManagerRating());
            hrReview.put("achievementLevel", review.getAchievementLevel());
            hrReview.put("potential", review.getPotential());
            hrReview.put("performance", review.getPerformance());
            hrReview.put("talentResource", review.getTalentResource());
            hrReview.put("matrixCategory", review.getMatrixCategory());
            hrReview.put("submittedToHrDate", review.getSubmittedToHrDate());
            hrReview.put("discussedWithR1", review.getDiscussedWithR1());
            hrReview.put("employeeComment", review.getEmployeeComment());
            hrReview.put("employeeCommentText", review.getEmployeeCommentText());
            hrReview.put("submittedToHrBy", review.getSubmittedToHrBy());
            hrReviewList.add(hrReview);
        }

        return hrReviewList;
    }

    @Override
    public Object getHrReviewDetails(Long reviewId) {
        log.info("Fetching HR review details for review ID: {}", reviewId);

        AnnualReview review = annualReviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with ID: " + reviewId));

        return getFullReviewResponse(review);
    }

    @Override
    @Transactional
    public void hrApproveOrReject(Long reviewId, Boolean approved, String hrRemarks) {
        log.info("HR {} review for review ID: {}", approved ? "approving" : "rejecting", reviewId);

        AnnualReview review = annualReviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with ID: " + reviewId));

        review.setHrRemarks(hrRemarks);

        if (approved) {
            review.setStatus(AnnualReviewStatus.COMPLETED);
            log.info("Annual review completed and approved for review ID: {}", reviewId);
        } else {
            review.setStatus(AnnualReviewStatus.SUBMITTED_TO_EMPLOYEE);
            log.info("Annual review rejected and sent back to employee for review ID: {}", reviewId);
        }

        review.setUpdatedAt(LocalDateTime.now());
        annualReviewRepository.save(review);
    }

    private String calculateCategory(String potential, String performance) {
        if (potential == null || performance == null) {
            return "";
        }

        Map<String, Integer> mapPotential = Map.of("High", 3, "Medium", 2, "Low", 1);
        Map<String, Integer> mapPerformance = Map.of("High", 3, "Average", 2, "Low", 1);

        Integer p = mapPotential.get(potential);
        Integer perf = mapPerformance.get(performance);

        if (p == null || perf == null) {
            return "";
        }

        if (p == 3 && perf == 3) return "⭐ Star";
        if (p == 3 && perf == 2) return "High Performer";
        if (p == 3 && perf == 1) return "High Potential";
        if (p == 2 && perf == 3) return "Potential Gem";
        if (p == 2 && perf == 2) return "Core Player";
        if (p == 2 && perf == 1) return "Solid Performer";
        if (p == 1 && perf == 3) return "Inconsistent Player";
        if (p == 1 && perf == 2) return "Average Performer";
        if (p == 1 && perf == 1) return "Risk";

        return "";
    }

    private void updateManagerFields(AnnualReview review, UpdateAnnualReviewDto dto) {
        if (dto.getManagerRating() != null) {
            review.setManagerRating(dto.getManagerRating());
        }
        if (dto.getAchievementLevel() != null) {
            review.setAchievementLevel(dto.getAchievementLevel());
        }
        if (dto.getPotential() != null) {
            review.setPotential(dto.getPotential());
            if (review.getPerformance() != null) {
                review.setMatrixCategory(calculateCategory(dto.getPotential(), review.getPerformance()));
            }
        }
        if (dto.getPerformance() != null) {
            review.setPerformance(dto.getPerformance());
            if (review.getPotential() != null) {
                review.setMatrixCategory(calculateCategory(review.getPotential(), dto.getPerformance()));
            }
        }
        if (dto.getTalentResource() != null) {
            review.setTalentResource(dto.getTalentResource());
        }
        if (dto.getMatrixCategory() != null) {
            review.setMatrixCategory(dto.getMatrixCategory());
        }
        if (dto.getNineBoxResult() != null) {
            review.setNineBoxResult(dto.getNineBoxResult());
        }
        if (dto.getTalentFlag() != null) {
            review.setTalentFlag(dto.getTalentFlag());
        }
        if (dto.getCriticalFlag() != null) {
            review.setCriticalFlag(dto.getCriticalFlag());
        }
        if (dto.getManagerRemarks() != null) {
            review.setManagerRemarks(dto.getManagerRemarks());
        }
        if (dto.getPerformanceRating() != null) {
            review.setPerformanceRating(dto.getPerformanceRating());
        }
        if (dto.getPotentialRating() != null) {
            review.setPotentialRating(dto.getPotentialRating());
        }
    }

    @Override
    public Object getDraft(String employeeId, Integer year) {
        log.info("Fetching draft for employee: {}, year: {}", employeeId, year);

        // Convert year to financial year
        String financialYear = year != null ? year + "-" + (year + 1) : null;

        return getDraftByFinancialYear(employeeId, financialYear);
    }

    public Object getDraftByFinancialYear(String employeeId, String financialYear) {
        log.info("Fetching draft for employee: {}, financialYear: {}", employeeId, financialYear);

        if (financialYear == null) {
            return Map.of(
                    "success", false,
                    "message", "Financial year is required",
                    "data", null
            );
        }

        AnnualReview review = annualReviewRepository
                .findByEmployeeIdAndFinancialYear(employeeId, financialYear)
                .orElse(null);

        if (review == null) {
            return Map.of(
                    "success", false,
                    "message", "No draft found",
                    "data", null
            );
        }

        List<Certification> certList = certificationRepository.findByAnnualReviewId(review.getId());

        List<Map<String, Object>> certifications = new ArrayList<>();
        for (Certification cert : certList) {
            certifications.add(Map.of(
                    "id", cert.getId(),
                    "name", cert.getName(),
                    "type", cert.getType(),
                    "fileName", cert.getFileName(),
                    "certificateDocId", cert.getCertificateDocId()
            ));
        }

        return Map.of(
                "success", true,
                "data", Map.of(
                        "id", review.getId(),
                        "managerId", review.getManagerId(),
                        "financialYear", review.getFinancialYear(),
                        "keyAccomplishment", review.getKeyAccomplishment() != null ? review.getKeyAccomplishment() : "",
                        "useNAOption", review.getUseNAOption() != null ? review.getUseNAOption() : false,
                        "certifications", certifications
                )
        );
    }

    @Override
    public Object getFullReview(String employeeId, Integer year) {
        log.info("Fetching full review for employee: {}, year: {}", employeeId, year);

        String financialYear = year != null ? year + "-" + (year + 1) : null;

        AnnualReview review = annualReviewRepository
                .findByEmployeeIdAndFinancialYear(employeeId, financialYear)
                .orElse(null);

        if (review == null) {
            return null;
        }

        return getFullReviewResponse(review);
    }

    public Object getFullReviewByFinancialYear(String employeeId, String financialYear) {
        log.info("Fetching full review for employee: {}, financialYear: {}", employeeId, financialYear);

        AnnualReview review = annualReviewRepository
                .findByEmployeeIdAndFinancialYear(employeeId, financialYear)
                .orElse(null);

        if (review == null) {
            return null;
        }

        return getFullReviewResponse(review);
    }

    @Override
    public Object getManagerReview(String employeeId, Integer year) {
        log.info("Fetching manager review for employee: {}, year: {}", employeeId, year);

        String financialYear = year != null ? year + "-" + (year + 1) : null;

        AnnualReview review = annualReviewRepository
                .findByEmployeeIdAndFinancialYear(employeeId, financialYear)
                .orElse(null);

        if (review == null) {
            return null;
        }

        return getManagerReviewResponse(review);
    }

    @Override
    public Object getManagerDraft(Long reviewId) {
        AnnualReview review = annualReviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with ID: " + reviewId));

        return getManagerReviewResponse(review);
    }

    private Object getManagerReviewResponse(AnnualReview review) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", review.getId());
        response.put("employeeId", review.getEmployeeId());
        response.put("managerId", review.getManagerId());
        response.put("financialYear", review.getFinancialYear());
        response.put("year", review.getYear());
        response.put("status", review.getStatus());
        response.put("keyAccomplishment", review.getKeyAccomplishment());
        response.put("managerRating", review.getManagerRating());

        response.put("achievementLevel", review.getAchievementLevel());
        response.put("potential", review.getPotential());
        response.put("performance", review.getPerformance());
        response.put("talentResource", review.getTalentResource());
        response.put("matrixCategory", review.getMatrixCategory());

        response.put("nineBoxResult", review.getNineBoxResult());
        response.put("talentFlag", review.getTalentFlag());
        response.put("criticalFlag", review.getCriticalFlag());

        response.put("managerRemarks", review.getManagerRemarks());
        response.put("performanceRating", review.getPerformanceRating());
        response.put("potentialRating", review.getPotentialRating());
        response.put("managerAnnualReviewSubmissionDate", review.getManagerAnnualReviewSubmissionDate());

        return response;
    }

    @Override
    @Transactional
    public void submitToHr(HrSubmissionDto dto) {
        log.info("Submitting annual review to HR for review ID: {}, Employee: {}, DiscussedWithR1: {}",
                dto.getId(), dto.getEmployeeId(), dto.getDiscussedWithR1());

        AnnualReview review = annualReviewRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Annual review not found with ID: " + dto.getId()));

        if (review.getStatus() != AnnualReviewStatus.SUBMITTED_TO_EMPLOYEE) {
            log.error("Cannot submit to HR: Invalid status {} for review ID: {}", review.getStatus(), dto.getId());
            throw new RuntimeException("Review must be submitted to employee before submitting to HR. Current status: " + review.getStatus());
        }

        int sendBackCount = review.getSendBackCount() != null ? review.getSendBackCount() : 0;
        boolean hasReachedLimit = sendBackCount >= 2;

        if (!hasReachedLimit && (dto.getDiscussedWithR1() == null || !dto.getDiscussedWithR1())) {
            log.error("Cannot submit to HR: discussedWithR1 is false for review ID: {} and sendBackCount: {}",
                    dto.getId(), sendBackCount);
            throw new RuntimeException("Must confirm discussion with R1 before submitting to HR");
        }

        boolean finalDiscussedWithR1 = dto.getDiscussedWithR1() != null ? dto.getDiscussedWithR1() : false;

        log.info("Send back count: {}, HasReachedLimit: {}, FinalDiscussedWithR1 from frontend: {}",
                sendBackCount, hasReachedLimit, finalDiscussedWithR1);

        review.setDiscussedWithR1(finalDiscussedWithR1);
        review.setEmployeeComment(dto.getEmployeeComment() != null ? dto.getEmployeeComment() : false);

        if (dto.getEmployeeCommentText() != null && !dto.getEmployeeCommentText().trim().isEmpty()) {
            review.setEmployeeCommentText(dto.getEmployeeCommentText());
        }

        if (dto.getEmployeeFeeling() != null && !dto.getEmployeeFeeling().trim().isEmpty()) {
            review.setEmployeeFeeling(dto.getEmployeeFeeling());
            log.info("Saved employee feeling: {} for review ID: {}", dto.getEmployeeFeeling(), review.getId());
        }

        if (dto.getAdditionalFeedback() != null && !dto.getAdditionalFeedback().trim().isEmpty()) {
            review.setAdditionalFeedback(dto.getAdditionalFeedback());
            log.info("Saved additional feedback for review ID: {}", review.getId());
        }

        review.setSubmittedToHrDate(LocalDateTime.now());
        review.setSubmittedToHrBy(dto.getSubmittedBy() != null ? dto.getSubmittedBy() : dto.getEmployeeId());
        review.setStatus(AnnualReviewStatus.SUBMITTED_TO_HR);
        review.setUpdatedAt(LocalDateTime.now());

        AnnualReview savedReview = annualReviewRepository.save(review);
        log.info("Annual review submitted to HR successfully for review ID: {}. Discussed with R1: {}",
                savedReview.getId(), savedReview.getDiscussedWithR1());
    }

    @Override
    @Transactional
    public void sendBackToR1(Long reviewId, String remarks, Boolean discussedWithR1) {
        log.info("Sending annual review back to R1 for review ID: {}, discussedWithR1: {}", reviewId, discussedWithR1);

        AnnualReview review = annualReviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with ID: " + reviewId));

        review.setDiscussedWithR1(discussedWithR1 != null ? discussedWithR1 : false);
        review.setEmployeeComment(false);
        review.setEmployeeCommentText(null);
        review.setSubmittedToHrDate(null);
        review.setSubmittedToHrBy(null);
        review.setHrRemarks(remarks);
        review.setUpdatedAt(LocalDateTime.now());

        annualReviewRepository.save(review);
        log.info("Annual review sent back to R1 for review ID: {}", reviewId);
    }

    @Override
    @Transactional
    public void sendBackToR1WithCount(Long reviewId, String remarks, Boolean discussedWithR1) {
        log.info("Sending annual review back to R1 with count tracking for review ID: {}", reviewId);

        AnnualReview review = annualReviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with ID: " + reviewId));

        int currentCount = review.getSendBackCount() != null ? review.getSendBackCount() : 0;

        if (currentCount >= 2) {
            throw new RuntimeException("Maximum send back limit of 2 reached. Please submit directly to HR.");
        }

        int newCount = currentCount + 1;
        log.info("Send back attempt {} of 2 for review ID: {}", newCount, reviewId);

        review.setSendBackCount(newCount);
        review.setLastSendBackAt(LocalDateTime.now());
        review.setSendBackRemarks(remarks);
        review.setDiscussedWithR1(discussedWithR1 != null ? discussedWithR1 : false);
        review.setEmployeeComment(false);
        review.setEmployeeCommentText(null);
        review.setSubmittedToHrDate(null);
        review.setSubmittedToHrBy(null);
        review.setHrRemarks(remarks);
        review.setUpdatedAt(LocalDateTime.now());

        annualReviewRepository.save(review);
        log.info("Annual review sent back to R1 successfully. Attempt {}/2 for review ID: {}", newCount, reviewId);
    }

    @Override
    public AnnualReview draftToSubmit(DraftToSubmitDto dto) {
        Optional<AnnualReview> optionalAnnualReview = annualReviewRepository.findById(dto.getId());
        if(optionalAnnualReview.isPresent()) {
            AnnualReview annualReview = optionalAnnualReview.get();
            annualReview.setStatus(AnnualReviewStatus.SUBMITTED_TO_R1);
            annualReview.setSubmittedAt(LocalDateTime.now());
            return annualReviewRepository.save(annualReview);
        }
        return null;
    }

    private Object getFullReviewResponse(AnnualReview review) {
        List<Certification> certList = certificationRepository.findByAnnualReviewId(review.getId());

        List<Map<String, Object>> certifications = certList.stream()
                .map(cert -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", cert.getId());
                    map.put("name", cert.getName());
                    map.put("type", cert.getType());
                    map.put("fileName", cert.getFileName());
                    map.put("certificateDocId", cert.getCertificateDocId());
                    return map;
                })
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("id", review.getId());
        response.put("employeeId", review.getEmployeeId());
        response.put("managerId", review.getManagerId());
        response.put("financialYear", review.getFinancialYear());
        response.put("year", review.getYear());
        response.put("status", review.getStatus());
        response.put("keyAccomplishment", review.getKeyAccomplishment());
        response.put("useNAOption", review.getUseNAOption() != null ? review.getUseNAOption() : false);
        response.put("managerRating", review.getManagerRating());

        response.put("achievementLevel", review.getAchievementLevel());
        response.put("potential", review.getPotential());
        response.put("performance", review.getPerformance());
        response.put("talentResource", review.getTalentResource());
        response.put("matrixCategory", review.getMatrixCategory());

        response.put("nineBoxResult", review.getNineBoxResult());
        response.put("talentFlag", review.getTalentFlag());
        response.put("criticalFlag", review.getCriticalFlag());

        response.put("managerRemarks", review.getManagerRemarks());
        response.put("performanceRating", review.getPerformanceRating());
        response.put("potentialRating", review.getPotentialRating());
        response.put("submittedAt", review.getSubmittedAt());
        response.put("managerAnnualReviewSubmissionDate", review.getManagerAnnualReviewSubmissionDate());
        response.put("discussedWithR1", review.getDiscussedWithR1());
        response.put("employeeComment", review.getEmployeeComment());
        response.put("employeeCommentText", review.getEmployeeCommentText());
        response.put("submittedToHrDate", review.getSubmittedToHrDate());
        response.put("submittedToHrBy", review.getSubmittedToHrBy());
        response.put("hrRemarks", review.getHrRemarks());

        response.put("sendBackCount", review.getSendBackCount() != null ? review.getSendBackCount() : 0);
        response.put("lastSendBackAt", review.getLastSendBackAt());
        response.put("sendBackRemarks", review.getSendBackRemarks());
        response.put("employeeFeeling", review.getEmployeeFeeling());
        response.put("additionalFeedback", review.getAdditionalFeedback());

        response.put("createdAt", review.getCreatedAt());
        response.put("updatedAt", review.getUpdatedAt());
        response.put("certifications", certifications);

        return response;
    }
}