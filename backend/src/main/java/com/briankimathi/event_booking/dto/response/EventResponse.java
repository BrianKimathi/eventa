package com.briankimathi.event_booking.dto.response;

import com.briankimathi.event_booking.domain.enums.EventStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventResponse {

    private Long id;
    private String title;
    private String description;
    private String venue;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String category;
    private EventStatus status;
    private String imageUrl;
    private Integer totalCapacity;
    private Integer availableTickets;
    private Long creatorId;
    private String creatorName;
    private String creatorEmail;
    private List<EventTicketTypeResponse> ticketTypes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EventTicketTypeResponse {
        private Long ticketTypeId;
        private String name;
        private String description;
        private BigDecimal price;
        private Integer availableQuantity;
    }
}
