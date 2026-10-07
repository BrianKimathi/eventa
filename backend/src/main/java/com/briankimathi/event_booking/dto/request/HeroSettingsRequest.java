package com.briankimathi.event_booking.dto.request;

import lombok.Data;

@Data
public class HeroSettingsRequest {
    private String badgeText;
    private String headline;
    private String subheadline;
    private String ctaPrimaryText;
    private String ctaSecondaryText;
    private String backgroundImageUrl;
    private Integer overlayOpacity;
    private Boolean isActive;
}
