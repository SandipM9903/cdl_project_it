package com.cdl.epms.repository;

import com.cdl.epms.model.EmployeeCertification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface EmployeeCertificationRepository extends JpaRepository<EmployeeCertification, Long> {

    List<EmployeeCertification> findByYear(Integer year);

    List<EmployeeCertification> findByEmployeeIdAndYear(String employeeId, Integer year);

    Optional<EmployeeCertification> findByEmployeeIdAndCertification_IdAndYear(String employeeId, Long certificationId, Integer year);

    @Modifying
    @Transactional
    @Query("DELETE FROM EmployeeCertification ec WHERE ec.employeeId = :employeeId AND ec.year = :year")
    void deleteByEmployeeIdAndYear(@Param("employeeId") String employeeId, @Param("year") Integer year);

    @Modifying
    @Transactional
    @Query("DELETE FROM EmployeeCertification ec WHERE ec.year = :year")
    void deleteByYear(@Param("year") Integer year);

    @Modifying
    @Transactional
    @Query("DELETE FROM EmployeeCertification ec WHERE ec.certification.id IN :certIds")
    void deleteByCertificationIdIn(@Param("certIds") List<Long> certIds);
}