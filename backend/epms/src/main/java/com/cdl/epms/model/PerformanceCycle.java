package com.cdl.epms.model;

import com.cdl.epms.common.enums.CycleStatus;
import com.cdl.epms.common.enums.CycleType;
import com.cdl.epms.common.enums.Quarter;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "performance_cycle",
        indexes = {
                @Index(name = "idx_financial_year_performance", columnList = "financial_year"),
                @Index(name = "idx_cycle_type_year", columnList = "cycle_type, year"),
                @Index(name = "idx_status", columnList = "status")
        })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PerformanceCycle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Cycle type cannot be null.")
    @Enumerated(EnumType.STRING)
    @Column(name = "cycle_type", nullable = false)
    private CycleType cycleType;

    @NotNull(message = "Year cannot be null.")
    @Min(value = 2000, message = "Year must be a valid year.")
    @Column(name = "year", nullable = false)
    private Integer year;

    @Enumerated(EnumType.STRING)
    @Column(name = "quarter")
    private Quarter quarter;

    @NotNull(message = "Start date cannot be null.")
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @NotNull(message = "End date cannot be null.")
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @NotNull(message = "Cycle status cannot be null.")
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private CycleStatus status;

    @Column(name = "reminder_days")
    private Integer reminderDays;

    private LocalDate publishedDate;

    @Column(name = "last_reminder_date")
    private LocalDateTime lastReminderDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "financial_year", length = 20)
    private String financialYear;

    @PrePersist
    public void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = CycleStatus.NOT_STARTED;
        }
        // Auto-generate financialYear if not provided
        if (this.financialYear == null && this.year != null) {
            if (this.cycleType == CycleType.ANNUAL) {
                // For annual cycles, financial year is previous year to current selection
                // Example: If year is 2025, financial year is "2025-2026"
                this.financialYear = this.year + "-" + (this.year + 1);
            } else {
                // For quarterly cycles, financial year is year-year+1
                this.financialYear = this.year + "-" + (this.year + 1);
            }
        }
    }
}