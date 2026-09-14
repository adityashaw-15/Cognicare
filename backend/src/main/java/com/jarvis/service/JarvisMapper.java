package com.jarvis.service;

import com.jarvis.dto.Payloads.AlertPayload;
import com.jarvis.dto.Payloads.DailyActivityPayload;
import com.jarvis.dto.Payloads.GamePayload;
import com.jarvis.dto.Payloads.GameResultPayload;
import com.jarvis.dto.Payloads.GameSessionPayload;
import com.jarvis.dto.Payloads.MemoryPayload;
import com.jarvis.dto.Payloads.MoodEntryPayload;
import com.jarvis.dto.Payloads.PatientPayload;
import com.jarvis.dto.Payloads.ReminderPayload;
import com.jarvis.entity.CaregiverAlert;
import com.jarvis.entity.CognitiveGame;
import com.jarvis.entity.DailyActivity;
import com.jarvis.entity.GameResult;
import com.jarvis.entity.GameSession;
import com.jarvis.entity.Memory;
import com.jarvis.entity.MoodEntry;
import com.jarvis.entity.Patient;
import com.jarvis.entity.Reminder;

public final class JarvisMapper {
    private JarvisMapper() {
    }

    public static PatientPayload patient(Patient patient) {
        return new PatientPayload(
                patient.getId(),
                patient.getUser().getDisplayName(),
                patient.getAge(),
                patient.getCity(),
                patient.getPreferredLanguage(),
                patient.getDifficultyLevel(),
                patient.isOnline(),
                patient.getCareNotes(),
                patient.getUpdatedAt());
    }

    public static MemoryPayload memory(Memory memory) {
        return new MemoryPayload(
                memory.getId(),
                memory.getPatient().getId(),
                memory.getCategory() == null ? null : memory.getCategory().getId(),
                memory.getCategory() == null ? null : memory.getCategory().getName(),
                memory.getPersonName(),
                memory.getRelationship(),
                memory.getPlaceName(),
                memory.getEventName(),
                memory.getFavoriteObject(),
                memory.getFavoriteFood(),
                memory.getFavoriteSong(),
                memory.getImportantDate(),
                memory.getImageUrl(),
                memory.getNote(),
                memory.getPromptSeed(),
                memory.getUpdatedAt());
    }

    public static ReminderPayload reminder(Reminder reminder) {
        return new ReminderPayload(
                reminder.getId(),
                reminder.getPatient().getId(),
                reminder.getTitle(),
                reminder.getDescription(),
                reminder.getDate(),
                reminder.getTime(),
                reminder.getCategory(),
                reminder.getPriority(),
                reminder.isCompleted(),
                reminder.getRepeatRule(),
                reminder.getUpdatedAt());
    }

    public static GamePayload game(CognitiveGame game) {
        return new GamePayload(
                game.getId(),
                game.getName(),
                game.getType(),
                game.getDescription(),
                game.getSuggestedDifficulty());
    }

    public static GameSessionPayload gameSession(GameSession session) {
        return new GameSessionPayload(
                session.getId(),
                session.getPatient().getId(),
                session.getGame().getId(),
                session.getStartedAt(),
                session.getCompletedAt(),
                session.getDifficulty(),
                session.getStatus());
    }

    public static GameResultPayload gameResult(GameResult result) {
        return new GameResultPayload(
                result.getId(),
                result.getPatient().getId(),
                result.getGameSession().getGame().getId(),
                result.getGameSession().getGame().getName(),
                result.getGameSession().getId(),
                result.getClientOperationId(),
                result.getAccuracy(),
                result.getResponseTimeSeconds(),
                result.getAttempts(),
                result.getScore(),
                result.getHintsUsed(),
                result.getDifficulty(),
                result.getSessionDurationSeconds(),
                result.getSummary(),
                result.getCreatedAt(),
                result.getUpdatedAt());
    }

    public static MoodEntryPayload mood(MoodEntry entry) {
        return new MoodEntryPayload(
                entry.getId(),
                entry.getPatient().getId(),
                entry.getClientOperationId(),
                entry.getEntryDate(),
                entry.getMood(),
                entry.getNote(),
                entry.getUpdatedAt());
    }

    public static DailyActivityPayload activity(DailyActivity activity) {
        return new DailyActivityPayload(
                activity.getId(),
                activity.getPatient().getId(),
                activity.getTitle(),
                activity.getTime(),
                activity.getCategory(),
                activity.isCompleted(),
                activity.getUpdatedAt());
    }

    public static AlertPayload alert(CaregiverAlert alert) {
        return new AlertPayload(
                alert.getId(),
                alert.getPatient().getId(),
                alert.getMessage(),
                alert.getSeverity(),
                alert.isResolved(),
                alert.getGeneratedAt(),
                alert.getUpdatedAt());
    }
}

