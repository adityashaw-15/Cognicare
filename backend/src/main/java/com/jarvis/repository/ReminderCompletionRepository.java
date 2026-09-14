package com.jarvis.repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import com.jarvis.entity.ReminderCompletion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReminderCompletionRepository extends JpaRepository<ReminderCompletion, String> {
    Optional<ReminderCompletion> findByClientOperationId(String clientOperationId);
    List<ReminderCompletion> findByUpdatedAtAfterOrderByUpdatedAtAsc(Instant since);
}

