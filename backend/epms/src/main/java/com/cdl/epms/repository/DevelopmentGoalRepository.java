package com.cdl.epms.repository;

import com.cdl.epms.common.enums.GoalStatus;
import com.cdl.epms.common.enums.Quarter;
import com.cdl.epms.model.DevelopmentGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface DevelopmentGoalRepository extends JpaRepository<DevelopmentGoal, Long> {

    @Modifying
    @Transactional
    @Query("DELETE FROM DevelopmentGoal dg WHERE dg.employeeId = :employeeId AND dg.quarter = :quarter AND (dg.performanceCycle.financialYear = :financialYear OR dg.year = :year)")
    void deleteByEmployeeIdAndQuarterAndFinancialYear(
            @Param("employeeId") String employeeId,
            @Param("quarter") Quarter quarter,
            @Param("financialYear") String financialYear,
            @Param("year") Integer year
    );

    @Modifying
    @Transactional
    @Query("DELETE FROM DevelopmentGoal dg WHERE dg.quarter = :quarter AND (dg.performanceCycle.financialYear = :financialYear OR dg.year = :year)")
    void deleteByQuarterAndFinancialYear(
            @Param("quarter") Quarter quarter,
            @Param("financialYear") String financialYear,
            @Param("year") Integer year
    );

    @Modifying
    @Transactional
    @Query("DELETE FROM DevelopmentGoal dg WHERE dg.employeeId = :employeeId AND (dg.performanceCycle.financialYear = :financialYear OR dg.year = :year)")
    void deleteByEmployeeIdAndFinancialYear(
            @Param("employeeId") String employeeId,
            @Param("financialYear") String financialYear,
            @Param("year") Integer year
    );

    @Modifying
    @Transactional
    @Query("DELETE FROM DevelopmentGoal dg WHERE (dg.performanceCycle.financialYear = :financialYear OR dg.year = :year)")
    void deleteByFinancialYear(
            @Param("financialYear") String financialYear,
            @Param("year") Integer year
    );

    List<DevelopmentGoal> findByEmployeeIdAndQuarterAndYear(
            String employeeId,
            Quarter quarter,
            Integer year
    );

    List<DevelopmentGoal> findByEmployeeIdAndQuarterAndYearAndStatus(
            String employeeId,
            Quarter quarter,
            Integer year,
            GoalStatus status
    );

    List<DevelopmentGoal> findByManagerIdAndQuarterAndYear(
            String managerId,
            Quarter quarter,
            Integer year
    );

    List<DevelopmentGoal> findByEmployeeIdAndQuarterAndYearAndStatusIn(
            String employeeId,
            Quarter quarter,
            Integer year,
            List<GoalStatus> statuses
    );

    long countByEmployeeIdAndQuarterAndYear(
            String employeeId,
            Quarter quarter,
            Integer year
    );

    boolean existsByEmployeeIdAndQuarterAndYearAndTitle(
            String employeeId,
            Quarter quarter,
            Integer year,
            String title
    );

    boolean existsByEmployeeIdAndQuarterAndYearAndTitleAndTrainingName(
            String employeeId,
            Quarter quarter,
            Integer year,
            String title,
            String trainingName
    );

    List<DevelopmentGoal> findByQuarterAndYear(Quarter quarter, Integer year);
}