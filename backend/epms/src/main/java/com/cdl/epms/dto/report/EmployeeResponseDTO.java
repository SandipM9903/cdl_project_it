package com.cdl.epms.dto.report;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class EmployeeResponseDTO {

    @JsonProperty("fileAndObjectTypeBean")
    private FileAndObjectTypeBean fileAndObjectTypeBean;

    @JsonProperty("userDTO")
    private UserDTO userDTO;

    // Manager details fields
    private String managerEmpCode;
    private String managerFullName;
    private String managerEmailId;

    @Data
    @NoArgsConstructor
    public static class FileAndObjectTypeBean {
        @JsonProperty("empResDTO")
        private EmpResDTO empResDTO;
    }

    @Data
    @NoArgsConstructor
    public static class EmpResDTO {
        private String empCode;
        private String firstName;
        private String lastName;
        private String fullNameAsAadhaar;  // This will be used for employee full name
        private String emailId;
        private String reportTo;           // Manager Emp Code
        private String reportingManager;   // Manager Full Name
        private String reportingManagerEmailId;

        @JsonProperty("mainDeptResDTO")
        private MainDeptResDTO mainDeptResDTO;

        @JsonProperty("subDeptResDTO")
        private SubDeptResDTO subDeptResDTO;

        @Data
        @NoArgsConstructor
        public static class MainDeptResDTO {
            private String mainDepartment;
        }

        @Data
        @NoArgsConstructor
        public static class SubDeptResDTO {
            private String subDept;
        }
    }

    @Data
    @NoArgsConstructor
    public static class UserDTO {
        @JsonProperty("locationResDTO")
        private LocationResDTO locationResDTO;

        @Data
        @NoArgsConstructor
        public static class LocationResDTO {
            private String locationName;
            private String city;
            private String state;
            private String country;
        }
    }

    // Helper method to extract full name - NOW USING ONLY fullNameAsAadhaar
    public String getFullName() {
        if (fileAndObjectTypeBean != null && fileAndObjectTypeBean.empResDTO != null) {
            return fileAndObjectTypeBean.empResDTO.getFullNameAsAadhaar();
        }
        return null;
    }

    // Helper method to extract main department
    public String getMainDepartment() {
        if (fileAndObjectTypeBean != null &&
                fileAndObjectTypeBean.empResDTO != null &&
                fileAndObjectTypeBean.empResDTO.mainDeptResDTO != null) {
            return fileAndObjectTypeBean.empResDTO.mainDeptResDTO.mainDepartment;
        }
        return null;
    }

    // Helper method to extract sub department
    public String getSubDepartment() {
        if (fileAndObjectTypeBean != null &&
                fileAndObjectTypeBean.empResDTO != null &&
                fileAndObjectTypeBean.empResDTO.subDeptResDTO != null) {
            return fileAndObjectTypeBean.empResDTO.subDeptResDTO.subDept;
        }
        return null;
    }

    // Helper method to extract location name
    public String getLocationName() {
        if (userDTO != null && userDTO.locationResDTO != null) {
            return userDTO.locationResDTO.getLocationName();
        }
        return null;
    }

    // Helper method to extract manager emp code (reportTo)
    public String getManagerEmpCode() {
        if (fileAndObjectTypeBean != null && fileAndObjectTypeBean.empResDTO != null) {
            return fileAndObjectTypeBean.empResDTO.getReportTo();
        }
        return null;
    }

    // Helper method to extract manager full name (reportingManager)
    public String getManagerFullName() {
        if (fileAndObjectTypeBean != null && fileAndObjectTypeBean.empResDTO != null) {
            return fileAndObjectTypeBean.empResDTO.getReportingManager();
        }
        return null;
    }

    // Helper method to extract manager email ID
    public String getManagerEmailId() {
        if (fileAndObjectTypeBean != null && fileAndObjectTypeBean.empResDTO != null) {
            return fileAndObjectTypeBean.empResDTO.getReportingManagerEmailId();
        }
        return null;
    }
}