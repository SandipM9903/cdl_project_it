package com.cms.IT_DEC.repository;

import com.cms.IT_DEC.model.Regime;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RegimeRepository extends JpaRepository<Regime, Long> {

    Optional<Regime> findByEmpCode(String empCode);
}
