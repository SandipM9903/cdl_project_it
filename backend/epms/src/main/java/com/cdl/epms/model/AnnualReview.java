package com.cdl.epms.model;

import com.cdl.epms.common.enums.AnnualReviewStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "annual_reviews",
        indexes = {
                @Index(name = "idx_employee_financial_year", columnList = "employee_id, financial_year"),
                @Index(name = "idx_financial_year_annrevw", columnList = "financial_year")
        })
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnnualReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_id", nullable = false)
    private String employeeId;

    @Column(name = "manager_id", nullable = false)
    private String managerId;

    @Column(name = "year")
    private Integer year;

    @Column(name = "financial_year", length = 20)
    private String financialYear;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private AnnualReviewStatus status;

    @Column(name = "key_accomplishment", columnDefinition = "TEXT")
    private String keyAccomplishment;

    @Column(name = "use_na_option")
    private Boolean useNAOption;

    @Column(name = "manager_rating", length = 5)
    private String managerRating;

    @Column(name = "achievement_level", length = 20)
    private String achievementLevel;

    @Column(name = "potential", length = 20)
    private String potential;

    @Column(name = "performance", length = 20)
    private String performance;

    @Column(name = "talent_resource", length = 50)
    private String talentResource;

    @Column(name = "matrix_category", length = 50)
    private String matrixCategory;

    @Column(name = "nine_box_result", length = 50)
    private String nineBoxResult;

    @Column(name = "talent_flag")
    private Boolean talentFlag;

    @Column(name = "critical_flag")
    private Boolean criticalFlag;

    @Column(name = "manager_remarks", columnDefinition = "TEXT")
    private String managerRemarks;

    @Column(name = "performance_rating", length = 20)
    private String performanceRating;

    @Column(name = "potential_rating", length = 20)
    private String potentialRating;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "manager_annual_review_submission_date")
    private LocalDateTime managerAnnualReviewSubmissionDate;

    @Column(name = "discussed_with_r1")
    private Boolean discussedWithR1;

    @Column(name = "employee_comment")
    private Boolean employeeComment;

    @Column(name = "employee_comment_text", columnDefinition = "TEXT")
    private String employeeCommentText;

    @Column(name = "submitted_to_hr_date")
    private LocalDateTime submittedToHrDate;

    @Column(name = "submitted_to_hr_by")
    private String submittedToHrBy;

    @Column(name = "hr_remarks", columnDefinition = "TEXT")
    private String hrRemarks;

    @Column(name = "send_back_count")
    private Integer sendBackCount = 0;

    @Column(name = "last_send_back_at")
    private LocalDateTime lastSendBackAt;

    @Column(name = "send_back_remarks", columnDefinition = "TEXT")
    private String sendBackRemarks;

    @Column(name = "employee_feeling", length = 50)
    private String employeeFeeling;

    @Column(name = "additional_feedback", columnDefinition = "TEXT")
    private String additionalFeedback;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = AnnualReviewStatus.DRAFT;
        }
        if (sendBackCount == null) {
            sendBackCount = 0;
        }
        if (useNAOption == null) {
            useNAOption = false;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}