package com.briankimathi.event_booking.service;

import com.briankimathi.event_booking.domain.PaymentTransaction;
import com.briankimathi.event_booking.domain.TicketPurchase;
import com.briankimathi.event_booking.domain.enums.PaymentStatus;
import com.briankimathi.event_booking.repository.PaymentTransactionRepository;
import com.briankimathi.event_booking.repository.TicketPurchaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentTransactionRepository paymentTransactionRepository;
    private final TicketPurchaseRepository ticketPurchaseRepository;

    @Transactional
    public PaymentTransaction processPayment(Long ticketPurchaseId, String paymentMethod) {
        TicketPurchase purchase = ticketPurchaseRepository.findById(ticketPurchaseId)
                .orElseThrow(() -> new IllegalArgumentException("Purchase not found with ID: " + ticketPurchaseId));

        String method = paymentMethod != null ? paymentMethod : "CARD";
        String intentId = method.equalsIgnoreCase("BTC") 
                ? "btc_nowpay_" + UUID.randomUUID().toString().substring(0, 8) 
                : "pi_mock_" + UUID.randomUUID().toString();

        PaymentTransaction transaction = PaymentTransaction.builder()
                .ticketPurchase(purchase)
                .amount(purchase.getTotalAmount())
                .currency("USD")
                .paymentMethod(method)
                .status(PaymentStatus.SUCCESS)
                .stripePaymentIntentId(intentId)
                .transactionDate(LocalDateTime.now())
                .build();

        return paymentTransactionRepository.save(transaction);
    }

    @Transactional
    public PaymentTransaction processRefund(Long ticketPurchaseId) {
        TicketPurchase purchase = ticketPurchaseRepository.findById(ticketPurchaseId)
                .orElseThrow(() -> new IllegalArgumentException("Purchase not found with ID: " + ticketPurchaseId));

        // Update purchase status to CANCELLED
        purchase.setStatus(com.briankimathi.event_booking.domain.enums.PurchaseStatus.CANCELLED);

        // Restore event capacity
        if (purchase.getEvent() != null && purchase.getQuantity() != null) {
            purchase.getEvent().setAvailableTickets(purchase.getEvent().getAvailableTickets() + purchase.getQuantity());
        }

        ticketPurchaseRepository.save(purchase);

        // Update or create payment transaction record with REFUNDED
        PaymentTransaction transaction = paymentTransactionRepository.findByTicketPurchaseId(ticketPurchaseId)
                .orElseGet(() -> PaymentTransaction.builder()
                        .ticketPurchase(purchase)
                        .amount(purchase.getTotalAmount())
                        .currency("USD")
                        .paymentMethod("REFUND")
                        .transactionDate(LocalDateTime.now())
                        .build());

        transaction.setStatus(PaymentStatus.REFUNDED);
        return paymentTransactionRepository.save(transaction);
    }
}
