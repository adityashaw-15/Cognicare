package com.jarvis.service;

import java.time.Instant;
import java.util.List;

import com.jarvis.dto.Payloads.CompleteReminderRequest;
import com.jarvis.dto.Payloads.ReminderPayload;
import com.jarvis.dto.Payloads.ReminderRequest;
import com.jarvis.entity.CaregiverAlert;
import com.jarvis.entity.Reminder;
import com.jarvis.entity.ReminderCompletion;
import com.jarvis.exception.ApiException;
import com.jarvis.repository.CaregiverAlertRepository;
import com.jarvis.repository.ReminderCompletionRepository;
import com.jarvis.repository.ReminderRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReminderService {
    private final ReminderRepository reminders;
    private final ReminderCompletionRepository completions;
    private final CaregiverAlertRepository alerts;
    private final PatientService patients;

    public ReminderService(
            ReminderRepository reminders,
            ReminderCompletionRepository completions,
            CaregiverAlertRepository alerts,
            PatientService patients) {
        this.reminders = reminders;
        this.completions = completions;
        this.alerts = alerts;
        this.patients = patients;
    }

    @Transactional(readOnly = true)
    public List<ReminderPayload> list(String patientId) {
        return reminders.findByPatientIdOrderByDateAscTimeAsc(patientId).stream()
                .map(JarvisMapper::reminder)
                .toList();
    }

    @Transactional
    public ReminderPayload saveFromRequest(ReminderRequest request) {
        Reminder reminder = request.id() == null || request.id().isBlank()
                ? new Reminder()
                : reminders.findById(request.id()).orElseGet(Reminder::new);
        if (request.id() != null && !request.id().isBlank()) {
            reminder.setId(request.id());
        }
        reminder.setPatient(patients.getPatientEntity(request.patientId()));
        reminder.setTitle(request.title());
        reminder.setDescription(request.description());
        reminder.setDate(request.date());
        reminder.setTime(request.time());
        reminder.setCategory(request.category());
        reminder.setPriority(request.priority());
        reminder.setCompleted(request.completed());
        reminder.setRepeatRule(request.repeatRule() == null ? "none" : request.repeatRule());
        return JarvisMapper.reminder(reminders.save(reminder));
    }

    @Transactional
    public ReminderPayload complete(String reminderId, CompleteReminderRequest request) {
        if (request.clientOperationId() != null && !request.clientOperationId().isBlank()) {
            var existing = completions.findByClientOperationId(request.clientOperationId());
            if (existing.isPresent()) {
                return JarvisMapper.reminder(existing.get().getReminder());
            }
        }
        Reminder reminder = getReminder(reminderId);
        String action = request.action().trim().toUpperCase();
        if ("DONE".equals(action)) {
            reminder.setCompleted(true);
        } else if ("SNOOZE".equals(action)) {
            reminder.setCompleted(false);
            reminder.setTime(reminder.getTime().plusMinutes(15));
        } else if ("SKIP".equals(action)) {
            reminder.setCompleted(false);
            createAlert(reminder, "Reminder skipped: " + reminder.getTitle(), "WARNING");
        } else {
            throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_REMINDER_ACTION", "Use Done, Snooze, or Skip");
        }

        ReminderCompletion completion = new ReminderCompletion();
        completion.setReminder(reminder);
        completion.setPatient(reminder.getPatient());
        completion.setAction(action);
        completion.setNote(request.note());
        completion.setCompletedAt(Instant.now());
        completion.setClientOperationId(request.clientOperationId());
        completions.save(completion);
        return JarvisMapper.reminder(reminders.save(reminder));
    }

    @Transactional
    public void delete(String id) {
        if (!reminders.existsById(id)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "REMINDER_NOT_FOUND", "Reminder not found");
        }
        reminders.deleteById(id);
    }

    private Reminder getReminder(String id) {
        return reminders.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "REMINDER_NOT_FOUND", "Reminder not found"));
    }

    private void createAlert(Reminder reminder, String message, String severity) {
        CaregiverAlert alert = new CaregiverAlert();
        alert.setPatient(reminder.getPatient());
        alert.setMessage(message);
        alert.setSeverity(severity);
        alert.setGeneratedAt(Instant.now());
        alerts.save(alert);
    }
}

