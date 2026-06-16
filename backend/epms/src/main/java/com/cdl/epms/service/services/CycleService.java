package com.cdl.epms.service.services;

import com.cdl.epms.common.enums.CycleType;
import com.cdl.epms.common.enums.Quarter;
import com.cdl.epms.model.PerformanceCycle;

import java.time.LocalDate;
import java.util.List;

public interface CycleService {

    PerformanceCycle createCycle(
            CycleType cycleType,
            Integer year,
            Quarter quarter,
            Integer reminderDays,
            LocalDate startDate,
            LocalDate endDate,
            String financialYear  // Added financialYear parameter
    );

    String publishCycle(Long cycleId, String customSubject, String customBody);

    PerformanceCycle getActiveCycle();

    void closeCycle(Long cycleId);

    PerformanceCycle extendExpiryDate(Long cycleId, LocalDate newEndDate);

    PerformanceCycle reopenQuarter(Long cycleId, LocalDate newEndDate);

    PerformanceCycle sendReminder(Long cycleId);

    List<PerformanceCycle> getCyclesByYear(Integer year);

    List<PerformanceCycle> getCyclesByFinancialYear(String financialYear);  // New method

    PerformanceCycle createAnnualCycle(
            Integer year,
            Integer reminderDays,
            LocalDate startDate,
            LocalDate endDate,
            String financialYear  // Added financialYear parameter
    );
}