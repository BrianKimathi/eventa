package com.briankimathi.event_booking.repository;

import com.briankimathi.event_booking.domain.TicketPurchase;
import com.briankimathi.event_booking.domain.enums.PurchaseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketPurchaseRepository extends JpaRepository<TicketPurchase, Long> {
    Optional<TicketPurchase> findByPurchaseCode(String purchaseCode);
    List<TicketPurchase> findByUserId(Long userId);
    List<TicketPurchase> findByEventId(Long eventId);
    List<TicketPurchase> findByUserIdAndStatus(Long userId, PurchaseStatus status);
    List<TicketPurchase> findByEventIdAndStatus(Long eventId, PurchaseStatus status);
}
