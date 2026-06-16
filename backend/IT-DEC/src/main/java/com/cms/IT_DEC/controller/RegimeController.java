package com.cms.IT_DEC.controller;

import com.cms.IT_DEC.model.Regime;
import com.cms.IT_DEC.service.RegimeService;
import com.cms.cdl.common_dtos.AES_enc_decy.SimpleEncryptorDecryptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/regimes")
public class RegimeController {

    @Autowired
    SimpleEncryptorDecryptor simpleEncryptorDecryptor;

    private final RegimeService regimeService;

    public RegimeController(RegimeService regimeService) {
        this.regimeService = regimeService;
    }

    @PostMapping
    public ResponseEntity<Regime> createRegime(@RequestBody Regime regime) {
        Regime response = regimeService.saveRegime(regime);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Regime> updateRegime(
            @PathVariable Long id,
            @RequestBody Regime regime) {

        String decId = simpleEncryptorDecryptor.simpleDecrypt(String.valueOf(id));
        Regime response = regimeService.updateRegime(Long.valueOf(decId), regime);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Regime> getRegimeById(@PathVariable Long id) {
        String decId = simpleEncryptorDecryptor.simpleDecrypt(String.valueOf(id));
        return regimeService.getRegimeById(Long.valueOf(decId))
                .map(regime -> ResponseEntity
                        .status(HttpStatus.OK)
                        .body(regime))
                .orElse(ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .build());
    }

    @GetMapping
    public ResponseEntity<List<Regime>> getAllRegimes() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(regimeService.getAllRegimes());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRegime(@PathVariable Long id) {
        String decId = simpleEncryptorDecryptor.simpleDecrypt(String.valueOf(id));
        regimeService.deleteRegime(Long.valueOf(decId));
        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .build();
    }

    @GetMapping("/emp/{empCode}")
    public ResponseEntity<Regime> getRegimeByEmpCode(@PathVariable String empCode) {
        String decEmpCode = simpleEncryptorDecryptor.simpleDecrypt(empCode);
        return regimeService.findByEmpCode(decEmpCode)
                .map(regime -> ResponseEntity.ok(regime))
                .orElse(ResponseEntity.ok(null));
    }


    @PutMapping("/emp/{empCode}")
    public ResponseEntity<Regime> updateRegimeByEmpCode(@PathVariable String empCode, @RequestBody Regime regime) {
        String decEmpCode = simpleEncryptorDecryptor.simpleDecrypt(empCode);
        Regime response = regimeService.updateRegimeByEmpCode(decEmpCode, regime);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(response);
    }

}
