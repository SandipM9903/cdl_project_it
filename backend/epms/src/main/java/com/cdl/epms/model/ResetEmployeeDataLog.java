package com.cdl.epms.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "reset_employee_data_log")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResetEmployeeDataLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_id", nullable = false)
    private String employeeId;

    @Column(name = "financial_year", nullable = false, length = 20)
    private String financialYear;

    @Column(name = "reset_scope", nullable = false, length = 20)
    private String resetScope;

    @Column(name = "quarter", length = 10)
    private String quarter;

    @Column(name = "reset_at", nullable = false)
    private LocalDateTime resetAt;

    @Column(name = "reset_by", nullable = false)
    private String resetBy;

    @PrePersist
    protected void onCreate() {
        if (this.resetAt == null) {
            this.resetAt = LocalDateTime.now();
        }
    }
}
