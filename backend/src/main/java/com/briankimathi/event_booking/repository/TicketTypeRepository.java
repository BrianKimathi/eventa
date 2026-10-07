package com.briankimathi.event_booking.repository;

import com.briankimathi.event_booking.domain.TicketType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TicketTypeRepository extends JpaRepository<TicketType, Long> {
    Optional<TicketType> findByName(String name);
}
