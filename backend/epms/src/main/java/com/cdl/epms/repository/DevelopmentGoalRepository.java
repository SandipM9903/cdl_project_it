package com.cdl.epms.repository;

import com.cdl.epms.common.enums.GoalStatus;
import com.cdl.epms.common.enums.Quarter;
import com.cdl.epms.model.DevelopmentGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DevelopmentGoalRepository extends JpaRepository<DevelopmentGoal, Long> {

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
}