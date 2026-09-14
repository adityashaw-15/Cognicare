package com.jarvis.repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import com.jarvis.entity.SyncRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SyncRecordRepository extends JpaRepository<SyncRecord, String> {
    Optional<SyncRecord> findByOperationId(String operationId);
    List<SyncRecord> findByUpdatedAtAfterOrderByUpdatedAtAsc(Instant since);
}

