package com.cdl.epms.service.serviceImpl;

import com.cdl.epms.common.enums.*;
import com.cdl.epms.dto.goal.*;
import com.cdl.epms.exception.ConflictException;
import com.cdl.epms.exception.ResourceNotFoundException;
import com.cdl.epms.exception.ValidationException;
import com.cdl.epms.model.Goal;
import com.cdl.epms.model.PerformanceCycle;
import com.cdl.epms.repository.GoalRepository;
import com.cdl.epms.repository.PerformanceCycleRepository;
import com.cdl.epms.service.services.EmailerService;
import com.cdl.epms.service.services.GoalService;
import com.cdl.epms.util.GoalCategoryUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class GoalServiceImpl implements GoalService {

    private final GoalRepository goalRepository;
    private final PerformanceCycleRepository cycleRepository;
    private final EmailerService emailerService;

    private PerformanceCycle getActiveCycle() {
        return cycleRepository.findByStatus(CycleStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("No active cycle found"));
    }

    // ==================== VALIDATION ====================

    @Override
    public void validateWeightageTotal(String employeeId, Quarter quarter, Integer year) {
        List<Goal> goals = goalRepository.findByEmployeeIdAndQuarterAndYearAndGoalType(
                employeeId, quarter, year, GoalType.SMART);

        int totalWeightage = goals.stream()
                .filter(g -> g.getWeightage() != null)
                .mapToInt(Goal::getWeightage)
                .sum();

        if (totalWeightage != 100) {
            throw new ValidationException("Total weightage must be 100%. Current total: " + totalWeightage + "%");
        }
    }

    // ==================== GOAL CRUD (Step 4 - Employee creates goals) ====================

    @Override
    @Transactional
    public Goal saveGoal(Goal goal, Quarter quarter) {
        log.info("=== SAVE GOAL START ===");
        log.info("EmployeeId: {}", goal.getEmployeeId());
        log.info("ManagerId: {}", goal.getManagerId());
        log.info("Title: {}", goal.getTitle());
        log.info("Target: {}", goal.getTarget());
        log.info("Weightage: {}", goal.getWeightage());
        log.info("Quarter: {}", quarter);

        PerformanceCycle activeCycle = getActiveCycle();
        log.info("Active cycle - Year: {}, Status: {}", activeCycle.getYear(), activeCycle.getStatus());

        if (quarter == null) throw new ValidationException("Quarter is required");
        if (goal.getEmployeeId() == null || goal.getEmployeeId().trim().isEmpty()) {
            throw new ValidationException("Employee ID is required");
        }
        if (goal.getTitle() == null || goal.getTitle().trim().isEmpty()) {
            throw new ValidationException("Goal title is required");
        }

        if (goalRepository.existsByEmployeeIdAndQuarterAndYearAndTitle(
                goal.getEmployeeId(), quarter, activeCycle.getYear(), goal.getTitle())) {
            throw new ConflictException("A goal with this title already exists for this quarter");
        }

        Goal newGoal = new Goal();
        newGoal.setPerformanceCycle(activeCycle);
        newGoal.setYear(activeCycle.getYear());
        newGoal.setQuarter(quarter);
        newGoal.setEmployeeId(goal.getEmployeeId());
        newGoal.setManagerId(goal.getManagerId());
        newGoal.setGoalType(GoalType.SMART);
        newGoal.setGoalCategory("CUSTOM");
        newGoal.setTitle(goal.getTitle());
        newGoal.setTarget(goal.getTarget());
        newGoal.setWeightage(goal.getWeightage() != null ? goal.getWeightage() : 0);
        newGoal.setCreatedAt(LocalDateTime.now());
        newGoal.setStatus(GoalStatus.PENDING_APPROVAL);

        newGoal.setRemarks("");
        newGoal.setManagerComment("");
        newGoal.setManagerApprovalComment("");
        newGoal.setOverallSelfReviewComments("");
        newGoal.setManagerOverallSelfReviewComments("");
        newGoal.setAchievementLevel("");
        newGoal.setPotential("");
        newGoal.setPerformance("");
        newGoal.setTalentOrCriticalResource("");
        newGoal.setTalentMatrixCategory("");
        newGoal.setTimeline("");

        if (newGoal.getSelfAssessmentScore() == null) newGoal.setSelfAssessmentScore(0);
        if (newGoal.getManagerAssessmentScore() == null) newGoal.setManagerAssessmentScore(0);
        if (newGoal.getOverallSelfAssessmentRating() == null) newGoal.setOverallSelfAssessmentRating(0);
        if (newGoal.getManagerOverallSelfAssessmentRating() == null) newGoal.setManagerOverallSelfAssessmentRating(0);

        log.info("Saving goal with title: {}", newGoal.getTitle());
        Goal savedGoal = goalRepository.save(newGoal);
        log.info("Goal saved successfully with ID: {}", savedGoal.getId());

        // ========== SEND EMAIL NOTIFICATIONS FOR SINGLE GOAL ==========
        sendGoalSubmissionEmails(savedGoal.getEmployeeId(), savedGoal.getManagerId(),
                quarter.toString(), String.valueOf(savedGoal.getYear()), Arrays.asList(savedGoal));
        // ========== END EMAIL NOTIFICATIONS ==========

        return savedGoal;
    }

    @Override
    @Transactional
    public Goal saveGoalAsDraft(Goal goal, Quarter quarter) {
        PerformanceCycle activeCycle = getActiveCycle();
        Integer year = activeCycle.getYear();

        if (quarter == null) throw new ValidationException("Quarter is required");
        if (goal.getEmployeeId() == null || goal.getEmployeeId().trim().isEmpty()) {
            throw new ValidationException("Employee ID is required");
        }

        List<Goal> existingDrafts = goalRepository.findByEmployeeIdAndQuarterAndYearAndGoalTypeAndStatus(
                goal.getEmployeeId(), quarter, year, GoalType.SMART, GoalStatus.DRAFT);

        boolean titleExists = existingDrafts.stream()
                .anyMatch(g -> g.getTitle().equalsIgnoreCase(goal.getTitle()));

        if (titleExists) {
            throw new ConflictException("A draft goal with this title already exists for this quarter");
        }

        Goal newGoal = new Goal();
        newGoal.setPerformanceCycle(activeCycle);
        newGoal.setYear(year);
        newGoal.setQuarter(quarter);
        newGoal.setEmployeeId(goal.getEmployeeId());
        newGoal.setManagerId(goal.getManagerId() != null ? goal.getManagerId() : "DEFAULT_MANAGER");
        newGoal.setGoalType(GoalType.SMART);
        newGoal.setGoalCategory("CUSTOM");
        newGoal.setTitle(goal.getTitle() != null ? goal.getTitle() : "New Goal");
        newGoal.setTarget(goal.getTarget());
        newGoal.setWeightage(goal.getWeightage() != null ? goal.getWeightage() : 0);
        newGoal.setCreatedAt(LocalDateTime.now());
        newGoal.setUpdatedAt(LocalDateTime.now());
        newGoal.setStatus(GoalStatus.DRAFT);

        newGoal.setRemarks("");
        newGoal.setManagerComment("");
        newGoal.setManagerApprovalComment("");
        newGoal.setOverallSelfReviewComments("");
        newGoal.setManagerOverallSelfReviewComments("");
        newGoal.setAchievementLevel("");
        newGoal.setPotential("");
        newGoal.setPerformance("");
        newGoal.setTalentOrCriticalResource("");
        newGoal.setTalentMatrixCategory("");
        newGoal.setTimeline("");
        newGoal.setSelfAssessmentScore(0);
        newGoal.setManagerAssessmentScore(0);
        newGoal.setOverallSelfAssessmentRating(0);
        newGoal.setManagerOverallSelfAssessmentRating(0);

        Goal savedGoal = goalRepository.save(newGoal);
        log.info("Draft goal saved with ID: {}", savedGoal.getId());
        return savedGoal;
    }

    @Override
    @Transactional
    public Goal updateGoalDraft(Long goalId, Goal goal) {
        log.info("Updating draft goal with ID: {}", goalId);

        Goal existingGoal = goalRepository.findById(goalId)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + goalId));

        log.info("Existing goal - EmployeeId: {}, Status: {}", existingGoal.getEmployeeId(), existingGoal.getStatus());

        if (!existingGoal.getEmployeeId().equals(goal.getEmployeeId())) {
            throw new ValidationException("Goal does not belong to this employee");
        }

        if (existingGoal.getStatus() != GoalStatus.DRAFT && existingGoal.getStatus() != GoalStatus.SENT_BACK) {
            throw new ValidationException("Only goals in DRAFT or SENT_BACK status can be updated. Current status: " + existingGoal.getStatus());
        }

        if (goal.getTitle() != null && !goal.getTitle().trim().isEmpty()) {
            if (!existingGoal.getTitle().equals(goal.getTitle())) {
                List<Goal> existingGoals = goalRepository.findByEmployeeIdAndQuarterAndYearAndGoalType(
                        existingGoal.getEmployeeId(), existingGoal.getQuarter(), existingGoal.getYear(), GoalType.SMART);

                boolean titleExists = existingGoals.stream()
                        .filter(g -> !g.getId().equals(goalId))
                        .anyMatch(g -> g.getTitle().equalsIgnoreCase(goal.getTitle()));

                if (titleExists) {
                    throw new ConflictException("A goal with title '" + goal.getTitle() + "' already exists for this quarter");
                }
            }
            existingGoal.setTitle(goal.getTitle());
        }

        if (goal.getTarget() != null) {
            existingGoal.setTarget(goal.getTarget());
        }

        if (goal.getWeightage() != null) {
            if (goal.getWeightage() < 0 || goal.getWeightage() > 100) {
                throw new ValidationException("Weightage must be between 0 and 100");
            }
            existingGoal.setWeightage(goal.getWeightage());
        }

        try {
            existingGoal.setUpdatedAt(LocalDateTime.now());
        } catch (Exception e) {
            log.warn("Could not set updatedAt field: {}", e.getMessage());
        }

        log.info("Updating goal - Title: {}, Target: {}, Weightage: {}",
                existingGoal.getTitle(), existingGoal.getTarget(), existingGoal.getWeightage());

        Goal updatedGoal = goalRepository.save(existingGoal);
        log.info("Draft goal updated successfully with ID: {}", updatedGoal.getId());

        return updatedGoal;
    }

    @Override
    @Transactional
    public Goal submitGoalDraft(Long goalId) {
        log.info("Submitting draft goal with ID: {}", goalId);

        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + goalId));

        log.info("Goal found - ID: {}, Title: {}, Weightage: {}, Status: {}",
                goal.getId(), goal.getTitle(), goal.getWeightage(), goal.getStatus());

        if (goal.getStatus() != GoalStatus.DRAFT && goal.getStatus() != GoalStatus.SENT_BACK) {
            throw new ValidationException("Only goals in DRAFT or SENT_BACK status can be submitted. Current status: " + goal.getStatus());
        }

        if (goal.getTitle() == null || goal.getTitle().trim().isEmpty()) {
            throw new ValidationException("Goal title is required before submission");
        }

        if (goal.getWeightage() == null) {
            throw new ValidationException("Weightage is required before submission");
        }
        if (goal.getWeightage() <= 0) {
            throw new ValidationException("Weightage must be greater than 0 before submission. Current weightage: " + goal.getWeightage());
        }

        goal.setStatus(GoalStatus.PENDING_APPROVAL);
        goal.setSubmittedToEmployeeAt(LocalDateTime.now());
        goal.setUpdatedAt(LocalDateTime.now());

        Goal submittedGoal = goalRepository.save(goal);
        log.info("Goal submitted for approval with ID: {}", submittedGoal.getId());

        // ========== SEND EMAIL NOTIFICATIONS FOR SINGLE DRAFT SUBMISSION ==========
        sendGoalSubmissionEmails(submittedGoal.getEmployeeId(), submittedGoal.getManagerId(),
                submittedGoal.getQuarter().toString(), String.valueOf(submittedGoal.getYear()), Arrays.asList(submittedGoal));
        // ========== END EMAIL NOTIFICATIONS ==========

        return submittedGoal;
    }

    @Override
    public List<Goal> getGoalsByEmployee(String employeeId, Quarter quarter, Integer year) {
        log.info("getGoalsByEmployee called with employeeId: {}, quarter: {}, year: {}", employeeId, quarter, year);
        try {
            List<Goal> goals = goalRepository.findByEmployeeIdAndQuarterAndYearAndGoalType(
                    employeeId, quarter, year, GoalType.SMART);
            log.info("Found {} goals", goals != null ? goals.size() : 0);
            return goals != null ? goals : new ArrayList<>();
        } catch (Exception e) {
            log.error("Error in getGoalsByEmployee: ", e);
            return new ArrayList<>();
        }
    }

    @Override
    public List<Goal> getDraftGoalsByEmployee(String employeeId, Quarter quarter, Integer year) {
        log.info("Getting draft goals for employee: {}, quarter: {}, year: {}", employeeId, quarter, year);
        return goalRepository.findByEmployeeIdAndQuarterAndYearAndGoalTypeAndStatus(
                employeeId, quarter, year, GoalType.SMART, GoalStatus.DRAFT);
    }

    @Override
    public List<Goal> getAllGoalsForEditing(String employeeId, Quarter quarter, Integer year) {
        log.info("Getting all editable goals for employee: {}, quarter: {}, year: {}", employeeId, quarter, year);
        return goalRepository.findByEmployeeIdAndQuarterAndYearAndGoalTypeAndStatusIn(
                employeeId, quarter, year, GoalType.SMART,
                Arrays.asList(GoalStatus.DRAFT, GoalStatus.SENT_BACK));
    }

    @Override
    @Transactional
    public void deleteGoal(Long goalId) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found"));

        if (goal.getStatus() == GoalStatus.ACCEPTED_BY_EMPLOYEE ||
                goal.getStatus() == GoalStatus.FINAL_SUBMITTED_TO_HR ||
                goal.getStatus() == GoalStatus.PENDING_APPROVAL) {
            throw new ValidationException("Cannot delete goal that has been submitted for approval or accepted");
        }

        log.info("Deleting goal with ID: {}", goalId);
        goalRepository.delete(goal);
    }

    // ==================== MANAGER APPROVAL (Step 5) ====================

    @Override
    @Transactional
    public List<Goal> approveOrSendBackGoals(ManagerApprovalRequestDto requestDto) {
        log.info("Manager {} processing approval action {} for employee {}",
                requestDto.getManagerId(), requestDto.getAction(), requestDto.getEmployeeId());

        if (requestDto.getGoalIds() == null || requestDto.getGoalIds().isEmpty()) {
            throw new ValidationException("No goals provided for approval");
        }

        List<Goal> updatedGoals = new ArrayList<>();

        for (Long goalId : requestDto.getGoalIds()) {
            Goal goal = goalRepository.findById(goalId)
                    .orElseThrow(() -> new ResourceNotFoundException("Goal not found: " + goalId));

            if (!goal.getManagerId().equals(requestDto.getManagerId())) {
                throw new ValidationException("Goal does not belong to this manager");
            }

            if (goal.getStatus() != GoalStatus.PENDING_APPROVAL) {
                throw new ValidationException("Goal is not pending approval. Current status: " + goal.getStatus());
            }

            if (requestDto.getAction() == ManagerApprovalRequestDto.ApprovalAction.APPROVE) {
                goal.setStatus(GoalStatus.APPROVED);
                goal.setManagerApprovalComment(null);
                goal.setApprovedAt(LocalDateTime.now());
            } else if (requestDto.getAction() == ManagerApprovalRequestDto.ApprovalAction.SEND_BACK) {
                goal.setStatus(GoalStatus.SENT_BACK);
                goal.setManagerApprovalComment(requestDto.getManagerApprovalComment());
            }

            goal.setUpdatedAt(LocalDateTime.now());
            updatedGoals.add(goalRepository.save(goal));
        }

        // ========== ADD EMAIL NOTIFICATIONS FOR APPROVAL/REJECTION ==========
        if (!updatedGoals.isEmpty()) {
            Goal firstGoal = updatedGoals.get(0);
            String employeeId = firstGoal.getEmployeeId();
            String managerId = firstGoal.getManagerId();
            String quarter = firstGoal.getQuarter().toString();
            String year = String.valueOf(firstGoal.getYear());

            // Convert goals to map format
            List<Map<String, Object>> goalsMap = updatedGoals.stream()
                    .map(goal -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("title", goal.getTitle());
                        map.put("targetOperator", goal.getTarget() != null ? goal.getTarget() : "=");
                        map.put("weightage", goal.getWeightage());
                        map.put("selfAssessmentScore", goal.getSelfAssessmentScore());
                        map.put("remarks", goal.getRemarks());
                        return map;
                    })
                    .collect(Collectors.toList());

            if (requestDto.getAction() == ManagerApprovalRequestDto.ApprovalAction.APPROVE) {
                // Send approval email to employee
                emailerService.sendGoalApprovalToEmployee(employeeId, managerId, quarter, year, goalsMap);
                log.info("Approval email sent to employee: {}", employeeId);
            } else if (requestDto.getAction() == ManagerApprovalRequestDto.ApprovalAction.SEND_BACK) {
                // Send rejection email to employee with comments
                String rejectionReason = requestDto.getManagerApprovalComment() != null ?
                        requestDto.getManagerApprovalComment() : "No specific reason provided";
                emailerService.sendGoalRejectionToEmployee(employeeId, managerId, quarter, year, goalsMap, rejectionReason);
                log.info("Rejection email sent to employee: {}", employeeId);
            }
        }
        // ========== END EMAIL NOTIFICATIONS ==========

        return updatedGoals;
    }

    @Override
    public List<String> getTeamEmployeesByManager(String managerId, Quarter quarter) {
        PerformanceCycle activeCycle = getActiveCycle();
        List<Goal> goals = goalRepository.findByManagerIdAndPerformanceCycleAndQuarter(
                managerId, activeCycle, quarter);

        return goals.stream().map(Goal::getEmployeeId).distinct().toList();
    }

    @Override
    public List<Goal> getGoalsForManagerApproval(String managerId, String employeeId, Quarter quarter) {
        PerformanceCycle activeCycle = getActiveCycle();
        return goalRepository.findByManagerIdAndEmployeeIdAndPerformanceCycleAndQuarterAndGoalTypeIn(
                managerId, employeeId, activeCycle, quarter,
                Arrays.asList(GoalType.SMART, GoalType.DEVELOPMENT));
    }

    // ==================== EMPLOYEE SELF REVIEW (Step 6) ====================

    @Override
    @Transactional
    public List<Goal> submitSelfReview(SelfReviewRequestDto requestDto) {
        Quarter quarterEnum = Quarter.valueOf(requestDto.getQuarter());
        List<Goal> updatedGoals = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        for (SelfReviewRequestDto.SelfReviewGoalDto goalDto : requestDto.getGoals()) {
            Goal goal = goalRepository.findById(goalDto.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Goal not found: " + goalDto.getId()));

            if (goal.getStatus() != GoalStatus.APPROVED) {
                throw new ValidationException("Goal is not approved for self-review. Current status: " + goal.getStatus());
            }
        }

        for (SelfReviewRequestDto.SelfReviewGoalDto goalDto : requestDto.getGoals()) {
            Goal goal = goalRepository.findById(goalDto.getId()).get();

            if (goalDto.getRemarks() != null) {
                goal.setRemarks(goalDto.getRemarks());
            }

            if (goalDto.getSelfAssessmentScore() != null) {
                if (goalDto.getSelfAssessmentScore() < 0 || goalDto.getSelfAssessmentScore() > 100) {
                    throw new ValidationException("Self assessment score must be between 0 and 100");
                }
                goal.setSelfAssessmentScore(goalDto.getSelfAssessmentScore());
            }

            goal.setSelfReviewSubmittedDate(now);
            goal.setStatus(GoalStatus.SELF_REVIEWED);
            goal.setUpdatedAt(now);

            updatedGoals.add(goalRepository.save(goal));
        }

        if (updatedGoals.isEmpty()) {
            throw new ValidationException("No goals were updated");
        }

        Goal firstGoal = updatedGoals.get(0);
        List<Goal> allEmployeeGoals = goalRepository.findByEmployeeIdAndQuarterAndYearAndGoalType(
                firstGoal.getEmployeeId(), quarterEnum, firstGoal.getYear(), GoalType.SMART);

        for (Goal goal : allEmployeeGoals) {
            if (goal.getStatus() == GoalStatus.SELF_REVIEWED) {
                goal.setOverallSelfAssessmentRating(requestDto.getOverallSelfAssessmentRating());
                goal.setOverallSelfReviewComments(requestDto.getOverallSelfReviewComments());
                goal.setUpdatedAt(now);
                goalRepository.save(goal);
            }
        }

        // ========== ADD EMAIL NOTIFICATIONS FOR SELF REVIEW SUBMISSION ==========
        try {
            String employeeId = firstGoal.getEmployeeId();
            String managerId = firstGoal.getManagerId();
            String quarter = quarterEnum.toString();
            String year = String.valueOf(firstGoal.getYear());
            int overallRating = requestDto.getOverallSelfAssessmentRating() != null ?
                    requestDto.getOverallSelfAssessmentRating() : 0;

            // Convert goals to map format
            List<Map<String, Object>> goalsMap = updatedGoals.stream()
                    .map(goal -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("title", goal.getTitle());
                        map.put("targetOperator", goal.getTarget() != null ? goal.getTarget() : "=");
                        map.put("weightage", goal.getWeightage());
                        map.put("selfAssessmentScore", goal.getSelfAssessmentScore());
                        map.put("remarks", goal.getRemarks());
                        return map;
                    })
                    .collect(Collectors.toList());

            // Send email to manager
            emailerService.sendGoalSelfReviewSubmittedToManager(employeeId, managerId, quarter, year, goalsMap, overallRating);

            // Send confirmation email to employee
            emailerService.sendGoalSelfReviewSubmittedToEmployee(employeeId, managerId, quarter, year, goalsMap, overallRating);

            log.info("Self review emails sent for employee: {}", employeeId);
        } catch (Exception e) {
            log.error("Failed to send self review emails", e);
        }
        // ========== END EMAIL NOTIFICATIONS ==========

        return updatedGoals;
    }

    @Override
    public List<Goal> getGoalsPendingSelfReview(String employeeId, Quarter quarter, Integer year) {
        return goalRepository.findByEmployeeIdAndQuarterAndYearAndGoalTypeAndStatus(
                employeeId, quarter, year, GoalType.SMART, GoalStatus.APPROVED);
    }

    // ==================== MANAGER FINAL REVIEW (Step 7) ====================

    @Override
    public List<Goal> getGoalsForManagerFinalReview(String managerId, String employeeId, Quarter quarter) {
        PerformanceCycle activeCycle = getActiveCycle();
        return goalRepository.findByManagerIdAndEmployeeIdAndPerformanceCycleAndQuarterAndGoalTypeIn(
                managerId, employeeId, activeCycle, quarter,
                Arrays.asList(GoalType.SMART, GoalType.DEVELOPMENT));
    }

    private String calculateManagerRating(String potential, String performance) {
        if (potential == null || performance == null) {
            return null;
        }

        if (potential.equals("High") && performance.equals("High")) {
            return "A+";
        } else if (potential.equals("High") && performance.equals("Medium")) {
            return "A";
        } else if (potential.equals("High") && performance.equals("Low")) {
            return "B";
        } else if (potential.equals("Medium") && performance.equals("High")) {
            return "A";
        } else if (potential.equals("Medium") && performance.equals("Medium")) {
            return "B+";
        } else if (potential.equals("Medium") && performance.equals("Low")) {
            return "B";
        } else if (potential.equals("Low") && performance.equals("High")) {
            return "B+";
        } else if (potential.equals("Low") && performance.equals("Medium")) {
            return "B";
        } else if (potential.equals("Low") && performance.equals("Low")) {
            return "C";
        }

        return null;
    }

    @Override
    @Transactional
    public List<Goal> submitManagerFinalReview(ManagerFinalReviewRequestDto requestDto) {
        Quarter quarterEnum = Quarter.valueOf(requestDto.getQuarter());

        if (requestDto.getManagerOverallSelfAssessmentRating() != null &&
                (requestDto.getManagerOverallSelfAssessmentRating() < 1 ||
                        requestDto.getManagerOverallSelfAssessmentRating() > 5)) {
            throw new ValidationException("Manager overall rating must be between 1 and 5");
        }

        List<Goal> updatedGoals = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        String category = null;
        String managerRating = null;

        if (requestDto.getPotential() != null && requestDto.getPerformance() != null) {
            category = GoalCategoryUtil.calculateCategory(
                    requestDto.getPotential(),
                    requestDto.getPerformance()
            );
            managerRating = calculateManagerRating(
                    requestDto.getPotential(),
                    requestDto.getPerformance()
            );
        }

        if (managerRating == null && requestDto.getManagerRating() != null) {
            managerRating = requestDto.getManagerRating();
        }

        log.info("Calculated values - Category: {}, Manager Rating: {}", category, managerRating);

        for (ManagerFinalReviewRequestDto.ManagerFinalReviewGoalDto goalDto : requestDto.getGoals()) {
            Goal goal = goalRepository.findById(goalDto.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Goal not found: " + goalDto.getId()));

            if (goal.getStatus() != GoalStatus.SELF_REVIEWED) {
                throw new ValidationException("Goal not eligible for manager review. Current status: " + goal.getStatus());
            }

            if (goalDto.getManagerAssessmentScore() != null) {
                if (goalDto.getManagerAssessmentScore() < 0 || goalDto.getManagerAssessmentScore() > 100) {
                    throw new ValidationException("Manager assessment score must be between 0 and 100");
                }
                goal.setManagerAssessmentScore(goalDto.getManagerAssessmentScore());
            }

            goal.setManagerComment(goalDto.getManagerComment());
            goal.setReviewedAt(now);
            goal.setStatus(GoalStatus.MANAGER_REVIEWED);
            goal.setUpdatedAt(now);

            updatedGoals.add(goalRepository.save(goal));
        }

        if (!updatedGoals.isEmpty()) {
            Goal firstGoal = updatedGoals.get(0);
            List<Goal> allEmployeeGoals = goalRepository.findByEmployeeIdAndQuarterAndYearAndGoalType(
                    firstGoal.getEmployeeId(), quarterEnum, firstGoal.getYear(), GoalType.SMART);

            for (Goal goal : allEmployeeGoals) {
                if (goal.getStatus() == GoalStatus.MANAGER_REVIEWED) {
                    goal.setManagerOverallSelfAssessmentRating(requestDto.getManagerOverallSelfAssessmentRating());
                    goal.setManagerOverallSelfReviewComments(requestDto.getManagerOverallSelfReviewComments());
                    goal.setAchievementLevel(requestDto.getAchievementLevel());
                    goal.setPotential(requestDto.getPotential());
                    goal.setPerformance(requestDto.getPerformance());
                    goal.setTalentOrCriticalResource(requestDto.getTalentOrCriticalResource());
                    goal.setTalentMatrixCategory(category);
                    goal.setManagerRating(managerRating);
                    goal.setUpdatedAt(now);
                    goalRepository.save(goal);
                }
            }

            // ========== ADD EMAIL NOTIFICATIONS FOR MANAGER FINAL REVIEW ==========
            try {
                String employeeId = firstGoal.getEmployeeId();
                String managerId = firstGoal.getManagerId();
                String quarter = quarterEnum.toString();
                String year = String.valueOf(firstGoal.getYear());
                int overallRating = requestDto.getManagerOverallSelfAssessmentRating() != null ?
                        requestDto.getManagerOverallSelfAssessmentRating() : 0;

                // Convert goals to map format
                List<Map<String, Object>> goalsMap = updatedGoals.stream()
                        .map(goal -> {
                            Map<String, Object> map = new HashMap<>();
                            map.put("title", goal.getTitle());
                            map.put("targetOperator", goal.getTarget() != null ? goal.getTarget() : "=");
                            map.put("weightage", goal.getWeightage());
                            map.put("selfAssessmentScore", goal.getSelfAssessmentScore());
                            map.put("managerAssessmentScore", goal.getManagerAssessmentScore());
                            map.put("managerComment", goal.getManagerComment());
                            return map;
                        })
                        .collect(Collectors.toList());

                // Send email to employee
                emailerService.sendGoalManagerReviewSubmittedToEmployee(employeeId, managerId, quarter, year, goalsMap, overallRating, managerRating);

                // Send email to HR
                emailerService.sendGoalManagerReviewSubmittedToHR(employeeId, managerId, quarter, year, goalsMap, overallRating);

                log.info("Manager review emails sent for employee: {}", employeeId);
            } catch (Exception e) {
                log.error("Failed to send manager review emails", e);
            }
            // ========== END EMAIL NOTIFICATIONS ==========
        }

        log.info("Manager final review completed for employee: {}", requestDto.getEmployeeId());
        return updatedGoals;
    }

    // ==================== EMPLOYEE ACCEPTANCE (Step 8) ====================

    @Override
    public List<Goal> getPendingGoalsForAcceptance(String employeeId, Quarter quarter, Integer year) {
        return goalRepository.findByEmployeeIdAndQuarterAndYearAndGoalTypeAndStatus(
                employeeId, quarter, year, GoalType.SMART, GoalStatus.MANAGER_REVIEWED);
    }

    @Override
    @Transactional
    public void acceptReviewedGoals(String employeeId, Quarter quarter, Integer year) {
        List<Goal> goals = goalRepository.findByEmployeeIdAndQuarterAndYearAndGoalTypeAndStatus(
                employeeId, quarter, year, GoalType.SMART, GoalStatus.MANAGER_REVIEWED);

        if (goals.isEmpty()) {
            throw new ResourceNotFoundException("No goals found for acceptance");
        }

        LocalDateTime now = LocalDateTime.now();
        for (Goal goal : goals) {
            goal.setStatus(GoalStatus.ACCEPTED_BY_EMPLOYEE);
            goal.setSelfAcceptedDate(now);
            goal.setUpdatedAt(now);
        }
        goalRepository.saveAll(goals);

        // ========== ADD EMAIL NOTIFICATION FOR ACCEPTANCE ==========
        try {
            if (!goals.isEmpty()) {
                Goal firstGoal = goals.get(0);
                String managerId = firstGoal.getManagerId();
                String quarterStr = quarter.toString();
                String yearStr = String.valueOf(year);

                // Send acceptance notification to manager
                emailerService.sendGoalAcceptedByEmployeeToManager(employeeId, managerId, quarterStr, yearStr);

                log.info("Acceptance email sent to manager: {} for employee: {}", managerId, employeeId);
            }
        } catch (Exception e) {
            log.error("Failed to send acceptance email for employee: {}", employeeId, e);
        }
        // ========== END EMAIL NOTIFICATION ==========
    }

    // ==================== HR OPERATIONS ====================

    @Override
    @Transactional
    public void finalSubmitToHR(String employeeId, Quarter quarter) {
        PerformanceCycle activeCycle = getActiveCycle();
        List<Goal> goals = goalRepository.findByEmployeeIdAndPerformanceCycleAndQuarterAndStatus(
                employeeId, activeCycle, quarter, GoalStatus.ACCEPTED_BY_EMPLOYEE);

        for (Goal goal : goals) {
            goal.setStatus(GoalStatus.FINAL_SUBMITTED_TO_HR);
            goal.setUpdatedAt(LocalDateTime.now());
        }
        goalRepository.saveAll(goals);
    }

    // ==================== BULK OPERATIONS ====================

    @Override
    public void deleteGoals(List<Long> goalIds) {
        if (goalIds == null || goalIds.isEmpty()) {
            throw new ValidationException("Goal IDs are required");
        }
        List<Goal> goals = goalRepository.findAllById(goalIds);
        goalRepository.deleteAll(goals);
    }

    @Override
    @Transactional
    public List<Goal> submitAllDraftGoals(String employeeId, Quarter quarter, Integer year) {
        log.info("Submitting all draft goals for employee: {}, quarter: {}, year: {}", employeeId, quarter, year);

        List<Goal> draftGoals = goalRepository.findByEmployeeIdAndQuarterAndYearAndGoalTypeAndStatusIn(
                employeeId, quarter, year, GoalType.SMART,
                Arrays.asList(GoalStatus.DRAFT, GoalStatus.SENT_BACK));

        log.info("Found {} draft goals to submit", draftGoals.size());

        if (draftGoals.isEmpty()) {
            throw new ResourceNotFoundException("No draft goals found for submission");
        }

        for (Goal goal : draftGoals) {
            log.info("Goal ID: {}, Title: {}, Weightage: {}, Status: {}",
                    goal.getId(), goal.getTitle(), goal.getWeightage(), goal.getStatus());
        }

        validateWeightageTotal(employeeId, quarter, year);

        for (Goal goal : draftGoals) {
            if (goal.getTitle() == null || goal.getTitle().trim().isEmpty()) {
                throw new ValidationException("Goal title is required for goal ID: " + goal.getId());
            }
            if (goal.getWeightage() == null) {
                throw new ValidationException("Weightage is required for goal: " + goal.getTitle());
            }
            if (goal.getWeightage() <= 0) {
                throw new ValidationException("Weightage must be greater than 0 for goal: " + goal.getTitle() + ". Current weightage: " + goal.getWeightage());
            }
        }

        List<Goal> submittedGoals = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        for (Goal goal : draftGoals) {
            goal.setStatus(GoalStatus.PENDING_APPROVAL);
            goal.setSubmittedToEmployeeAt(now);
            goal.setUpdatedAt(now);
            submittedGoals.add(goalRepository.save(goal));
            log.info("Submitted goal ID: {} with weightage: {}", goal.getId(), goal.getWeightage());
        }

        log.info("Successfully submitted {} draft goals", submittedGoals.size());

        // ========== SEND EMAIL NOTIFICATIONS FOR BULK SUBMISSION ==========
        sendGoalSubmissionEmails(employeeId, submittedGoals.get(0).getManagerId(),
                quarter.toString(), String.valueOf(year), submittedGoals);
        // ========== END EMAIL NOTIFICATIONS ==========

        return submittedGoals;
    }

    /**
     * Helper method to send goal submission emails to both manager and employee
     */
    private void sendGoalSubmissionEmails(String employeeId, String managerId, String quarter, String year, List<Goal> goals) {
        try {
            if (managerId == null || managerId.isEmpty()) {
                log.warn("Manager ID not found for employee: {}, skipping email notifications", employeeId);
                return;
            }

            log.info("========== SENDING GOAL SUBMISSION EMAILS ==========");
            log.info("Employee ID: {}", employeeId);
            log.info("Manager ID: {}", managerId);
            log.info("Quarter: {}", quarter);
            log.info("Year: {}", year);
            log.info("Number of goals: {}", goals.size());

            // Convert goals to map format for email
            List<Map<String, Object>> goalsMap = goals.stream()
                    .map(goal -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("title", goal.getTitle());
                        map.put("targetOperator", goal.getTarget() != null ? goal.getTarget() : "=");
                        map.put("weightage", goal.getWeightage());
                        return map;
                    })
                    .collect(Collectors.toList());

            // Send email to manager
            log.info("Sending email to manager with ID: {}", managerId);
            emailerService.sendGoalSubmissionToManager(employeeId, managerId, quarter, year, goalsMap);

            // Send email to employee
            log.info("Sending email to employee with ID: {}", employeeId);
            emailerService.sendGoalSubmissionToEmployee(employeeId, managerId, quarter, year, goalsMap);

            log.info("✅ Goal submission emails sent successfully!");
            log.info("===================================================");

        } catch (Exception e) {
            log.error("❌ Failed to send goal submission emails for employee: {}, quarter: {}, year: {}",
                    employeeId, quarter, year, e);
            // Don't throw exception - email failure shouldn't affect goal submission
        }
    }
}