package com.briankimathi.event_booking.security;

import com.briankimathi.event_booking.domain.User;
import com.briankimathi.event_booking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: {}" + email));

        return SecurityUser.builder()
                .id(user.getId())
                .email(user.getEmail())
                .password(user.getPassword())
                .authorities(getAuthorities(user))
                .accountNonExpired(true)
                .accountNonLocked(!user.getIsSuspended())
                .credentialsNonExpired(true)
                .enabled(user.getIsActive() && !user.getIsSuspended())
                .build();

    }

    private Collection<? extends GrantedAuthority> getAuthorities(User user) {
        return user.getUserRoles().stream()
                .map(userRole -> new SimpleGrantedAuthority("ROLE_" + userRole.getRole().getName().name()))
                .collect(Collectors.toList());
    }

}
