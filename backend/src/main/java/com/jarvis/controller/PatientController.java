package com.jarvis.controller;

import java.util.List;
import java.util.Map;

import com.jarvis.dto.ApiResponse;
import com.jarvis.dto.Payloads.PatientPayload;
import com.jarvis.dto.Payloads.ProgressSummary;
import com.jarvis.service.PatientService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/patients")
public class PatientController {
    private final PatientService patients;

    public PatientController(PatientService patients) {
        this.patients = patients;
    }

    @GetMapping
    public ApiResponse<List<PatientPayload>> list() {
        return ApiResponse.ok("Patients loaded", patients.listPatients());
    }

    @GetMapping("/{id}")
    public ApiResponse<PatientPayload> get(@PathVariable String id) {
        return ApiResponse.ok("Patient loaded", patients.getPatient(id));
    }

    @GetMapping("/{id}/progress")
    public ApiResponse<ProgressSummary> progress(@PathVariable String id) {
        return ApiResponse.ok("Progress loaded", patients.progress(id));
    }

    @PutMapping("/{id}/preferences")
    public ApiResponse<PatientPayload> preferences(@PathVariable String id, @RequestBody Map<String, Object> request) {
        String language = request.get("preferredLanguage") instanceof String value ? value : null;
        Integer difficulty = request.get("difficultyLevel") instanceof Number value ? value.intValue() : null;
        return ApiResponse.ok("Preferences updated", patients.updatePreferences(id, language, difficulty));
    }
}

