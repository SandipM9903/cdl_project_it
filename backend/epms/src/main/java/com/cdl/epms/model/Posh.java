package com.cdl.epms.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "posh")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Posh {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "annual_review_id", nullable = false)
    private Long annualReviewId;

    @Column(name = "posh_doc_id", nullable = false)
    private Long poshDocId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}