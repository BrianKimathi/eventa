package com.briankimathi.event_booking.repository;

import com.briankimathi.event_booking.domain.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {
    Optional<PaymentTransaction> findByTicketPurchaseId(Long ticketPurchaseId);
    Optional<PaymentTransaction> findByStripePaymentIntentId(String stripePaymentIntentId);
}
