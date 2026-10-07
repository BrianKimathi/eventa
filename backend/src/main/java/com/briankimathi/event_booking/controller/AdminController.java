package com.briankimathi.event_booking.controller;

import com.briankimathi.event_booking.domain.Commission;
import com.briankimathi.event_booking.domain.enums.CreatorVerificationStatus;
import com.briankimathi.event_booking.dto.request.CommissionRequest;
import com.briankimathi.event_booking.dto.request.EventApprovalRequest;
import com.briankimathi.event_booking.dto.response.AdminDashboardResponse;
import com.briankimathi.event_booking.dto.response.EventResponse;
import com.briankimathi.event_booking.dto.response.UserResponse;
import com.briankimathi.event_booking.service.CommissionService;
import com.briankimathi.event_booking.service.EventService;
import com.briankimathi.event_booking.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;
    private final EventService eventService;
    private final CommissionService commissionService;
    private final com.briankimathi.event_booking.service.PlatformSettingsService platformSettingsService;
    private final com.briankimathi.event_booking.service.TicketService ticketService;
    private final com.briankimathi.event_booking.service.PaymentService paymentService;

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse> getDashboardMetrics() {
        return ResponseEntity.ok(userService.getAdminDashboardMetrics());
    }

    @GetMapping("/orders")
    public ResponseEntity<List<com.briankimathi.event_booking.dto.response.OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(ticketService.getAllOrdersForAdmin());
    }

    @PutMapping("/orders/{id}/refund")
    public ResponseEntity<com.briankimathi.event_booking.domain.PaymentTransaction> processRefund(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.processRefund(id));
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/users/{id}/suspension")
    public ResponseEntity<UserResponse> toggleUserSuspension(@PathVariable Long id, @RequestParam boolean suspended) {
        return ResponseEntity.ok(userService.toggleUserSuspension(id, suspended));
    }

    @PutMapping("/users/{id}/roles")
    public ResponseEntity<UserResponse> addRoleToUser(@PathVariable Long id, @RequestParam String role) {
        return ResponseEntity.ok(userService.addRoleToUser(id, role));
    }

    @PutMapping("/users/{id}/creator-verification")
    public ResponseEntity<UserResponse> updateCreatorVerification(@PathVariable Long id,
                                                                   @RequestParam CreatorVerificationStatus status) {
        return ResponseEntity.ok(userService.updateCreatorVerification(id, status));
    }

    @GetMapping("/events")
    public ResponseEntity<List<EventResponse>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEventsForAdmin());
    }

    @PutMapping("/events/{id}/approval")
    public ResponseEntity<EventResponse> updateEventApproval(@PathVariable Long id,
                                                             @Valid @RequestBody EventApprovalRequest request) {
        return ResponseEntity.ok(eventService.updateEventApproval(id, request));
    }

    @GetMapping("/settings")
    public ResponseEntity<com.briankimathi.event_booking.domain.PlatformSettings> getSettings() {
        return ResponseEntity.ok(platformSettingsService.getSettings());
    }

    @PutMapping("/settings")
    public ResponseEntity<com.briankimathi.event_booking.domain.PlatformSettings> updateSettings(@RequestBody com.briankimathi.event_booking.domain.PlatformSettings settings) {
        return ResponseEntity.ok(platformSettingsService.updateSettings(settings));
    }
}
