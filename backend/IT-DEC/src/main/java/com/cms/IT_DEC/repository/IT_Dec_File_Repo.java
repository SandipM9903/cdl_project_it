package com.cms.IT_DEC.repository;

import com.cms.IT_DEC.model.IT_Dec_File;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface IT_Dec_File_Repo extends JpaRepository<IT_Dec_File,Long> {
    List<IT_Dec_File> findByEmployeeCodeAndItDecIdAndFinancialYear(String employeeId, Long itDecId, String financialYear);

    List<IT_Dec_File> findByEmployeeCodeAndFinancialYear(String employeeId, String financialYear);

    @Query("SELECT COUNT(f) FROM IT_Dec_File f WHERE f.employeeCode = :empCode AND f.itDecId = :itDecId AND f.financialYear = :financialYear")
    int countByEmployeeCodeAndItDecIdAndFinancialYear(
            @Param("empCode") String empCode,
            @Param("itDecId") Long itDecId,
            @Param("financialYear") String financialYear);
    Optional<IT_Dec_File> findByItDecDocId(Long itDecDocId);
}
