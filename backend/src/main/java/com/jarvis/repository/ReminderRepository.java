package com.jarvis.repository;

import java.time.Instant;
import java.util.List;

import com.jarvis.entity.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReminderRepository extends JpaRepository<Reminder, String> {
    List<Reminder> findByPatientIdOrderByDateAscTimeAsc(String patientId);
    List<Reminder> findByUpdatedAtAfterOrderByUpdatedAtAsc(Instant since);
}

