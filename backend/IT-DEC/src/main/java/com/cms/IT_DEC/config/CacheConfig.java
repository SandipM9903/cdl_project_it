package com.cms.IT_DEC.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.cache.caffeine.CaffeineCacheManager;

import java.util.concurrent.TimeUnit;

@Configuration
@EnableCaching
public class CacheConfig {

    /**
     * Caffeine Cache Manager for better performance and control
     */
    @Bean
    @Primary
    public CacheManager caffeineCacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager(
                "allEmployees",
                "employeeAddress",
                "employeeReports",
                "employeeReportByYear",
                "decInfoByEidAndFinYr",
                "saveStatusForSec80c",
                "decAmtForSec80c",
                "saveStatusForSec80d",
                "decAmtForSec80d"
        );

        cacheManager.setCaffeine(Caffeine.newBuilder()
                .expireAfterWrite(1, TimeUnit.HOURS)    // Cache expires after 1 hour
                .expireAfterAccess(30, TimeUnit.MINUTES) // Expire if not accessed for 30 min
                .maximumSize(1000)                       // Max 1000 entries in cache
                .recordStats()                           // Record cache statistics
        );

        return cacheManager;
    }

    /**
     * Simple ConcurrentMap Cache Manager as fallback
     */
    @Bean
    public CacheManager simpleCacheManager() {
        return new ConcurrentMapCacheManager(
                "allEmployees",
                "employeeAddress",
                "employeeReports",
                "employeeReportByYear",
                "decInfoByEidAndFinYr",
                "saveStatusForSec80c",
                "decAmtForSec80c",
                "saveStatusForSec80d",
                "decAmtForSec80d"
        );
    }
}