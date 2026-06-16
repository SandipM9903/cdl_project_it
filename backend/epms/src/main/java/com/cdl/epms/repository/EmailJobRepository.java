package com.cdl.epms.repository;

import com.cdl.epms.model.EmailJob;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmailJobRepository extends JpaRepository<EmailJob, Long> {
    boolean existsByUniqueKey(String uniqueKey);
}