package com.briankimathi.event_booking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private Boolean isEmailVerified;
    private Boolean isActive;
    private Boolean isSuspended;
    private String creatorVerificationStatus;
    private List<String> roles;
}
