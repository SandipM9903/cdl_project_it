package com.cdl.epms.model;

import com.cdl.epms.common.enums.GoalStatus;
import com.cdl.epms.common.enums.GoalType;
import com.cdl.epms.common.enums.Quarter;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Entity
@Table(name = "goal")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Goal {

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

    @NotNull(message = "Goal type cannot be null.")
    @Enumerated(EnumType.STRING)
    @Column(name = "goal_type", nullable = false)
    private GoalType goalType;

    @NotBlank(message = "Objective/Title cannot be empty.")
    @Size(max = 1000, message = "Objective/Title cannot be more than 1000 characters.")
    @Column(name = "title", nullable = false, length = 1000)
    private String title;

    @Column(name = "target", columnDefinition = "TEXT")
    private String target;

    @Min(value = 0, message = "Weightage must be at least 0.")
    @Max(value = 100, message = "Weightage cannot be more than 100.")
    @Column(name = "weightage")
    private Integer weightage;

    @NotNull(message = "Goal status cannot be null.")
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private GoalStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

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

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "goal_category")
    private String goalCategory;

    @Column(name = "submitted_to_employee_at")
    private LocalDateTime submittedToEmployeeAt;

    @Column(name = "self_review_submitted_date")
    private LocalDateTime selfReviewSubmittedDate;

    @Min(value = 0, message = "Overall self assessment rating must be at least 0.")
    @Max(value = 5, message = "Overall self assessment rating cannot be greater than 5.")
    @Column(name = "overall_self_assessment_rating")
    private Integer overallSelfAssessmentRating;

    @Column(name = "overall_self_review_comments", columnDefinition = "TEXT")
    private String overallSelfReviewComments;

    @Min(value = 0, message = "Manager overall rating must be at least 0.")
    @Max(value = 5, message = "Manager overall rating cannot be greater than 5.")
    @Column(name = "manager_overall_self_assessment_rating")
    private Integer managerOverallSelfAssessmentRating;

    @Column(name = "manager_overall_self_review_comments", columnDefinition = "TEXT")
    private String managerOverallSelfReviewComments;

    @Column(name = "achievement_level", columnDefinition = "TEXT")
    private String achievementLevel;

    @Column(name = "potential", columnDefinition = "TEXT")
    private String potential;

    @Column(name = "performance", columnDefinition = "TEXT")
    private String performance;

    @Column(name = "talent_or_critical_resource", columnDefinition = "TEXT")
    private String talentOrCriticalResource;

    @Column(name = "talent_matrix_category", columnDefinition = "TEXT")
    private String talentMatrixCategory;

    @Column(name = "self_accecpted_date")
    private LocalDateTime selfAcceptedDate;

    @Column(name = "timeline", columnDefinition = "TEXT")
    private String timeline;

    // NEW FIELD: Manager Rating (A+, A, B+, B, C)
    @Column(name = "manager_rating", columnDefinition = "VARCHAR(10)")
    private String managerRating;

    @PrePersist
    public void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.updatedAt == null) {
            this.updatedAt = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = GoalStatus.PENDING_APPROVAL;
        }
        if (this.year == null && this.performanceCycle != null) {
            this.year = this.performanceCycle.getYear();
        }
        // Set default values for nullable fields
        if (this.remarks == null) this.remarks = "";
        if (this.managerComment == null) this.managerComment = "";
        if (this.managerApprovalComment == null) this.managerApprovalComment = "";
        if (this.overallSelfReviewComments == null) this.overallSelfReviewComments = "";
        if (this.managerOverallSelfReviewComments == null) this.managerOverallSelfReviewComments = "";
        if (this.achievementLevel == null) this.achievementLevel = "";
        if (this.potential == null) this.potential = "";
        if (this.performance == null) this.performance = "";
        if (this.talentOrCriticalResource == null) this.talentOrCriticalResource = "";
        if (this.talentMatrixCategory == null) this.talentMatrixCategory = "";
        if (this.timeline == null) this.timeline = "";
        if (this.selfAssessmentScore == null) this.selfAssessmentScore = 0;
        if (this.managerAssessmentScore == null) this.managerAssessmentScore = 0;
        if (this.overallSelfAssessmentRating == null) this.overallSelfAssessmentRating = 0;
        if (this.managerOverallSelfAssessmentRating == null) this.managerOverallSelfAssessmentRating = 0;
        if (this.managerRating == null) this.managerRating = "";
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public List<String> getTimelineAsList() {
        if (this.timeline == null || this.timeline.isEmpty()) {
            return new ArrayList<>();
        }
        return Arrays.asList(this.timeline.split(","));
    }

    public void setTimelineFromList(List<String> timelineList) {
        if (timelineList == null || timelineList.isEmpty()) {
            this.timeline = null;
        } else {
            this.timeline = String.join(",", timelineList);
        }
    }
}