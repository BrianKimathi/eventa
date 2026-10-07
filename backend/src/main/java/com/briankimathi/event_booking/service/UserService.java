package com.briankimathi.event_booking.service;

import com.briankimathi.event_booking.domain.*;
import com.briankimathi.event_booking.domain.enums.CreatorVerificationStatus;
import com.briankimathi.event_booking.domain.enums.EventStatus;
import com.briankimathi.event_booking.domain.enums.UserRoleEnum;
import com.briankimathi.event_booking.dto.response.AdminDashboardResponse;
import com.briankimathi.event_booking.dto.response.UserResponse;
import com.briankimathi.event_booking.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final EventRepository eventRepository;
    private final TicketPurchaseRepository ticketPurchaseRepository;
    private final CommissionService commissionService;

    @Transactional(readOnly = true)
    public UserResponse getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));
        return mapToUserResponse(user);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserResponse toggleUserSuspension(Long userId, boolean suspended) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        user.setIsSuspended(suspended);
        return mapToUserResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse addRoleToUser(Long userId, String roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        UserRoleEnum roleEnum = UserRoleEnum.valueOf(roleName.toUpperCase());
        Role role = roleRepository.findByName(roleEnum)
                .orElseThrow(() -> new IllegalArgumentException("Role not found: " + roleName));

        boolean exists = user.getUserRoles().stream()
                .anyMatch(ur -> ur.getRole().getName() == roleEnum);

        if (!exists) {
            UserRole userRole = UserRole.builder()
                    .user(user)
                    .role(role)
                    .build();
            user.getUserRoles().add(userRole);
            userRepository.save(user);
        }

        return mapToUserResponse(user);
    }

    @Transactional
    public UserResponse updateCreatorVerification(Long userId, CreatorVerificationStatus status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        user.setCreatorVerificationStatus(status);
        userRepository.save(user);

        if (status == CreatorVerificationStatus.VERIFIED) {
            addRoleToUser(userId, UserRoleEnum.CREATOR.name());
        }

        return mapToUserResponse(user);
    }

    @Transactional(readOnly = true)
    public AdminDashboardResponse getAdminDashboardMetrics() {
        long totalUsers = userRepository.count();

        long totalCreators = userRepository.findAll().stream()
                .filter(u -> u.getUserRoles().stream()
                        .anyMatch(ur -> ur.getRole().getName() == UserRoleEnum.CREATOR))
                .count();

        long totalEvents = eventRepository.count();
        long pendingEvents = eventRepository.findByStatus(EventStatus.PENDING_APPROVAL).size();

        List<TicketPurchase> purchases = ticketPurchaseRepository.findAll();
        long totalTicketsSold = purchases.stream().mapToLong(TicketPurchase::getQuantity).sum();

        BigDecimal totalRevenue = purchases.stream()
                .map(TicketPurchase::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalCommission = purchases.stream()
                .map(p -> commissionService.calculateCommission(p.getEvent(), p.getTotalAmount()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return AdminDashboardResponse.builder()
                .totalUsers(totalUsers)
                .totalCreators(totalCreators)
                .totalEvents(totalEvents)
                .pendingApprovalEvents(pendingEvents)
                .totalTicketsSold(totalTicketsSold)
                .totalRevenue(totalRevenue)
                .totalPlatformCommission(totalCommission)
                .build();
    }

    public UserResponse mapToUserResponse(User user) {
        List<String> roles = user.getUserRoles().stream()
                .map(ur -> ur.getRole().getName().name())
                .collect(Collectors.toList());

        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .isEmailVerified(user.getIsEmailVerified())
                .isActive(user.getIsActive())
                .isSuspended(user.getIsSuspended())
                .creatorVerificationStatus(user.getCreatorVerificationStatus().name())
                .roles(roles)
                .build();
    }
}
