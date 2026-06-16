package com.cms.IT_DEC.controller;

import com.cms.IT_DEC.service.EmployeeClientService;
import com.cms.IT_DEC.service.impl.IT_Declaration_Info_ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/cache")
@CrossOrigin("*")
public class CacheManagementController {

    @Autowired
    private CacheManager cacheManager;

    @Autowired
    private EmployeeClientService employeeClientService;

    @Autowired
    private IT_Declaration_Info_ServiceImpl declarationInfoService;

    /**
     * Get cache statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getCacheStats() {
        Map<String, Object> stats = new HashMap<>();

        cacheManager.getCacheNames().forEach(cacheName -> {
            var cache = cacheManager.getCache(cacheName);
            if (cache != null) {
                stats.put(cacheName, "Active");
            }
        });

        stats.put("availableCaches", cacheManager.getCacheNames());
        return ResponseEntity.ok(stats);
    }

    /**
     * Clear all caches
     */
    @DeleteMapping("/clear-all")
    public ResponseEntity<String> clearAllCaches() {
        cacheManager.getCacheNames().forEach(cacheName -> {
            Objects.requireNonNull(cacheManager.getCache(cacheName)).clear();
        });
        employeeClientService.clearEmployeeCache();
        declarationInfoService.clearReportCache();
        return ResponseEntity.ok("All caches cleared successfully");
    }

    /**
     * Clear specific cache
     */
    @DeleteMapping("/clear/{cacheName}")
    public ResponseEntity<String> clearCache(@PathVariable String cacheName) {
        var cache = cacheManager.getCache(cacheName);
        if (cache != null) {
            cache.clear();
            return ResponseEntity.ok("Cache '" + cacheName + "' cleared successfully");
        }
        return ResponseEntity.badRequest().body("Cache '" + cacheName + "' not found");
    }

    /**
     * Clear employee caches
     */
    @DeleteMapping("/clear-employees")
    public ResponseEntity<String> clearEmployeeCaches() {
        employeeClientService.clearEmployeeCache();
        return ResponseEntity.ok("Employee caches cleared successfully");
    }

    /**
     * Clear report caches
     */
    @DeleteMapping("/clear-reports")
    public ResponseEntity<String> clearReportCaches() {
        declarationInfoService.clearReportCache();
        return ResponseEntity.ok("Report caches cleared successfully");
    }
}