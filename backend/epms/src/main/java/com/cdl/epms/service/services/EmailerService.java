package com.cdl.epms.service.services;

import java.util.List;
import java.util.Map;

public interface EmailerService {
    void publishEmailToAllEmployees(Long cycleId, String customSubject, String customBody);
    void sendReminderToAllEmployees(Long cycleId);
    void sendAnnualReviewSendBackEmail(Long reviewId, String remarks, String employeeId, String managerId, Integer year);
    void sendAnnualReviewSendBackEmail(Long reviewId, String remarks, String employeeId,
                                       String managerId, Integer year, int attemptCount,
                                       boolean isLastAttempt);
    void sendEmployeeGSSubmissionNotification(Long reviewId, String employeeId, String managerId, String financialYear);
    void sendManagerGSSubmissionNotification(Long reviewId, String employeeId, String managerId, String financialYear);
    void sendManagerReviewSubmittedToEmployeeNotification(Long reviewId, String employeeId, String managerId, String financialYear);
    void sendSendBackNotifications(Long reviewId, String employeeId, String managerId,
                                   String financialYear, String remarks, int attemptCount);
    void sendHRSubmissionNotification(Long reviewId, String employeeId, String financialYear);

    void sendGoalSubmissionToManager(String employeeId, String managerId, String quarter, String year, List<Map<String, Object>> goals);
    void sendGoalSubmissionToEmployee(String employeeId, String managerId, String quarter, String year, List<Map<String, Object>> goals);

    void sendGoalApprovalToEmployee(String employeeId, String managerId, String quarter, String year, List<Map<String, Object>> goals);
    void sendGoalRejectionToEmployee(String employeeId, String managerId, String quarter, String year, List<Map<String, Object>> goals, String rejectionReason);

    void sendGoalSelfReviewSubmittedToManager(String employeeId, String managerId, String quarter, String year, List<Map<String, Object>> goals, int overallRating);
    void sendGoalSelfReviewSubmittedToEmployee(String employeeId, String managerId, String quarter, String year, List<Map<String, Object>> goals, int overallRating);

    void sendGoalManagerReviewSubmittedToEmployee(String employeeId, String managerId, String quarter, String year, List<Map<String, Object>> goals, int overallRating, String managerRating);
    void sendGoalManagerReviewSubmittedToHR(String employeeId, String managerId, String quarter, String year, List<Map<String, Object>> goals, int overallRating);

    void sendGoalAcceptedByEmployeeToManager(String employeeId, String managerId, String quarter, String year);

    void sendAcceptanceNotification(String employeeId, String managerEmailId, String employeeName,
                                    String managerName, String quarter, String year,
                                    String financialYear, String acceptanceDate, String acceptanceTime);

    // ✅ NEW UNIFIED METHOD FOR ALL CYCLE ACTIONS
    void sendUnifiedCycleEmail(Long cycleId, String actionType, String customSubject, String customBody, String newExpiryDate);
}