package com.cms.IT_DEC;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(scanBasePackages = {
		"com.cms.IT_DEC",
		"com.cms.cdl.common_dtos"
})
@EnableScheduling
@EnableJpaAuditing
@EnableCaching  // Make sure this is enabled
public class ItDecApplication {

	public static void main(String[] args) {
		SpringApplication.run(ItDecApplication.class, args);
	}
}