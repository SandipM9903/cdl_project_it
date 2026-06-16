package com.cms.IT_DEC.dto.employee_dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SalaryAccDetailsResDTO {
    private long salaryAccDetailsId;
    private String bankName;
    private long accountNumber;
    private String nameOnAccount;
    private String ifsc;
}
