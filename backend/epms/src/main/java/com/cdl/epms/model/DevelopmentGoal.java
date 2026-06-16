package com.cdl.epms.model;

import com.cdl.epms.common.enums.GoalStatus;
import com.cdl.epms.common.enums.Quarter;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "development_goal")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DevelopmentGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Performance cycle cannot be null.")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cycle_id", nullable = false)
    private PerformanceCycle performanceCycle;

    @NotNull(message = "Year cannot be null.")
    @Column(name = "year", nullable = false)
    private Integer year;

    @NotNull(message = "Quarter cannot be null.")
    @Enumerated(EnumType.STRING)
    @Column(name = "quarter", nullable = false)
    private Quarter quarter;

    @NotBlank(message = "Employee ID cannot be empty.")
    @Column(name = "employee_id", nullable = false)
    private String employeeId;

    @NotBlank(message = "Manager ID cannot be empty.")
    @Column(name = "manager_id", nullable = false)
    private String managerId;

    @NotBlank(message = "Title cannot be empty.")
    @Size(max = 500, message = "Title cannot be more than 500 characters.")
    @Column(name = "title", nullable = false, length = 500)
    private String title;

    @NotBlank(message = "Training name cannot be empty.")
    @Size(max = 500, message = "Training name cannot be more than 500 characters.")
    @Column(name = "training_name", nullable = false, length = 500)
    private String trainingName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Min(value = 0, message = "Self assessment score must be at least 0.")
    @Max(value = 100, message = "Self assessment score cannot be greater than 100.")
    @Column(name = "self_assessment_score")
    private Integer selfAssessmentScore;

    @Min(value = 0, message = "Manager assessment score must be at least 0.")
    @Max(value = 100, message = "Manager assessment score cannot be greater than 100.")
    @Column(name = "manager_assessment_score")
    private Integer managerAssessmentScore;

    @Column(name = "manager_comment", columnDefinition = "TEXT")
    private String managerComment;

    @Column(name = "manager_approval_comment", columnDefinition = "TEXT")
    private String managerApprovalComment;

    @NotNull(message = "Goal status cannot be null.")
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private GoalStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "submitted_to_employee_at")
    private LocalDateTime submittedToEmployeeAt;

    @Column(name = "self_review_submitted_date")
    private LocalDateTime selfReviewSubmittedDate;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "self_accepted_date")
    private LocalDateTime selfAcceptedDate;

    @PrePersist
    public void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = GoalStatus.DRAFT;
        }
        if (this.selfAssessmentScore == null) {
            this.selfAssessmentScore = 0;
        }
        if (this.managerAssessmentScore == null) {
            this.managerAssessmentScore = 0;
        }
        if (this.managerComment == null) {
            this.managerComment = "";
        }
        if (this.managerApprovalComment == null) {
            this.managerApprovalComment = "";
        }
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}