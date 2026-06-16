package com.example.reportDownloadedRecord;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {
"com.example.reportDownloadedRecord",
"com.cms.cdl.common_dtos"
})
public class ReportDownloadedRecordApplication {

	public static void main(String[] args) {
		SpringApplication.run(ReportDownloadedRecordApplication.class, args);
	}

}
