package com.briankimathi.event_booking.dto.response;

import com.briankimathi.event_booking.domain.enums.PurchaseStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseResponse {

    private Long id;
    private String purchaseCode;
    private Long eventId;
    private String eventTitle;
    private Long ticketTypeId;
    private String ticketTypeName;
    private Integer quantity;
    private BigDecimal totalAmount;
    private String qrCodeData;
    private PurchaseStatus status;
    private LocalDateTime purchaseDate;
}
