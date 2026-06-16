package com.cdl.epms.service.services;

import com.cdl.epms.common.enums.Quarter;
import com.cdl.epms.dto.goal.CreateDevelopmentGoalRequestDto;
import com.cdl.epms.dto.goal.DevelopmentGoalResponseDto;
import com.cdl.epms.model.DevelopmentGoal;

import java.util.List;

public interface DevelopmentGoalService {

    // Create/Update/Delete
    DevelopmentGoal createDevelopmentGoal(CreateDevelopmentGoalRequestDto requestDto, Quarter quarter);
    DevelopmentGoal updateDevelopmentGoal(Long goalId, CreateDevelopmentGoalRequestDto requestDto);
    void deleteDevelopmentGoal(Long goalId);

    // Fetch
    List<DevelopmentGoal> getDevelopmentGoalsByEmployee(String employeeId, Quarter quarter, Integer year);
    List<DevelopmentGoal> getDevelopmentGoalsByManager(String managerId, Quarter quarter, Integer year);
    DevelopmentGoal getDevelopmentGoalById(Long goalId);

    // Status updates
    DevelopmentGoal submitForApproval(Long goalId);
    DevelopmentGoal approveGoal(Long goalId, String managerComment);
    DevelopmentGoal sendBackGoal(Long goalId, String managerComment);
    DevelopmentGoal submitSelfReview(Long goalId, Integer selfAssessmentScore);
    DevelopmentGoal submitManagerAssessment(Long goalId, Integer managerAssessmentScore, String managerComment);
    DevelopmentGoal acceptGoal(Long goalId);
}