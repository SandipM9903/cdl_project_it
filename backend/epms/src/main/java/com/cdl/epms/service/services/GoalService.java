package com.cdl.epms.service.services;

import com.cdl.epms.common.enums.Quarter;
import com.cdl.epms.dto.goal.*;
import com.cdl.epms.model.Goal;

import java.util.List;

public interface GoalService {

    // ==================== GOAL CRUD ====================
    Goal saveGoal(Goal goal, Quarter quarter);
    Goal saveGoalAsDraft(Goal goal, Quarter quarter);
    Goal updateGoalDraft(Long goalId, Goal goal);
    Goal submitGoalDraft(Long goalId);
    List<Goal> submitAllDraftGoals(String employeeId, Quarter quarter, Integer year);
    void deleteGoal(Long goalId);
    List<Goal> getGoalsByEmployee(String employeeId, Quarter quarter, Integer year);
    List<Goal> getDraftGoalsByEmployee(String employeeId, Quarter quarter, Integer year);
    List<Goal> getAllGoalsForEditing(String employeeId, Quarter quarter, Integer year);

    // Validate total weightage = 100%
    void validateWeightageTotal(String employeeId, Quarter quarter, Integer year);

    // ==================== MANAGER APPROVAL (Step 5) ====================
    List<Goal> approveOrSendBackGoals(ManagerApprovalRequestDto requestDto);
    List<String> getTeamEmployeesByManager(String managerId, Quarter quarter);
    List<Goal> getGoalsForManagerApproval(String managerId, String employeeId, Quarter quarter);

    // ==================== EMPLOYEE SELF REVIEW (Step 6) ====================
    List<Goal> submitSelfReview(SelfReviewRequestDto requestDto);
    List<Goal> getGoalsPendingSelfReview(String employeeId, Quarter quarter, Integer year);

    // ==================== MANAGER FINAL REVIEW (Step 7) ====================
    List<Goal> submitManagerFinalReview(ManagerFinalReviewRequestDto requestDto);
    List<Goal> getGoalsForManagerFinalReview(String managerId, String employeeId, Quarter quarter);

    // ==================== EMPLOYEE ACCEPTANCE (Step 8) ====================
    List<Goal> getPendingGoalsForAcceptance(String employeeId, Quarter quarter, Integer year);
    void acceptReviewedGoals(String employeeId, Quarter quarter, Integer year);

    // ==================== HR OPERATIONS ====================
    void finalSubmitToHR(String employeeId, Quarter quarter);

    // ==================== BULK OPERATIONS ====================
    void deleteGoals(List<Long> goalIds);
}