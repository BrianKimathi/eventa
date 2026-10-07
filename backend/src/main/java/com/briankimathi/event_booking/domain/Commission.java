package com.briankimathi.event_booking.domain;

import com.briankimathi.event_booking.domain.enums.CommissionType;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "commissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@EqualsAndHashCode
public class Commission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false, unique = true)
    private Event event;

    @Enumerated(EnumType.STRING)
    @Column(name = "commission_type", nullable = false, length = 50)
    private CommissionType commissionType;

    @DecimalMin(value = "0.0", message = "Commission rate must be non-negative")
    @Column(name = "commission_rate", precision = 5, scale = 2)
    private BigDecimal commissionRate; // Percentage (e.g., 10.00 = 10%)

    @DecimalMin(value = "0.0", message = "Fixed amount must be non-negative")
    @Column(name = "fixed_amount", precision = 10, scale = 2)
    private BigDecimal fixedAmount;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}