package com.jarvis.repository;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.jarvis.entity.MoodEntry;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MoodEntryRepository extends JpaRepository<MoodEntry, String> {
    List<MoodEntry> findByPatientIdOrderByEntryDateDesc(String patientId);
    Optional<MoodEntry> findByPatientIdAndEntryDate(String patientId, LocalDate entryDate);
    Optional<MoodEntry> findByClientOperationId(String clientOperationId);
    List<MoodEntry> findByUpdatedAtAfterOrderByUpdatedAtAsc(Instant since);
}

