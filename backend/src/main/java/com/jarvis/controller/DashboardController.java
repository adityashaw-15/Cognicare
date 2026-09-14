package com.jarvis.controller;

import com.jarvis.dto.ApiResponse;
import com.jarvis.dto.Payloads.DashboardPayload;
import com.jarvis.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class DashboardController {
    private final DashboardService dashboards;

    public DashboardController(DashboardService dashboards) {
        this.dashboards = dashboards;
    }

    @GetMapping("/patient/dashboard/{id}")
    public ApiResponse<DashboardPayload> patient(@PathVariable String id) {
        return ApiResponse.ok("Patient dashboard loaded", dashboards.patientDashboard(id));
    }

    @GetMapping("/caregiver/dashboard/{id}")
    public ApiResponse<DashboardPayload> caregiver(@PathVariable String id) {
        return ApiResponse.ok("Patient Activity Overview", dashboards.caregiverDashboard(id));
    }

    @GetMapping("/healthcare/dashboard/{id}")
    public ApiResponse<DashboardPayload> healthcare(@PathVariable String id) {
        return ApiResponse.ok("Observed activity trends loaded", dashboards.healthcareDashboard(id));
    }
}

