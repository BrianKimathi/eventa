package com.briankimathi.event_booking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventSalesSummaryResponse {
    private Long eventId;
    private String eventTitle;
    private Integer totalCapacity;
    private Integer availableTickets;
    private Integer ticketsSold;
    private BigDecimal totalRevenue;
    private List<TicketTypeSales> ticketTypeSales;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TicketTypeSales {
        private Long ticketTypeId;
        private String ticketTypeName;
        private Integer quantitySold;
        private BigDecimal revenue;
    }
}
