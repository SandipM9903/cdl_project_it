package com.cdl.epms.repository;

import com.cdl.epms.model.Posh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

public interface PoshRepository extends JpaRepository<Posh, Long> {

    Optional<Posh> findByAnnualReviewId(Long annualReviewId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Posh p WHERE p.annualReviewId = :annualReviewId")
    void deleteByAnnualReviewId(@Param("annualReviewId") Long annualReviewId);
}