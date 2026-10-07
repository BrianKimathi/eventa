package com.briankimathi.event_booking.service;


import com.briankimathi.event_booking.domain.Role;
import com.briankimathi.event_booking.domain.User;
import com.briankimathi.event_booking.domain.UserRole;
import com.briankimathi.event_booking.domain.enums.CreatorVerificationStatus;
import com.briankimathi.event_booking.domain.enums.UserRoleEnum;
import com.briankimathi.event_booking.dto.request.LoginRequest;
import com.briankimathi.event_booking.dto.request.RegisterRequest;
import com.briankimathi.event_booking.dto.response.AuthResponse;
import com.briankimathi.event_booking.exception.ValidationException;
import com.briankimathi.event_booking.repository.RoleRepository;
import com.briankimathi.event_booking.repository.UserRepository;
import com.briankimathi.event_booking.security.JwtTokenProvider;
import com.briankimathi.event_booking.security.SecurityUser;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest request) {

        if(userRepository.existsByEmail(request.getEmail())) {
            throw new ValidationException("Email already registered");
        }

        // Create user
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .isEmailVerified(false)
                .isActive(true)
                .isSuspended(false)
                .creatorVerificationStatus(CreatorVerificationStatus.NOT_REQUESTED)
                .build();

        user = userRepository.save(user);

        // Assign USER role
        Role userRole = roleRepository.findByName(UserRoleEnum.USER)
                .orElseThrow(() -> new RuntimeException("USER role not found"));

        UserRole userRoleEntity = UserRole.builder()
                .user(user)
                .role(userRole)
                .build();

        user.getUserRoles().add(userRoleEntity);
        userRepository.save(user);

        // Generate JWT token
        SecurityUser securityUser = SecurityUser.builder()
                .id(user.getId())
                .email(user.getEmail())
                .password(user.getPassword())
                .enabled(true)
                .accountNonLocked(true)
                .accountNonExpired(true)
                .credentialsNonExpired(true)
                .build();

        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("email", user.getEmail());

        String token = jwtTokenProvider.generateToken(securityUser, claims);

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .userId(user.getId())
                .build();

    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        SecurityUser securityUser = (SecurityUser) authentication.getPrincipal();
        User user = userRepository.findByEmail(securityUser.getEmail())
                .orElseThrow(() -> new ValidationException("User not found!"));

        // Check if user is active and not suspended
        if(!user.getIsActive() || user.getIsSuspended()) {
            throw new ValidationException("Account is suspended or inactive");
        }

        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("email", user.getEmail());

        String token = jwtTokenProvider.generateToken(securityUser, claims);

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .userId(user.getId())
                .build();
    }

}
