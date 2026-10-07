package com.briankimathi.event_booking.domain;

import com.briankimathi.event_booking.domain.enums.EmailNotificationStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "email_notifications", indexes = {
        @Index(name = "idx_email_status", columnList = "status"),
        @Index(name = "idx_email_recipient", columnList = "recipient_email")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@EqualsAndHashCode
public class EmailNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Email(message = "Recipient email should be valid")
    @NotBlank(message = "Recipient email is required")
    @Column(name = "recipient_email", nullable = false, length = 255)
    private String recipientEmail;

    @NotBlank(message = "Subject is required")
    @Column(name = "subject", nullable = false, length = 500)
    private String subject;

    @Column(name = "body", columnDefinition = "TEXT", nullable = false)
    private String body;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private EmailNotificationStatus status = EmailNotificationStatus.PENDING;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}