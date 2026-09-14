package com.jarvis.service;

import java.util.List;

import com.jarvis.dto.Payloads.MoodEntryPayload;
import com.jarvis.dto.Payloads.MoodEntryRequest;
import com.jarvis.entity.MoodEntry;
import com.jarvis.repository.MoodEntryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MoodService {
    private final MoodEntryRepository moods;
    private final PatientService patients;

    public MoodService(MoodEntryRepository moods, PatientService patients) {
        this.moods = moods;
        this.patients = patients;
    }

    @Transactional(readOnly = true)
    public List<MoodEntryPayload> list(String patientId) {
        return moods.findByPatientIdOrderByEntryDateDesc(patientId).stream()
                .map(JarvisMapper::mood)
                .toList();
    }

    @Transactional
    public MoodEntryPayload saveFromRequest(MoodEntryRequest request) {
        if (request.clientOperationId() != null && !request.clientOperationId().isBlank()) {
            var existing = moods.findByClientOperationId(request.clientOperationId());
            if (existing.isPresent()) {
                return JarvisMapper.mood(existing.get());
            }
        }
        MoodEntry entry = request.id() != null && !request.id().isBlank()
                ? moods.findById(request.id()).orElseGet(MoodEntry::new)
                : moods.findByPatientIdAndEntryDate(request.patientId(), request.entryDate()).orElseGet(MoodEntry::new);
        if (request.id() != null && !request.id().isBlank()) {
            entry.setId(request.id());
        }
        entry.setPatient(patients.getPatientEntity(request.patientId()));
        entry.setClientOperationId(request.clientOperationId());
        entry.setEntryDate(request.entryDate());
        entry.setMood(request.mood());
        entry.setNote(request.note());
        return JarvisMapper.mood(moods.save(entry));
    }
}

