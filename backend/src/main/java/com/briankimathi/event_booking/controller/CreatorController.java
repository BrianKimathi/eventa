package com.briankimathi.event_booking.controller;

import com.briankimathi.event_booking.dto.request.CreateEventRequest;
import com.briankimathi.event_booking.dto.request.TicketValidationRequest;
import com.briankimathi.event_booking.dto.response.EventResponse;
import com.briankimathi.event_booking.dto.response.EventSalesSummaryResponse;
import com.briankimathi.event_booking.dto.response.PurchaseResponse;
import com.briankimathi.event_booking.service.EventService;
import com.briankimathi.event_booking.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/creator")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('CREATOR', 'ADMIN')")
public class CreatorController {

    private final EventService eventService;
    private final TicketService ticketService;

    @PostMapping("/events")
    public ResponseEntity<EventResponse> createEvent(@AuthenticationPrincipal UserDetails userDetails,
                                                    @Valid @RequestBody CreateEventRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(eventService.createEvent(request, userDetails.getUsername()));
    }

    @PutMapping("/events/{id}")
    public ResponseEntity<EventResponse> updateEvent(@AuthenticationPrincipal UserDetails userDetails,
                                                    @PathVariable Long id,
                                                    @Valid @RequestBody CreateEventRequest request) {
        return ResponseEntity.ok(eventService.updateEvent(id, request, userDetails.getUsername()));
    }

    @GetMapping("/events")
    public ResponseEntity<List<EventResponse>> getMyEvents(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(eventService.getCreatorEvents(userDetails.getUsername()));
    }

    @GetMapping("/events/{id}/sales")
    public ResponseEntity<EventSalesSummaryResponse> getEventSalesSummary(@AuthenticationPrincipal UserDetails userDetails,
                                                                            @PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventSalesSummary(id, userDetails.getUsername()));
    }

    @PostMapping("/tickets/validate")
    public ResponseEntity<PurchaseResponse> validateTicket(@Valid @RequestBody TicketValidationRequest request) {
        return ResponseEntity.ok(ticketService.validateTicketCode(request));
    }
}
