package com.briankimathi.event_booking.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommissionRequest {

    @NotNull(message = "Event ID is required")
    private Long eventId;

    @NotNull(message = "Commission type is required (PERCENTAGE or FIXED)")
    private String commissionType;

    private BigDecimal commissionRate;
    private BigDecimal fixedAmount;
}
