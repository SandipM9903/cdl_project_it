package com.cms.IT_DEC.service.impl;

import com.cms.IT_DEC.model.Regime;
import com.cms.IT_DEC.repository.RegimeRepository;
import com.cms.IT_DEC.service.RegimeService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RegimeServiceImpl implements RegimeService {

    private final RegimeRepository regimeRepository;

    public RegimeServiceImpl(RegimeRepository regimeRepository) {
        this.regimeRepository = regimeRepository;
    }

    // ================= SAVE =================
    @Override
    public Regime saveRegime(Regime regime) {

        regime.setCreatedDate(LocalDateTime.now());
        regime.setModifiedDate(LocalDateTime.now());

        return regimeRepository.save(regime);
    }

    // ================= UPDATE BY ID =================
    @Override
    public Regime updateRegime(Long regimeId, Regime regime) {

        Regime existingRegime = regimeRepository.findById(regimeId)
                .orElseThrow(() ->
                        new RuntimeException("Regime not found with id: " + regimeId));

        existingRegime.setEmpCode(regime.getEmpCode());
        existingRegime.setRegime(regime.getRegime());
        existingRegime.setModifiedDate(LocalDateTime.now());

        return regimeRepository.save(existingRegime);
    }

    // ================= GET BY ID =================
    @Override
    public Optional<Regime> getRegimeById(Long regimeId) {
        return regimeRepository.findById(regimeId);
    }

    // ================= GET ALL =================
    @Override
    public List<Regime> getAllRegimes() {
        return regimeRepository.findAll();
    }

    // ================= DELETE =================
    @Override
    public void deleteRegime(Long regimeId) {

        if (!regimeRepository.existsById(regimeId)) {
            throw new RuntimeException("Regime not found with id: " + regimeId);
        }

        regimeRepository.deleteById(regimeId);
    }

    // ================= FIND BY EMP CODE =================
    @Override
    public Optional<Regime> findByEmpCode(String empCode) {
        return regimeRepository.findByEmpCode(empCode);
    }

    // ================= UPDATE BY EMP CODE =================
    @Override
    public Regime updateRegimeByEmpCode(String empCode, Regime regime) {

        Regime existingRegime =
                regimeRepository.findByEmpCode(empCode)
                        .orElseThrow(() ->
                                new RuntimeException("Not found"));

        existingRegime.setRegime(regime.getRegime());

        if (existingRegime.getCreatedDate() == null) {
            System.out.println("SETTING CREATED DATE");
            existingRegime.setCreatedDate(LocalDateTime.now());
        }

        existingRegime.setModifiedDate(LocalDateTime.now());

        return regimeRepository.save(existingRegime);
    }
}