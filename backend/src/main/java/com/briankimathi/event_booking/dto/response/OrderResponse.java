package com.briankimathi.event_booking.dto.response;

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
public class OrderResponse {

    private Long purchaseId;
    private String purchaseCode;
    private LocalDateTime purchaseDate;
    private String customerName;
    private String customerEmail;
    private Long eventId;
    private String eventTitle;
    private String category;
    private String ticketTypeName;
    private Integer quantity;
    private BigDecimal totalAmount;
    private String purchaseStatus;
    private String paymentMethod;
    private String paymentStatus;
    private String qrCodeData;
}
