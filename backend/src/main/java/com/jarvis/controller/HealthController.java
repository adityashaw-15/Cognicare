package com.jarvis.controller;

import java.time.Instant;
import java.util.Map;

import com.jarvis.dto.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HealthController {
    @GetMapping("/health")
    public ApiResponse<Map<String, Object>> health() {
        return ApiResponse.ok("CogniCare API is available", Map.of(
                "service", "cognicare-care-api",
                "status", "UP",
                "serverTime", Instant.now()));
    }
}

