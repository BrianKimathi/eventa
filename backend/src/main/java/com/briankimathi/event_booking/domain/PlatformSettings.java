package com.briankimathi.event_booking.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "platform_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlatformSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // App & Site Settings
    @Column(name = "site_title", length = 255)
    private String siteTitle;

    @Column(name = "site_description", columnDefinition = "TEXT")
    private String siteDescription;

    @Column(name = "contact_email", length = 255)
    private String contactEmail;

    @Column(name = "contact_phone", length = 50)
    private String contactPhone;

    @Column(name = "office_address", length = 255)
    private String officeAddress;

    // Hero Section Control
    @Column(name = "hero_badge_text", length = 100)
    private String heroBadgeText;

    @Column(name = "hero_headline", length = 255)
    private String heroHeadline;

    @Column(name = "hero_subheadline", columnDefinition = "TEXT")
    private String heroSubheadline;

    @Column(name = "hero_cta_primary_text", length = 100)
    private String heroCtaPrimaryText;

    @Column(name = "hero_cta_secondary_text", length = 100)
    private String heroCtaSecondaryText;

    @Column(name = "hero_background_url", length = 500)
    private String heroBackgroundUrl;

    // Active Payment Gateway
    @Column(name = "payment_gateway", length = 50)
    @Builder.Default
    private String paymentGateway = "MPESA"; // STRIPE, PAYSTACK, MPESA

    // Mpesa Daraja API Config
    @Column(name = "mpesa_consumer_key", length = 255)
    private String mpesaConsumerKey;

    @Column(name = "mpesa_consumer_secret", length = 255)
    private String mpesaConsumerSecret;

    @Column(name = "mpesa_passkey", length = 255)
    private String mpesaPasskey;

    @Column(name = "mpesa_shortcode", length = 50)
    private String mpesaShortcode;

    // Stripe Config
    @Column(name = "stripe_api_key", length = 255)
    private String stripeApiKey;

    // Paystack Config
    @Column(name = "paystack_secret_key", length = 255)
    private String paystackSecretKey;

    // NOWPayments / BTC Config
    @Column(name = "nowpayments_api_key", length = 255)
    private String nowpaymentsApiKey;

    @Column(name = "btc_wallet_address", length = 255)
    private String btcWalletAddress;

    // Mail SMTP Settings
    @Column(name = "mail_host", length = 255)
    private String mailHost;

    @Column(name = "mail_port")
    private Integer mailPort;

    @Column(name = "mail_username", length = 255)
    private String mailUsername;

    @Column(name = "mail_password", length = 255)
    private String mailPassword;

    @Column(name = "mail_from", length = 255)
    private String mailFrom;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
