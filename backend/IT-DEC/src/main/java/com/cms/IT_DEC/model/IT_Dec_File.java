package com.cms.IT_DEC.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;


@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class IT_Dec_File {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;
//    private Long employeeId;
    private String employeeCode;
    private Long itDecId;
    private Long itDecDocId;
    private String financialYear;
    private String docCaption;
}

