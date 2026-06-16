package com.cms.IT_DEC.model;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Data
@Entity(name = "selected_regime")
@EntityListeners(AuditingEntityListener.class)
public class Regime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long regimeId;

    private String empCode;

    private String regime;

    @CreatedDate
    @Column(name = "created_date", updatable = false)
    private LocalDateTime createdDate;

    @LastModifiedDate
    @Column(name = "modified_date")
    private LocalDateTime modifiedDate;
}