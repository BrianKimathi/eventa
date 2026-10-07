package com.briankimathi.event_booking.service;

import com.briankimathi.event_booking.domain.PlatformSettings;
import com.briankimathi.event_booking.repository.PlatformSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PlatformSettingsService {

    private final PlatformSettingsRepository settingsRepository;

    public PlatformSettings getSettings() {
        return settingsRepository.findTopByOrderByIdAsc()
                .orElseGet(() -> settingsRepository.save(
                        PlatformSettings.builder()
                                .siteTitle("EventPulse Ticketing")
                                .siteDescription("Book live tickets for upcoming high-profile events")
                                .contactEmail("support@eventpulse.com")
                                .contactPhone("+254 700 000 000")
                                .officeAddress("Westlands Commercial Center, Nairobi, Kenya")
                                .heroBadgeText("LIVE EVENT TICKETING STORE")
                                .heroHeadline("Discover & Book Live Event Tickets")
                                .heroSubheadline("Browse top-tier concerts, technology summits, and business workshops with instant digital M-Pesa & Card QR passes.")
                                .heroCtaPrimaryText("Discover Events")
                                .heroCtaSecondaryText("Contact Support")
                                .paymentGateway("MPESA")
                                .mpesaShortcode("174379")
                                .mailHost("smtp.gmail.com")
                                .mailPort(587)
                                .build()
                ));
    }

    public PlatformSettings updateSettings(PlatformSettings request) {
        PlatformSettings existing = getSettings();
        
        if (request.getSiteTitle() != null) existing.setSiteTitle(request.getSiteTitle());
        if (request.getSiteDescription() != null) existing.setSiteDescription(request.getSiteDescription());
        if (request.getContactEmail() != null) existing.setContactEmail(request.getContactEmail());
        if (request.getContactPhone() != null) existing.setContactPhone(request.getContactPhone());
        if (request.getOfficeAddress() != null) existing.setOfficeAddress(request.getOfficeAddress());

        if (request.getHeroBadgeText() != null) existing.setHeroBadgeText(request.getHeroBadgeText());
        if (request.getHeroHeadline() != null) existing.setHeroHeadline(request.getHeroHeadline());
        if (request.getHeroSubheadline() != null) existing.setHeroSubheadline(request.getHeroSubheadline());
        if (request.getHeroCtaPrimaryText() != null) existing.setHeroCtaPrimaryText(request.getHeroCtaPrimaryText());
        if (request.getHeroCtaSecondaryText() != null) existing.setHeroCtaSecondaryText(request.getHeroCtaSecondaryText());
        if (request.getHeroBackgroundUrl() != null) existing.setHeroBackgroundUrl(request.getHeroBackgroundUrl());

        if (request.getPaymentGateway() != null) existing.setPaymentGateway(request.getPaymentGateway());
        if (request.getMpesaConsumerKey() != null) existing.setMpesaConsumerKey(request.getMpesaConsumerKey());
        if (request.getMpesaConsumerSecret() != null) existing.setMpesaConsumerSecret(request.getMpesaConsumerSecret());
        if (request.getMpesaPasskey() != null) existing.setMpesaPasskey(request.getMpesaPasskey());
        if (request.getMpesaShortcode() != null) existing.setMpesaShortcode(request.getMpesaShortcode());
        if (request.getStripeApiKey() != null) existing.setStripeApiKey(request.getStripeApiKey());
        if (request.getPaystackSecretKey() != null) existing.setPaystackSecretKey(request.getPaystackSecretKey());
        if (request.getNowpaymentsApiKey() != null) existing.setNowpaymentsApiKey(request.getNowpaymentsApiKey());
        if (request.getBtcWalletAddress() != null) existing.setBtcWalletAddress(request.getBtcWalletAddress());

        if (request.getMailHost() != null) existing.setMailHost(request.getMailHost());
        if (request.getMailPort() != null) existing.setMailPort(request.getMailPort());
        if (request.getMailUsername() != null) existing.setMailUsername(request.getMailUsername());
        if (request.getMailPassword() != null) existing.setMailPassword(request.getMailPassword());
        if (request.getMailFrom() != null) existing.setMailFrom(request.getMailFrom());

        return settingsRepository.save(existing);
    }
}
