package com.cdl.epms.repository;

import com.cdl.epms.model.AnnualReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AnnualPerformanceReportRepository extends JpaRepository<AnnualReview, Long> {

    // Date range queries
    @Query("SELECT r FROM AnnualReview r WHERE r.createdAt BETWEEN :startDate AND :endDate")
    List<AnnualReview> findByDateRange(@Param("startDate") LocalDateTime startDate,
                                       @Param("endDate") LocalDateTime endDate);

    @Query("SELECT r FROM AnnualReview r WHERE UPPER(r.status) = UPPER(:status) AND r.createdAt BETWEEN :startDate AND :endDate")
    List<AnnualReview> findByDateRangeAndStatus(@Param("startDate") LocalDateTime startDate,
                                                @Param("endDate") LocalDateTime endDate,
                                                @Param("status") String status);

    // Financial year queries
    @Query("SELECT r FROM AnnualReview r WHERE r.financialYear = :financialYear")
    List<AnnualReview> findByFinancialYear(@Param("financialYear") String financialYear);

    @Query("SELECT r FROM AnnualReview r WHERE UPPER(r.status) = UPPER(:status) AND r.financialYear = :financialYear")
    List<AnnualReview> findByFinancialYearAndStatus(@Param("financialYear") String financialYear,
                                                    @Param("status") String status);
}