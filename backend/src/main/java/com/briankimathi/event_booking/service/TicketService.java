package com.briankimathi.event_booking.service;

import com.briankimathi.event_booking.domain.*;
import com.briankimathi.event_booking.domain.enums.PurchaseStatus;
import com.briankimathi.event_booking.dto.request.PurchaseRequest;
import com.briankimathi.event_booking.dto.request.TicketValidationRequest;
import com.briankimathi.event_booking.dto.response.PurchaseResponse;
import com.briankimathi.event_booking.repository.EventRepository;
import com.briankimathi.event_booking.repository.TicketPurchaseRepository;
import com.briankimathi.event_booking.repository.TicketTypeRepository;
import com.briankimathi.event_booking.repository.UserRepository;
import com.briankimathi.event_booking.exception.ResourceNotFoundException;
import com.briankimathi.event_booking.util.Constants;
import com.briankimathi.event_booking.util.PurchaseCodeGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketPurchaseRepository ticketPurchaseRepository;
    private final EventRepository eventRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final UserRepository userRepository;
    private final QrCodeService qrCodeService;
    private final EmailService emailService;

    @Transactional
    public PurchaseResponse purchaseTicket(PurchaseRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", request.getEventId()));

        TicketType ticketType = ticketTypeRepository.findById(request.getTicketTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("TicketType", "id", request.getTicketTypeId()));

        if (event.getAvailableTickets() < request.getQuantity()) {
            throw new IllegalStateException("Not enough tickets available for this event");
        }

        // Calculate total price based on event_ticket_type configuration if present, otherwise default price
        BigDecimal unitPrice = event.getEventTicketTypes().stream()
                .filter(ett -> ett.getTicketType().getId().equals(ticketType.getId()))
                .map(EventTicketType::getPrice)
                .findFirst()
                .orElse(ticketType.getPrice());

        BigDecimal totalAmount = unitPrice.multiply(BigDecimal.valueOf(request.getQuantity()));
        String purchaseCode = PurchaseCodeGenerator.generate();

        // Lock/decrease available tickets
        event.setAvailableTickets(event.getAvailableTickets() - request.getQuantity());
        eventRepository.save(event);

        String qrCodeData = qrCodeService.generateQrCodeBase64(purchaseCode, Constants.QR_CODE_WIDTH, Constants.QR_CODE_HEIGHT);

        TicketPurchase purchase = TicketPurchase.builder()
                .user(user)
                .event(event)
                .ticketType(ticketType)
                .quantity(request.getQuantity())
                .totalAmount(totalAmount)
                .purchaseCode(purchaseCode)
                .qrCodeData(qrCodeData)
                .status(PurchaseStatus.COMPLETED)
                .purchaseDate(LocalDateTime.now())
                .build();

        TicketPurchase saved = ticketPurchaseRepository.save(purchase);

        // Trigger email notification asynchronously
        String emailBody = String.format("Hello %s,\n\nYour booking for '%s' is confirmed!\nPurchase Code: %s\nTickets: %d\nTotal Paid: $%s",
                user.getFirstName(), event.getTitle(), purchaseCode, request.getQuantity(), totalAmount);
        emailService.sendEmail(user.getEmail(), "Ticket Confirmation - " + event.getTitle(), emailBody);

        return mapToPurchaseResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<PurchaseResponse> getUserTickets(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        return ticketPurchaseRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToPurchaseResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PurchaseResponse validateTicketCode(TicketValidationRequest request) {
        TicketPurchase purchase = ticketPurchaseRepository.findByPurchaseCode(request.getPurchaseCode())
                .orElseThrow(() -> new ResourceNotFoundException("TicketPurchase", "purchaseCode", request.getPurchaseCode()));

        return mapToPurchaseResponse(purchase);
    }

    @Transactional(readOnly = true)
    public List<com.briankimathi.event_booking.dto.response.OrderResponse> getAllOrdersForAdmin() {
        return ticketPurchaseRepository.findAll().stream()
                .map(tp -> com.briankimathi.event_booking.dto.response.OrderResponse.builder()
                        .purchaseId(tp.getId())
                        .purchaseCode(tp.getPurchaseCode())
                        .purchaseDate(tp.getPurchaseDate())
                        .customerName(tp.getUser() != null ? (tp.getUser().getFirstName() + " " + tp.getUser().getLastName()).trim() : "Guest")
                        .customerEmail(tp.getUser() != null ? tp.getUser().getEmail() : "N/A")
                        .eventId(tp.getEvent() != null ? tp.getEvent().getId() : null)
                        .eventTitle(tp.getEvent() != null ? tp.getEvent().getTitle() : "N/A")
                        .category(tp.getEvent() != null ? tp.getEvent().getCategory() : "General")
                        .ticketTypeName(tp.getTicketType() != null ? tp.getTicketType().getName() : "Standard")
                        .quantity(tp.getQuantity())
                        .totalAmount(tp.getTotalAmount())
                        .purchaseStatus(tp.getStatus() != null ? tp.getStatus().name() : "COMPLETED")
                        .qrCodeData(tp.getQrCodeData())
                        .build())
                .collect(Collectors.toList());
    }

    private PurchaseResponse mapToPurchaseResponse(TicketPurchase purchase) {
        return PurchaseResponse.builder()
                .id(purchase.getId())
                .purchaseCode(purchase.getPurchaseCode())
                .eventId(purchase.getEvent().getId())
                .eventTitle(purchase.getEvent().getTitle())
                .ticketTypeId(purchase.getTicketType().getId())
                .ticketTypeName(purchase.getTicketType().getName())
                .quantity(purchase.getQuantity())
                .totalAmount(purchase.getTotalAmount())
                .qrCodeData(purchase.getQrCodeData())
                .status(purchase.getStatus())
                .purchaseDate(purchase.getPurchaseDate())
                .build();
    }
}
