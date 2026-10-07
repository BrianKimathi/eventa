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

        // Build rich HTML email receipt with embedded QR code image
        String qrImageTag = (qrCodeData != null && !qrCodeData.isEmpty())
                ? String.format("<img src='%s' alt='Gate QR Code Pass' style='width:200px; height:200px; border-radius:12px; border:2px solid #f23e14; margin:15px 0;' />", qrCodeData)
                : "";

        String htmlReceipt = String.format("""
                <div style="font-family: Arial, sans-serif; background-color: #f7f7fc; padding: 25px; border-radius: 16px; max-width: 550px; margin: 0 auto; color: #1f1f39; border: 1px solid #eff0f6;">
                  <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #f23e14; margin: 0; font-size: 24px; font-weight: 800;">Eventa</h1>
                    <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #6e7191; font-weight: 700;">Official Ticket Receipt & Entry Pass</span>
                  </div>

                  <div style="background-color: #ffffff; padding: 20px; border-radius: 12px; border: 1px solid #eff0f6;">
                    <h2 style="margin-top: 0; font-size: 18px; color: #1f1f39;">%s</h2>
                    <p style="font-size: 13px; color: #6e7191; margin-bottom: 15px;">Hello <strong>%s</strong>, your ticket purchase has been confirmed!</p>

                    <div style="background-color: #fff4f1; padding: 12px 16px; border-radius: 8px; font-family: monospace; font-size: 13px; font-weight: bold; color: #f23e14; display: inline-block;">
                      Pass Code: %s
                    </div>

                    <table style="width: 100%%; margin-top: 15px; border-collapse: collapse; font-size: 13px; color: #1f1f39;">
                      <tr style="border-bottom: 1px solid #eff0f6;">
                        <td style="padding: 8px 0; color: #6e7191;">Pass Tier:</td>
                        <td style="padding: 8px 0; font-weight: bold; text-align: right;">%s</td>
                      </tr>
                      <tr style="border-bottom: 1px solid #eff0f6;">
                        <td style="padding: 8px 0; color: #6e7191;">Quantity:</td>
                        <td style="padding: 8px 0; font-weight: bold; text-align: right;">%d</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6e7191;">Total Paid:</td>
                        <td style="padding: 8px 0; font-weight: 800; color: #f23e14; text-align: right;">$%s</td>
                      </tr>
                    </table>

                    <div style="text-align: center; margin-top: 20px;">
                      %s
                      <p style="font-size: 11px; color: #6e7191; margin: 0;">Scan this QR code at venue gate entry</p>
                    </div>
                  </div>
                </div>
                """,
                event.getTitle(),
                user.getFirstName(),
                purchaseCode,
                ticketType.getName(),
                request.getQuantity(),
                totalAmount.toString(),
                qrImageTag
        );

        emailService.sendHtmlEmail(user.getEmail(), "Event Ticket Receipt & Pass - " + event.getTitle(), htmlReceipt);

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
