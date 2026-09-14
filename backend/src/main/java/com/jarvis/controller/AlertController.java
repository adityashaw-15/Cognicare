package com.jarvis.controller;

import java.util.List;

import com.jarvis.dto.ApiResponse;
import com.jarvis.dto.Payloads.AlertPayload;
import com.jarvis.service.AlertService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {
    private final AlertService alerts;

    public AlertController(AlertService alerts) {
        this.alerts = alerts;
    }

    @GetMapping
    public ApiResponse<List<AlertPayload>> list(@RequestParam String patientId) {
        return ApiResponse.ok("Alerts loaded", alerts.list(patientId));
    }
}

