package com.jarvis.service;

import java.util.List;

import com.jarvis.dto.Payloads.MemoryPayload;
import com.jarvis.dto.Payloads.MemoryRequest;
import com.jarvis.entity.Memory;
import com.jarvis.entity.MemoryCategory;
import com.jarvis.exception.ApiException;
import com.jarvis.repository.MemoryCategoryRepository;
import com.jarvis.repository.MemoryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MemoryService {
    private final MemoryRepository memories;
    private final MemoryCategoryRepository categories;
    private final PatientService patients;

    public MemoryService(MemoryRepository memories, MemoryCategoryRepository categories, PatientService patients) {
        this.memories = memories;
        this.categories = categories;
        this.patients = patients;
    }

    @Transactional(readOnly = true)
    public List<MemoryPayload> listForPatient(String patientId) {
        return memories.findByPatientIdOrderByUpdatedAtDesc(patientId).stream()
                .map(JarvisMapper::memory)
                .toList();
    }

    @Transactional
    public MemoryPayload saveFromRequest(MemoryRequest request) {
        Memory memory = request.id() == null || request.id().isBlank()
                ? new Memory()
                : memories.findById(request.id()).orElseGet(Memory::new);
        if (request.id() != null && !request.id().isBlank()) {
            memory.setId(request.id());
        }
        memory.setPatient(patients.getPatientEntity(request.patientId()));
        memory.setCategory(resolveCategory(request.categoryId(), request.patientId()));
        memory.setPersonName(request.personName());
        memory.setRelationship(request.relationship());
        memory.setPlaceName(request.placeName());
        memory.setEventName(request.eventName());
        memory.setFavoriteObject(request.favoriteObject());
        memory.setFavoriteFood(request.favoriteFood());
        memory.setFavoriteSong(request.favoriteSong());
        memory.setImportantDate(request.importantDate());
        memory.setImageUrl(request.imageUrl());
        memory.setNote(request.note());
        memory.setPromptSeed(request.promptSeed());
        return JarvisMapper.memory(memories.save(memory));
    }

    @Transactional
    public void delete(String id) {
        if (!memories.existsById(id)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "MEMORY_NOT_FOUND", "Memory not found");
        }
        memories.deleteById(id);
    }

    private MemoryCategory resolveCategory(String categoryId, String patientId) {
        if (categoryId != null && !categoryId.isBlank()) {
            return categories.findById(categoryId).orElse(null);
        }
        return categories.findByPatientIdOrderByName(patientId).stream().findFirst().orElse(null);
    }
}

