package com.cms.IT_DEC.repository;

import com.cms.IT_DEC.model.IT_Proof_Investment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IT_Proof_Investment_Repo extends JpaRepository<IT_Proof_Investment,Long> {
    IT_Proof_Investment findByEmpCodeAndFinancialYearAndItDecId(String empId, String financialYear, Long itDecId);
    List<IT_Proof_Investment> findByEmpCodeAndFinancialYear(String empId, String financialYear);
}
