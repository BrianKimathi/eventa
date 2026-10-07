package com.briankimathi.event_booking.repository;


import com.briankimathi.event_booking.domain.Event;
import com.briankimathi.event_booking.domain.enums.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByCreatorId(Long creatorId);
    List<Event> findByStatus(EventStatus status);
    List<Event> findByStatusAndStartDateAfter(EventStatus status, LocalDateTime date);

    @Query("SELECT e FROM Event e WHERE e.status = :status AND e.startDate >= :startDate ORDER BY e.startDate ASC")
    List<Event> findPublishedUpcomingEvents(@Param("status") EventStatus status, @Param("startDate") LocalDateTime startDate);
}
