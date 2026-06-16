package com.cdl.epms.controller;

import com.cdl.epms.common.enums.GoalType;
import com.cdl.epms.common.enums.Quarter;
import com.cdl.epms.dto.goal.*;
import com.cdl.epms.model.Goal;
import com.cdl.epms.payload.ApiResponse;
import com.cdl.epms.repository.GoalRepository;
import com.cdl.epms.service.services.GoalService;
import jakarta.validation.Valid;
import jakarta.validation.ValidationException;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/goals")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Slf4j
public class GoalController {

    private final GoalService goalService;
    private final ModelMapper modelMapper;
    private final GoalRepository goalRepository;

    @PostMapping("/create/{quarter}")
    public ResponseEntity<ApiResponse<Goal>> createGoalWithDto(
            @PathVariable("quarter") Quarter quarter,
            @Valid @RequestBody CreateGoalRequestDto requestDto
    ) {
        log.info("Creating goal for employee: {}, quarter: {}", requestDto.getEmployeeId(), quarter);

        Goal goal = new Goal();
        goal.setEmployeeId(requestDto.getEmployeeId());
        goal.setManagerId(requestDto.getManagerId());
        goal.setTitle(requestDto.getTitle());
        goal.setTarget(requestDto.getTarget());
        goal.setWeightage(requestDto.getWeightage());

        Goal savedGoal = goalService.saveGoal(goal, quarter);

        ApiResponse<Goal> response = ApiResponse.<Goal>builder()
                .success(true)
                .message("Goal created successfully and sent to manager for approval")
                .data(savedGoal)
                .build();
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/draft/{quarter}")
    public ResponseEntity<ApiResponse<Goal>> saveGoalAsDraft(
            @PathVariable("quarter") Quarter quarter,
            @Valid @RequestBody UpdateGoalDraftDto draftDto
    ) {
        log.info("Saving goal as DRAFT for employee: {}", draftDto.getEmployeeId());

        Goal goal = new Goal();
        goal.setEmployeeId(draftDto.getEmployeeId());
        goal.setManagerId(draftDto.getManagerId());
        goal.setTitle(draftDto.getTitle());
        goal.setTarget(draftDto.getTarget());
        goal.setWeightage(draftDto.getWeightage());

        Goal savedGoal = goalService.saveGoalAsDraft(goal, quarter);

        ApiResponse<Goal> response = ApiResponse.<Goal>builder()
                .success(true)
                .message("Goal saved as draft successfully")
                .data(savedGoal)
                .build();
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/employee/{employeeId}/{quarter}")
    public ResponseEntity<ApiResponse<List<GoalListResponseDto>>> getGoalsByEmployee(
            @PathVariable String employeeId,
            @PathVariable Quarter quarter,
            @RequestParam Integer year
    ) {
        log.info("Fetching goals for employee: {}, quarter: {}, year: {}", employeeId, quarter, year);
        try {
            List<Goal> goals = goalService.getGoalsByEmployee(employeeId, quarter, year);

            List<GoalListResponseDto> responseDtos = goals.stream()
                    .map(goal -> modelMapper.map(goal, GoalListResponseDto.class))
                    .toList();

            log.info("Found {} goals", responseDtos.size());

            ApiResponse<List<GoalListResponseDto>> response = ApiResponse.<List<GoalListResponseDto>>builder()
                    .success(true)
                    .message("Goals fetched successfully")
                    .data(responseDtos)
                    .build();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching goals: ", e);
            ApiResponse<List<GoalListResponseDto>> response = ApiResponse.<List<GoalListResponseDto>>builder()
                    .success(false)
                    .message("Error fetching goals: " + e.getMessage())
                    .data(null)
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/draft/employee/{employeeId}/{quarter}")
    public ResponseEntity<ApiResponse<List<Goal>>> getDraftGoalsByEmployee(
            @PathVariable String employeeId,
            @PathVariable Quarter quarter,
            @RequestParam Integer year
    ) {
        List<Goal> goals = goalService.getDraftGoalsByEmployee(employeeId, quarter, year);

        ApiResponse<List<Goal>> response = ApiResponse.<List<Goal>>builder()
                .success(true)
                .message("Draft goals fetched successfully")
                .data(goals)
                .build();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/draft/{goalId}")
    public ResponseEntity<ApiResponse<Goal>> updateGoalDraft(
            @PathVariable Long goalId,
            @Valid @RequestBody UpdateGoalDraftDto updateDto
    ) {
        log.info("Updating draft goal with ID: {}", goalId);
        log.info("Update data - Title: {}, Target: {}, Weightage: {}",
                updateDto.getTitle(), updateDto.getTarget(), updateDto.getWeightage());

        Goal goal = new Goal();
        goal.setEmployeeId(updateDto.getEmployeeId());
        goal.setManagerId(updateDto.getManagerId());
        goal.setTitle(updateDto.getTitle());
        goal.setTarget(updateDto.getTarget());
        goal.setWeightage(updateDto.getWeightage());

        Goal updatedGoal = goalService.updateGoalDraft(goalId, goal);

        ApiResponse<Goal> response = ApiResponse.<Goal>builder()
                .success(true)
                .message("Goal draft updated successfully")
                .data(updatedGoal)
                .build();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/draft/submit/{goalId}")
    public ResponseEntity<ApiResponse<Goal>> submitGoalDraft(@PathVariable Long goalId) {
        Goal submittedGoal = goalService.submitGoalDraft(goalId);

        ApiResponse<Goal> response = ApiResponse.<Goal>builder()
                .success(true)
                .message("Goal submitted for manager approval successfully")
                .data(submittedGoal)
                .build();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{goalId}")
    public ResponseEntity<ApiResponse<String>> deleteGoal(@PathVariable Long goalId) {
        goalService.deleteGoal(goalId);

        ApiResponse<String> response = ApiResponse.<String>builder()
                .success(true)
                .message("Goal deleted successfully")
                .data("Goal with ID " + goalId + " deleted")
                .build();
        return ResponseEntity.ok(response);
    }

    // ==================== MANAGER APPROVAL (Step 5) ====================

    @PutMapping("/manager/approve-or-send-back")
    public ResponseEntity<ApiResponse<List<GoalResponseDto>>> approveOrSendBackGoals(
            @Valid @RequestBody ManagerApprovalRequestDto requestDto
    ) {
        log.info("Manager approval action: {} for employee: {}",
                requestDto.getAction(), requestDto.getEmployeeId());

        List<Goal> updatedGoals = goalService.approveOrSendBackGoals(requestDto);
        List<GoalResponseDto> responseDtos = updatedGoals.stream()
                .map(goal -> modelMapper.map(goal, GoalResponseDto.class))
                .toList();

        String message = requestDto.getAction() == ManagerApprovalRequestDto.ApprovalAction.APPROVE ?
                "Goals approved successfully" : "Goals sent back to employee with comments";

        ApiResponse<List<GoalResponseDto>> response = ApiResponse.<List<GoalResponseDto>>builder()
                .success(true)
                .message(message)
                .data(responseDtos)
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/manager/{managerId}/team/{quarter}")
    public ResponseEntity<ApiResponse<List<String>>> getTeamEmployees(
            @PathVariable String managerId,
            @PathVariable Quarter quarter
    ) {
        List<String> employees = goalService.getTeamEmployeesByManager(managerId, quarter);

        ApiResponse<List<String>> response = ApiResponse.<List<String>>builder()
                .success(true)
                .message("Team employees fetched successfully")
                .data(employees)
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/manager/{managerId}/employee/{employeeId}/{quarter}")
    public ResponseEntity<ApiResponse<List<GoalResponseDto>>> getGoalsForManagerApproval(
            @PathVariable String managerId,
            @PathVariable String employeeId,
            @PathVariable Quarter quarter
    ) {
        List<Goal> goals = goalService.getGoalsForManagerApproval(managerId, employeeId, quarter);
        List<GoalResponseDto> responseDtos = goals.stream()
                .map(goal -> modelMapper.map(goal, GoalResponseDto.class))
                .toList();

        ApiResponse<List<GoalResponseDto>> response = ApiResponse.<List<GoalResponseDto>>builder()
                .success(true)
                .message("Goals fetched for manager approval")
                .data(responseDtos)
                .build();
        return ResponseEntity.ok(response);
    }

    // ==================== EMPLOYEE SELF REVIEW (Step 6) ====================

    @GetMapping("/employee/pending-self-review/{employeeId}/{quarter}")
    public ResponseEntity<ApiResponse<List<GoalResponseDto>>> getPendingSelfReviewGoals(
            @PathVariable String employeeId,
            @PathVariable Quarter quarter,
            @RequestParam Integer year
    ) {
        List<Goal> goals = goalService.getGoalsPendingSelfReview(employeeId, quarter, year);
        List<GoalResponseDto> responseDtos = goals.stream()
                .map(goal -> modelMapper.map(goal, GoalResponseDto.class))
                .toList();

        ApiResponse<List<GoalResponseDto>> response = ApiResponse.<List<GoalResponseDto>>builder()
                .success(true)
                .message("Pending self-review goals fetched successfully")
                .data(responseDtos)
                .build();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/self-review/submit")
    public ResponseEntity<ApiResponse<List<GoalResponseDto>>> submitSelfReview(
            @Valid @RequestBody SelfReviewRequestDto requestDto
    ) {
        log.info("Submitting self-review for employee");

        List<Goal> updatedGoals = goalService.submitSelfReview(requestDto);
        List<GoalResponseDto> responseDtos = updatedGoals.stream()
                .map(goal -> modelMapper.map(goal, GoalResponseDto.class))
                .toList();

        ApiResponse<List<GoalResponseDto>> response = ApiResponse.<List<GoalResponseDto>>builder()
                .success(true)
                .message("Self-review submitted successfully and sent to manager")
                .data(responseDtos)
                .build();
        return ResponseEntity.ok(response);
    }

    // ==================== MANAGER FINAL REVIEW (Step 7) ====================

    @GetMapping("/manager/final-review/{managerId}/employee/{employeeId}/{quarter}")
    public ResponseEntity<ApiResponse<List<GoalResponseDto>>> getGoalsForManagerFinalReview(
            @PathVariable String managerId,
            @PathVariable String employeeId,
            @PathVariable Quarter quarter
    ) {
        List<Goal> goals = goalService.getGoalsForManagerFinalReview(managerId, employeeId, quarter);
        List<GoalResponseDto> responseDtos = goals.stream()
                .map(goal -> modelMapper.map(goal, GoalResponseDto.class))
                .toList();

        ApiResponse<List<GoalResponseDto>> response = ApiResponse.<List<GoalResponseDto>>builder()
                .success(true)
                .message("Goals fetched for manager final review")
                .data(responseDtos)
                .build();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/manager/final-review/submit")
    public ResponseEntity<ApiResponse<List<GoalResponseDto>>> submitManagerFinalReview(
            @Valid @RequestBody ManagerFinalReviewRequestDto requestDto
    ) {
        log.info("Submitting manager final review for employee: {}", requestDto.getEmployeeId());

        List<Goal> updatedGoals = goalService.submitManagerFinalReview(requestDto);
        List<GoalResponseDto> responseDtos = updatedGoals.stream()
                .map(goal -> modelMapper.map(goal, GoalResponseDto.class))
                .toList();

        ApiResponse<List<GoalResponseDto>> response = ApiResponse.<List<GoalResponseDto>>builder()
                .success(true)
                .message("Manager final review submitted successfully")
                .data(responseDtos)
                .build();
        return ResponseEntity.ok(response);
    }

    // ==================== EMPLOYEE ACCEPTANCE (Step 8) ====================

    @GetMapping("/employee/pending-acceptance/{employeeId}/{quarter}")
    public ResponseEntity<ApiResponse<List<GoalResponseDto>>> getPendingAcceptanceGoals(
            @PathVariable String employeeId,
            @PathVariable Quarter quarter,
            @RequestParam Integer year
    ) {
        List<Goal> goals = goalService.getPendingGoalsForAcceptance(employeeId, quarter, year);
        List<GoalResponseDto> responseDtos = goals.stream()
                .map(goal -> modelMapper.map(goal, GoalResponseDto.class))
                .toList();

        ApiResponse<List<GoalResponseDto>> response = ApiResponse.<List<GoalResponseDto>>builder()
                .success(true)
                .message("Pending acceptance goals fetched successfully")
                .data(responseDtos)
                .build();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/employee/accept/{employeeId}/{quarter}")
    public ResponseEntity<ApiResponse<String>> acceptReviewedGoals(
            @PathVariable String employeeId,
            @PathVariable Quarter quarter,
            @RequestParam Integer year
    ) {
        goalService.acceptReviewedGoals(employeeId, quarter, year);

        ApiResponse<String> response = ApiResponse.<String>builder()
                .success(true)
                .message("Goals accepted successfully")
                .data("Accepted successfully")
                .build();
        return ResponseEntity.ok(response);
    }

    // ==================== WEIGHTAGE VALIDATION ====================

    @GetMapping("/validate-weightage/{employeeId}/{quarter}")
    public ResponseEntity<ApiResponse<WeightageValidationResponse>> validateWeightage(
            @PathVariable String employeeId,
            @PathVariable Quarter quarter,
            @RequestParam Integer year
    ) {
        try {
            goalService.validateWeightageTotal(employeeId, quarter, year);
            WeightageValidationResponse validationResponse = new WeightageValidationResponse(true, 100, "Weightage total is valid (100%)");

            ApiResponse<WeightageValidationResponse> response = ApiResponse.<WeightageValidationResponse>builder()
                    .success(true)
                    .message("Weightage validation successful")
                    .data(validationResponse)
                    .build();
            return ResponseEntity.ok(response);
        } catch (ValidationException e) {
            WeightageValidationResponse validationResponse = new WeightageValidationResponse(false, null, e.getMessage());

            ApiResponse<WeightageValidationResponse> response = ApiResponse.<WeightageValidationResponse>builder()
                    .success(false)
                    .message(e.getMessage())
                    .data(validationResponse)
                    .build();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Helper class for weightage validation response
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class WeightageValidationResponse {
        private boolean valid;
        private Integer totalWeightage;
        private String message;
    }

    @GetMapping("/test/employee/{employeeId}/{quarter}")
    public ResponseEntity<?> testGetGoals(
            @PathVariable String employeeId,
            @PathVariable Quarter quarter,
            @RequestParam Integer year
    ) {
        log.info("Test endpoint - employeeId: {}, quarter: {}, year: {}", employeeId, quarter, year);
        try {
            List<Goal> goals = goalRepository.findByEmployeeIdAndQuarterAndYearAndGoalType(
                    employeeId, quarter, year, GoalType.SMART);

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("employeeId", employeeId);
            result.put("quarter", quarter);
            result.put("year", year);
            result.put("goalsCount", goals != null ? goals.size() : 0);
            result.put("goals", goals);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Test endpoint error: ", e);
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());
            error.put("stackTrace", Arrays.toString(e.getStackTrace()));
            return ResponseEntity.status(500).body(error);
        }
    }

    @GetMapping("/employee/{employeeId}/edit/{quarter}")
    public ResponseEntity<?> getGoalsForEditing(
            @PathVariable String employeeId,
            @PathVariable String quarter,
            @RequestParam Integer year) {
        try {
            Quarter quarterEnum = Quarter.valueOf(quarter);
            List<Goal> goals = goalService.getAllGoalsForEditing(employeeId, quarterEnum, year);
            return ResponseEntity.ok(goals);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/employee/{employeeId}/submit-all/{quarter}")
    public ResponseEntity<?> submitAllDraftGoals(
            @PathVariable String employeeId,
            @PathVariable String quarter,
            @RequestParam Integer year) {
        try {
            Quarter quarterEnum = Quarter.valueOf(quarter);
            List<Goal> submittedGoals = goalService.submitAllDraftGoals(employeeId, quarterEnum, year);
            return ResponseEntity.ok(Map.of(
                    "message", "All goals submitted successfully",
                    "submittedCount", submittedGoals.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{goalId}/submit-to-manager")
    public ResponseEntity<ApiResponse<Goal>> submitGoalToManager(
            @PathVariable Long goalId,
            @RequestBody Map<String, String> requestBody
    ) {
        log.info("Submitting goal to manager with ID: {}", goalId);

        Goal submittedGoal = goalService.submitGoalDraft(goalId);

        ApiResponse<Goal> response = ApiResponse.<Goal>builder()
                .success(true)
                .message("Goal submitted for manager approval successfully")
                .data(submittedGoal)
                .build();
        return ResponseEntity.ok(response);
    }
}