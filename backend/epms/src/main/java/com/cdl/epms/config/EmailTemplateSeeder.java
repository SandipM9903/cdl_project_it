package com.cdl.epms.config;

import com.cdl.epms.model.EmailTemplate;
import com.cdl.epms.repository.EmailTemplateRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@RequiredArgsConstructor
public class EmailTemplateSeeder implements CommandLineRunner {

    private final EmailTemplateRepository templateRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("========== RUNNING EMAIL TEMPLATE SEEDER ==========");
        updateTemplate(18L, "GOAL_SUBMISSION_TO_MANAGER", "Goal Setting Submitted for Review - {{employeeName}} - {{quarter}}",
                wrapEmail("EPMS - Goal Setting Submitted", "Dear {{managerName}},",
                        "<p>This is to inform you that your team member, <strong>{{employeeName}}</strong> (Employee Code: {{employeeId}}), has submitted their Goal Setting for <strong>{{quarter}}</strong> (FY {{financialYear}}).</p>" +
                        "<div style=\"background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; margin: 20px 0;\">" +
                        "    <h3 style=\"margin-top: 0; margin-bottom: 10px; color: #334155; font-size: 16px; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px;\">Submission Details</h3>" +
                        "    <table style=\"width: 100%; border-collapse: collapse; font-size: 14px;\">" +
                        "        <tr>" +
                        "            <td style=\"padding: 4px 0; color: #64748b; width: 120px;\">Date:</td>" +
                        "            <td style=\"padding: 4px 0; color: #0f172a; font-weight: 500;\">{{submissionDate}}</td>" +
                        "        </tr>" +
                        "        <tr>" +
                        "            <td style=\"padding: 4px 0; color: #64748b;\">Time:</td>" +
                        "            <td style=\"padding: 4px 0; color: #0f172a; font-weight: 500;\">{{submissionTime}}</td>" +
                        "        </tr>" +
                        "    </table>" +
                        "</div>" +
                        "<p><strong>Submitted Goals:</strong></p>" +
                        "<div style=\"margin: 15px 0; font-size: 14px;\">" +
                        "    {{goalsTable}}" +
                        "</div>" +
                        "<p style=\"margin-top: 25px;\">Please click the button below to review and provide your feedback/approval:</p>" +
                        "<div style=\"text-align: center; margin: 25px 0;\">" +
                        "    <a href=\"{{reviewUrl}}\" style=\"background-color: #2563eb; color: #ffffff; padding: 10px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 15px; display: inline-block;\">Review Goal Setting</a>" +
                        "</div>" +
                        "<p style=\"font-size: 13px; color: #6b7280; word-break: break-all;\">If the button doesn't work, copy and paste this URL into your browser:<br><a href=\"{{reviewUrl}}\" style=\"color: #2563eb;\">{{reviewUrl}}</a></p>"));

        updateTemplate(19L, "GOAL_SUBMISSION_TO_EMPLOYEE", "Goal Setting Submitted Successfully - {{quarter}}",
                wrapEmail("EPMS - Goal Setting Submitted Successfully", "Dear {{employeeName}},",
                        "<p>Your Goal Setting for <strong>{{quarter}}</strong> (FY {{financialYear}}) has been successfully submitted to your manager, <strong>{{managerName}}</strong>, for review.</p>" +
                        "<div style=\"background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; margin: 20px 0;\">" +
                        "    <h3 style=\"margin-top: 0; margin-bottom: 10px; color: #334155; font-size: 16px; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px;\">Submission Details</h3>" +
                        "    <table style=\"width: 100%; border-collapse: collapse; font-size: 14px;\">" +
                        "        <tr>" +
                        "            <td style=\"padding: 4px 0; color: #64748b; width: 120px;\">Date:</td>" +
                        "            <td style=\"padding: 4px 0; color: #0f172a; font-weight: 500;\">{{submissionDate}}</td>" +
                        "        </tr>" +
                        "        <tr>" +
                        "            <td style=\"padding: 4px 0; color: #64748b;\">Time:</td>" +
                        "            <td style=\"padding: 4px 0; color: #0f172a; font-weight: 500;\">{{submissionTime}}</td>" +
                        "        </tr>" +
                        "    </table>" +
                        "</div>" +
                        "<p><strong>Your Submitted Goals:</strong></p>" +
                        "<div style=\"margin: 15px 0; font-size: 14px;\">" +
                        "    {{goalsTable}}" +
                        "</div>" +
                        "<p>You will be notified once your manager reviews and takes action.</p>" +
                        "<div style=\"text-align: center; margin: 25px 0;\">" +
                        "    <a href=\"{{previewUrl}}\" style=\"background-color: #2563eb; color: #ffffff; padding: 10px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 15px; display: inline-block;\">View Goals</a>" +
                        "</div>"));

