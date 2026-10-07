package com.briankimathi.event_booking.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class CreateEventRequest {

    @NotBlank(message = "Event title is required")
    private String title;

    private String description;
    private String venue;

    @NotNull(message = "Start date is required")
    @Future(message = "Start date must be in the future")
    private LocalDateTime startDate;

    @NotNull(message = "End date is required")
    @Future(message = "End date must be in the future")
    private LocalDateTime endDate;

    private String category;
    private String imageUrl;

    @NotNull(message = "Total capacity is required")
    @Min(value = 1, message = "Total capacity must be at least 1")
    private Integer totalCapacity;

    private List<TicketTypeConfig> ticketTypes;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TicketTypeConfig {
        @NotBlank(message = "Ticket type name is required")
        private String name;

        private String description;

        @NotNull(message = "Price is required")
        @Min(value = 0, message = "Price cannot be negative")
        private BigDecimal price;

        @NotNull(message = "Available quantity is required")
        @Min(value = 1, message = "Available quantity must be at least 1")
        private Integer availableQuantity;
    }
}
