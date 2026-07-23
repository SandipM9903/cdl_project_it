package com.cdl.epms.repository;

import com.cdl.epms.model.ResetEmployeeDataLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResetEmployeeDataLogRepository extends JpaRepository<ResetEmployeeDataLog, Long> {

    List<ResetEmployeeDataLog> findByFinancialYearOrderByIdDesc(String financialYear);

    List<ResetEmployeeDataLog> findAllByOrderByIdDesc();
}
