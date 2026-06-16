package com.cdl.epms.service.serviceImpl;

import com.cdl.epms.dto.email.EmailRequest;
import com.cdl.epms.model.PerformanceCycle;
import com.cdl.epms.repository.EmailJobRepository;
import com.cdl.epms.repository.EmailTemplateRepository;
import com.cdl.epms.repository.PerformanceCycleRepository;
import com.cdl.epms.service.services.EmailPreparationService;
import com.cdl.epms.service.services.EmailerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import jakarta.annotation.PreDestroy;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Semaphore;
import java.util.concurrent.atomic.AtomicInteger;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailerServiceImpl implements EmailerService {

    private final EmailPreparationService emailPreparationService;
    private final EmailJobRepository emailJobRepository;
    private final PerformanceCycleRepository cycleRepository;
    private final EmailTemplateRepository emailTemplateRepository;
    private final RestTemplate restTemplate;
    private final JavaMailSender mailSender;

    @Value("${employee.api.url}")
    private String employeeApiUrl;

    @Value("${employee.api.search.api}")
    private String employeeSearchApi;

    @Value("${employee.api.emails.api}")
    private String employeeEmailsApi;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Value("${app.frontend.paths.manager-goal-setting}")
    private String managerGoalSettingPath;

    @Value("${app.frontend.paths.manager-dashboard}")
    private String managerDashboardPath;

    @Value("${app.frontend.paths.manager-annual-review}")
    private String managerAnnualReviewPath;

    @Value("${app.frontend.paths.employee-annual-review}")
    private String employeeAnnualReviewPath;

    @Value("${app.frontend.paths.employee-dashboard}")
    private String employeeDashboardPath;

    @Value("${email.batch.size:50}")
    private int batchSize;

    @Value("${email.batch.delay.ms:2000}")
    private long batchDelayMs;

    @Value("${email.retry.max.attempts:3}")
    private int maxRetryAttempts;

    @Value("${email.parallel.threads:3}")
    private int parallelThreads;

    @Value("${email.delay.between.emails.ms:1500}")
    private long delayBetweenEmailsMs;

    private ExecutorService executorService;
    private Semaphore semaphore;

    private void initExecutorService() {
        if (executorService == null) {
            int threads = parallelThreads > 0 ? parallelThreads : 3;
            this.executorService = Executors.newFixedThreadPool(threads);
            this.semaphore = new Semaphore(threads);
            log.info("Initialized executor service with {} threads", threads);
        }
    }

    // ==================== BULK EMAIL METHODS ====================

    @Override
    @Async
    public void publishEmailToAllEmployees(Long cycleId, String customSubject, String customBody) {
        initExecutorService();
        long startTime = System.currentTimeMillis();

        PerformanceCycle cycle = cycleRepository.findById(cycleId)
                .orElseThrow(() -> new RuntimeException("Cycle not found"));

        log.info("========== PUBLISHING LAUNCH EMAILS ==========");
        log.info("Cycle ID: {}, Quarter: {}", cycleId, cycle.getQuarter());

        List<Map<String, Object>> employees = fetchEmployeesFromAPI();

        if (employees.isEmpty()) {
            log.warn("No employees found to send launch emails");
            return;
        }

        List<Map<String, Object>> validEmployees = employees.stream()
                .filter(emp -> emp.get("emailId") != null && !((String) emp.get("emailId")).isEmpty())
                .toList();

        List<List<Map<String, Object>>> batches = new ArrayList<>();
        for (int i = 0; i < validEmployees.size(); i += batchSize) {
            batches.add(validEmployees.subList(i, Math.min(i + batchSize, validEmployees.size())));
        }

        log.info("Split into {} batches", batches.size());

        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger errorCount = new AtomicInteger(0);
        List<CompletableFuture<Void>> futures = new ArrayList<>();

        for (int i = 0; i < batches.size(); i++) {
            final int batchIndex = i;
            final List<Map<String, Object>> batch = batches.get(i);

            CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
                try {
                    semaphore.acquire();
                    log.info("Processing batch {}/{}", batchIndex + 1, batches.size());

                    boolean success = sendBatchLaunchEmail(batch, customSubject, customBody, cycle);
                    if (success) {
                        successCount.addAndGet(batch.size());
                    } else {
                        errorCount.addAndGet(batch.size());
                    }

                    if (batchIndex < batches.size() - 1) {
                        Thread.sleep(batchDelayMs);
                    }
                } catch (Exception e) {
                    log.error("Batch {} failed", batchIndex + 1, e);
                    errorCount.addAndGet(batch.size());
                } finally {
                    semaphore.release();
                }
            }, executorService);

            futures.add(future);
        }

        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();

        long totalSeconds = (System.currentTimeMillis() - startTime) / 1000;
        log.info("LAUNCH EMAILS COMPLETED - Success: {}, Errors: {}, Time: {} seconds", successCount.get(), errorCount.get(), totalSeconds);
    }

    private boolean sendBatchLaunchEmail(List<Map<String, Object>> batch, String customSubject,
                                         String customBody, PerformanceCycle cycle) {
        try {
            List<String> recipients = new ArrayList<>();
            for (Map<String, Object> emp : batch) {
                String emailId = (String) emp.get("emailId");
                if (emailId != null && !emailId.isEmpty()) {
                    recipients.add(emailId);
                }
            }

            if (recipients.isEmpty()) return false;

            SimpleMailMessage message = new SimpleMailMessage();
            message.setBcc(recipients.toArray(new String[0]));
            message.setSubject(customSubject);
            message.setText(customBody);
            message.setFrom("cdladmin@cms.co.in");

            mailSender.send(message);
            log.info("✅ Batch email sent to {} recipients", recipients.size());
            return true;

        } catch (Exception e) {
            log.error("Failed to send batch email", e);
            return false;
        }
    }

    private boolean sendIndividualLaunchEmail(Map<String, Object> emp, String customSubject,
                                              String customBody, PerformanceCycle cycle) {
        String emailId = (String) emp.get("emailId");
        if (emailId == null || emailId.isEmpty()) return false;

        String firstName = (String) emp.getOrDefault("firstName", "");
        String lastName = (String) emp.getOrDefault("lastName", "");
        String employeeName = (firstName + " " + lastName).trim();
        if (employeeName.isEmpty()) employeeName = "Employee";

        String uniqueKey = String.format("launch_%d_%s_%d_%d",
                cycle.getId(),
                cycle.getQuarter() != null ? cycle.getQuarter().toString() : "ANNUAL",
                System.currentTimeMillis(),
                new Random().nextInt(10000));

        EmailRequest request = new EmailRequest();
        request.setTo(emailId);
        request.setCycleId(cycle.getId());
        request.setReminderType("CYCLE_LAUNCH");
        request.setUniqueKey(uniqueKey);
        request.setSubject(customSubject);
        request.setBody(customBody);
        request.setTemplateId(1L);

        Map<String, String> variables = new HashMap<>();
        variables.put("employeeName", employeeName);
        variables.put("firstName", firstName);
        variables.put("quarter", cycle.getQuarter() != null ? cycle.getQuarter().toString() : "Annual Review");
        variables.put("endDate", cycle.getEndDate() != null ?
                cycle.getEndDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) : "");
        variables.put("year", cycle.getYear() != null ? cycle.getYear().toString() : "");
        variables.put("financialYear", cycle.getFinancialYear());
        request.setVariables(variables);

        return sendEmailWithRetry(request, emailId, "launch");
    }

    @Override
    @Async
    public void sendReminderToAllEmployees(Long cycleId) {
        initExecutorService();
        long startTime = System.currentTimeMillis();

        PerformanceCycle cycle = cycleRepository.findById(cycleId)
                .orElseThrow(() -> new RuntimeException("Cycle not found"));

        log.info("========== SENDING REMINDER EMAILS ==========");
        log.info("Cycle ID: {}, Quarter: {}", cycleId, cycle.getQuarter());

        List<Map<String, Object>> employees = fetchEmployeesFromAPI();
        if (employees.isEmpty()) {
            log.warn("No employees found");
            return;
        }

        List<Map<String, Object>> validEmployees = employees.stream()
                .filter(emp -> emp.get("emailId") != null && !((String) emp.get("emailId")).isEmpty())
                .toList();

        List<List<Map<String, Object>>> batches = new ArrayList<>();
        for (int i = 0; i < validEmployees.size(); i += batchSize) {
            batches.add(validEmployees.subList(i, Math.min(i + batchSize, validEmployees.size())));
        }

        AtomicInteger successCount = new AtomicInteger(0);
        List<CompletableFuture<Void>> futures = new ArrayList<>();

        for (int i = 0; i < batches.size(); i++) {
            final int batchIndex = i;
            final List<Map<String, Object>> batch = batches.get(i);

            CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
                try {
                    semaphore.acquire();
                    boolean success = sendBatchReminderEmail(batch, cycle);
                    if (success) {
                        successCount.addAndGet(batch.size());
                    }
                    if (batchIndex < batches.size() - 1) {
                        Thread.sleep(batchDelayMs);
                    }
                } catch (Exception e) {
                    log.error("Batch {} failed", batchIndex + 1, e);
                } finally {
                    semaphore.release();
                }
            }, executorService);

            futures.add(future);
        }

        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();

        long totalSeconds = (System.currentTimeMillis() - startTime) / 1000;
        log.info("REMINDER EMAILS COMPLETED - Success: {}, Time: {} seconds", successCount.get(), totalSeconds);
    }

    private boolean sendBatchReminderEmail(List<Map<String, Object>> batch, PerformanceCycle cycle) {
        try {
            List<String> recipients = new ArrayList<>();
            for (Map<String, Object> emp : batch) {
                String emailId = (String) emp.get("emailId");
                if (emailId != null && !emailId.isEmpty()) {
                    recipients.add(emailId);
                }
            }

            if (recipients.isEmpty()) return false;

            String subject = String.format("Reminder: %s %s Performance Review",
                    cycle.getYear(), cycle.getQuarter() != null ? "Q" + cycle.getQuarter() : "Annual");
            String body = String.format("Dear Employee,\n\nThis is a reminder to complete your %s performance review.\n\nDeadline: %s\n\nPlease log in to the EPMS portal.",
                    cycle.getQuarter() != null ? "Q" + cycle.getQuarter() + " " + cycle.getYear() : "Annual " + cycle.getYear(),
                    cycle.getEndDate() != null ? cycle.getEndDate().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")) : "Not set");

            SimpleMailMessage message = new SimpleMailMessage();
            message.setBcc(recipients.toArray(new String[0]));
            message.setSubject(subject);
            message.setText(body);
            message.setFrom("cdladmin@cms.co.in");

            mailSender.send(message);
            log.info("✅ Batch reminder sent to {} recipients", recipients.size());
            return true;

        } catch (Exception e) {
            log.error("Failed to send batch reminder", e);
            return false;
        }
    }

    private void sendIndividualReminderEmail(Map<String, Object> emp, PerformanceCycle cycle, Long templateId) {
        String emailId = (String) emp.get("emailId");
        if (emailId == null || emailId.isEmpty()) return;

        String firstName = (String) emp.getOrDefault("firstName", "");
        String lastName = (String) emp.getOrDefault("lastName", "");
        String employeeName = (firstName + " " + lastName).trim();
        if (employeeName.isEmpty()) employeeName = "Employee";

        String uniqueKey = String.format("reminder_%d_%s_%s_%d_%d",
                cycle.getId(), cycle.getQuarter(), emailId, System.currentTimeMillis(), new Random().nextInt(10000));

        EmailRequest request = new EmailRequest();
        request.setTemplateId(templateId);
        request.setTo(emailId);
        request.setCycleId(cycle.getId());
        request.setUniqueKey(uniqueKey);

        Map<String, String> variables = new HashMap<>();
        variables.put("employeeName", employeeName);
        variables.put("firstName", firstName);
        variables.put("quarter", cycle.getQuarter() != null ? cycle.getQuarter().toString() : "Annual Review");
        variables.put("endDate", cycle.getEndDate() != null ?
                cycle.getEndDate().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")) : "Not set");
        variables.put("year", cycle.getYear() != null ? cycle.getYear().toString() : "");

        request.setVariables(variables);
        sendEmailWithRetry(request, emailId, "reminder");
    }

    private void saveEmailRecord(String emailId, String subject, String body,
                                 PerformanceCycle cycle, Map<String, String> variables) {
        log.debug("Email record saved for: {}", emailId);
    }

    // ==================== INDIVIDUAL EMAIL METHODS ====================

    @Override
    @Async
    public void sendGoalSubmissionToManager(String employeeId, String managerId, String quarter, String year, List<Map<String, Object>> goals) {
        addDelayForIndividualEmail();

        log.info("========== SENDING GOAL SUBMISSION TO MANAGER ==========");
        log.info("Employee ID: {}, Manager ID: {}, Quarter: {}, Year: {}", employeeId, managerId, quarter, year);

        try {
            Map<String, Object> employee = fetchEmployeeById(employeeId);
            if (employee == null) {
                log.error("Employee not found with ID: {}", employeeId);
                return;
            }

            String managerEmail = (String) employee.get("reportingManagerEmailId");
            String managerName = (String) employee.get("reportingManager");

            if (managerEmail == null || managerEmail.isEmpty()) {
                log.error("Manager email not found for employee: {}", employeeId);
                return;
            }

            String employeeName = getEmployeeFullName(employee);
            log.info("Sending to manager: {} ({})", managerName, managerEmail);

            StringBuilder goalsHtml = buildGoalsHtml(goals);
            String financialYear = year + "-" + (Integer.parseInt(year) + 1);
            String uniqueKey = String.format("goal_submission_manager_%s_%s_%s_%d",
                    employeeId, quarter, year, System.currentTimeMillis());

            EmailRequest emailRequest = new EmailRequest();
            emailRequest.setTemplateId(18L);
            emailRequest.setTo(managerEmail);
            emailRequest.setUniqueKey(uniqueKey);
            emailRequest.setReminderType("GOAL_SUBMISSION_TO_MANAGER");

            Map<String, String> variables = new HashMap<>();
            variables.put("managerName", managerName != null ? managerName : "Manager");
            variables.put("employeeName", employeeName);
            variables.put("employeeId", employeeId);
            variables.put("quarter", quarter);
            variables.put("year", year);
            variables.put("financialYear", financialYear);
            variables.put("submissionDate", LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")));
            variables.put("submissionTime", LocalDateTime.now().format(DateTimeFormatter.ofPattern("hh:mm a")));
            variables.put("goalsTable", goalsHtml.toString());
            variables.put("reviewUrl", frontendUrl + managerGoalSettingPath + "/" + employeeId + "?year=" + year + "&quarter=" + quarter);

            emailRequest.setVariables(variables);
            sendEmailWithRetry(emailRequest, managerEmail, "goal submission to manager");
            log.info("✅ Goal submission sent to manager: {}", managerEmail);

        } catch (Exception e) {
            log.error("Failed to send goal submission to manager: ", e);
        }
        log.info("==================================================");
    }

    @Override
    @Async
    public void sendGoalSubmissionToEmployee(String employeeId, String managerId, String quarter, String year, List<Map<String, Object>> goals) {
        addDelayForIndividualEmail();

        log.info("========== SENDING GOAL SUBMISSION TO EMPLOYEE ==========");
        log.info("Employee ID: {}, Manager ID: {}, Quarter: {}, Year: {}", employeeId, managerId, quarter, year);

        try {
            Map<String, Object> employee = fetchEmployeeById(employeeId);
            if (employee == null) {
                log.error("Employee not found with ID: {}", employeeId);
                return;
            }

            String employeeEmail = (String) employee.get("emailId");
            if (employeeEmail == null || employeeEmail.isEmpty()) {
                log.error("Employee email not found");
                return;
            }

            String employeeName = getEmployeeFullName(employee);
            String managerName = (String) employee.get("reportingManager");
            if (managerName == null) managerName = "Manager";

            log.info("Sending to employee: {}", employeeEmail);

            StringBuilder goalsHtml = buildGoalsHtml(goals);
            String financialYear = year + "-" + (Integer.parseInt(year) + 1);
            String uniqueKey = String.format("goal_submission_employee_%s_%s_%s_%d",
                    employeeId, quarter, year, System.currentTimeMillis());

            EmailRequest emailRequest = new EmailRequest();
            emailRequest.setTemplateId(19L);
            emailRequest.setTo(employeeEmail);
            emailRequest.setUniqueKey(uniqueKey);
            emailRequest.setReminderType("GOAL_SUBMISSION_TO_EMPLOYEE");

            Map<String, String> variables = new HashMap<>();
            variables.put("employeeName", employeeName);
            variables.put("managerName", managerName);
            variables.put("quarter", quarter);
            variables.put("year", year);
            variables.put("financialYear", financialYear);
            variables.put("submissionDate", LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")));
            variables.put("submissionTime", LocalDateTime.now().format(DateTimeFormatter.ofPattern("hh:mm a")));
            variables.put("goalsTable", goalsHtml.toString());

            emailRequest.setVariables(variables);
            sendEmailWithRetry(emailRequest, employeeEmail, "goal submission to employee");
            log.info("✅ Goal submission sent to employee: {}", employeeEmail);

        } catch (Exception e) {
            log.error("Failed to send goal submission to employee: ", e);
        }
        log.info("==================================================");
    }

    // ==================== GOAL APPROVAL/REJECTION EMAILS ====================

    @Override
    @Async
    public void sendGoalApprovalToEmployee(String employeeId, String managerId, String quarter, String year, List<Map<String, Object>> goals) {
        addDelayForIndividualEmail();

        log.info("========== SENDING GOAL APPROVAL TO EMPLOYEE ==========");
        log.info("Employee ID: {}, Manager ID: {}, Quarter: {}, Year: {}", employeeId, managerId, quarter, year);

        try {
            Map<String, Object> employee = fetchEmployeeById(employeeId);
            if (employee == null) {
                log.error("Employee not found");
                return;
            }

            String employeeEmail = (String) employee.get("emailId");
            if (employeeEmail == null || employeeEmail.isEmpty()) {
                log.error("Employee email not found");
                return;
            }

            String employeeName = getEmployeeFullName(employee);
            String managerName = (String) employee.get("reportingManager");
            if (managerName == null) managerName = "Manager";

            StringBuilder goalsHtml = buildGoalsHtml(goals);
            String financialYear = year + "-" + (Integer.parseInt(year) + 1);
            String uniqueKey = String.format("goal_approval_%s_%s_%s_%d",
                    employeeId, quarter, year, System.currentTimeMillis());

            EmailRequest emailRequest = new EmailRequest();
            emailRequest.setTemplateId(20L);
            emailRequest.setTo(employeeEmail);
            emailRequest.setUniqueKey(uniqueKey);
            emailRequest.setReminderType("GOAL_APPROVAL_TO_EMPLOYEE");

            Map<String, String> variables = new HashMap<>();
            variables.put("employeeName", employeeName);
            variables.put("managerName", managerName);
            variables.put("quarter", quarter);
            variables.put("year", year);
            variables.put("financialYear", financialYear);
            variables.put("approvalDate", LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")));
            variables.put("approvalTime", LocalDateTime.now().format(DateTimeFormatter.ofPattern("hh:mm a")));
            variables.put("goalsTable", goalsHtml.toString());

            emailRequest.setVariables(variables);
            sendEmailWithRetry(emailRequest, employeeEmail, "goal approval");
            log.info("✅ Goal approval sent to employee: {}", employeeEmail);

        } catch (Exception e) {
            log.error("Failed to send goal approval: ", e);
        }
        log.info("==================================================");
    }

    @Override
    @Async
    public void sendGoalRejectionToEmployee(String employeeId, String managerId, String quarter, String year, List<Map<String, Object>> goals, String rejectionReason) {
        addDelayForIndividualEmail();

        log.info("========== SENDING GOAL REJECTION TO EMPLOYEE ==========");
        log.info("Employee ID: {}, Manager ID: {}, Quarter: {}, Year: {}", employeeId, managerId, quarter, year);

        try {
            Map<String, Object> employee = fetchEmployeeById(employeeId);
            if (employee == null) {
                log.error("Employee not found");
                return;
            }

            String employeeEmail = (String) employee.get("emailId");
            if (employeeEmail == null || employeeEmail.isEmpty()) {
                log.error("Employee email not found");
                return;
            }

            String employeeName = getEmployeeFullName(employee);
            String managerName = (String) employee.get("reportingManager");
            if (managerName == null) managerName = "Manager";

            StringBuilder goalsHtml = buildGoalsHtml(goals);
            String financialYear = year + "-" + (Integer.parseInt(year) + 1);
            String uniqueKey = String.format("goal_rejection_%s_%s_%s_%d",
                    employeeId, quarter, year, System.currentTimeMillis());

            EmailRequest emailRequest = new EmailRequest();
            emailRequest.setTemplateId(21L);
            emailRequest.setTo(employeeEmail);
            emailRequest.setUniqueKey(uniqueKey);
            emailRequest.setReminderType("GOAL_REJECTION_TO_EMPLOYEE");

            Map<String, String> variables = new HashMap<>();
            variables.put("employeeName", employeeName);
            variables.put("managerName", managerName);
            variables.put("quarter", quarter);
            variables.put("year", year);
            variables.put("financialYear", financialYear);
            variables.put("rejectionDate", LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")));
            variables.put("rejectionTime", LocalDateTime.now().format(DateTimeFormatter.ofPattern("hh:mm a")));
            variables.put("goalsTable", goalsHtml.toString());
            variables.put("rejectionReason", rejectionReason != null ? rejectionReason : "No specific reason provided");

            emailRequest.setVariables(variables);
            sendEmailWithRetry(emailRequest, employeeEmail, "goal rejection");
            log.info("✅ Goal rejection sent to employee: {}", employeeEmail);

        } catch (Exception e) {
            log.error("Failed to send goal rejection: ", e);
        }
        log.info("==================================================");
    }

    // ==================== SELF REVIEW EMAILS ====================

    @Override
    @Async
    public void sendGoalSelfReviewSubmittedToManager(String employeeId, String managerId, String quarter, String year, List<Map<String, Object>> goals, int overallRating) {
        addDelayForIndividualEmail();

        log.info("========== SENDING SELF REVIEW TO MANAGER ==========");
        log.info("Employee ID: {}, Manager ID: {}, Quarter: {}, Year: {}", employeeId, managerId, quarter, year);

        try {
            Map<String, Object> employee = fetchEmployeeById(employeeId);
            if (employee == null) {
                log.error("Employee not found");
                return;
            }

            String managerEmail = (String) employee.get("reportingManagerEmailId");
            String managerName = (String) employee.get("reportingManager");

            if (managerEmail == null || managerEmail.isEmpty()) {
                log.error("Manager email not found for employee: {}", employeeId);
                return;
            }

            String employeeName = getEmployeeFullName(employee);
            StringBuilder goalsHtml = buildSelfReviewGoalsHtml(goals);
            String financialYear = year + "-" + (Integer.parseInt(year) + 1);
            String uniqueKey = String.format("self_review_manager_%s_%s_%s_%d",
                    employeeId, quarter, year, System.currentTimeMillis());

            EmailRequest emailRequest = new EmailRequest();
            emailRequest.setTemplateId(22L);
            emailRequest.setTo(managerEmail);
            emailRequest.setUniqueKey(uniqueKey);
            emailRequest.setReminderType("SELF_REVIEW_SUBMITTED_TO_MANAGER");

            Map<String, String> variables = new HashMap<>();
            variables.put("managerName", managerName != null ? managerName : "Manager");
            variables.put("employeeName", employeeName);
            variables.put("employeeId", employeeId);
            variables.put("quarter", quarter);
            variables.put("year", year);
            variables.put("financialYear", financialYear);
            variables.put("submissionDate", LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")));
            variables.put("submissionTime", LocalDateTime.now().format(DateTimeFormatter.ofPattern("hh:mm a")));
            variables.put("goalsTable", goalsHtml.toString());
            variables.put("overallRating", String.valueOf(overallRating));

            emailRequest.setVariables(variables);
            sendEmailWithRetry(emailRequest, managerEmail, "self review to manager");
            log.info("✅ Self review sent to manager: {}", managerEmail);

        } catch (Exception e) {
            log.error("Failed to send self review to manager: ", e);
        }
        log.info("==================================================");
    }

    @Override
    @Async
    public void sendGoalSelfReviewSubmittedToEmployee(String employeeId, String managerId, String quarter, String year, List<Map<String, Object>> goals, int overallRating) {
        addDelayForIndividualEmail();

        log.info("========== SENDING SELF REVIEW TO EMPLOYEE ==========");
        log.info("Employee ID: {}, Manager ID: {}, Quarter: {}, Year: {}", employeeId, managerId, quarter, year);

        try {
            Map<String, Object> employee = fetchEmployeeById(employeeId);
            if (employee == null) {
                log.error("Employee not found");
                return;
            }

            String employeeEmail = (String) employee.get("emailId");
            if (employeeEmail == null || employeeEmail.isEmpty()) {
                log.error("Employee email not found");
                return;
            }

            String employeeName = getEmployeeFullName(employee);
            String managerName = (String) employee.get("reportingManager");
            if (managerName == null) managerName = "Manager";

            StringBuilder goalsHtml = buildSelfReviewGoalsHtml(goals);
            String financialYear = year + "-" + (Integer.parseInt(year) + 1);
            String uniqueKey = String.format("self_review_employee_%s_%s_%s_%d",
                    employeeId, quarter, year, System.currentTimeMillis());

            EmailRequest emailRequest = new EmailRequest();
            emailRequest.setTemplateId(23L);
            emailRequest.setTo(employeeEmail);
            emailRequest.setUniqueKey(uniqueKey);
            emailRequest.setReminderType("SELF_REVIEW_SUBMITTED_TO_EMPLOYEE");

            Map<String, String> variables = new HashMap<>();
            variables.put("employeeName", employeeName);
            variables.put("managerName", managerName);
            variables.put("quarter", quarter);
            variables.put("year", year);
            variables.put("financialYear", financialYear);
            variables.put("submissionDate", LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")));
            variables.put("submissionTime", LocalDateTime.now().format(DateTimeFormatter.ofPattern("hh:mm a")));
            variables.put("goalsTable", goalsHtml.toString());
            variables.put("overallRating", String.valueOf(overallRating));

            emailRequest.setVariables(variables);
            sendEmailWithRetry(emailRequest, employeeEmail, "self review to employee");
            log.info("✅ Self review sent to employee: {}", employeeEmail);

        } catch (Exception e) {
            log.error("Failed to send self review to employee: ", e);
        }
        log.info("==================================================");
    }

    // ==================== MANAGER FINAL REVIEW EMAILS ====================

    @Override
    @Async
    public void sendGoalManagerReviewSubmittedToEmployee(String employeeId, String managerId, String quarter, String year, List<Map<String, Object>> goals, int overallRating, String managerRating) {
        addDelayForIndividualEmail();

        log.info("========== SENDING MANAGER REVIEW TO EMPLOYEE ==========");
        log.info("Employee ID: {}, Manager ID: {}, Quarter: {}, Year: {}", employeeId, managerId, quarter, year);

        try {
            Map<String, Object> employee = fetchEmployeeById(employeeId);
            if (employee == null) {
                log.error("Employee not found");
                return;
            }

            String employeeEmail = (String) employee.get("emailId");
            if (employeeEmail == null || employeeEmail.isEmpty()) {
                log.error("Employee email not found");
                return;
            }

            String employeeName = getEmployeeFullName(employee);
            String managerName = (String) employee.get("reportingManager");
            if (managerName == null) managerName = "Manager";

            StringBuilder goalsHtml = buildManagerReviewGoalsHtml(goals);
            String financialYear = year + "-" + (Integer.parseInt(year) + 1);
            String uniqueKey = String.format("manager_review_employee_%s_%s_%s_%d",
                    employeeId, quarter, year, System.currentTimeMillis());

            EmailRequest emailRequest = new EmailRequest();
            emailRequest.setTemplateId(24L);
            emailRequest.setTo(employeeEmail);
            emailRequest.setUniqueKey(uniqueKey);
            emailRequest.setReminderType("MANAGER_REVIEW_SUBMITTED_TO_EMPLOYEE");

            Map<String, String> variables = new HashMap<>();
            variables.put("employeeName", employeeName);
            variables.put("managerName", managerName);
            variables.put("quarter", quarter);
            variables.put("year", year);
            variables.put("financialYear", financialYear);
            variables.put("submissionDate", LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")));
            variables.put("submissionTime", LocalDateTime.now().format(DateTimeFormatter.ofPattern("hh:mm a")));
            variables.put("goalsTable", goalsHtml.toString());
            variables.put("overallRating", String.valueOf(overallRating));
            variables.put("managerRating", managerRating != null ? managerRating : "Not specified");

            emailRequest.setVariables(variables);
            sendEmailWithRetry(emailRequest, employeeEmail, "manager review to employee");
            log.info("✅ Manager review sent to employee: {}", employeeEmail);

        } catch (Exception e) {
            log.error("Failed to send manager review to employee: ", e);
        }
        log.info("==================================================");
    }

    @Override
    @Async
    public void sendGoalManagerReviewSubmittedToHR(String employeeId, String managerId, String quarter, String year, List<Map<String, Object>> goals, int overallRating) {
        addDelayForIndividualEmail();

        log.info("========== SENDING MANAGER REVIEW TO HR ==========");
        log.info("Employee ID: {}, Manager ID: {}, Quarter: {}, Year: {}", employeeId, managerId, quarter, year);

        try {
            String hrEmail = "hr@cms.co.in";

            Map<String, Object> employee = fetchEmployeeById(employeeId);
            String employeeName = employee != null ? getEmployeeFullName(employee) : "Employee";

            Map<String, Object> manager = fetchEmployeeById(managerId);
            String managerName = manager != null ? getEmployeeFullName(manager) : "Manager";

            StringBuilder goalsHtml = buildManagerReviewGoalsHtml(goals);
            String financialYear = year + "-" + (Integer.parseInt(year) + 1);
            String uniqueKey = String.format("manager_review_hr_%s_%s_%s_%d",
                    employeeId, quarter, year, System.currentTimeMillis());

            EmailRequest emailRequest = new EmailRequest();
            emailRequest.setTemplateId(25L);
            emailRequest.setTo(hrEmail);
            emailRequest.setUniqueKey(uniqueKey);
            emailRequest.setReminderType("MANAGER_REVIEW_SUBMITTED_TO_HR");

            Map<String, String> variables = new HashMap<>();
            variables.put("hrName", "HR Team");
            variables.put("employeeName", employeeName);
            variables.put("employeeId", employeeId);
            variables.put("managerName", managerName);
            variables.put("quarter", quarter);
            variables.put("year", year);
            variables.put("financialYear", financialYear);
            variables.put("submissionDate", LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")));
            variables.put("submissionTime", LocalDateTime.now().format(DateTimeFormatter.ofPattern("hh:mm a")));
            variables.put("goalsTable", goalsHtml.toString());
            variables.put("overallRating", String.valueOf(overallRating));

            emailRequest.setVariables(variables);
            sendEmailWithRetry(emailRequest, hrEmail, "manager review to HR");
            log.info("✅ Manager review sent to HR: {}", hrEmail);

        } catch (Exception e) {
            log.error("Failed to send manager review to HR: ", e);
        }
        log.info("==================================================");
    }

    // ==================== EMPLOYEE ACCEPTANCE EMAIL ====================

    @Override
    @Async
    public void sendGoalAcceptedByEmployeeToManager(String employeeId, String managerId, String quarter, String year) {
        addDelayForIndividualEmail();

        log.info("========== SENDING GOAL ACCEPTANCE TO MANAGER ==========");
        log.info("Employee ID: {}, Manager ID: {}, Quarter: {}, Year: {}", employeeId, managerId, quarter, year);

        try {
            Map<String, Object> employee = fetchEmployeeById(employeeId);
            if (employee == null) {
                log.error("Employee not found");
                return;
            }

            String managerEmail = (String) employee.get("reportingManagerEmailId");
            String managerName = (String) employee.get("reportingManager");

            if (managerEmail == null || managerEmail.isEmpty()) {
                log.error("Manager email not found for employee: {}", employeeId);
                return;
            }

            String employeeName = getEmployeeFullName(employee);
            String financialYear = year + "-" + (Integer.parseInt(year) + 1);
            String uniqueKey = String.format("goal_acceptance_%s_%s_%s_%d",
                    employeeId, quarter, year, System.currentTimeMillis());

            EmailRequest emailRequest = new EmailRequest();
            emailRequest.setTemplateId(26L);
            emailRequest.setTo(managerEmail);
            emailRequest.setUniqueKey(uniqueKey);
            emailRequest.setReminderType("GOAL_ACCEPTED_BY_EMPLOYEE_TO_MANAGER");

            Map<String, String> variables = new HashMap<>();
            variables.put("managerName", managerName != null ? managerName : "Manager");
            variables.put("employeeName", employeeName);
            variables.put("employeeId", employeeId);
            variables.put("quarter", quarter);
            variables.put("year", year);
            variables.put("financialYear", financialYear);
            variables.put("acceptanceDate", LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")));
            variables.put("acceptanceTime", LocalDateTime.now().format(DateTimeFormatter.ofPattern("hh:mm a")));

            emailRequest.setVariables(variables);
            sendEmailWithRetry(emailRequest, managerEmail, "goal acceptance to manager");
            log.info("✅ Goal acceptance sent to manager: {}", managerEmail);

        } catch (Exception e) {
            log.error("Failed to send goal acceptance to manager: ", e);
        }
        log.info("==================================================");
    }

    // ==================== ANNUAL REVIEW EMAIL METHODS ====================

    @Override
    @Async
    public void sendEmployeeGSSubmissionNotification(Long reviewId, String employeeId, String managerId, String financialYear) {
        addDelayForIndividualEmail();

        log.info("========== SENDING ANNUAL REVIEW SUBMISSION CONFIRMATION TO EMPLOYEE ==========");
        log.info("Employee ID: {}, Review ID: {}, Financial Year: {}", employeeId, reviewId, financialYear);

        try {
            Map<String, Object> employee = fetchEmployeeById(employeeId);
            if (employee == null) {
                log.error("Employee not found with ID: {}", employeeId);
                return;
            }

            String employeeEmail = (String) employee.get("emailId");
            if (employeeEmail == null || employeeEmail.isEmpty()) {
                log.error("Employee email not found for ID: {}", employeeId);
                return;
            }

            String employeeName = getEmployeeFullName(employee);
            String managerName = (String) employee.get("reportingManager");
            if (managerName == null) managerName = "Manager";

            String[] years = financialYear.split("-");
            String year = years[0];

            String uniqueKey = String.format("annual_review_submission_employee_%s_%s_%d",
                    employeeId, financialYear, System.currentTimeMillis());

            EmailRequest emailRequest = new EmailRequest();
            emailRequest.setTemplateId(11L);
            emailRequest.setTo(employeeEmail);
            emailRequest.setUniqueKey(uniqueKey);
            emailRequest.setReminderType("ANNUAL_REVIEW_SUBMITTED_TO_R1_EMPLOYEE");

            Map<String, String> variables = new HashMap<>();
            variables.put("employeeName", employeeName);
            variables.put("managerName", managerName);
            variables.put("financialYear", financialYear);
            variables.put("submissionDate", LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")));
            variables.put("submissionTime", LocalDateTime.now().format(DateTimeFormatter.ofPattern("hh:mm a")));
            variables.put("reviewUrl", frontendUrl + employeeAnnualReviewPath + "/" + employeeId + "?year=" + year);

            emailRequest.setVariables(variables);
            sendEmailWithRetry(emailRequest, employeeEmail, "annual review submission confirmation");
            log.info("✅ Annual review submission confirmation sent to employee: {}", employeeEmail);

        } catch (Exception e) {
            log.error("Failed to send annual review submission confirmation to employee: ", e);
        }
        log.info("==================================================");
    }

    @Override
    @Async
    public void sendManagerGSSubmissionNotification(Long reviewId, String employeeId, String managerId, String financialYear) {
        addDelayForIndividualEmail();

        log.info("========== SENDING ANNUAL REVIEW SUBMISSION NOTIFICATION TO MANAGER ==========");
        log.info("Employee ID: {}, Manager ID: {}, Review ID: {}, Financial Year: {}",
                employeeId, managerId, reviewId, financialYear);

        try {
            Map<String, Object> employee = fetchEmployeeById(employeeId);
            if (employee == null) {
                log.error("Employee not found with ID: {}", employeeId);
                return;
            }

            String managerEmail = (String) employee.get("reportingManagerEmailId");
            String managerName = (String) employee.get("reportingManager");

            if (managerEmail == null || managerEmail.isEmpty()) {
                log.error("Manager email not found for employee: {}", employeeId);
                return;
            }

            String employeeName = getEmployeeFullName(employee);
            String[] years = financialYear.split("-");
            String year = years[0];

            String uniqueKey = String.format("annual_review_submission_manager_%s_%s_%d",
                    employeeId, financialYear, System.currentTimeMillis());

            EmailRequest emailRequest = new EmailRequest();
            emailRequest.setTemplateId(12L);
            emailRequest.setTo(managerEmail);
            emailRequest.setUniqueKey(uniqueKey);
            emailRequest.setReminderType("ANNUAL_REVIEW_SUBMITTED_TO_R1_MANAGER");

            Map<String, String> variables = new HashMap<>();
            variables.put("managerName", managerName != null ? managerName : "Manager");
            variables.put("employeeName", employeeName);
            variables.put("employeeId", employeeId);
            variables.put("financialYear", financialYear);
            variables.put("submissionDate", LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")));
            variables.put("submissionTime", LocalDateTime.now().format(DateTimeFormatter.ofPattern("hh:mm a")));
            variables.put("reviewUrl", frontendUrl + managerAnnualReviewPath + "/" + employeeId + "?year=" + year);

            emailRequest.setVariables(variables);
            sendEmailWithRetry(emailRequest, managerEmail, "annual review submission notification");
            log.info("✅ Annual review submission notification sent to manager: {}", managerEmail);

        } catch (Exception e) {
            log.error("Failed to send annual review submission notification to manager: ", e);
        }
        log.info("==================================================");
    }

    @Override
    @Async
    public void sendManagerReviewSubmittedToEmployeeNotification(Long reviewId, String employeeId, String managerId, String financialYear) {
        addDelayForIndividualEmail();

        log.info("========== SENDING MANAGER REVIEW COMPLETED NOTIFICATION TO EMPLOYEE ==========");
        log.info("Employee ID: {}, Review ID: {}, Financial Year: {}", employeeId, reviewId, financialYear);

        try {
            Map<String, Object> employee = fetchEmployeeById(employeeId);
            if (employee == null) {
                log.error("Employee not found with ID: {}", employeeId);
                return;
            }

            String employeeEmail = (String) employee.get("emailId");
            if (employeeEmail == null || employeeEmail.isEmpty()) {
                log.error("Employee email not found for ID: {}", employeeId);
                return;
            }

            String employeeName = getEmployeeFullName(employee);
            String managerName = (String) employee.get("reportingManager");
            if (managerName == null) managerName = "Manager";

            String[] years = financialYear.split("-");
            String year = years[0];

            String uniqueKey = String.format("manager_review_completed_employee_%s_%s_%d",
                    employeeId, financialYear, System.currentTimeMillis());

            EmailRequest emailRequest = new EmailRequest();
            emailRequest.setTemplateId(13L);
            emailRequest.setTo(employeeEmail);
            emailRequest.setUniqueKey(uniqueKey);
            emailRequest.setReminderType("MANAGER_REVIEW_COMPLETED_TO_EMPLOYEE");

            Map<String, String> variables = new HashMap<>();
            variables.put("employeeName", employeeName);
            variables.put("managerName", managerName);
            variables.put("financialYear", financialYear);
            variables.put("submissionDate", LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")));
            variables.put("submissionTime", LocalDateTime.now().format(DateTimeFormatter.ofPattern("hh:mm a")));
            variables.put("reviewUrl", frontendUrl + employeeAnnualReviewPath + "/" + employeeId + "?year=" + year);

            emailRequest.setVariables(variables);
            sendEmailWithRetry(emailRequest, employeeEmail, "manager review completed notification");
            log.info("✅ Manager review completed notification sent to employee: {}", employeeEmail);

        } catch (Exception e) {
            log.error("Failed to send manager review completed notification to employee: ", e);
        }
        log.info("==================================================");
    }

    @Override
    @Async
    public void sendHRSubmissionNotification(Long reviewId, String employeeId, String financialYear) {
        addDelayForIndividualEmail();

        log.info("========== SENDING HR SUBMISSION CONFIRMATION TO EMPLOYEE ==========");
        log.info("Employee ID: {}, Review ID: {}, Financial Year: {}", employeeId, reviewId, financialYear);

        try {
            Map<String, Object> employee = fetchEmployeeById(employeeId);
            if (employee == null) {
                log.error("Employee not found with ID: {}", employeeId);
                return;
            }

            String employeeEmail = (String) employee.get("emailId");
            if (employeeEmail == null || employeeEmail.isEmpty()) {
                log.error("Employee email not found for ID: {}", employeeId);
                return;
            }

            String employeeName = getEmployeeFullName(employee);
            String[] years = financialYear.split("-");
            String year = years[0];

            String uniqueKey = String.format("hr_submission_employee_%s_%s_%d",
                    employeeId, financialYear, System.currentTimeMillis());

            EmailRequest emailRequest = new EmailRequest();
            emailRequest.setTemplateId(14L);
            emailRequest.setTo(employeeEmail);
            emailRequest.setUniqueKey(uniqueKey);
            emailRequest.setReminderType("HR_SUBMISSION_CONFIRMATION_TO_EMPLOYEE");

            Map<String, String> variables = new HashMap<>();
            variables.put("employeeName", employeeName);
            variables.put("financialYear", financialYear);
            variables.put("submissionDate", LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")));
            variables.put("submissionTime", LocalDateTime.now().format(DateTimeFormatter.ofPattern("hh:mm a")));
            variables.put("reviewUrl", frontendUrl + employeeAnnualReviewPath + "/" + employeeId + "?year=" + year);

            emailRequest.setVariables(variables);
            sendEmailWithRetry(emailRequest, employeeEmail, "HR submission confirmation");
            log.info("✅ HR submission confirmation sent to employee: {}", employeeEmail);

        } catch (Exception e) {
            log.error("Failed to send HR submission confirmation to employee: ", e);
        }
        log.info("==================================================");
    }

    @Override
    @Async
    public void sendSendBackNotifications(Long reviewId, String employeeId, String managerId, String financialYear, String remarks, int attemptCount) {
        sendSendBackNotificationToManager(reviewId, employeeId, managerId, financialYear, remarks, attemptCount);
        sendSendBackNotificationToEmployee(reviewId, employeeId, managerId, financialYear, remarks, attemptCount);
    }

    private void sendSendBackNotificationToManager(Long reviewId, String employeeId, String managerId, String financialYear, String remarks, int attemptCount) {
        addDelayForIndividualEmail();

        boolean isLastAttempt = attemptCount >= 2;
        log.info("========== SENDING SEND BACK NOTIFICATION TO MANAGER ==========");
        log.info("Employee ID: {}, Manager ID: {}, Attempt: {}/2", employeeId, managerId, attemptCount);

        try {
            Map<String, Object> employee = fetchEmployeeById(employeeId);
            if (employee == null) {
                log.error("Employee not found with ID: {}", employeeId);
                return;
            }

            String managerEmail = (String) employee.get("reportingManagerEmailId");
            String managerName = (String) employee.get("reportingManager");
            String employeeName = getEmployeeFullName(employee);

            if (managerEmail == null || managerEmail.isEmpty()) {
                log.error("Manager email not found for employee: {}", employeeId);
                return;
            }

            String uniqueKey = String.format("send_back_manager_%s_%s_%d_attempt_%d",
                    employeeId, financialYear, System.currentTimeMillis(), attemptCount);

            EmailRequest emailRequest = new EmailRequest();
            emailRequest.setTemplateId(isLastAttempt ? 16L : 15L);
            emailRequest.setTo(managerEmail);
            emailRequest.setUniqueKey(uniqueKey);
            emailRequest.setReminderType("ANNUAL_REVIEW_SENT_BACK_TO_MANAGER");

            Map<String, String> variables = new HashMap<>();
            variables.put("managerName", managerName != null ? managerName : "Manager");
            variables.put("employeeName", employeeName);
            variables.put("employeeId", employeeId);
            variables.put("financialYear", financialYear);
            variables.put("remarks", remarks != null ? remarks : "No remarks provided");
            variables.put("attemptNumber", String.valueOf(attemptCount));
            variables.put("sendBackDate", LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")));
            variables.put("sendBackTime", LocalDateTime.now().format(DateTimeFormatter.ofPattern("hh:mm a")));

            String[] years = financialYear.split("-");
            String year = years[0];
            variables.put("reviewUrl", frontendUrl + managerAnnualReviewPath + "/" + employeeId + "?year=" + year);

            emailRequest.setVariables(variables);
            sendEmailWithRetry(emailRequest, managerEmail, "send back notification to manager");
            log.info("✅ Send back notification (Attempt {}/2) sent to manager: {}", attemptCount, managerEmail);

        } catch (Exception e) {
            log.error("Failed to send send back notification to manager: ", e);
        }
        log.info("==================================================");
    }

    private void sendSendBackNotificationToEmployee(Long reviewId, String employeeId, String managerId, String financialYear, String remarks, int attemptCount) {
        addDelayForIndividualEmail();

        log.info("========== SENDING SEND BACK CONFIRMATION TO EMPLOYEE ==========");
        log.info("Employee ID: {}, Attempt: {}/2", employeeId, attemptCount);

        try {
            Map<String, Object> employee = fetchEmployeeById(employeeId);
            if (employee == null) {
                log.error("Employee not found with ID: {}", employeeId);
                return;
            }

            String employeeEmail = (String) employee.get("emailId");
            if (employeeEmail == null || employeeEmail.isEmpty()) {
                log.error("Employee email not found for ID: {}", employeeId);
                return;
            }

            String employeeName = getEmployeeFullName(employee);
            String managerName = (String) employee.get("reportingManager");
            if (managerName == null) managerName = "Manager";

            String uniqueKey = String.format("send_back_employee_%s_%s_%d_attempt_%d",
                    employeeId, financialYear, System.currentTimeMillis(), attemptCount);

            EmailRequest emailRequest = new EmailRequest();
            emailRequest.setTemplateId(17L);
            emailRequest.setTo(employeeEmail);
            emailRequest.setUniqueKey(uniqueKey);
            emailRequest.setReminderType("ANNUAL_REVIEW_SENT_BACK_CONFIRMATION_TO_EMPLOYEE");

            Map<String, String> variables = new HashMap<>();
            variables.put("employeeName", employeeName);
            variables.put("managerName", managerName);
            variables.put("financialYear", financialYear);
            variables.put("remarks", remarks != null ? remarks : "No remarks provided");
            variables.put("attemptNumber", String.valueOf(attemptCount));
            variables.put("sendBackDate", LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")));
            variables.put("sendBackTime", LocalDateTime.now().format(DateTimeFormatter.ofPattern("hh:mm a")));

            String[] years = financialYear.split("-");
            String year = years[0];
            variables.put("reviewUrl", frontendUrl + employeeAnnualReviewPath + "/" + employeeId + "?year=" + year);

            emailRequest.setVariables(variables);
            sendEmailWithRetry(emailRequest, employeeEmail, "send back confirmation to employee");
            log.info("✅ Send back confirmation (Attempt {}/2) sent to employee: {}", attemptCount, employeeEmail);

        } catch (Exception e) {
            log.error("Failed to send send back confirmation to employee: ", e);
        }
        log.info("==================================================");
    }

    @Override
    @Async
    public void sendAnnualReviewSendBackEmail(Long reviewId, String remarks, String employeeId, String managerId, Integer year) {
        sendAnnualReviewSendBackEmail(reviewId, remarks, employeeId, managerId, year, 1, false);
    }

    @Override
    @Async
    public void sendAnnualReviewSendBackEmail(Long reviewId, String remarks, String employeeId, String managerId, Integer year, int attemptCount, boolean isLastAttempt) {
        addDelayForIndividualEmail();

        String financialYear = year + "-" + (year + 1);
        log.info("========== SENDING ANNUAL REVIEW SEND BACK EMAIL ==========");
        log.info("Employee ID: {}, Manager ID: {}, Attempt: {}/2", employeeId, managerId, attemptCount);

        try {
            Map<String, Object> employee = fetchEmployeeById(employeeId);
            if (employee == null) {
                log.error("Employee not found with ID: {}", employeeId);
                return;
            }

            String managerEmail = (String) employee.get("reportingManagerEmailId");
            String managerName = (String) employee.get("reportingManager");
            String employeeName = getEmployeeFullName(employee);

            if (managerEmail == null || managerEmail.isEmpty()) {
                log.error("Manager email not found for employee: {}", employeeId);
                return;
            }

            String uniqueKey = String.format("annual_review_sendback_%s_%d_%d_attempt_%d",
                    employeeId, year, System.currentTimeMillis(), attemptCount);

            EmailRequest emailRequest = new EmailRequest();
            emailRequest.setTemplateId(isLastAttempt ? 16L : 15L);
            emailRequest.setTo(managerEmail);
            emailRequest.setUniqueKey(uniqueKey);
            emailRequest.setReminderType("ANNUAL_REVIEW_SENT_BACK_TO_MANAGER");

            Map<String, String> variables = new HashMap<>();
            variables.put("managerName", managerName != null ? managerName : "Manager");
            variables.put("employeeName", employeeName);
            variables.put("employeeId", employeeId);
            variables.put("financialYear", financialYear);
            variables.put("remarks", remarks != null ? remarks : "No remarks provided");
            variables.put("attemptNumber", String.valueOf(attemptCount));
            variables.put("isLastAttempt", String.valueOf(isLastAttempt));
            variables.put("sendBackDate", LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")));
            variables.put("sendBackTime", LocalDateTime.now().format(DateTimeFormatter.ofPattern("hh:mm a")));
            variables.put("reviewUrl", frontendUrl + managerAnnualReviewPath + "/" + employeeId + "?year=" + year);

            emailRequest.setVariables(variables);
            sendEmailWithRetry(emailRequest, managerEmail, "annual review send back");
            log.info("✅ Annual review send back email (Attempt {}/2) sent to manager: {}", attemptCount, managerEmail);

            sendSendBackNotificationToEmployee(reviewId, employeeId, managerId, financialYear, remarks, attemptCount);

        } catch (Exception e) {
            log.error("Failed to send annual review send back email: ", e);
        }
        log.info("==================================================");
    }

    // ==================== OTHER REQUIRED METHODS ====================

    @Override
    @Async
    public void sendAcceptanceNotification(String employeeId, String managerEmailId, String employeeName,
                                           String managerName, String quarter, String year,
                                           String financialYear, String acceptanceDate, String acceptanceTime) {
        addDelayForIndividualEmail();

        log.info("========== SENDING ACCEPTANCE NOTIFICATION ==========");
        log.info("Employee: {}, Manager: {}", employeeName, managerName);

        try {
            if (managerEmailId != null && !managerEmailId.isEmpty()) {
                EmailRequest managerRequest = new EmailRequest();
                managerRequest.setTemplateId(26L);
                managerRequest.setTo(managerEmailId);
                managerRequest.setReminderType("GOAL_ACCEPTED_BY_EMPLOYEE_TO_MANAGER");
                managerRequest.setUniqueKey(String.format("acceptance_manager_%s_%s_%s_%d",
                        employeeId, quarter, year, System.currentTimeMillis()));

                Map<String, String> variables = new HashMap<>();
                variables.put("managerName", managerName);
                variables.put("employeeName", employeeName);
                variables.put("employeeId", employeeId);
                variables.put("quarter", quarter);
                variables.put("year", year);
                variables.put("financialYear", financialYear);
                variables.put("acceptanceDate", acceptanceDate);
                variables.put("acceptanceTime", acceptanceTime);
                variables.put("dashboardUrl", frontendUrl + managerDashboardPath + "?year=" + year + "&quarter=" + quarter);

                managerRequest.setVariables(variables);
                sendEmailWithRetry(managerRequest, managerEmailId, "acceptance to manager");
                log.info("✅ Acceptance notification sent to manager: {}", managerEmailId);
            }

            String employeeEmail = getEmployeeEmailById(employeeId);
            if (employeeEmail != null && !employeeEmail.isEmpty()) {
                EmailRequest employeeRequest = new EmailRequest();
                employeeRequest.setTemplateId(27L);
                employeeRequest.setTo(employeeEmail);
                employeeRequest.setReminderType("GOAL_ACCEPTED_BY_EMPLOYEE_CONFIRMATION");
                employeeRequest.setUniqueKey(String.format("acceptance_employee_%s_%s_%s_%d",
                        employeeId, quarter, year, System.currentTimeMillis()));

                Map<String, String> variables = new HashMap<>();
                variables.put("employeeName", employeeName);
                variables.put("quarter", quarter);
                variables.put("year", year);
                variables.put("financialYear", financialYear);
                variables.put("acceptanceDate", acceptanceDate);
                variables.put("acceptanceTime", acceptanceTime);

                employeeRequest.setVariables(variables);
                sendEmailWithRetry(employeeRequest, employeeEmail, "acceptance confirmation to employee");
                log.info("✅ Acceptance confirmation sent to employee: {}", employeeEmail);
            }

        } catch (Exception e) {
            log.error("Failed to send acceptance notification: ", e);
        }

        log.info("==================================================");
    }

    // ==================== UNIFIED CYCLE EMAIL METHOD ====================

    @Override
    @Async
    public void sendUnifiedCycleEmail(Long cycleId, String actionType, String customSubject, String customBody, String newExpiryDate) {
        initExecutorService();
        long startTime = System.currentTimeMillis();

        PerformanceCycle cycle = cycleRepository.findById(cycleId)
                .orElseThrow(() -> new RuntimeException("Cycle not found"));

        log.info("========== SENDING UNIFIED CYCLE EMAIL ==========");
        log.info("Action: {}, Cycle ID: {}", actionType, cycleId);

        Long templateId = getTemplateIdByAction(actionType);
        if (templateId == null) {
            throw new RuntimeException("Invalid action type: " + actionType);
        }

        List<Map<String, Object>> employees = fetchEmployeesFromAPI();
        if (employees.isEmpty()) {
            log.warn("No employees found");
            return;
        }

        List<Map<String, Object>> validEmployees = employees.stream()
                .filter(emp -> emp.get("emailId") != null && !((String) emp.get("emailId")).isEmpty())
                .toList();

        List<List<Map<String, Object>>> batches = new ArrayList<>();
        for (int i = 0; i < validEmployees.size(); i += batchSize) {
            batches.add(validEmployees.subList(i, Math.min(i + batchSize, validEmployees.size())));
        }

        AtomicInteger successCount = new AtomicInteger(0);
        List<CompletableFuture<Void>> futures = new ArrayList<>();

        for (int i = 0; i < batches.size(); i++) {
            final int batchIndex = i;
            final List<Map<String, Object>> batch = batches.get(i);

            CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
                try {
                    semaphore.acquire();
                    boolean success = sendBatchUnifiedEmail(batch, cycle, templateId, customSubject, customBody, actionType, newExpiryDate);
                    if (success) successCount.addAndGet(batch.size());
                    if (batchIndex < batches.size() - 1) Thread.sleep(batchDelayMs);
                } catch (Exception e) {
                    log.error("Batch {} failed", batchIndex + 1, e);
                } finally {
                    semaphore.release();
                }
            }, executorService);
            futures.add(future);
        }

        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();

        long totalSeconds = (System.currentTimeMillis() - startTime) / 1000;
        log.info("UNIFIED EMAILS COMPLETED - Action: {}, Success: {}, Time: {} seconds", actionType, successCount.get(), totalSeconds);
    }

    private Long getTemplateIdByAction(String actionType) {
        switch (actionType) {
            case "LAUNCH": return 1L;
            case "CLOSE": return 5L;
            case "EXTEND": return 6L;
            case "REMINDER": return 8L;
            case "REOPEN": return 7L;
            default: return null;
        }
    }

    // ==================== HELPER METHODS ====================

    private String getEmployeeFullName(Map<String, Object> employee) {
        if (employee == null) return "Employee";

        // Check for fullNameAsAadhaar first
        String fullNameAsAadhaar = (String) employee.get("fullNameAsAadhaar");
        if (fullNameAsAadhaar != null && !fullNameAsAadhaar.trim().isEmpty()) {
            return fullNameAsAadhaar.trim();
        }

        // Fallback to firstName, lastName
        String firstName = (String) employee.getOrDefault("firstName", "");
        String lastName = (String) employee.getOrDefault("lastName", "");
        String fullName = (firstName + " " + lastName).trim();
        return fullName.isEmpty() ? "Employee" : fullName;
    }

    private StringBuilder buildGoalsHtml(List<Map<String, Object>> goals) {
        StringBuilder html = new StringBuilder();
        html.append("<table border='1' cellpadding='10' style='border-collapse: collapse; width: 100%;'>");
        html.append("<thead><tr style='background-color: #f3f4f6;'>");
        html.append("<th>#</th><th>Goal/Objective</th><th>Target</th><th>Weightage (%)</th>");
        html.append("<tr></thead><tbody>");

        int index = 1;
        for (Map<String, Object> goal : goals) {
            html.append("<tr>");
            html.append("<td>").append(index++).append("</td>");
            html.append("<td>").append(escapeHtml(String.valueOf(goal.get("title")))).append("</td>");
            html.append("<td>").append(escapeHtml(String.valueOf(goal.get("targetOperator")))).append("</td>");
            html.append("<td style='text-align: center;'>").append(goal.get("weightage")).append("%</td>");
            html.append("</tr>");
        }
        html.append("</tbody></tr>");
        return html;
    }

    private StringBuilder buildSelfReviewGoalsHtml(List<Map<String, Object>> goals) {
        StringBuilder html = new StringBuilder();
        html.append("<table border='1' cellpadding='10' style='border-collapse: collapse; width: 100%;'>");
        html.append("<thead><tr style='background-color: #f3f4f6;'>");
        html.append("<th>#</th><th>Goal/Objective</th><th>Weightage</th><th>Self Assessment</th>");
        html.append("<tr></thead><tbody>");

        int index = 1;
        for (Map<String, Object> goal : goals) {
            html.append("<tr>");
            html.append("<td>").append(index++).append("</td>");
            html.append("<td>").append(escapeHtml(String.valueOf(goal.get("title")))).append("</td>");
            html.append("<td style='text-align: center;'>").append(goal.get("weightage")).append("%</td>");
            html.append("<td style='text-align: center;'>").append(goal.get("selfAssessmentScore")).append("/100</td>");
            html.append("</tr>");
        }
        html.append("</tbody></table>");
        return html;
    }

    private StringBuilder buildManagerReviewGoalsHtml(List<Map<String, Object>> goals) {
        StringBuilder html = new StringBuilder();
        html.append("<table border='1' cellpadding='10' style='border-collapse: collapse; width: 100%;'>");
        html.append("<thead><tr style='background-color: #f3f4f6;'>");
        html.append("<th>#</th><th>Goal/Objective</th><th>Weightage</th><th>Self Score</th><th>Manager Score</th>");
        html.append("<tr></thead><tbody>");

        int index = 1;
        for (Map<String, Object> goal : goals) {
            html.append("<tr>");
            html.append("<td>").append(index++).append("</td>");
            html.append("<td>").append(escapeHtml(String.valueOf(goal.get("title")))).append("</td>");
            html.append("<td style='text-align: center;'>").append(goal.get("weightage")).append("%</td>");
            html.append("<td style='text-align: center;'>").append(goal.get("selfAssessmentScore")).append("/100</td>");
            html.append("<td style='text-align: center;'>").append(goal.get("managerAssessmentScore")).append("/100</td>");
            html.append("</tr>");
        }
        html.append("</tbody></table>");
        return html;
    }

    private boolean sendEmailWithRetry(EmailRequest request, String emailId, String emailType) {
        for (int attempt = 1; attempt <= maxRetryAttempts; attempt++) {
            try {
                emailPreparationService.prepareEmail(request);
                log.info("✅ {} email sent to: {}", emailType, emailId);
                return true;
            } catch (Exception e) {
                log.error("❌ Failed to send {} email to: {} (Attempt {}/{}) - Error: {}", emailType, emailId, attempt, maxRetryAttempts, e.getMessage());
                if (attempt == maxRetryAttempts) return false;
                try { Thread.sleep(1000L * attempt); } catch (InterruptedException ie) { Thread.currentThread().interrupt(); return false; }
            }
        }
        return false;
    }

    private void addDelayForIndividualEmail() {
        try { Thread.sleep(500); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
    }

    private Map<String, Object> fetchEmployeeById(String employeeId) {
        try {
            String url = employeeSearchApi + "/" + employeeId;
            log.info("Fetching employee from API: {}", url);

            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {}
            );

            List<Map<String, Object>> employees = response.getBody();

            if (employees != null && !employees.isEmpty()) {
                Map<String, Object> firstEmployee = employees.get(0);
                Map<String, Object> empResDTO = (Map<String, Object>) firstEmployee.get("empResDTO");

                if (empResDTO != null && empResDTO.get("empCode") != null) {
                    log.info("Successfully fetched employee: {} - {}", empResDTO.get("empCode"), empResDTO.get("emailId"));
                    return empResDTO;
                }
            }

            log.warn("Employee not found with ID: {}", employeeId);
            return null;

        } catch (Exception e) {
            log.error("Failed to fetch employee with ID: {} - Error: {}", employeeId, e.getMessage());
            return null;
        }
    }

    private List<Map<String, Object>> fetchEmployeesFromAPI() {
        try {
            String url = employeeEmailsApi;
            log.info("Fetching employee emails from API: {}", url);

            ResponseEntity<List<String>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<String>>() {}
            );

            List<String> emails = response.getBody();
            List<Map<String, Object>> employees = new ArrayList<>();

            if (emails != null) {
                for (String email : emails) {
                    Map<String, Object> emp = new HashMap<>();
                    emp.put("emailId", email);
                    employees.add(emp);
                }
            }

            log.info("Fetched {} employee emails", employees.size());
            return employees;

        } catch (Exception e) {
            log.error("Failed to fetch employee emails: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    private String escapeHtml(String text) {
        if (text == null) return "";
        return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;").replace("'", "&#39;");
    }

    private boolean sendBatchUnifiedEmail(List<Map<String, Object>> batch, PerformanceCycle cycle, Long templateId,
                                          String customSubject, String customBody, String actionType, String newExpiryDate) {
        try {
            var template = emailTemplateRepository.findById(templateId).orElse(null);
            if (template == null) return false;

            String subject = (customSubject != null && !customSubject.isEmpty()) ? customSubject : template.getSubject();
            String body = (customBody != null && !customBody.isEmpty()) ? customBody : template.getBody();

            List<String> recipients = new ArrayList<>();
            for (Map<String, Object> emp : batch) {
                String emailId = (String) emp.get("emailId");
                if (emailId != null && !emailId.isEmpty()) recipients.add(emailId);
            }

            if (recipients.isEmpty()) return false;

            String processedSubject = processEmailVariables(subject, cycle, actionType, newExpiryDate, null);
            String processedBody = processEmailVariables(body, cycle, actionType, newExpiryDate, null);

            SimpleMailMessage message = new SimpleMailMessage();
            message.setBcc(recipients.toArray(new String[0]));
            message.setSubject(processedSubject);
            message.setText(processedBody);
            message.setFrom("cdladmin@cms.co.in");

            mailSender.send(message);
            log.info("✅ Batch email sent to {} recipients for action: {}", recipients.size(), actionType);
            return true;

        } catch (Exception e) {
            log.error("Failed to send batch email", e);
            return false;
        }
    }

    private String processEmailVariables(String text, PerformanceCycle cycle, String actionType,
                                         String newExpiryDate, String employeeName) {
        if (text == null) return "";
        String result = text;
        result = result.replace("{{employeeName}}", employeeName != null ? employeeName : "Employee");
        result = result.replace("{{quarter}}", cycle.getQuarter() != null ? cycle.getQuarter().toString() : "Annual Review");
        result = result.replace("{{financialYear}}", cycle.getFinancialYear() != null ? cycle.getFinancialYear() : "");
        result = result.replace("{{year}}", cycle.getYear() != null ? cycle.getYear().toString() : "");
        result = result.replace("{{endDate}}", cycle.getEndDate() != null ? cycle.getEndDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) : "");
        result = result.replace("{{deadline}}", cycle.getEndDate() != null ? cycle.getEndDate().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")) : "");
        if (newExpiryDate != null && !newExpiryDate.isEmpty()) {
            result = result.replace("{{newDate}}", newExpiryDate);
            result = result.replace("{{newExpiryDate}}", newExpiryDate);
        }
        result = result.replace("{{actionType}}", actionType);
        return result;
    }

    private String getEmployeeEmailById(String employeeId) {
        try {
            Map<String, Object> employee = fetchEmployeeById(employeeId);
            if (employee != null) {
                return (String) employee.get("emailId");
            }
        } catch (Exception e) {
            log.error("Failed to get employee email", e);
        }
        return null;
    }

    @PreDestroy
    public void cleanup() {
        if (executorService != null && !executorService.isShutdown()) {
            executorService.shutdown();
        }
    }
}