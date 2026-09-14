package com.jarvis.service;

import java.util.Comparator;
import java.util.List;

import com.jarvis.dto.Payloads.PatientPayload;
import com.jarvis.dto.Payloads.ProgressSummary;
import com.jarvis.entity.GameResult;
import com.jarvis.entity.Patient;
import com.jarvis.exception.ApiException;
import com.jarvis.repository.DailyActivityRepository;
import com.jarvis.repository.GameResultRepository;
import com.jarvis.repository.MoodEntryRepository;
import com.jarvis.repository.PatientRepository;
import com.jarvis.repository.ReminderRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PatientService {
    private final PatientRepository patients;
    private final ReminderRepository reminders;
    private final DailyActivityRepository activities;
    private final MoodEntryRepository moods;
    private final GameResultRepository gameResults;
    private final PersonalizationService personalization;

    public PatientService(
            PatientRepository patients,
            ReminderRepository reminders,
            DailyActivityRepository activities,
            MoodEntryRepository moods,
            GameResultRepository gameResults,
            PersonalizationService personalization) {
        this.patients = patients;
        this.reminders = reminders;
        this.activities = activities;
        this.moods = moods;
        this.gameResults = gameResults;
        this.personalization = personalization;
    }

    @Transactional(readOnly = true)
    public List<PatientPayload> listPatients() {
        return patients.findAll().stream()
                .map(JarvisMapper::patient)
                .toList();
    }

    @Transactional(readOnly = true)
    public PatientPayload getPatient(String id) {
        return JarvisMapper.patient(getPatientEntity(id));
    }

    @Transactional(readOnly = true)
    public ProgressSummary progress(String patientId) {
        Patient patient = getPatientEntity(patientId);
        var patientReminders = reminders.findByPatientIdOrderByDateAscTimeAsc(patientId);
        var patientActivities = activities.findByPatientIdOrderByTimeAsc(patientId);
        var latestMood = moods.findByPatientIdOrderByEntryDateDesc(patientId).stream()
                .findFirst()
                .map(entry -> entry.getMood())
                .orElse("Good");
        List<GameResult> recent = gameResults.findTop12ByPatientIdOrderByCreatedAtDesc(patientId);
        int cognitive = recent.isEmpty()
                ? 72
                : (int) Math.round(recent.stream().mapToDouble(GameResult::getAccuracy).average().orElse(72));
        int routineDone = (int) patientActivities.stream().filter(activity -> activity.isCompleted()).count();
        int remindersDone = (int) patientReminders.stream().filter(reminder -> reminder.isCompleted()).count();
        GameResult latest = recent.stream()
                .max(Comparator.comparing(GameResult::getCreatedAt))
                .orElse(null);
        String recommendation = latest == null
                ? "Let's exercise your memory with a comfortable first activity."
                : personalization.recommendation(patient.getDifficultyLevel(), latest.getAccuracy(),
                        latest.getResponseTimeSeconds(), latest.getAttempts());

        return new ProgressSummary(patientId, cognitive, routineDone, patientActivities.size(),
                remindersDone, patientReminders.size(), latestMood, patient.getDifficultyLevel(), recommendation);
    }

    public Patient getPatientEntity(String id) {
        return patients.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "PATIENT_NOT_FOUND", "Patient not found"));
    }

    @Transactional
    public PatientPayload updatePreferences(String patientId, String language, Integer difficultyLevel) {
        Patient patient = getPatientEntity(patientId);
        if (language != null && !language.isBlank()) {
            patient.setPreferredLanguage(language);
        }
        if (difficultyLevel != null) {
            patient.setDifficultyLevel(Math.max(1, Math.min(5, difficultyLevel)));
        }
        return JarvisMapper.patient(patients.save(patient));
    }
}

