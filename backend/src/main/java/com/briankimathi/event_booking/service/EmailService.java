package com.briankimathi.event_booking.service;

import com.briankimathi.event_booking.domain.EmailNotification;
import com.briankimathi.event_booking.domain.enums.EmailNotificationStatus;
import com.briankimathi.event_booking.repository.EmailNotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final EmailNotificationRepository emailNotificationRepository;

    public void sendEmail(String to, String subject, String body) {
        EmailNotification notification = EmailNotification.builder()
                .recipientEmail(to)
                .subject(subject)
                .body(body)
                .status(EmailNotificationStatus.PENDING)
                .build();

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);

            notification.setStatus(EmailNotificationStatus.SENT);
            notification.setSentAt(LocalDateTime.now());
            log.info("Email sent successfully to {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to {}", to, e);
            notification.setStatus(EmailNotificationStatus.FAILED);
        }

        emailNotificationRepository.save(notification);
    }

    public void sendHtmlEmail(String to, String subject, String htmlBody) {
        EmailNotification notification = EmailNotification.builder()
                .recipientEmail(to)
                .subject(subject)
                .body(htmlBody)
                .status(EmailNotificationStatus.PENDING)
                .build();

        try {
            jakarta.mail.internet.MimeMessage message = mailSender.createMimeMessage();
            org.springframework.mail.javamail.MimeMessageHelper helper = 
                    new org.springframework.mail.javamail.MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);

            mailSender.send(message);

            notification.setStatus(EmailNotificationStatus.SENT);
            notification.setSentAt(LocalDateTime.now());
            log.info("HTML Email receipt sent successfully to {}", to);
        } catch (Exception e) {
            log.error("Failed to send HTML email to {}", to, e);
            notification.setStatus(EmailNotificationStatus.FAILED);
        }

        emailNotificationRepository.save(notification);
    }
}
