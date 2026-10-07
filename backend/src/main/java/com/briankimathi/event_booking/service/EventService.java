package com.briankimathi.event_booking.service;

import com.briankimathi.event_booking.domain.*;
import com.briankimathi.event_booking.domain.enums.EventStatus;
import com.briankimathi.event_booking.dto.request.CreateEventRequest;
import com.briankimathi.event_booking.dto.request.EventApprovalRequest;
import com.briankimathi.event_booking.dto.response.EventResponse;
import com.briankimathi.event_booking.dto.response.EventSalesSummaryResponse;
import com.briankimathi.event_booking.exception.ResourceNotFoundException;
import com.briankimathi.event_booking.repository.EventRepository;
import com.briankimathi.event_booking.repository.TicketPurchaseRepository;
import com.briankimathi.event_booking.repository.TicketTypeRepository;
import com.briankimathi.event_booking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final TicketPurchaseRepository ticketPurchaseRepository;

    @Transactional
    public EventResponse createEvent(CreateEventRequest request, String creatorEmail) {
        User creator = userRepository.findByEmail(creatorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", creatorEmail));

        Event event = Event.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .venue(request.getVenue())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .category(request.getCategory())
                .imageUrl(request.getImageUrl())
                .totalCapacity(request.getTotalCapacity())
                .availableTickets(request.getTotalCapacity())
                .status(EventStatus.PENDING_APPROVAL)
                .creator(creator)
                .build();

        if (request.getTicketTypes() != null && !request.getTicketTypes().isEmpty()) {
            for (CreateEventRequest.TicketTypeConfig ttConfig : request.getTicketTypes()) {
                TicketType ticketType = ticketTypeRepository.findByName(ttConfig.getName())
                        .orElseGet(() -> ticketTypeRepository.save(TicketType.builder()
                                .name(ttConfig.getName())
                                .description(ttConfig.getDescription())
                                .price(ttConfig.getPrice())
                                .capacity(ttConfig.getAvailableQuantity())
                                .build()));

                EventTicketType ett = EventTicketType.builder()
                        .event(event)
                        .ticketType(ticketType)
                        .price(ttConfig.getPrice())
                        .availableQuantity(ttConfig.getAvailableQuantity())
                        .build();

                event.getEventTicketTypes().add(ett);
            }
        }

        Event saved = eventRepository.save(event);
        return mapToEventResponse(saved);
    }

    @Transactional
    public EventResponse updateEvent(Long eventId, CreateEventRequest request, String creatorEmail) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));

        User user = userRepository.findByEmail(creatorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", creatorEmail));

        boolean isAdmin = user.getUserRoles().stream().anyMatch(ur -> ur.getRole().getName().name().equals("ADMIN"));
        if (!isAdmin && !event.getCreator().getId().equals(user.getId())) {
            throw new IllegalStateException("You are not authorized to update this event");
        }

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setVenue(request.getVenue());
        event.setStartDate(request.getStartDate());
        event.setEndDate(request.getEndDate());
        event.setCategory(request.getCategory());
        event.setImageUrl(request.getImageUrl());

        Event saved = eventRepository.save(event);
        return mapToEventResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getPublishedEvents() {
        return eventRepository.findPublishedUpcomingEvents(EventStatus.PUBLISHED, LocalDateTime.now())
                .stream()
                .map(this::mapToEventResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EventResponse getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", id));
        return mapToEventResponse(event);
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getCreatorEvents(String creatorEmail) {
        User creator = userRepository.findByEmail(creatorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", creatorEmail));
        return eventRepository.findByCreatorId(creator.getId())
                .stream()
                .map(this::mapToEventResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EventSalesSummaryResponse getEventSalesSummary(Long eventId, String creatorEmail) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));

        User user = userRepository.findByEmail(creatorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", creatorEmail));

        boolean isAdmin = user.getUserRoles().stream().anyMatch(ur -> ur.getRole().getName().name().equals("ADMIN"));
        if (!isAdmin && !event.getCreator().getId().equals(user.getId())) {
            throw new IllegalStateException("You are not authorized to view sales for this event");
        }

        List<TicketPurchase> purchases = ticketPurchaseRepository.findByEventId(eventId);

        int ticketsSold = purchases.stream().mapToInt(TicketPurchase::getQuantity).sum();
        BigDecimal totalRevenue = purchases.stream()
                .map(TicketPurchase::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<Long, EventSalesSummaryResponse.TicketTypeSales> salesByType = new HashMap<>();

        for (TicketPurchase p : purchases) {
            Long ttId = p.getTicketType().getId();
            EventSalesSummaryResponse.TicketTypeSales sales = salesByType.getOrDefault(ttId,
                    EventSalesSummaryResponse.TicketTypeSales.builder()
                            .ticketTypeId(ttId)
                            .ticketTypeName(p.getTicketType().getName())
                            .quantitySold(0)
                            .revenue(BigDecimal.ZERO)
                            .build());

            sales.setQuantitySold(sales.getQuantitySold() + p.getQuantity());
            sales.setRevenue(sales.getRevenue().add(p.getTotalAmount()));
            salesByType.put(ttId, sales);
        }

        return EventSalesSummaryResponse.builder()
                .eventId(event.getId())
                .eventTitle(event.getTitle())
                .totalCapacity(event.getTotalCapacity())
                .availableTickets(event.getAvailableTickets())
                .ticketsSold(ticketsSold)
                .totalRevenue(totalRevenue)
                .ticketTypeSales(new ArrayList<>(salesByType.values()))
                .build();
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getAllEventsForAdmin() {
        return eventRepository.findAll()
                .stream()
                .map(this::mapToEventResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public EventResponse updateEventApproval(Long eventId, EventApprovalRequest request) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));

        event.setStatus(request.getStatus());
        Event updated = eventRepository.save(event);
        return mapToEventResponse(updated);
    }

    public EventResponse mapToEventResponse(Event event) {
        List<EventResponse.EventTicketTypeResponse> ticketTypes = event.getEventTicketTypes() == null ? List.of() :
                event.getEventTicketTypes().stream()
                        .map(ett -> EventResponse.EventTicketTypeResponse.builder()
                                .ticketTypeId(ett.getTicketType().getId())
                                .name(ett.getTicketType().getName())
                                .description(ett.getTicketType().getDescription())
                                .price(ett.getPrice())
                                .availableQuantity(ett.getAvailableQuantity())
                                .build())
                        .collect(Collectors.toList());

        return EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .venue(event.getVenue())
                .startDate(event.getStartDate())
                .endDate(event.getEndDate())
                .category(event.getCategory())
                .status(event.getStatus())
                .imageUrl(event.getImageUrl())
                .totalCapacity(event.getTotalCapacity())
                .availableTickets(event.getAvailableTickets())
                .creatorId(event.getCreator().getId())
                .creatorName(event.getCreator().getFirstName() + " " + event.getCreator().getLastName())
                .creatorEmail(event.getCreator().getEmail())
                .ticketTypes(ticketTypes)
                .createdAt(event.getCreatedAt())
                .updatedAt(event.getUpdatedAt())
                .build();
    }
}
