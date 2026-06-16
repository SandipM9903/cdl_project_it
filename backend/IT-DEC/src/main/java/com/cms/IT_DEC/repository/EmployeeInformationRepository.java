package com.cms.IT_DEC.repository;

import com.cms.IT_DEC.model.EmployeeInformation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeInformationRepository
        extends JpaRepository<EmployeeInformation, Long> {

    EmployeeInformation findByPanNumber(String panNumber);

    boolean existsByPanNumber(String panNumber);

    Optional<EmployeeInformation> findByEmpCode(String empCode);
}