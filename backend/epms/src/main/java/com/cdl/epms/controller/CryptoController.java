package com.cdl.epms.controller;

import com.cdl.epms.util.CryptoUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/crypto")
@CrossOrigin("*")
@RequiredArgsConstructor
public class CryptoController {

    private final CryptoUtil cryptoUtil;

    @GetMapping("/encrypt/{text}")
    public ResponseEntity<Map<String, String>> encrypt(@PathVariable String text) {
        String encrypted = cryptoUtil.encrypt(text);
        return ResponseEntity.ok(Map.of(
                "original", text,
                "token", encrypted
        ));
    }

    @GetMapping("/decrypt/{token}")
    public ResponseEntity<Map<String, String>> decrypt(@PathVariable String token) {
        String decrypted = cryptoUtil.decryptIfEncrypted(token);
        return ResponseEntity.ok(Map.of(
                "token", token,
                "decrypted", decrypted
        ));
    }
}
