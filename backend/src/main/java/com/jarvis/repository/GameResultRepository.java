package com.jarvis.repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import com.jarvis.entity.GameResult;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameResultRepository extends JpaRepository<GameResult, String> {
    List<GameResult> findTop12ByPatientIdOrderByCreatedAtDesc(String patientId);
    List<GameResult> findByPatientIdOrderByCreatedAtDesc(String patientId);
    List<GameResult> findByUpdatedAtAfterOrderByUpdatedAtAsc(Instant since);
    Optional<GameResult> findByClientOperationId(String clientOperationId);
}

