package com.jarvis.repository;

import java.time.Instant;
import java.util.List;

import com.jarvis.entity.Memory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemoryRepository extends JpaRepository<Memory, String> {
    List<Memory> findByPatientIdOrderByUpdatedAtDesc(String patientId);
    List<Memory> findByUpdatedAtAfterOrderByUpdatedAtAsc(Instant since);
}

