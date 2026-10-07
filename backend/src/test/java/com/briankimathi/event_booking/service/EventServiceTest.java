package com.briankimathi.event_booking.service;

import com.briankimathi.event_booking.domain.Event;
import com.briankimathi.event_booking.domain.User;
import com.briankimathi.event_booking.domain.enums.EventStatus;
import com.briankimathi.event_booking.dto.request.CreateEventRequest;
import com.briankimathi.event_booking.dto.request.EventApprovalRequest;
import com.briankimathi.event_booking.dto.response.EventResponse;
import com.briankimathi.event_booking.repository.EventRepository;
import com.briankimathi.event_booking.repository.TicketTypeRepository;
import com.briankimathi.event_booking.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EventServiceTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TicketTypeRepository ticketTypeRepository;

    @InjectMocks
    private EventService eventService;

    private User creator;

    @BeforeEach
    void setUp() {
        creator = User.builder()
                .id(1L)
                .email("creator@example.com")
                .firstName("John")
                .lastName("Doe")
                .build();
    }

    @Test
    void testCreateEvent_PendingApproval() {
        CreateEventRequest request = CreateEventRequest.builder()
                .title("Tech Conference 2026")
                .description("Annual Developer Summit")
                .venue("Convention Center")
                .startDate(LocalDateTime.now().plusDays(5))
                .endDate(LocalDateTime.now().plusDays(6))
                .totalCapacity(500)
                .build();

        when(userRepository.findByEmail("creator@example.com")).thenReturn(Optional.of(creator));
        when(eventRepository.save(any(Event.class))).thenAnswer(invocation -> {
            Event e = invocation.getArgument(0);
            e.setId(100L);
            return e;
        });

        EventResponse response = eventService.createEvent(request, "creator@example.com");

        assertNotNull(response);
        assertEquals("Tech Conference 2026", response.getTitle());
        assertEquals(EventStatus.PENDING_APPROVAL, response.getStatus());
        verify(eventRepository, times(1)).save(any(Event.class));
    }

    @Test
    void testUpdateEventApproval_Publish() {
        Event event = Event.builder()
                .id(100L)
                .title("Tech Conference 2026")
                .status(EventStatus.PENDING_APPROVAL)
                .creator(creator)
                .build();

        EventApprovalRequest approvalRequest = EventApprovalRequest.builder()
                .status(EventStatus.PUBLISHED)
                .comment("Approved by Admin")
                .build();

        when(eventRepository.findById(100L)).thenReturn(Optional.of(event));
        when(eventRepository.save(any(Event.class))).thenAnswer(invocation -> invocation.getArgument(0));

        EventResponse response = eventService.updateEventApproval(100L, approvalRequest);

        assertEquals(EventStatus.PUBLISHED, response.getStatus());
        verify(eventRepository).save(event);
    }
}
