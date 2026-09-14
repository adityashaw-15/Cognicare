package com.jarvis.controller;

import java.util.List;

import com.jarvis.dto.ApiResponse;
import com.jarvis.dto.Payloads.MoodEntryPayload;
import com.jarvis.dto.Payloads.MoodEntryRequest;
import com.jarvis.service.MoodService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/moods")
public class MoodController {
    private final MoodService moods;

    public MoodController(MoodService moods) {
        this.moods = moods;
    }

    @GetMapping
    public ApiResponse<List<MoodEntryPayload>> list(@RequestParam String patientId) {
        return ApiResponse.ok("Mood entries loaded", moods.list(patientId));
    }

    @PostMapping
    public ApiResponse<MoodEntryPayload> save(@Valid @RequestBody MoodEntryRequest request) {
        return ApiResponse.ok("Mood check-in saved", moods.saveFromRequest(request));
    }
}

