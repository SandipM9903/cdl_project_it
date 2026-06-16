package com.cdl.epms.controller;

import com.cdl.epms.common.enums.Quarter;
import com.cdl.epms.dto.goal.CreateDevelopmentGoalRequestDto;
import com.cdl.epms.dto.goal.DevelopmentGoalResponseDto;
import com.cdl.epms.model.DevelopmentGoal;
import com.cdl.epms.payload.ApiResponse;
import com.cdl.epms.service.services.DevelopmentGoalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/development-goals")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Slf4j
public class DevelopmentGoalController {

    private final DevelopmentGoalService developmentGoalService;
    private final ModelMapper modelMapper;

    @PostMapping("/create/{quarter}")
    public ResponseEntity<ApiResponse<DevelopmentGoalResponseDto>> createDevelopmentGoal(
            @PathVariable("quarter") Quarter quarter,
            @Valid @RequestBody CreateDevelopmentGoalRequestDto requestDto
    ) {
        log.info("Creating development goal for employee: {}, quarter: {}", requestDto.getEmployeeId(), quarter);

        DevelopmentGoal savedGoal = developmentGoalService.createDevelopmentGoal(requestDto, quarter);
        DevelopmentGoalResponseDto responseDto = modelMapper.map(savedGoal, DevelopmentGoalResponseDto.class);

        ApiResponse<DevelopmentGoalResponseDto> response = ApiResponse.<DevelopmentGoalResponseDto>builder()
                .success(true)
                .message("Development goal created successfully")
                .data(responseDto)
                .build();
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/update/{goalId}")
    public ResponseEntity<ApiResponse<DevelopmentGoalResponseDto>> updateDevelopmentGoal(
            @PathVariable Long goalId,
            @Valid @RequestBody CreateDevelopmentGoalRequestDto requestDto
    ) {
        log.info("Updating development goal: {}", goalId);

        DevelopmentGoal updatedGoal = developmentGoalService.updateDevelopmentGoal(goalId, requestDto);
        DevelopmentGoalResponseDto responseDto = modelMapper.map(updatedGoal, DevelopmentGoalResponseDto.class);

        ApiResponse<DevelopmentGoalResponseDto> response = ApiResponse.<DevelopmentGoalResponseDto>builder()
                .success(true)
                .message("Development goal updated successfully")
                .data(responseDto)
                .build();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{goalId}")
    public ResponseEntity<ApiResponse<String>> deleteDevelopmentGoal(@PathVariable Long goalId) {
        log.info("Deleting development goal: {}", goalId);

        developmentGoalService.deleteDevelopmentGoal(goalId);

        ApiResponse<String> response = ApiResponse.<String>builder()
                .success(true)
                .message("Development goal deleted successfully")
                .data("Goal with ID " + goalId + " deleted")
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/employee/{employeeId}/{quarter}")
    public ResponseEntity<ApiResponse<List<DevelopmentGoalResponseDto>>> getDevelopmentGoalsByEmployee(
            @PathVariable String employeeId,
            @PathVariable Quarter quarter,
            @RequestParam Integer year
    ) {
        log.info("Fetching development goals for employee: {}, quarter: {}, year: {}", employeeId, quarter, year);

        List<DevelopmentGoal> goals = developmentGoalService.getDevelopmentGoalsByEmployee(employeeId, quarter, year);
        List<DevelopmentGoalResponseDto> responseDtos = goals.stream()
                .map(goal -> modelMapper.map(goal, DevelopmentGoalResponseDto.class))
                .toList();

        ApiResponse<List<DevelopmentGoalResponseDto>> response = ApiResponse.<List<DevelopmentGoalResponseDto>>builder()
                .success(true)
                .message("Development goals fetched successfully")
                .data(responseDtos)
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/manager/{managerId}/{quarter}")
    public ResponseEntity<ApiResponse<List<DevelopmentGoalResponseDto>>> getDevelopmentGoalsByManager(
            @PathVariable String managerId,
            @PathVariable Quarter quarter,
            @RequestParam Integer year
    ) {
        log.info("Fetching development goals for manager: {}, quarter: {}, year: {}", managerId, quarter, year);

        List<DevelopmentGoal> goals = developmentGoalService.getDevelopmentGoalsByManager(managerId, quarter, year);
        List<DevelopmentGoalResponseDto> responseDtos = goals.stream()
                .map(goal -> modelMapper.map(goal, DevelopmentGoalResponseDto.class))
                .toList();

        ApiResponse<List<DevelopmentGoalResponseDto>> response = ApiResponse.<List<DevelopmentGoalResponseDto>>builder()
                .success(true)
                .message("Development goals fetched successfully")
                .data(responseDtos)
                .build();
        return ResponseEntity.ok(response);
    }

    // Manager Approval endpoints
    @PutMapping("/approve/{goalId}")
    public ResponseEntity<ApiResponse<DevelopmentGoalResponseDto>> approveGoal(
            @PathVariable Long goalId,
            @RequestParam(required = false) String comment
    ) {
        log.info("Approving development goal: {}", goalId);

        DevelopmentGoal goal = developmentGoalService.approveGoal(goalId, comment);
        DevelopmentGoalResponseDto responseDto = modelMapper.map(goal, DevelopmentGoalResponseDto.class);

        ApiResponse<DevelopmentGoalResponseDto> response = ApiResponse.<DevelopmentGoalResponseDto>builder()
                .success(true)
                .message("Development goal approved successfully")
                .data(responseDto)
                .build();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/send-back/{goalId}")
    public ResponseEntity<ApiResponse<DevelopmentGoalResponseDto>> sendBackGoal(
            @PathVariable Long goalId,
            @RequestParam String comment
    ) {
        log.info("Sending back development goal: {}", goalId);

        DevelopmentGoal goal = developmentGoalService.sendBackGoal(goalId, comment);
        DevelopmentGoalResponseDto responseDto = modelMapper.map(goal, DevelopmentGoalResponseDto.class);

        ApiResponse<DevelopmentGoalResponseDto> response = ApiResponse.<DevelopmentGoalResponseDto>builder()
                .success(true)
                .message("Development goal sent back with comments")
                .data(responseDto)
                .build();
        return ResponseEntity.ok(response);
    }

    // Employee Self Review
    @PutMapping("/self-review/{goalId}")
    public ResponseEntity<ApiResponse<DevelopmentGoalResponseDto>> submitSelfReview(
            @PathVariable Long goalId,
            @RequestParam Integer selfAssessmentScore
    ) {
        log.info("Submitting self review for development goal: {}", goalId);

        DevelopmentGoal goal = developmentGoalService.submitSelfReview(goalId, selfAssessmentScore);
        DevelopmentGoalResponseDto responseDto = modelMapper.map(goal, DevelopmentGoalResponseDto.class);

        ApiResponse<DevelopmentGoalResponseDto> response = ApiResponse.<DevelopmentGoalResponseDto>builder()
                .success(true)
                .message("Self review submitted successfully")
                .data(responseDto)
                .build();
        return ResponseEntity.ok(response);
    }

    // Manager Final Assessment
    @PutMapping("/manager-assessment/{goalId}")
    public ResponseEntity<ApiResponse<DevelopmentGoalResponseDto>> submitManagerAssessment(
            @PathVariable Long goalId,
            @RequestParam Integer managerAssessmentScore,
            @RequestParam(required = false) String comment
    ) {
        log.info("Submitting manager assessment for development goal: {}", goalId);

        DevelopmentGoal goal = developmentGoalService.submitManagerAssessment(goalId, managerAssessmentScore, comment);
        DevelopmentGoalResponseDto responseDto = modelMapper.map(goal, DevelopmentGoalResponseDto.class);

        ApiResponse<DevelopmentGoalResponseDto> response = ApiResponse.<DevelopmentGoalResponseDto>builder()
                .success(true)
                .message("Manager assessment submitted successfully")
                .data(responseDto)
                .build();
        return ResponseEntity.ok(response);
    }

    // Employee Acceptance
    @PutMapping("/accept/{goalId}")
    public ResponseEntity<ApiResponse<DevelopmentGoalResponseDto>> acceptGoal(@PathVariable Long goalId) {
        log.info("Accepting development goal: {}", goalId);

        DevelopmentGoal goal = developmentGoalService.acceptGoal(goalId);
        DevelopmentGoalResponseDto responseDto = modelMapper.map(goal, DevelopmentGoalResponseDto.class);

        ApiResponse<DevelopmentGoalResponseDto> response = ApiResponse.<DevelopmentGoalResponseDto>builder()
                .success(true)
                .message("Development goal accepted successfully")
                .data(responseDto)
                .build();
        return ResponseEntity.ok(response);
    }
}