package com.cdl.epms.repository;

import com.cdl.epms.common.enums.CycleStatus;
import com.cdl.epms.common.enums.CycleType;
import com.cdl.epms.common.enums.Quarter;
import com.cdl.epms.model.PerformanceCycle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PerformanceCycleRepository extends JpaRepository<PerformanceCycle, Long> {

    // Existing methods
    Optional<PerformanceCycle> findByStatus(CycleStatus status);

    boolean existsByStatus(CycleStatus status);

    List<PerformanceCycle> findByYear(Integer year);

    Optional<PerformanceCycle> findByYearAndCycleType(Integer year, CycleType cycleType);

    Optional<PerformanceCycle> findByYearAndQuarterAndCycleType(Integer year, Quarter quarter, CycleType cycleType);

    List<PerformanceCycle> findByYearAndCycleTypeOrderByQuarterAsc(Integer year, CycleType cycleType);

    // New methods for financial year support
    Optional<PerformanceCycle> findByFinancialYearAndQuarterAndCycleType(String financialYear, Quarter quarter, CycleType cycleType);

    Optional<PerformanceCycle> findByFinancialYearAndCycleType(String financialYear, CycleType cycleType);

    List<PerformanceCycle> findByFinancialYear(String financialYear);

    List<PerformanceCycle> findByFinancialYearAndCycleTypeOrderByQuarterAsc(String financialYear, CycleType cycleType);

    // Query to get all cycles for a financial year with optional filtering
    @Query("SELECT pc FROM PerformanceCycle pc WHERE pc.financialYear = :financialYear ORDER BY pc.cycleType, pc.quarter")
    List<PerformanceCycle> findAllByFinancialYear(@Param("financialYear") String financialYear);

    // Check if any cycle exists for a financial year
    boolean existsByFinancialYear(String financialYear);
}