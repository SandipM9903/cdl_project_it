package com.cms.IT_DEC.controller;

import com.cms.IT_DEC.model.EmployeeInformation;
import com.cms.IT_DEC.service.EmployeeInformationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping("/api/employees")
public class EmployeeInformationController {

    private final EmployeeInformationService employeeInformationService;

    public EmployeeInformationController(
            EmployeeInformationService employeeInformationService) {
        this.employeeInformationService = employeeInformationService;
    }

    @PostMapping
    public ResponseEntity<EmployeeInformation> saveEmployee(
            @RequestBody EmployeeInformation employeeInformation) {

        EmployeeInformation savedEmployee =
                employeeInformationService.saveEmployee(employeeInformation);

        return new ResponseEntity<>(savedEmployee, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<EmployeeInformation>> getAllEmployees() {

        List<EmployeeInformation> employees =
                employeeInformationService.getAllEmployees();

        return ResponseEntity.ok(employees);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeInformation> getEmployeeById(
            @PathVariable Long id) {

        EmployeeInformation employee =
                employeeInformationService.getEmployeeById(id);

        return ResponseEntity.ok(employee);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEmployee(
            @PathVariable Long id) {

        employeeInformationService.deleteEmployee(id);

        return ResponseEntity.ok("Employee deleted successfully");
    }

    @GetMapping("/emp/{empCode}")
    public ResponseEntity<EmployeeInformation> getByEmpCode(
            @PathVariable String empCode) {

        EmployeeInformation employee =
                employeeInformationService.getByEmpCode(empCode);

        return ResponseEntity.ok(employee);
    }

    @PutMapping("/emp/{empCode}")
    public ResponseEntity<EmployeeInformation> updatePan(
            @PathVariable String empCode,
            @RequestBody EmployeeInformation request) {

        return ResponseEntity.ok(
                employeeInformationService.updatePan(empCode, request)
        );
    }

    @PutMapping("/landlord/{empCode}")
    public ResponseEntity<?> updateLandlordDetails(
            @PathVariable String empCode,
            @RequestBody Map<String, String> request) {

        try {
            EmployeeInformation empInfo = new EmployeeInformation();
            empInfo.setLandlordName(request.get("landlordName"));
            empInfo.setLandlordPanNumber(request.get("landlordPanNumber"));

            EmployeeInformation updated =
                    employeeInformationService.updateLandlordDetails(empCode, empInfo);

            Map<String, Object> responseMap = new java.util.HashMap<>();
            responseMap.put("landlordName", updated.getLandlordName());
            responseMap.put("landlordPanNumber", updated.getLandlordPanNumber());
            responseMap.put("message", "Landlord details updated successfully");

            return ResponseEntity.ok(responseMap);
        } catch (Exception e) {
            Map<String, Object> errorMap = new java.util.HashMap<>();
            errorMap.put("error", "Failed to update landlord details: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorMap);
        }
    }

    // NEW: Get landlord details endpoint
    @GetMapping("/landlord/{empCode}")
    public ResponseEntity<?> getLandlordDetails(@PathVariable String empCode) {

        EmployeeInformation employee =
                employeeInformationService.getLandlordDetails(empCode);

        if (employee == null) {
            // Return empty strings if no record exists
            return ResponseEntity.ok(Map.of(
                    "landlordName", "",
                    "landlordPanNumber", ""
            ));
        }

        return ResponseEntity.ok(Map.of(
                "landlordName", employee.getLandlordName() != null ? employee.getLandlordName() : "",
                "landlordPanNumber", employee.getLandlordPanNumber() != null ? employee.getLandlordPanNumber() : ""
        ));
    }
}