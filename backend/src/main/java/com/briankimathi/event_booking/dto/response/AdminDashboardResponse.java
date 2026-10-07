package com.briankimathi.event_booking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {

    private long totalUsers;
    private long totalCreators;
    private long totalEvents;
    private long pendingApprovalEvents;
    private long totalTicketsSold;
    private BigDecimal totalRevenue;
    private BigDecimal totalPlatformCommission;
}
