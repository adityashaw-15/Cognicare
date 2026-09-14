package com.jarvis.repository;

import java.time.Instant;
import java.util.List;

import com.jarvis.entity.DailyActivity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DailyActivityRepository extends JpaRepository<DailyActivity, String> {
    List<DailyActivity> findByPatientIdOrderByTimeAsc(String patientId);
    List<DailyActivity> findByUpdatedAtAfterOrderByUpdatedAtAsc(Instant since);
}

