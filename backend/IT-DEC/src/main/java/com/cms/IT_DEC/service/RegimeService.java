package com.cms.IT_DEC.service;

import com.cms.IT_DEC.model.Regime;

import java.util.List;
import java.util.Optional;

public interface RegimeService {

    Regime saveRegime(Regime regime);

    Regime updateRegime(Long regimeId, Regime regime);

    Optional<Regime> getRegimeById(Long regimeId);

    List<Regime> getAllRegimes();

    Optional<Regime> findByEmpCode(String empCode);

    void deleteRegime(Long regimeId);

    Regime updateRegimeByEmpCode(String empCode, Regime regime);
}