        updateTemplate(20L, "GOAL_APPROVAL_TO_EMPLOYEE", "Goal Setting Approved - {{quarter}}",
                wrapEmail("EPMS - Goal Setting Approved", "Dear {{employeeName}},",
                        "<p>We are pleased to inform you that your Goal Setting for <strong>{{quarter}}</strong> (FY {{financialYear}}) has been <strong>approved</strong> by your manager, <strong>{{managerName}}</strong>.</p>" +
                        "<div style=\"background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 15px; margin: 20px 0; color: #166534;\">" +
                        "    <h3 style=\"margin-top: 0; margin-bottom: 10px; color: #166534; font-size: 16px; border-bottom: 1px solid #bbf7d0; padding-bottom: 6px;\">Approval Details</h3>" +
                        "    <table style=\"width: 100%; border-collapse: collapse; font-size: 14px;\">" +
                        "        <tr>" +
                        "            <td style=\"padding: 4px 0; color: #166534; width: 120px;\">Date:</td>" +
                        "            <td style=\"padding: 4px 0; color: #14532d; font-weight: 600;\">{{approvalDate}}</td>" +
                        "        </tr>" +
                        "        <tr>" +
                        "            <td style=\"padding: 4px 0; color: #166534;\">Time:</td>" +
                        "            <td style=\"padding: 4px 0; color: #14532d; font-weight: 600;\">{{approvalTime}}</td>" +
                        "        </tr>" +
                        "    </table>" +
                        "</div>" +
                        "<p><strong>Approved Goals:</strong></p>" +
                        "<div style=\"margin: 15px 0; font-size: 14px;\">" +
                        "    {{goalsTable}}" +
                        "</div>" +
                        "<div style=\"text-align: center; margin: 25px 0;\">" +
                        "    <a href=\"{{previewUrl}}\" style=\"background-color: #16a34a; color: #ffffff; padding: 10px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 15px; display: inline-block;\">View Approved Goals</a>" +
                        "</div>"));

