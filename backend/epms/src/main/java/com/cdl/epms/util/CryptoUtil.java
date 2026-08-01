package com.cdl.epms.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Slf4j
@Component
public class CryptoUtil {

    @Value("${epms.security.secret-key:CdlEpmsSecretKey123456789012345}")
    private String secretKey;

    private static final String SIMPLE_SECRET = "8F3dK9@Q!2zL7X#A";
    private static final String ALGORITHM = "AES";

    /**
     * Encrypt plain employee code or text into a URL-safe Base64 token.
     */
    public String encrypt(String plainText) {
        if (plainText == null || plainText.trim().isEmpty()) {
            return plainText;
        }
        try {
            SecretKeySpec key = new SecretKeySpec(getKeyBytes(), ALGORITHM);
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, key);
            byte[] encryptedBytes = cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(encryptedBytes);
        } catch (Exception e) {
            log.error("Error encrypting value: {}", e.getMessage());
            return plainText;
        }
    }

    /**
     * Decrypt a URL-safe Base64 token back to plain text.
     */
    public String decrypt(String encryptedText) {
        if (encryptedText == null || encryptedText.trim().isEmpty()) {
            return encryptedText;
        }

        String token = encryptedText;
        try {
            token = URLDecoder.decode(encryptedText, StandardCharsets.UTF_8.name());
        } catch (Exception ignored) {}

        // 1. Try simpleEncrypt token format (Base64 -> reverse -> SECRET:VALUE:TIMESTAMP)
        try {
            byte[] decoded = Base64.getDecoder().decode(token);
            String reversed = new String(decoded, StandardCharsets.UTF_8);
            String combined = new StringBuilder(reversed).reverse().toString();
            String[] parts = combined.split(":");
            if (parts.length >= 3 && (parts[0].equals(SIMPLE_SECRET) || parts[0].equals(secretKey))) {
                return parts[1];
            }
        } catch (Exception ignored) {}

        // 2. Try URL-safe Base64 simpleEncrypt format
        try {
            byte[] decoded = Base64.getUrlDecoder().decode(token);
            String reversed = new String(decoded, StandardCharsets.UTF_8);
            String combined = new StringBuilder(reversed).reverse().toString();
            String[] parts = combined.split(":");
            if (parts.length >= 3 && (parts[0].equals(SIMPLE_SECRET) || parts[0].equals(secretKey))) {
                return parts[1];
            }
        } catch (Exception ignored) {}

        // 3. Try AES decryption
        try {
            SecretKeySpec key = new SecretKeySpec(getKeyBytes(), ALGORITHM);
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, key);
            byte[] decodedBytes = Base64.getUrlDecoder().decode(token);
            byte[] decryptedBytes = cipher.doFinal(decodedBytes);
            return new String(decryptedBytes, StandardCharsets.UTF_8);
        } catch (Exception ignored) {}

        throw new IllegalArgumentException("Invalid or corrupted employee token");
    }

    /**
     * Decrypts input if it is encrypted. If input is already plain text or decryption fails, returns input.
     */
    public String decryptIfEncrypted(String input) {
        if (input == null || input.trim().isEmpty()) {
            return input;
        }
        try {
            return decrypt(input);
        } catch (Exception e) {
            log.debug("Input '{}' is not an encrypted token, returning as-is", input);
            return input;
        }
    }

    private byte[] getKeyBytes() {
        byte[] keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
        byte[] finalKey = new byte[16]; // 128-bit key buffer
        System.arraycopy(keyBytes, 0, finalKey, 0, Math.min(keyBytes.length, finalKey.length));
        return finalKey;
    }
}
