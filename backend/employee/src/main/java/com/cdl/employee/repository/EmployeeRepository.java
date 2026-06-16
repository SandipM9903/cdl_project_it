package com.cdl.employee.repository;

import com.cdl.employee.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    Optional<Employee> findByempCode(Integer empCode);

    Optional<Employee> findByEmailId(String emailId);

    List<Employee> findByReportingManager(String reportingManager);

    @Query("SELECT e.emailId FROM Employee e")
    List<String> findAllEmailIds();

}