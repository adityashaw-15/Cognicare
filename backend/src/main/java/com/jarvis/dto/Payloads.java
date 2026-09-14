package com.jarvis.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.JsonNode;
import com.jarvis.entity.Role;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public final class Payloads {
    private Payloads() {
    }

    public record LoginRequest(
            @Email @NotBlank String email,
            @NotBlank String password,
            @NotNull Role role) {
    }

    public record LoginResponse(
            String token,
            Role role,
            String userId,
            String patientId,
            String caregiverId,
            String workerId,
            String displayName) {
    }

    public record PatientPayload(
            String id,
            String name,
            int age,
            String city,
            String preferredLanguage,
            int difficultyLevel,
            boolean online,
            String careNotes,
            Instant updatedAt) {
    }

    public record MemoryRequest(
            String id,
            @NotBlank String patientId,
            String categoryId,
            @NotBlank String personName,
            String relationship,
            String placeName,
            String eventName,
            String favoriteObject,
            String favoriteFood,
            String favoriteSong,
            LocalDate importantDate,
            String imageUrl,
            String note,
            String promptSeed) {
    }

    public record MemoryPayload(
            String id,
            String patientId,
            String categoryId,
            String categoryName,
            String personName,
            String relationship,
            String placeName,
            String eventName,
            String favoriteObject,
            String favoriteFood,
            String favoriteSong,
            LocalDate importantDate,
            String imageUrl,
            String note,
            String promptSeed,
            Instant updatedAt) {
    }

    public record ReminderRequest(
            String id,
            @NotBlank String patientId,
            @NotBlank String title,
            String description,
            @NotNull LocalDate date,
            @NotNull LocalTime time,
            @NotBlank String category,
            @NotBlank String priority,
            boolean completed,
            String repeatRule) {
    }

    public record CompleteReminderRequest(
            @NotBlank String action,
            String note,
            String clientOperationId) {
    }

    public record ReminderPayload(
            String id,
            String patientId,
            String title,
            String description,
            LocalDate date,
            LocalTime time,
            String category,
            String priority,
            boolean completed,
            String repeatRule,
            Instant updatedAt) {
    }

    public record GamePayload(
            String id,
            String name,
            String type,
            String description,
            int suggestedDifficulty) {
    }

    public record GameSessionRequest(
            @NotBlank String patientId,
            @NotBlank String gameId,
            @Min(1) @Max(5) int difficulty) {
    }

    public record GameSessionPayload(
            String id,
            String patientId,
            String gameId,
            Instant startedAt,
            Instant completedAt,
            int difficulty,
            String status) {
    }

    public record GameResultRequest(
            @NotBlank String patientId,
            @NotBlank String gameId,
            String sessionId,
            String clientOperationId,
            @Min(0) @Max(100) double accuracy,
            @Min(0) double responseTimeSeconds,
            @Min(1) int attempts,
            @Min(0) int score,
            @Min(0) int hintsUsed,
            @Min(1) @Max(5) int difficulty,
            @Min(0) int sessionDurationSeconds) {
    }

    public record GameResultPayload(
            String id,
            String patientId,
            String gameId,
            String gameName,
            String sessionId,
            String clientOperationId,
            double accuracy,
            double responseTimeSeconds,
            int attempts,
            int score,
            int hintsUsed,
            int difficulty,
            int sessionDurationSeconds,
            String summary,
            Instant createdAt,
            Instant updatedAt) {
    }

    public record MoodEntryRequest(
            String id,
            @NotBlank String patientId,
            String clientOperationId,
            @NotNull LocalDate entryDate,
            @NotBlank String mood,
            String note) {
    }

    public record MoodEntryPayload(
            String id,
            String patientId,
            String clientOperationId,
            LocalDate entryDate,
            String mood,
            String note,
            Instant updatedAt) {
    }

    public record DailyActivityRequest(
            String id,
            @NotBlank String patientId,
            @NotBlank String title,
            @NotNull LocalTime time,
            @NotBlank String category,
            boolean completed) {
    }

    public record DailyActivityPayload(
            String id,
            String patientId,
            String title,
            LocalTime time,
            String category,
            boolean completed,
            Instant updatedAt) {
    }

    public record AlertPayload(
            String id,
            String patientId,
            String message,
            String severity,
            boolean resolved,
            Instant generatedAt,
            Instant updatedAt) {
    }

    public record ProgressSummary(
            String patientId,
            int cognitiveActivity,
            int routineCompleted,
            int routineTotal,
            int remindersCompleted,
            int remindersTotal,
            String mood,
            int difficultyLevel,
            String recommendation) {
    }

    public record DashboardPayload(
            List<PatientPayload> patients,
            List<GameResultPayload> recentResults,
            List<ReminderPayload> reminders,
            List<MoodEntryPayload> moodEntries,
            List<DailyActivityPayload> activities,
            List<AlertPayload> alerts,
            ProgressSummary progress,
            Map<String, Integer> trend) {
    }

    public record SyncOperationRequest(
            @NotBlank String operationId,
            @NotBlank String entityType,
            @NotBlank String entityId,
            @NotBlank String operation,
            @NotNull Instant timestamp,
            @NotNull JsonNode payload) {
    }

    public record SyncPushRequest(@Valid @NotEmpty List<SyncOperationRequest> operations) {
    }

    public record SyncPushResult(String operationId, String entityType, String entityId, String status, String message) {
    }

    public record SyncPullResponse(
            Instant serverTime,
            List<PatientPayload> patients,
            List<MemoryPayload> memories,
            List<GamePayload> games,
            List<GameResultPayload> gameResults,
            List<ReminderPayload> reminders,
            List<MoodEntryPayload> moodEntries,
            List<DailyActivityPayload> activities,
            List<AlertPayload> alerts) {
    }
}