        updateTemplate(21L, "GOAL_REJECTION_TO_EMPLOYEE", "Goal Setting Sent Back - {{quarter}}",
                wrapEmail("EPMS - Goal Setting Sent Back", "Dear {{employeeName}},",
                        "<p>Please note that your Goal Setting for <strong>{{quarter}}</strong> (FY {{financialYear}}) has been <strong>sent back for revision</strong> by your manager, <strong>{{managerName}}</strong>.</p>" +
                        "<div style=\"background-color: #fef2f2; border: 1px solid #fee2e2; border-radius: 6px; padding: 15px; margin: 20px 0; color: #991b1b;\">" +
                        "    <h3 style=\"margin-top: 0; margin-bottom: 10px; color: #991b1b; font-size: 16px; border-bottom: 1px solid #fecaca; padding-bottom: 6px;\">Revision Details</h3>" +
                        "    <table style=\"width: 100%; border-collapse: collapse; font-size: 14px;\">" +
                        "        <tr>" +
                        "            <td style=\"padding: 4px 0; color: #b91c1c; width: 120px;\">Date:</td>" +
                        "            <td style=\"padding: 4px 0; color: #7f1d1d; font-weight: 600;\">{{rejectionDate}}</td>" +
                        "        </tr>" +
                        "        <tr>" +
                        "            <td style=\"padding: 4px 0; color: #b91c1c;\">Time:</td>" +
                        "            <td style=\"padding: 4px 0; color: #7f1d1d; font-weight: 600;\">{{rejectionTime}}</td>" +
                        "        </tr>" +
                        "        <tr>" +
                        "            <td style=\"padding: 4px 0; color: #b91c1c; vertical-align: top;\">Remarks/Reason:</td>" +
                        "            <td style=\"padding: 4px 0; color: #7f1d1d; font-weight: 600; vertical-align: top;\">{{rejectionReason}}</td>" +
                        "        </tr>" +
                        "    </table>" +
                        "</div>" +
                        "<p><strong>Your Submitted Goals:</strong></p>" +
                        "<div style=\"margin: 15px 0; font-size: 14px;\">" +
                        "    {{goalsTable}}" +
                        "</div>" +
                        "<p style=\"margin-top: 25px;\">Please click the button below to update and resubmit your goals:</p>" +
                        "<div style=\"text-align: center; margin: 25px 0;\">" +
                        "    <a href=\"{{editUrl}}\" style=\"background-color: #dc2626; color: #ffffff; padding: 10px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 15px; display: inline-block;\">Edit & Resubmit Goals</a>" +
                        "</div>" +
                        "<p style=\"font-size: 13px; color: #6b7280; word-break: break-all;\">If the button doesn't work, copy and paste this URL into your browser:<br><a href=\"{{editUrl}}\" style=\"color: #dc2626;\">{{editUrl}}</a></p>"));

        updateTemplate(22L, "SELF_REVIEW_SUBMITTED_TO_MANAGER", "Quarterly Self-Review Submitted - {{employeeName}} - {{quarter}}",
                wrapEmail("EPMS - Quarterly Self-Review Submitted", "Dear {{managerName}},",
                        "<p>This is to inform you that your team member, <strong>{{employeeName}}</strong> (Employee Code: {{employeeId}}), has submitted their Self-Review for <strong>{{quarter}}</strong> (FY {{financialYear}}).</p>" +
                        "<div style=\"background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; margin: 20px 0;\">" +
                        "    <h3 style=\"margin-top: 0; margin-bottom: 10px; color: #334155; font-size: 16px; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px;\">Evaluation Summary</h3>" +
                        "    <table style=\"width: 100%; border-collapse: collapse; font-size: 14px;\">" +
                        "        <tr>" +
                        "            <td style=\"padding: 4px 0; color: #64748b; width: 180px;\">Date & Time:</td>" +
                        "            <td style=\"padding: 4px 0; color: #0f172a; font-weight: 500;\">{{submissionDate}} at {{submissionTime}}</td>" +
                        "        </tr>" +
                        "        <tr>" +
                        "            <td style=\"padding: 4px 0; color: #64748b;\">Overall Self-Assessed Rating:</td>" +
                        "            <td style=\"padding: 4px 0; color: #0f172a; font-weight: 600; font-size: 15px;\">{{overallRating}} / 100</td>" +
                        "        </tr>" +
                        "    </table>" +
                        "</div>" +
                        "<p><strong>Self-Assessment Details:</strong></p>" +
                        "<div style=\"margin: 15px 0; font-size: 14px;\">" +
                        "    {{goalsTable}}" +
                        "</div>" +
                        "<p style=\"margin-top: 25px;\">Please click the button below to complete the manager review and score your team member:</p>" +
                        "<div style=\"text-align: center; margin: 25px 0;\">" +
                        "    <a href=\"{{reviewUrl}}\" style=\"background-color: #2563eb; color: #ffffff; padding: 10px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 15px; display: inline-block;\">Perform Manager Review</a>" +
                        "</div>" +
                        "<p style=\"font-size: 13px; color: #6b7280; word-break: break-all;\">If the button doesn't work, copy and paste this URL into your browser:<br><a href=\"{{reviewUrl}}\" style=\"color: #2563eb;\">{{reviewUrl}}</a></p>"));

