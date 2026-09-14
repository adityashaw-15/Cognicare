package com.jarvis.controller;

import java.util.List;

import com.jarvis.dto.ApiResponse;
import com.jarvis.dto.Payloads.CompleteReminderRequest;
import com.jarvis.dto.Payloads.ReminderPayload;
import com.jarvis.dto.Payloads.ReminderRequest;
import com.jarvis.service.ReminderService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ReminderController {
    private final ReminderService reminders;

    public ReminderController(ReminderService reminders) {
        this.reminders = reminders;
    }

    @GetMapping("/reminders")
    public ApiResponse<List<ReminderPayload>> list(@RequestParam String patientId) {
        return ApiResponse.ok("Reminders loaded", reminders.list(patientId));
    }

    @PostMapping("/reminders")
    public ApiResponse<ReminderPayload> create(@Valid @RequestBody ReminderRequest request) {
        return ApiResponse.ok("Reminder saved", reminders.saveFromRequest(request));
    }

    @PutMapping("/reminders/{id}")
    public ApiResponse<ReminderPayload> update(@PathVariable String id, @Valid @RequestBody ReminderRequest request) {
        ReminderRequest withId = new ReminderRequest(id, request.patientId(), request.title(), request.description(),
                request.date(), request.time(), request.category(), request.priority(), request.completed(), request.repeatRule());
        return ApiResponse.ok("Reminder updated", reminders.saveFromRequest(withId));
    }

    @PostMapping("/reminders/{id}/complete")
    public ApiResponse<ReminderPayload> complete(@PathVariable String id, @Valid @RequestBody CompleteReminderRequest request) {
        return ApiResponse.ok("Reminder action saved", reminders.complete(id, request));
    }

    @DeleteMapping("/reminders/{id}")
    public ApiResponse<Void> delete(@PathVariable String id) {
        reminders.delete(id);
        return ApiResponse.ok("Reminder deleted", null);
    }
}

