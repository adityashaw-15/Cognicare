package com.jarvis.service;

import java.util.List;

import com.jarvis.dto.Payloads.DailyActivityPayload;
import com.jarvis.dto.Payloads.DailyActivityRequest;
import com.jarvis.entity.DailyActivity;
import com.jarvis.exception.ApiException;
import com.jarvis.repository.DailyActivityRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DailyActivityService {
    private final DailyActivityRepository activities;
    private final PatientService patients;

    public DailyActivityService(DailyActivityRepository activities, PatientService patients) {
        this.activities = activities;
        this.patients = patients;
    }

    @Transactional(readOnly = true)
    public List<DailyActivityPayload> list(String patientId) {
        return activities.findByPatientIdOrderByTimeAsc(patientId).stream()
                .map(JarvisMapper::activity)
                .toList();
    }

    @Transactional
    public DailyActivityPayload saveFromRequest(DailyActivityRequest request) {
        DailyActivity activity = request.id() == null || request.id().isBlank()
                ? new DailyActivity()
                : activities.findById(request.id()).orElseGet(DailyActivity::new);
        if (request.id() != null && !request.id().isBlank()) {
            activity.setId(request.id());
        }
        activity.setPatient(patients.getPatientEntity(request.patientId()));
        activity.setTitle(request.title());
        activity.setTime(request.time());
        activity.setCategory(request.category());
        activity.setCompleted(request.completed());
        return JarvisMapper.activity(activities.save(activity));
    }

    @Transactional
    public DailyActivityPayload complete(String id) {
        DailyActivity activity = activities.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "ACTIVITY_NOT_FOUND", "Activity not found"));
        activity.setCompleted(true);
        return JarvisMapper.activity(activities.save(activity));
    }
}

