package com.cdl.epms.dto.annualReview;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnnualReviewRequestDto {
    private Long id;
    private String employeeId;
    private String managerId;
    private String financialYear;
    private String keyAccomplishment;
    private Boolean useNAOption;
    private List<CertificationDto> certifications;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CertificationDto {
        private Long id;
        private String name;
        private String type;
    }
}