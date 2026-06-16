package com.cdl.epms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication(
		scanBasePackages = {
				"com.cdl.epms",
				"com.cms.cdl.common_dtos"
		}
)
@EnableAsync
public class EpmsApplication {

	public static void main(String[] args) {
		SpringApplication.run(EpmsApplication.class, args);
	}

}
