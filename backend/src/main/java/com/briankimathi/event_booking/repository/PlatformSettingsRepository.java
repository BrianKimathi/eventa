package com.briankimathi.event_booking.repository;

import com.briankimathi.event_booking.domain.PlatformSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlatformSettingsRepository extends JpaRepository<PlatformSettings, Long> {
    Optional<PlatformSettings> findTopByOrderByIdAsc();
}
