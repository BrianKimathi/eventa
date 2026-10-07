package com.briankimathi.event_booking.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "hero_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HeroSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "badge_text", length = 100)
    private String badgeText;

    @Column(name = "headline", length = 255)
    private String headline;

    @Column(name = "subheadline", columnDefinition = "TEXT")
    private String subheadline;

    @Column(name = "cta_primary_text", length = 100)
    private String ctaPrimaryText;

    @Column(name = "cta_secondary_text", length = 100)
    private String ctaSecondaryText;

    @Column(name = "background_image_url", length = 500)
    private String backgroundImageUrl;

    @Column(name = "overlay_opacity")
    @Builder.Default
    private Integer overlayOpacity = 60;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
