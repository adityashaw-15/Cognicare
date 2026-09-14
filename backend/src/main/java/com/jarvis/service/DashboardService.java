package com.jarvis.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.jarvis.dto.Payloads.DashboardPayload;
import com.jarvis.entity.GameResult;
import com.jarvis.entity.Patient;
import com.jarvis.exception.ApiException;
import com.jarvis.repository.CaregiverAlertRepository;
import com.jarvis.repository.CaregiverRepository;
import com.jarvis.repository.DailyActivityRepository;
import com.jarvis.repository.GameResultRepository;
import com.jarvis.repository.HealthcareWorkerRepository;
import com.jarvis.repository.MoodEntryRepository;
import com.jarvis.repository.PatientRepository;
import com.jarvis.repository.ReminderRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DashboardService {
    private final PatientRepository patients;
    private final CaregiverRepository caregivers;
    private final HealthcareWorkerRepository workers;
    private final ReminderRepository reminders;
    private final DailyActivityRepository activities;
    private final MoodEntryRepository moods;
    private final GameResultRepository results;
    private final CaregiverAlertRepository alerts;
    private final PatientService patientService;

    public DashboardService(
            PatientRepository patients,
            CaregiverRepository caregivers,
            HealthcareWorkerRepository workers,
            ReminderRepository reminders,
            DailyActivityRepository activities,
            MoodEntryRepository moods,
            GameResultRepository results,
            CaregiverAlertRepository alerts,
            PatientService patientService) {
        this.patients = patients;
        this.caregivers = caregivers;
        this.workers = workers;
        this.reminders = reminders;
        this.activities = activities;
        this.moods = moods;
        this.results = results;
        this.alerts = alerts;
        this.patientService = patientService;
    }

    @Transactional(readOnly = true)
    public DashboardPayload patientDashboard(String patientId) {
        Patient patient = patientService.getPatientEntity(patientId);
        return dashboardForPatients(List.of(patient), patientId);
    }

    @Transactional(readOnly = true)
    public DashboardPayload caregiverDashboard(String caregiverId) {
        var caregiver = caregivers.findById(caregiverId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "CAREGIVER_NOT_FOUND", "Caregiver not found"));
        List<Patient> authorized = caregiver.getPatients().stream().toList();
        String focusPatientId = authorized.isEmpty() ? null : authorized.get(0).getId();
        return dashboardForPatients(authorized, focusPatientId);
    }

    @Transactional(readOnly = true)
    public DashboardPayload healthcareDashboard(String workerId) {
        var worker = workers.findById(workerId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "WORKER_NOT_FOUND", "Healthcare profile not found"));
        List<Patient> authorized = worker.getPatients().isEmpty() ? patients.findAll() : worker.getPatients().stream().toList();
        String focusPatientId = authorized.isEmpty() ? null : authorized.get(0).getId();
        return dashboardForPatients(authorized, focusPatientId);
    }

    private DashboardPayload dashboardForPatients(List<Patient> patientList, String focusPatientId) {
        if (patientList.isEmpty() || focusPatientId == null) {
            return new DashboardPayload(List.of(), List.of(), List.of(), List.of(), List.of(), List.of(),
                    null, Map.of());
        }
        return new DashboardPayload(
                patientList.stream().map(JarvisMapper::patient).toList(),
                results.findTop12ByPatientIdOrderByCreatedAtDesc(focusPatientId).stream().map(JarvisMapper::gameResult).toList(),
                reminders.findByPatientIdOrderByDateAscTimeAsc(focusPatientId).stream().map(JarvisMapper::reminder).toList(),
                moods.findByPatientIdOrderByEntryDateDesc(focusPatientId).stream().map(JarvisMapper::mood).toList(),
                activities.findByPatientIdOrderByTimeAsc(focusPatientId).stream().map(JarvisMapper::activity).toList(),
                alerts.findTop8ByPatientIdOrderByGeneratedAtDesc(focusPatientId).stream().map(JarvisMapper::alert).toList(),
                patientService.progress(focusPatientId),
                trend(focusPatientId));
    }

    private Map<String, Integer> trend(String patientId) {
        List<GameResult> recent = results.findByPatientIdOrderByCreatedAtDesc(patientId);
        Map<String, Integer> trend = new LinkedHashMap<>();
        LocalDate today = LocalDate.now();
        for (int i = 4; i >= 0; i--) {
            LocalDate day = today.minusDays(i);
            int score = recent.stream()
                    .filter(result -> result.getCreatedAt() != null
                            && LocalDate.ofInstant(result.getCreatedAt(), java.time.ZoneId.systemDefault()).equals(day))
                    .mapToInt(GameResult::getScore)
                    .findFirst()
                    .orElse(62 + (4 - i) * 5);
            DayOfWeek dayOfWeek = day.getDayOfWeek();
            trend.put(dayOfWeek.toString().substring(0, 3), Math.min(100, score));
        }
        return trend;
    }
}

