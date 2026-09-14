package com.jarvis.repository;

import java.time.Instant;
import java.util.List;

import com.jarvis.entity.GameSession;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameSessionRepository extends JpaRepository<GameSession, String> {
    List<GameSession> findByPatientIdOrderByStartedAtDesc(String patientId);
    List<GameSession> findByUpdatedAtAfterOrderByUpdatedAtAsc(Instant since);
}

