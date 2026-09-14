package com.jarvis.repository;

import java.util.Optional;

import com.jarvis.entity.Caregiver;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CaregiverRepository extends JpaRepository<Caregiver, String> {
    Optional<Caregiver> findByUserId(String userId);
}

