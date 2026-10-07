package com.briankimathi.event_booking.repository;

import com.briankimathi.event_booking.domain.HeroSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HeroSettingsRepository extends JpaRepository<HeroSettings, Long> {
    Optional<HeroSettings> findTopByOrderByIdAsc();
}
