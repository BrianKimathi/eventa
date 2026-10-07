package com.briankimathi.event_booking.dto.request;

import com.briankimathi.event_booking.domain.enums.EventStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventApprovalRequest {

    @NotNull(message = "Target status is required")
    private EventStatus status; // Expected PUBLISHED or CANCELLED/REJECTED

    private String comment;
}
