package com.jarvis.sync;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jarvis.dto.Payloads.DailyActivityRequest;
import com.jarvis.dto.Payloads.GameResultRequest;
import com.jarvis.dto.Payloads.MemoryRequest;
import com.jarvis.dto.Payloads.MoodEntryRequest;
import com.jarvis.dto.Payloads.ReminderRequest;
import com.jarvis.dto.Payloads.SyncOperationRequest;
import com.jarvis.dto.Payloads.SyncPullResponse;
import com.jarvis.dto.Payloads.SyncPushResult;
import com.jarvis.entity.SyncRecord;
import com.jarvis.exception.ApiException;
import com.jarvis.repository.CaregiverAlertRepository;
import com.jarvis.repository.CognitiveGameRepository;
import com.jarvis.repository.DailyActivityRepository;
import com.jarvis.repository.GameResultRepository;
import com.jarvis.repository.MemoryRepository;
import com.jarvis.repository.MoodEntryRepository;
import com.jarvis.repository.PatientRepository;
import com.jarvis.repository.ReminderRepository;
import com.jarvis.repository.SyncRecordRepository;
import com.jarvis.service.DailyActivityService;
import com.jarvis.service.GameService;
import com.jarvis.service.JarvisMapper;
import com.jarvis.service.MemoryService;
import com.jarvis.service.MoodService;
import com.jarvis.service.PatientService;
import com.jarvis.service.ReminderService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SyncService {
    private final SyncRecordRepository syncRecords;
    private final PatientRepository patients;
    private final MemoryRepository memories;
    private final CognitiveGameRepository games;
    private final GameResultRepository gameResults;
    private final ReminderRepository reminders;
    private final MoodEntryRepository moods;
    private final DailyActivityRepository activities;
    private final CaregiverAlertRepository alerts;
    private final MemoryService memoryService;
    private final ReminderService reminderService;
    private final GameService gameService;
    private final MoodService moodService;
    private final DailyActivityService activityService;
    private final PatientService patientService;
    private final ObjectMapper mapper;

    public SyncService(
            SyncRecordRepository syncRecords,
            PatientRepository patients,
            MemoryRepository memories,
            CognitiveGameRepository games,
            GameResultRepository gameResults,
            ReminderRepository reminders,
            MoodEntryRepository moods,
            DailyActivityRepository activities,
            CaregiverAlertRepository alerts,
            MemoryService memoryService,
            ReminderService reminderService,
            GameService gameService,
            MoodService moodService,
            DailyActivityService activityService,
            PatientService patientService,
            ObjectMapper mapper) {
        this.syncRecords = syncRecords;
        this.patients = patients;
        this.memories = memories;
        this.games = games;
        this.gameResults = gameResults;
        this.reminders = reminders;
        this.moods = moods;
        this.activities = activities;
        this.alerts = alerts;
        this.memoryService = memoryService;
        this.reminderService = reminderService;
        this.gameService = gameService;
        this.moodService = moodService;
        this.activityService = activityService;
        this.patientService = patientService;
        this.mapper = mapper;
    }

    @Transactional
    public List<SyncPushResult> push(List<SyncOperationRequest> operations) {
        List<SyncPushResult> results = new ArrayList<>();
        for (SyncOperationRequest operation : operations.stream()
                .sorted(Comparator.comparing(SyncOperationRequest::timestamp))
                .toList()) {
            var existing = syncRecords.findByOperationId(operation.operationId());
            if (existing.isPresent()) {
                results.add(new SyncPushResult(operation.operationId(), operation.entityType(), operation.entityId(),
                        "ALREADY_APPLIED", "Operation was already synchronized"));
                continue;
            }
            try {
                apply(operation);
                saveRecord(operation, "APPLIED");
                results.add(new SyncPushResult(operation.operationId(), operation.entityType(), operation.entityId(),
                        "APPLIED", "Synchronized"));
            } catch (ApiException ex) {
                saveRecord(operation, "REJECTED");
                results.add(new SyncPushResult(operation.operationId(), operation.entityType(), operation.entityId(),
                        "REJECTED", ex.getMessage()));
            } catch (Exception ex) {
                saveRecord(operation, "FAILED");
                results.add(new SyncPushResult(operation.operationId(), operation.entityType(), operation.entityId(),
                        "FAILED", "Could not safely apply operation"));
            }
        }
        return results;
    }

    @Transactional(readOnly = true)
    public SyncPullResponse pull(Instant since) {
        Instant threshold = since == null ? Instant.EPOCH : since;
        return new SyncPullResponse(
                Instant.now(),
                patients.findAll().stream()
                        .filter(patient -> patient.getUpdatedAt() == null || patient.getUpdatedAt().isAfter(threshold))
                        .map(JarvisMapper::patient)
                        .toList(),
                memories.findByUpdatedAtAfterOrderByUpdatedAtAsc(threshold).stream().map(JarvisMapper::memory).toList(),
                games.findByActiveTrueOrderByNameAsc().stream().map(JarvisMapper::game).toList(),
                gameResults.findByUpdatedAtAfterOrderByUpdatedAtAsc(threshold).stream().map(JarvisMapper::gameResult).toList(),
                reminders.findByUpdatedAtAfterOrderByUpdatedAtAsc(threshold).stream().map(JarvisMapper::reminder).toList(),
                moods.findByUpdatedAtAfterOrderByUpdatedAtAsc(threshold).stream().map(JarvisMapper::mood).toList(),
                activities.findByUpdatedAtAfterOrderByUpdatedAtAsc(threshold).stream().map(JarvisMapper::activity).toList(),
                alerts.findByUpdatedAtAfterOrderByUpdatedAtAsc(threshold).stream().map(JarvisMapper::alert).toList());
    }

    private void apply(SyncOperationRequest operation) throws JsonProcessingException {
        String type = normalized(operation.entityType());
        String action = operation.operation().trim().toUpperCase(Locale.ROOT);
        if ("DELETE".equals(action)) {
            delete(type, operation.entityId());
            return;
        }
        switch (type) {
            case "MEMORY" -> memoryService.saveFromRequest(mapper.treeToValue(operation.payload(), MemoryRequest.class));
            case "REMINDER" -> reminderService.saveFromRequest(mapper.treeToValue(operation.payload(), ReminderRequest.class));
            case "GAMERESULT" -> gameService.submitResult(mapper.treeToValue(operation.payload(), GameResultRequest.class));
            case "MOODENTRY" -> moodService.saveFromRequest(mapper.treeToValue(operation.payload(), MoodEntryRequest.class));
            case "DAILYACTIVITY" -> activityService.saveFromRequest(mapper.treeToValue(operation.payload(), DailyActivityRequest.class));
            case "PATIENT" -> {
                String language = operation.payload().path("preferredLanguage").asText(null);
                Integer difficulty = operation.payload().has("difficultyLevel")
                        ? operation.payload().path("difficultyLevel").asInt()
                        : null;
                patientService.updatePreferences(operation.entityId(), language, difficulty);
            }
            default -> throw new ApiException(HttpStatus.BAD_REQUEST, "UNSUPPORTED_SYNC_ENTITY", "Unsupported sync entity");
        }
    }

    private void delete(String normalizedType, String entityId) {
        switch (normalizedType) {
            case "MEMORY" -> memoryService.delete(entityId);
            case "REMINDER" -> reminderService.delete(entityId);
            default -> throw new ApiException(HttpStatus.BAD_REQUEST, "UNSUPPORTED_SYNC_DELETE", "Delete is not supported for that entity");
        }
    }

    private String normalized(String raw) {
        return raw == null ? "" : raw.replace("_", "").replace("-", "").trim().toUpperCase(Locale.ROOT);
    }

    private void saveRecord(SyncOperationRequest operation, String status) {
        SyncRecord record = new SyncRecord();
        record.setOperationId(operation.operationId());
        record.setEntityType(operation.entityType());
        record.setEntityId(operation.entityId());
        record.setOperation(operation.operation());
        record.setRequestedAt(operation.timestamp());
        record.setAppliedAt(Instant.now());
        record.setSyncStatus(status);
        record.setPayloadJson(operation.payload().toString());
        syncRecords.save(record);
    }
}

