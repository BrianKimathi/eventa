package com.briankimathi.event_booking.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.Components;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI eventBookingOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Event Booking Platform API")
                        .description("REST API for the Event Booking Platform — handles authentication, event management, ticket purchasing, and admin operations.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Brian Kimathi")
                                .email("briankimathi@example.com"))
                        .license(new License().name("MIT License")))
                .addSecurityItem(new SecurityRequirement().addList("Bearer Auth"))
                .components(new Components()
                        .addSecuritySchemes("Bearer Auth", new SecurityScheme()
                                .name("Bearer Auth")
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }
}
