package com.cdl.epms.dto.cycle;

import com.cdl.epms.common.enums.CycleType;
import com.cdl.epms.common.enums.Quarter;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateCycleRequestDto {

    @NotNull(message = "Cycle type is required")
    private CycleType cycleType;

    private Integer year;

    private Quarter quarter;

    private Integer reminderDays;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    private String financialYear; // New field for financial year (e.g., "2026-2027")
}