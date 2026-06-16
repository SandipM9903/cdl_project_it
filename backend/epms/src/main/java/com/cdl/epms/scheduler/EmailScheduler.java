//package com.cdl.epms.scheduler;
//
//import com.cdl.epms.common.enums.EmailerStatus;
//import com.cdl.epms.model.EmailJob;
//import com.cdl.epms.repository.EmailJobRepository;
//import com.cdl.epms.service.services.EmailService;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.scheduling.annotation.Scheduled;
//import org.springframework.stereotype.Component;
//
//import java.time.LocalDateTime;
//import java.util.List;
//
//@Slf4j
//@Component
//@RequiredArgsConstructor
//public class EmailScheduler {
//
//    private final EmailJobRepository repository;
//    private final EmailService emailService;
//
//    @Scheduled(fixedRate = 60000)
//    public void processEmails() {
//        List<EmailJob> jobs = repository.findByStatusAndScheduledTimeBefore(
//                EmailerStatus.NOT_STARTED,
//                LocalDateTime.now()
//        );
//
//        log.info("Found {} pending emails to process", jobs.size());
//
//        for (EmailJob job : jobs) {
//            // Try to lock the job
//            int updated = repository.updateStatusAtomically(
//                    job.getId(),
//                    EmailerStatus.ACTIVE,
//                    EmailerStatus.NOT_STARTED
//            );
//
//            if (updated == 1) {
//                try {
//                    log.info("Sending email to: {}", job.getToEmail());
//
//                    emailService.sendEmail(
//                            job.getToEmail(),
//                            job.getSubject(),
//                            job.getBody()
//                    );
//
//                    job.setSent(true);
//                    repository.save(job);
//
//                    log.info("Successfully sent email to: {}", job.getToEmail());
//
//                } catch (Exception e) {
//                    log.error("Failed to send email to: {}", job.getToEmail(), e);
//                    // Reset status for retry
//                    repository.updateStatusAtomically(
//                            job.getId(),
//                            EmailerStatus.NOT_STARTED,
//                            EmailerStatus.ACTIVE
//                    );
//                }
//            }
//        }
//    }
//}