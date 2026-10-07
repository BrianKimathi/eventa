package com.briankimathi.event_booking.controller;

import com.briankimathi.event_booking.dto.request.PurchaseRequest;
import com.briankimathi.event_booking.dto.response.PurchaseResponse;
import com.briankimathi.event_booking.dto.response.UserResponse;
import com.briankimathi.event_booking.service.TicketService;
import com.briankimathi.event_booking.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final TicketService ticketService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getUserProfile(userDetails.getUsername()));
    }

    @PostMapping("/me/tickets/purchase")
    public ResponseEntity<PurchaseResponse> purchaseTicket(@AuthenticationPrincipal UserDetails userDetails,
                                                          @Valid @RequestBody PurchaseRequest request) {
        return ResponseEntity.ok(ticketService.purchaseTicket(request, userDetails.getUsername()));
    }

    @GetMapping("/me/tickets")
    public ResponseEntity<List<PurchaseResponse>> getMyTickets(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ticketService.getUserTickets(userDetails.getUsername()));
    }
}
