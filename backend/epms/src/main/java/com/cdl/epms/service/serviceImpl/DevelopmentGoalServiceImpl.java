package com.cdl.epms.service.serviceImpl;

import com.cdl.epms.common.enums.CycleStatus;
import com.cdl.epms.common.enums.GoalStatus;
import com.cdl.epms.common.enums.Quarter;
import com.cdl.epms.dto.goal.CreateDevelopmentGoalRequestDto;
import com.cdl.epms.exception.ConflictException;
import com.cdl.epms.exception.ResourceNotFoundException;
import com.cdl.epms.exception.ValidationException;
import com.cdl.epms.model.DevelopmentGoal;
import com.cdl.epms.model.PerformanceCycle;
import com.cdl.epms.repository.DevelopmentGoalRepository;
import com.cdl.epms.repository.PerformanceCycleRepository;
import com.cdl.epms.service.services.DevelopmentGoalService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DevelopmentGoalServiceImpl implements DevelopmentGoalService {

    private final DevelopmentGoalRepository developmentGoalRepository;
    private final PerformanceCycleRepository cycleRepository;

    private PerformanceCycle getActiveCycle() {
        return cycleRepository.findByStatus(CycleStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("No active cycle found"));
    }

    @Override
    @Transactional
    public DevelopmentGoal createDevelopmentGoal(CreateDevelopmentGoalRequestDto requestDto, Quarter quarter) {
        log.info("Creating development goal for employee: {}, quarter: {}", requestDto.getEmployeeId(), quarter);

        PerformanceCycle activeCycle = getActiveCycle();

        if (quarter == null) throw new ValidationException("Quarter is required");
        if (requestDto.getEmployeeId() == null || requestDto.getEmployeeId().trim().isEmpty()) {
            throw new ValidationException("Employee ID is required");
        }
        if (requestDto.getTitle() == null || requestDto.getTitle().trim().isEmpty()) {
            throw new ValidationException("Title is required");
        }
        if (requestDto.getTrainingName() == null || requestDto.getTrainingName().trim().isEmpty()) {
            throw new ValidationException("Training name is required");
        }

        // Check for duplicate title
        if (developmentGoalRepository.existsByEmployeeIdAndQuarterAndYearAndTitle(
                requestDto.getEmployeeId(), quarter, activeCycle.getYear(), requestDto.getTitle())) {
            throw new ConflictException("A development goal with this title already exists for this quarter");
        }

        DevelopmentGoal goal = new DevelopmentGoal();
        goal.setPerformanceCycle(activeCycle);
        goal.setYear(activeCycle.getYear());
        goal.setQuarter(quarter);
        goal.setEmployeeId(requestDto.getEmployeeId());
        goal.setManagerId(requestDto.getManagerId());
        goal.setTitle(requestDto.getTitle());
        goal.setTrainingName(requestDto.getTrainingName());
        goal.setDescription(requestDto.getDescription());

        if (requestDto.getSelfAssessmentScore() != null) {
            goal.setSelfAssessmentScore(requestDto.getSelfAssessmentScore());
        }

        goal.setStatus(GoalStatus.PENDING_APPROVAL);
        goal.setCreatedAt(LocalDateTime.now());
        goal.setUpdatedAt(LocalDateTime.now());

        log.info("Saving development goal: {}", goal.getTitle());
        return developmentGoalRepository.save(goal);
    }

    @Override
    @Transactional
    public DevelopmentGoal updateDevelopmentGoal(Long goalId, CreateDevelopmentGoalRequestDto requestDto) {
        log.info("Updating development goal: {}", goalId);

        DevelopmentGoal goal = developmentGoalRepository.findById(goalId)
                .orElseThrow(() -> new ResourceNotFoundException("Development goal not found with id: " + goalId));

        // Allow update for DRAFT, SENT_BACK, and PENDING_APPROVAL status
        if (goal.getStatus() != GoalStatus.DRAFT &&
                goal.getStatus() != GoalStatus.SENT_BACK &&
                goal.getStatus() != GoalStatus.PENDING_APPROVAL) {
            throw new ValidationException("Only goals in DRAFT, SENT_BACK, or PENDING_APPROVAL status can be updated. Current status: " + goal.getStatus());
        }

        if (requestDto.getTitle() != null && !requestDto.getTitle().trim().isEmpty()) {
            goal.setTitle(requestDto.getTitle());
        }
        if (requestDto.getTrainingName() != null && !requestDto.getTrainingName().trim().isEmpty()) {
            goal.setTrainingName(requestDto.getTrainingName());
        }
        if (requestDto.getDescription() != null) {
            goal.setDescription(requestDto.getDescription());
        }
        if (requestDto.getSelfAssessmentScore() != null) {
            if (requestDto.getSelfAssessmentScore() < 0 || requestDto.getSelfAssessmentScore() > 100) {
                throw new ValidationException("Self assessment score must be between 0 and 100");
            }
            goal.setSelfAssessmentScore(requestDto.getSelfAssessmentScore());
        }

        goal.setUpdatedAt(LocalDateTime.now());

        DevelopmentGoal updatedGoal = developmentGoalRepository.save(goal);
        log.info("Development goal updated successfully with ID: {}", updatedGoal.getId());

        return updatedGoal;
    }

    @Override
    @Transactional
    public void deleteDevelopmentGoal(Long goalId) {
        log.info("Deleting development goal: {}", goalId);

        DevelopmentGoal goal = developmentGoalRepository.findById(goalId)
                .orElseThrow(() -> new ResourceNotFoundException("Development goal not found"));

        if (goal.getStatus() == GoalStatus.ACCEPTED_BY_EMPLOYEE) {
            throw new ValidationException("Cannot delete a goal that has been accepted");
        }

        developmentGoalRepository.delete(goal);
    }

    @Override
    public List<DevelopmentGoal> getDevelopmentGoalsByEmployee(String employeeId, Quarter quarter, Integer year) {
        log.info("Fetching development goals for employee: {}, quarter: {}, year: {}", employeeId, quarter, year);
        return developmentGoalRepository.findByEmployeeIdAndQuarterAndYear(employeeId, quarter, year);
    }

    @Override
    public List<DevelopmentGoal> getDevelopmentGoalsByManager(String managerId, Quarter quarter, Integer year) {
        log.info("Fetching development goals for manager: {}, quarter: {}, year: {}", managerId, quarter, year);
        return developmentGoalRepository.findByManagerIdAndQuarterAndYear(managerId, quarter, year);
    }

    @Override
    public DevelopmentGoal getDevelopmentGoalById(Long goalId) {
        return developmentGoalRepository.findById(goalId)
                .orElseThrow(() -> new ResourceNotFoundException("Development goal not found"));
    }

    @Override
    @Transactional
    public DevelopmentGoal submitForApproval(Long goalId) {
        DevelopmentGoal goal = developmentGoalRepository.findById(goalId)
                .orElseThrow(() -> new ResourceNotFoundException("Development goal not found"));

        if (goal.getStatus() != GoalStatus.DRAFT && goal.getStatus() != GoalStatus.SENT_BACK) {
            throw new ValidationException("Only draft or sent back goals can be submitted for approval");
        }

        goal.setStatus(GoalStatus.PENDING_APPROVAL);
        goal.setSubmittedToEmployeeAt(LocalDateTime.now());
        goal.setUpdatedAt(LocalDateTime.now());

        return developmentGoalRepository.save(goal);
    }

    @Override
    @Transactional
    public DevelopmentGoal approveGoal(Long goalId, String managerComment) {
        DevelopmentGoal goal = developmentGoalRepository.findById(goalId)
                .orElseThrow(() -> new ResourceNotFoundException("Development goal not found"));

        if (goal.getStatus() != GoalStatus.PENDING_APPROVAL) {
            throw new ValidationException("Goal is not pending approval");
        }

        goal.setStatus(GoalStatus.APPROVED);
        if (managerComment != null) {
            goal.setManagerApprovalComment(managerComment);
        }
        goal.setUpdatedAt(LocalDateTime.now());

        return developmentGoalRepository.save(goal);
    }

    @Override
    @Transactional
    public DevelopmentGoal sendBackGoal(Long goalId, String managerComment) {
        DevelopmentGoal goal = developmentGoalRepository.findById(goalId)
                .orElseThrow(() -> new ResourceNotFoundException("Development goal not found"));

        if (goal.getStatus() != GoalStatus.PENDING_APPROVAL) {
            throw new ValidationException("Goal is not pending approval");
        }

        goal.setStatus(GoalStatus.SENT_BACK);
        goal.setManagerApprovalComment(managerComment);
        goal.setUpdatedAt(LocalDateTime.now());

        return developmentGoalRepository.save(goal);
    }

    @Override
    @Transactional
    public DevelopmentGoal submitSelfReview(Long goalId, Integer selfAssessmentScore) {
        DevelopmentGoal goal = developmentGoalRepository.findById(goalId)
                .orElseThrow(() -> new ResourceNotFoundException("Development goal not found"));

        if (goal.getStatus() != GoalStatus.APPROVED) {
            throw new ValidationException("Goal must be approved before self review");
        }

        goal.setSelfAssessmentScore(selfAssessmentScore);
        goal.setSelfReviewSubmittedDate(LocalDateTime.now());
        goal.setStatus(GoalStatus.SELF_REVIEWED);
        goal.setUpdatedAt(LocalDateTime.now());

        return developmentGoalRepository.save(goal);
    }

    @Override
    @Transactional
    public DevelopmentGoal submitManagerAssessment(Long goalId, Integer managerAssessmentScore, String managerComment) {
        DevelopmentGoal goal = developmentGoalRepository.findById(goalId)
                .orElseThrow(() -> new ResourceNotFoundException("Development goal not found"));

        if (goal.getStatus() != GoalStatus.SELF_REVIEWED) {
            throw new ValidationException("Self review must be completed before manager assessment");
        }

        goal.setManagerAssessmentScore(managerAssessmentScore);
        goal.setManagerComment(managerComment);
        goal.setReviewedAt(LocalDateTime.now());
        goal.setStatus(GoalStatus.MANAGER_REVIEWED);
        goal.setUpdatedAt(LocalDateTime.now());

        return developmentGoalRepository.save(goal);
    }

    @Override
    @Transactional
    public DevelopmentGoal acceptGoal(Long goalId) {
        DevelopmentGoal goal = developmentGoalRepository.findById(goalId)
                .orElseThrow(() -> new ResourceNotFoundException("Development goal not found"));

        if (goal.getStatus() != GoalStatus.MANAGER_REVIEWED) {
            throw new ValidationException("Manager review must be completed before acceptance");
        }

        goal.setStatus(GoalStatus.ACCEPTED_BY_EMPLOYEE);
        goal.setSelfAcceptedDate(LocalDateTime.now());
        goal.setUpdatedAt(LocalDateTime.now());

        return developmentGoalRepository.save(goal);
    }
}