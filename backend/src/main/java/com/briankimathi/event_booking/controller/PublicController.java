package com.briankimathi.event_booking.controller;

import com.briankimathi.event_booking.dto.response.EventResponse;
import com.briankimathi.event_booking.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/public")
@RequiredArgsConstructor
public class PublicController {

    private final EventService eventService;
    private final com.briankimathi.event_booking.service.PlatformSettingsService platformSettingsService;

    @GetMapping("/settings")
    public ResponseEntity<com.briankimathi.event_booking.domain.PlatformSettings> getPublicSettings() {
        return ResponseEntity.ok(platformSettingsService.getSettings());
    }

    @GetMapping("/events")
    public ResponseEntity<List<EventResponse>> getPublishedEvents() {
        return ResponseEntity.ok(eventService.getPublishedEvents());
    }

    @GetMapping("/events/{id}")
    public ResponseEntity<EventResponse> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }
}
