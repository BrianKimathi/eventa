package com.briankimathi.event_booking.repository;

import com.briankimathi.event_booking.domain.Role;
import com.briankimathi.event_booking.domain.enums.UserRoleEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(UserRoleEnum name);
    Boolean existsByName(UserRoleEnum name);
}
