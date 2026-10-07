package com.briankimathi.event_booking.repository;

import com.briankimathi.event_booking.domain.EmailNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailNotificationRepository extends JpaRepository<EmailNotification, Long> {
}
