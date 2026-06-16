package com.cdl.epms.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class EmailTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String subject;

    @Column(columnDefinition = "TEXT")
    private String body;
}