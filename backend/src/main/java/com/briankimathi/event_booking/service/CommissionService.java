package com.briankimathi.event_booking.service;

import com.briankimathi.event_booking.domain.Commission;
import com.briankimathi.event_booking.domain.Event;
import com.briankimathi.event_booking.domain.enums.CommissionType;
import com.briankimathi.event_booking.dto.request.CommissionRequest;
import com.briankimathi.event_booking.repository.CommissionRepository;
import com.briankimathi.event_booking.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class CommissionService {

    private final CommissionRepository commissionRepository;
    private final EventRepository eventRepository;

    @Transactional
    public Commission configureCommission(CommissionRequest request) {
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new IllegalArgumentException("Event not found with ID: " + request.getEventId()));

        Commission commission = commissionRepository.findByEventId(request.getEventId())
                .orElse(Commission.builder().event(event).build());

        CommissionType type = CommissionType.valueOf(request.getCommissionType().toUpperCase());
        commission.setCommissionType(type);

        if (type == CommissionType.PERCENTAGE) {
            commission.setCommissionRate(request.getCommissionRate());
            commission.setFixedAmount(null);
        } else {
            commission.setFixedAmount(request.getFixedAmount());
            commission.setCommissionRate(null);
        }

        return commissionRepository.save(commission);
    }

    public BigDecimal calculateCommission(Event event, BigDecimal totalAmount) {
        Commission commission = commissionRepository.findByEventId(event.getId()).orElse(null);
        if (commission == null) {
            // Default 10% platform commission if not specified
            return totalAmount.multiply(new BigDecimal("0.10"));
        }

        if (commission.getCommissionType() == CommissionType.PERCENTAGE) {
            return totalAmount.multiply(commission.getCommissionRate().divide(new BigDecimal("100")));
        } else {
            return commission.getFixedAmount();
        }
    }
}