        updateTemplate(23L, "SELF_REVIEW_SUBMITTED_TO_EMPLOYEE", "Quarterly Self-Review Submitted Successfully - {{quarter}}",
                wrapEmail("EPMS - Quarterly Self-Review Submitted Successfully", "Dear {{employeeName}},",
                        "<p>Your Self-Review for <strong>{{quarter}}</strong> (FY {{financialYear}}) has been successfully submitted and forwarded to your manager, <strong>{{managerName}}</strong>, for evaluation.</p>" +
                        "<div style=\"background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; margin: 20px 0;\">" +
                        "    <h3 style=\"margin-top: 0; margin-bottom: 10px; color: #334155; font-size: 16px; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px;\">Submission Summary</h3>" +
                        "    <table style=\"width: 100%; border-collapse: collapse; font-size: 14px;\">" +
                        "        <tr>" +
                        "            <td style=\"padding: 4px 0; color: #64748b; width: 180px;\">Date & Time:</td>" +
                        "            <td style=\"padding: 4px 0; color: #0f172a; font-weight: 500;\">{{submissionDate}} at {{submissionTime}}</td>" +
                        "        </tr>" +
                        "        <tr>" +
                        "            <td style=\"padding: 4px 0; color: #64748b;\">Overall Self-Assessed Rating:</td>" +
                        "            <td style=\"padding: 4px 0; color: #0f172a; font-weight: 600;\">{{overallRating}} / 100</td>" +
                        "        </tr>" +
                        "    </table>" +
                        "</div>" +
                        "<p><strong>Your Submissions:</strong></p>" +
                        "<div style=\"margin: 15px 0; font-size: 14px;\">" +
                        "    {{goalsTable}}" +
                        "</div>" +
                        "<div style=\"text-align: center; margin: 25px 0;\">" +
                        "    <a href=\"{{previewUrl}}\" style=\"background-color: #2563eb; color: #ffffff; padding: 10px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 15px; display: inline-block;\">View Self-Review Details</a>" +
                        "</div>"));

        updateTemplate(24L, "MANAGER_REVIEW_SUBMITTED_TO_EMPLOYEE", "Quarterly Performance Review Completed by Manager - {{quarter}}",
                wrapEmail("EPMS - Quarterly Performance Review Completed", "Dear {{employeeName}},",
                        "<p>Your manager, <strong>{{managerName}}</strong>, has completed your performance evaluation for <strong>{{quarter}}</strong> (FY {{financialYear}}).</p>" +
                        "<div style=\"background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; margin: 20px 0;\">" +
                        "    <h3 style=\"margin-top: 0; margin-bottom: 10px; color: #334155; font-size: 16px; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px;\">Review Summary</h3>" +
                        "    <table style=\"width: 100%; border-collapse: collapse; font-size: 14px;\">" +
                        "        <tr>" +
                        "            <td style=\"padding: 4px 0; color: #64748b; width: 180px;\">Review Date:</td>" +
                        "            <td style=\"padding: 4px 0; color: #0f172a; font-weight: 500;\">{{submissionDate}}</td>" +
                        "        </tr>" +
                        "        <tr>" +
                        "            <td style=\"padding: 4px 0; color: #64748b;\">Self-Assessed Score:</td>" +
                        "            <td style=\"padding: 4px 0; color: #0f172a; font-weight: 500;\">{{overallRating}} / 100</td>" +
                        "        </tr>" +
                        "        <tr>" +
                        "            <td style=\"padding: 4px 0; color: #64748b;\">Manager Assessment Score:</td>" +
                        "            <td style=\"padding: 4px 0; color: #0f172a; font-weight: 600; font-size: 15px; color: #1e3a8a;\">{{managerRating}} / 100</td>" +
                        "        </tr>" +
                        "    </table>" +
                        "</div>" +
                        "<p><strong>Goal Assessment Table:</strong></p>" +
                        "<div style=\"margin: 15px 0; font-size: 14px;\">" +
                        "    {{goalsTable}}" +
                        "</div>" +
                        "<p style=\"margin-top: 25px;\">Please log in to the EPMS portal to review the detailed feedback and complete your acceptance:</p>" +
                        "<div style=\"text-align: center; margin: 25px 0;\">" +
                        "    <a href=\"{{previewUrl}}\" style=\"background-color: #2563eb; color: #ffffff; padding: 10px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 15px; display: inline-block;\">Review Feedback & Accept</a>" +
                        "</div>" +
                        "<p style=\"font-size: 13px; color: #6b7280; word-break: break-all;\">If the button doesn't work, copy and paste this URL into your browser:<br><a href=\"{{previewUrl}}\" style=\"color: #2563eb;\">{{previewUrl}}</a></p>"));

