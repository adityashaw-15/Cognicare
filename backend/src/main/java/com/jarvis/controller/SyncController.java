package com.jarvis.controller;

import java.time.Instant;
import java.util.List;

import com.jarvis.dto.ApiResponse;
import com.jarvis.dto.Payloads.SyncPullResponse;
import com.jarvis.dto.Payloads.SyncPushRequest;
import com.jarvis.dto.Payloads.SyncPushResult;
import com.jarvis.sync.SyncService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sync")
public class SyncController {
    private final SyncService sync;

    public SyncController(SyncService sync) {
        this.sync = sync;
    }

    @PostMapping("/push")
    public ApiResponse<List<SyncPushResult>> push(@Valid @RequestBody SyncPushRequest request) {
        return ApiResponse.ok("Sync push processed", sync.push(request.operations()));
    }

    @GetMapping("/pull")
    public ApiResponse<SyncPullResponse> pull(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant since) {
        return ApiResponse.ok("Sync pull processed", sync.pull(since));
    }
}

