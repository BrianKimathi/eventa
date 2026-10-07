package com.briankimathi.event_booking.integration;

import com.briankimathi.event_booking.dto.request.RegisterRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@Sql(scripts = "/insert-test-roles.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
@DisplayName("Auth Controller Integration Tests")
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule());

    @Test
    @DisplayName("Should register user successfully")
    void register_Success() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .email("integration@test.com")
                .password("password123")
                .firstName("Integration")
                .lastName("Test")
                .phone("+1234567890")
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.token").exists())
                .andExpect(jsonPath("$.data.email").value("integration@test.com"))
                .andExpect(jsonPath("$.data.userId").exists())
                .andExpect(jsonPath("$.message").value("User registered successfully"));
    }

    @Test
    @DisplayName("Should return 400 when email already exists")
    void register_DuplicateEmail_ReturnsBadRequest() throws Exception {
        // First registration
        RegisterRequest firstRequest = RegisterRequest.builder()
                .email("duplicate@test.com")
                .password("password123")
                .firstName("First")
                .lastName("User")
                .phone("+1234567890")
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(firstRequest)))
                .andExpect(status().isCreated());

        // Second registration with same email
        RegisterRequest secondRequest = RegisterRequest.builder()
                .email("duplicate@test.com")
                .password("password123")
                .firstName("Second")
                .lastName("User")
                .phone("+9876543210")
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(secondRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should return 400 when request is invalid")
    void register_InvalidRequest_ReturnsBadRequest() throws Exception {
        RegisterRequest invalidRequest = RegisterRequest.builder()
                .email("invalid-email")  // Invalid email format
                .password("")            // Empty password
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }
}