        updateTemplate(25L, "MANAGER_REVIEW_SUBMITTED_TO_HR", "Quarterly Performance Review Submitted to HR - {{employeeName}}",
                wrapEmail("EPMS - Quarterly Performance Review Submitted to HR", "Dear {{hrName}},",
                        "<p>The performance review for <strong>{{employeeName}}</strong> (Employee Code: {{employeeId}}) for <strong>{{quarter}}</strong> (FY {{financialYear}}) has been completed by Manager <strong>{{managerName}}</strong> and submitted to HR.</p>" +
                        "<div style=\"background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; margin: 20px 0;\">" +
                        "    <table style=\"width: 100%; border-collapse: collapse; font-size: 14px;\">" +
                        "        <tr>" +
                        "            <td style=\"padding: 4px 0; color: #64748b; width: 120px;\">Submitted On:</td>" +
                        "            <td style=\"padding: 4px 0; color: #0f172a; font-weight: 500;\">{{submissionDate}} at {{submissionTime}}</td>" +
                        "        </tr>" +
                        "        <tr>" +
                        "            <td style=\"padding: 4px 0; color: #64748b;\">Overall Score:</td>" +
                        "            <td style=\"padding: 4px 0; color: #0f172a; font-weight: 600;\">{{overallRating}} / 100</td>" +
                        "        </tr>" +
                        "    </table>" +
                        "</div>" +
                        "<p><strong>Goal Assessment Details:</strong></p>" +
                        "<div style=\"margin: 15px 0; font-size: 14px;\">" +
                        "    {{goalsTable}}" +
                        "</div>" +
                        "<p>The review is now available for HR processing.</p>"));

        updateTemplate(26L, "GOAL_ACCEPTED_BY_EMPLOYEE_TO_MANAGER", "Performance Review Accepted by Employee - {{employeeName}} - {{quarter}}",
                wrapEmail("EPMS - Review Accepted by Employee", "Dear {{managerName}},",
                        "<p>This is to inform you that your team member, <strong>{{employeeName}}</strong> (Employee Code: {{employeeId}}), has <strong>accepted</strong> your quarterly review ratings/feedback for <strong>{{quarter}}</strong> (FY {{financialYear}}).</p>" +
                        "<div style=\"background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 15px; margin: 20px 0; color: #166534;\">" +
                        "    <h3 style=\"margin-top: 0; margin-bottom: 10px; color: #166534; font-size: 16px; border-bottom: 1px solid #bbf7d0; padding-bottom: 6px;\">Acceptance Summary</h3>" +
                        "    <table style=\"width: 100%; border-collapse: collapse; font-size: 14px;\">" +
                        "        <tr>" +
                        "            <td style=\"padding: 4px 0; color: #166534; width: 120px;\">Date:</td>" +
                        "            <td style=\"padding: 4px 0; color: #14532d; font-weight: 600;\">{{acceptanceDate}}</td>" +
                        "        </tr>" +
                        "        <tr>" +
                        "            <td style=\"padding: 4px 0; color: #166534;\">Time:</td>" +
                        "            <td style=\"padding: 4px 0; color: #14532d; font-weight: 600;\">{{acceptanceTime}}</td>" +
                        "        </tr>" +
                        "    </table>" +
                        "</div>" +
                        "<p>Please click the button below to view the manager dashboard:</p>" +
                        "<div style=\"text-align: center; margin: 25px 0;\">" +
                        "    <a href=\"{{dashboardUrl}}\" style=\"background-color: #2563eb; color: #ffffff; padding: 10px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 15px; display: inline-block;\">View Dashboard</a>" +
                        "</div>" +
                        "<p style=\"font-size: 13px; color: #6b7280; word-break: break-all;\">If the button doesn't work, copy and paste this URL into your browser:<br><a href=\"{{dashboardUrl}}\" style=\"color: #2563eb;\">{{dashboardUrl}}</a></p>"));

