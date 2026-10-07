package com.briankimathi.event_booking.domain;

import com.briankimathi.event_booking.domain.enums.PurchaseStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ticket_purchases", indexes = {
        @Index(name = "idx_purchase_code", columnList = "purchase_code"),
        @Index(name = "idx_purchase_user", columnList = "user_id"),
        @Index(name = "idx_purchase_event", columnList = "event_id"),
        @Index(name = "idx_purchase_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "qrCodeData")
@EqualsAndHashCode
public class TicketPurchase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user; // Nullable for guest purchases

    @NotNull(message = "Event is required")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ticket_type_id", nullable = false)
    private TicketType ticketType;

    @Min(value = 1, message = "Quantity must be at least 1")
    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @DecimalMin(value = "0.0", inclusive = false, message = "Total amount must be greater than 0")
    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "purchase_code", nullable = false, unique = true, length = 50)
    private String purchaseCode;

    @Column(name = "qr_code_data", columnDefinition = "TEXT")
    private String qrCodeData;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private PurchaseStatus status = PurchaseStatus.PENDING;

    @Column(name = "purchase_date", nullable = false)
    private LocalDateTime purchaseDate;

    @OneToOne(mappedBy = "ticketPurchase", cascade = CascadeType.ALL, orphanRemoval = true)
    private PaymentTransaction paymentTransaction;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}