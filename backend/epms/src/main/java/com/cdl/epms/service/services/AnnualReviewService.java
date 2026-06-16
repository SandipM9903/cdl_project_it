package com.cdl.epms.service.services;

import com.cdl.epms.dto.annualReview.AnnualReviewRequestDto;
import com.cdl.epms.dto.annualReview.DraftToSubmitDto;
import com.cdl.epms.dto.annualReview.HrSubmissionDto;
import com.cdl.epms.dto.annualReview.UpdateAnnualReviewDto;
import com.cdl.epms.model.AnnualReview;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface AnnualReviewService {
    Long saveDraft(AnnualReviewRequestDto dto, MultipartFile poshCertificate, List<MultipartFile> certificatesFiles) throws IOException;
    Long updateDraft(Long id, AnnualReviewRequestDto dto, MultipartFile poshCertificate, List<MultipartFile> certificatesFiles) throws IOException;
    Long submitReview(AnnualReviewRequestDto dto, MultipartFile poshCertificate, List<MultipartFile> certificatesFiles) throws IOException;
    void saveManagerDraft(UpdateAnnualReviewDto dto);
    void submitToEmployee(UpdateAnnualReviewDto dto);
    Object updateManagerReview(UpdateAnnualReviewDto dto);
    void submitToHr(HrSubmissionDto dto);
    Object getHrReviews(Integer year);
    Object getHrReviewDetails(Long reviewId);
    void hrApproveOrReject(Long reviewId, Boolean approved, String hrRemarks);
    void sendBackToR1(Long reviewId, String remarks, Boolean discussedWithR1);
    Object getDraft(String employeeId, Integer year);
    Object getFullReview(String employeeId, Integer year);
    Object getManagerReview(String employeeId, Integer year);
    Object getManagerDraft(Long reviewId);
    void sendBackToR1WithCount(Long reviewId, String remarks, Boolean discussedWithR1);
    AnnualReview draftToSubmit(DraftToSubmitDto dto);
}