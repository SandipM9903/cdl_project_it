package com.cms.IT_DEC.repository;

import com.cms.IT_DEC.model.IT_Proof_Investment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IT_Proof_Investment_Report_Repo extends JpaRepository<IT_Proof_Investment, Long> {

    @Query(value = """
    SELECT 
        COALESCE(ep.emp_name, '') AS employeeName,
        ipi.emp_code AS employeeCode,
        COALESCE(ep.pan_number, '') AS panNo,
        ipi.financial_year AS financialYear,
        CASE 
            WHEN idm.it_dec_id IN (1, 2, 4, 5, 9, 18, 19, 20, 21, 22, 23) THEN 'C'
            WHEN idm.it_dec_id IN (7, 8, 10, 11, 15, 16, 17) THEN 'D'
            WHEN idm.it_dec_id IN (12, 13, 14) THEN 'E'
            ELSE NULL 
        END AS section,
        idm.declaration_name AS component,
        COALESCE(idm.additional_information, '') AS particular,
        COALESCE(ipi.revised_amount, 0) AS revisedAmount,
        COALESCE(ipi.modified_date, ipi.created_date) AS modifiedDate,
        COALESCE(ipi.comments, '') AS remarks,
        COALESCE(ep.landlord_name, '') AS landlordName,
        COALESCE(ep.landlord_pan_number, '') AS landlordPanNumber,
        CASE 
            WHEN COUNT(idf.it_dec_doc_id) > 0 THEN 'Yes'
            ELSE 'No' 
        END AS uploadedDocs,
        STRING_AGG(DISTINCT CAST(idf.it_dec_doc_id AS varchar), ', ') AS documentIds,
        STRING_AGG(DISTINCT COALESCE(idf.doc_caption, ''), ', ') AS documentCaption
        
    FROM it_proof_investment ipi
    
    LEFT JOIN employee_pan ep
        ON ipi.emp_code = ep.emp_code
        
    LEFT JOIN it_declaration_master idm
        ON ipi.it_dec_id = idm.it_dec_id
        
    LEFT JOIN it_dec_file idf
        ON ipi.emp_code = idf.employee_code
        AND ipi.financial_year = idf.financial_year
        AND ipi.it_dec_id = idf.it_dec_id
        
    WHERE (:empCode IS NULL OR ipi.emp_code = :empCode)
        AND (:financialYear IS NULL OR ipi.financial_year = :financialYear)
        
    GROUP BY 
        ep.emp_name, 
        ipi.emp_code, 
        ep.pan_number, 
        ipi.financial_year,
        idm.it_dec_id, 
        idm.declaration_name, 
        idm.additional_information,
        ipi.revised_amount, 
        ipi.modified_date, 
        ipi.created_date, 
        ipi.comments,
        ep.landlord_name, 
        ep.landlord_pan_number
        
    ORDER BY ipi.modified_date DESC, ipi.created_date DESC
    """, nativeQuery = true)
    List<Object[]> getInvestmentProofReport(
            @Param("empCode") String empCode,
            @Param("financialYear") String financialYear
    );
}