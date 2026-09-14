package com.jarvis.repository;

import java.util.Optional;

import com.jarvis.entity.HealthcareWorker;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HealthcareWorkerRepository extends JpaRepository<HealthcareWorker, String> {
    Optional<HealthcareWorker> findByUserId(String userId);
}

