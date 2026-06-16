package com.cms.IT_DEC.repository;

import com.cms.IT_DEC.model.IT_Declaration_Info;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IT_Declaration_Info_Repo extends JpaRepository<IT_Declaration_Info, Long> {

    List<IT_Declaration_Info> findByEmpCodeAndFinancialYear(String empId, String financialYear);

    IT_Declaration_Info findByEmpCodeAndFinancialYearAndItDecId(String empId, String financialYear, Long itDecId);

    // Get employee report - only from declaration tables, no employee table join
    @Query(value = """
            SELECT 
                m.it_dec_id,
                m.declaration_name,
                i.emp_code,
                COALESCE(i.declaration_amount, 0) as declaration_amount,
                i.created_date,
                i.signature_date,
                i.financial_year,
                i.is_submitted,
                i.loan_amount,
                i.loan_date,
                i.interest,
                i.institute_name,
                i.tax_regime,
                i.regime,
                i.signature_place,
                i.hr_signature_date,
                i.hr_signature_place,
                i.modified_date,
                i.it_info_id
            FROM it_declaration_master m
            LEFT JOIN it_declaration_info i
                   ON m.it_dec_id = i.it_dec_id
                   AND i.emp_code = :empCode
                   AND i.financial_year = :financialYear
            ORDER BY m.it_dec_id
            """, nativeQuery = true)
    List<Object[]> getEmployeeReport(@Param("empCode") String empCode, @Param("financialYear") String financialYear);

    // Get distinct employee codes for a financial year
    @Query(value = """
            SELECT DISTINCT 
                i.emp_code
            FROM it_declaration_info i
            WHERE i.financial_year = :financialYear
            AND i.emp_code IS NOT NULL
            ORDER BY i.emp_code
            """, nativeQuery = true)
    List<String> findDistinctEmpCodesByFinancialYear(@Param("financialYear") String financialYear);

    // Get PAN number from employee_pan table (if exists)
    @Query(value = """
            SELECT DISTINCT ep.pan_number 
            FROM employee_pan ep 
            WHERE ep.emp_code = :empCode
            """, nativeQuery = true)
    String findPanNumberByEmpCode(@Param("empCode") String empCode);

    @Query(value = """
            SELECT DISTINCT financial_year 
            FROM it_declaration_info 
            WHERE financial_year IS NOT NULL 
            ORDER BY financial_year DESC
            """, nativeQuery = true)
    List<String> findDistinctFinancialYears();

    List<IT_Declaration_Info> findByFinancialYear(String financialYear);

    Page<IT_Declaration_Info> findByFinancialYear(String financialYear, Pageable pageable);
}