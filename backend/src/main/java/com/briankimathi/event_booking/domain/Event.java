package com.briankimathi.event_booking.domain;

import com.briankimathi.event_booking.domain.enums.EventStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "events", indexes = {
        @Index(name = "idx_event_status", columnList = "status"),
        @Index(name = "idx_event_creator", columnList = "creator_id"),
        @Index(name = "idx_event_start_date", columnList = "start_date")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"eventTicketTypes", "purchases"})
@EqualsAndHashCode(exclude = {"eventTicketTypes", "purchases"})
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Event title is required")
    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "venue", length = 255)
    private String venue;

    @NotNull(message = "Start date is required")
    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @NotNull(message = "End date is required")
    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    @Column(name = "category", length = 100)
    private String category;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private EventStatus status = EventStatus.DRAFT;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Min(value = 1, message = "Total capacity must be at least 1")
    @Column(name = "total_capacity", nullable = false)
    private Integer totalCapacity;

    @Column(name = "available_tickets", nullable = false)
    private Integer availableTickets;

    @NotNull(message = "Creator is required")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<EventTicketType> eventTicketTypes = new HashSet<>();

    @OneToMany(mappedBy = "event", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @Builder.Default
    private Set<TicketPurchase> purchases = new HashSet<>();

    @OneToOne(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    private Commission commission;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

}
