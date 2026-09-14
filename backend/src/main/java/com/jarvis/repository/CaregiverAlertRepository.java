package com.jarvis.repository;

import java.time.Instant;
import java.util.List;

import com.jarvis.entity.CaregiverAlert;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CaregiverAlertRepository extends JpaRepository<CaregiverAlert, String> {
    List<CaregiverAlert> findTop8ByPatientIdOrderByGeneratedAtDesc(String patientId);
    List<CaregiverAlert> findByPatientIdOrderByGeneratedAtDesc(String patientId);
    List<CaregiverAlert> findByUpdatedAtAfterOrderByUpdatedAtAsc(Instant since);
}

