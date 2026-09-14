package com.jarvis.controller;

import java.util.List;

import com.jarvis.dto.ApiResponse;
import com.jarvis.dto.Payloads.MemoryPayload;
import com.jarvis.dto.Payloads.MemoryRequest;
import com.jarvis.service.MemoryService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class MemoryController {
    private final MemoryService memories;

    public MemoryController(MemoryService memories) {
        this.memories = memories;
    }

    @GetMapping("/patients/{patientId}/memories")
    public ApiResponse<List<MemoryPayload>> list(@PathVariable String patientId) {
        return ApiResponse.ok("Memories loaded", memories.listForPatient(patientId));
    }

    @PostMapping("/memories")
    public ApiResponse<MemoryPayload> create(@Valid @RequestBody MemoryRequest request) {
        return ApiResponse.ok("Memory saved", memories.saveFromRequest(request));
    }

    @PutMapping("/memories/{id}")
    public ApiResponse<MemoryPayload> update(@PathVariable String id, @Valid @RequestBody MemoryRequest request) {
        MemoryRequest withId = new MemoryRequest(id, request.patientId(), request.categoryId(), request.personName(),
                request.relationship(), request.placeName(), request.eventName(), request.favoriteObject(),
                request.favoriteFood(), request.favoriteSong(), request.importantDate(), request.imageUrl(),
                request.note(), request.promptSeed());
        return ApiResponse.ok("Memory updated", memories.saveFromRequest(withId));
    }

    @DeleteMapping("/memories/{id}")
    public ApiResponse<Void> delete(@PathVariable String id) {
        memories.delete(id);
        return ApiResponse.ok("Memory deleted", null);
    }
}