        updateTemplate(27L, "GOAL_ACCEPTED_BY_EMPLOYEE_CONFIRMATION", "Quarterly Review Accepted Successfully - {{quarter}}",
                wrapEmail("EPMS - Review Accepted Successfully", "Dear {{employeeName}},",
                        "<p>You have successfully accepted the performance review ratings and feedback for <strong>{{quarter}}</strong> (FY {{financialYear}}).</p>" +
                        "<div style=\"background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 15px; margin: 20px 0; color: #166534;\">" +
                        "    <h3 style=\"margin-top: 0; margin-bottom: 10px; color: #166534; font-size: 16px; border-bottom: 1px solid #bbf7d0; padding-bottom: 6px;\">Confirmation Summary</h3>" +
                        "    <table style=\"width: 100%; border-collapse: collapse; font-size: 14px;\">" +
                        "        <tr>" +
                        "            <td style=\"padding: 4px 0; color: #166534; width: 120px;\">Date:</td>" +
                        "            <td style=\"padding: 4px 0; color: #14532d; font-weight: 600;\">{{acceptanceDate}}</td>" +
                        "        </tr>" +
                        "        <tr>" +
                        "            <td style=\"padding: 4px 0; color: #166534;\">Time:</td>" +
                        "            <td style=\"padding: 4px 0; color: #14532d; font-weight: 600;\">{{acceptanceTime}}</td>" +
                        "        </tr>" +
                        "    </table>" +
                        "</div>" +
                        "<p>The review process is now successfully finalized for this quarter. Thank you for your active participation.</p>"));

        log.info("========== EMAIL TEMPLATE SEEDER COMPLETED SUCCESSFULLY ==========");
    }

    private void updateTemplate(Long id, String name, String subject, String body) {
        EmailTemplate template = templateRepository.findById(id).orElse(new EmailTemplate());
        template.setId(id);
        template.setName(name);
        template.setSubject(subject);
        template.setBody(body);
        templateRepository.save(template);
        log.info("Seeded template ID: {} - {}", id, name);
    }

    private String wrapEmail(String title, String salutation, String bodyContent) {
        return "<div style=\"font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; color: #1e293b; line-height: 1.6;\">" +
               "  <div style=\"border-bottom: 2px solid #3b82f6; padding-bottom: 12px; margin-bottom: 20px;\">" +
               "    <h2 style=\"margin: 0; color: #1e3a8a; font-size: 18px; font-weight: 600;\">" + title + "</h2>" +
               "  </div>" +
               "  <div style=\"font-size: 15px; color: #334155;\">" +
               "    <p style=\"margin-top: 0; margin-bottom: 16px;\">" + salutation + "</p>" +
               "    " + bodyContent +
               "  </div>" +
               "  <div style=\"margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 14px; color: #64748b;\">" +
               "    <p style=\"margin: 0;\">Regards,<br><strong style=\"color: #475569;\">Team HR</strong></p>" +
               "    <p style=\"margin-top: 12px; font-size: 11px; color: #94a3b8;\">This is an automated system-generated email. Please do not reply to this address.</p>" +
               "  </div>" +
               "</div>";
    }
}
