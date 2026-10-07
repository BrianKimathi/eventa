package com.briankimathi.event_booking.service;


import com.briankimathi.event_booking.domain.Role;
import com.briankimathi.event_booking.domain.User;
import com.briankimathi.event_booking.domain.enums.CreatorVerificationStatus;
import com.briankimathi.event_booking.domain.enums.UserRoleEnum;
import com.briankimathi.event_booking.dto.request.RegisterRequest;
import com.briankimathi.event_booking.dto.response.AuthResponse;
import com.briankimathi.event_booking.exception.ValidationException;
import com.briankimathi.event_booking.repository.RoleRepository;
import com.briankimathi.event_booking.repository.UserRepository;
import com.briankimathi.event_booking.security.JwtTokenProvider;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService Tests")
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest validRegisterRequest;
    private Role userRole;
    private User savedUser;

    @BeforeEach
    void setUp() {
        validRegisterRequest = RegisterRequest.builder()
                .email("test@example.com")
                .password("password123")
                .firstName("Ken")
                .lastName("Mark")
                .phone("+254712345678")
                .build();

        userRole = Role.builder()
                .id(1L)
                .name(UserRoleEnum.USER)
                .description("Regular User")
                .build();

        savedUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .firstName("John")
                .lastName("Doe")
                .phone("+1234567890")
                .isActive(true)
                .isSuspended(false)
                .isEmailVerified(false)
                .creatorVerificationStatus(CreatorVerificationStatus.NOT_REQUESTED)
                .build();

    }

    @Test
    @DisplayName("Should register successfully when email is unique")
    public void register_Success() {
        // Arrange
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(roleRepository.findByName(UserRoleEnum.USER)).thenReturn(Optional.of(userRole));
        when(jwtTokenProvider.generateToken(any(), any())).thenReturn("jwt-token");

        // Act
        AuthResponse response = authService.register(validRegisterRequest);

        // Assert

        assertNotNull(response);
        assertEquals("test@example.com", response.getEmail());
        assertEquals(1L, response.getUserId());
        assertEquals("jwt-token", response.getToken());

        verify(userRepository).existsByEmail("test@example.com");
        verify(passwordEncoder).encode("password123");
        verify(userRepository, times(2)).save(any(User.class));
        verify(roleRepository).findByName(UserRoleEnum.USER);
        verify(jwtTokenProvider).generateToken(any(), any());

    }

    @Test
    @DisplayName("Should throw ValidationException when email already exists")
    public void register_EmailAlreadyExists_ThrowsException() {
        // Arrange
        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        // Act & assert
        ValidationException exception = assertThrows(
                ValidationException.class,
                () -> authService.register(validRegisterRequest)
        );

        assertEquals("Email already registered", exception.getMessage());
        verify(userRepository).existsByEmail("test@example.com");
        verify(userRepository, never()).save(any(User.class));

    }



}
