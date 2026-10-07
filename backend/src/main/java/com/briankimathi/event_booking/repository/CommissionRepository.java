package com.briankimathi.event_booking.repository;

import com.briankimathi.event_booking.domain.Commission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CommissionRepository extends JpaRepository<Commission, Long> {
    Optional<Commission> findByEventId(Long eventId);
}
