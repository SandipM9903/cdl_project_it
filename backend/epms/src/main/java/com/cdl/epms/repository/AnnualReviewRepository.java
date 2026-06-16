package com.cdl.epms.repository;

import com.cdl.epms.common.enums.AnnualReviewStatus;
import com.cdl.epms.model.AnnualReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnnualReviewRepository extends JpaRepository<AnnualReview, Long> {

    // Old method - keep for backward compatibility
    Optional<AnnualReview> findByEmployeeIdAndYear(String employeeId, Integer year);

    // New method to find by financial year
    Optional<AnnualReview> findByEmployeeIdAndFinancialYear(String employeeId, String financialYear);

    // Get by financial year only
    Optional<AnnualReview> findByFinancialYear(String financialYear);

    // Get all by financial year
    List<AnnualReview> findAllByFinancialYear(String financialYear);

    // Get by status and financial year
    List<AnnualReview> findByStatusAndFinancialYear(AnnualReviewStatus status, String financialYear);

    List<AnnualReview> findByStatus(AnnualReviewStatus status);

    List<AnnualReview> findByManagerIdAndStatus(String managerId, AnnualReviewStatus status);

    @Query("SELECT a FROM AnnualReview a WHERE a.status = :status AND a.submittedToHrDate IS NULL")
    List<AnnualReview> findByStatusAndSubmittedToHrDateIsNull(@Param("status") AnnualReviewStatus status);

    @Query("SELECT a FROM AnnualReview a WHERE a.employeeId = :employeeId ORDER BY a.financialYear DESC")
    List<AnnualReview> findAllByEmployeeIdOrderByFinancialYearDesc(@Param("employeeId") String employeeId);

    // Find by employee ID and year (using financial year)
    @Query("SELECT a FROM AnnualReview a WHERE a.employeeId = :employeeId AND a.financialYear = :financialYear")
    Optional<AnnualReview> findByEmployeeIdAndFinancialYearQuery(@Param("employeeId") String employeeId, @Param("financialYear") String financialYear);
}