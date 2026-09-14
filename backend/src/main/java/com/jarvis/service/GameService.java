package com.jarvis.service;

import java.time.Instant;
import java.util.List;

import com.jarvis.dto.Payloads.GamePayload;
import com.jarvis.dto.Payloads.GameResultPayload;
import com.jarvis.dto.Payloads.GameResultRequest;
import com.jarvis.dto.Payloads.GameSessionPayload;
import com.jarvis.dto.Payloads.GameSessionRequest;
import com.jarvis.entity.CognitiveGame;
import com.jarvis.entity.GameResult;
import com.jarvis.entity.GameSession;
import com.jarvis.entity.Patient;
import com.jarvis.exception.ApiException;
import com.jarvis.repository.CognitiveGameRepository;
import com.jarvis.repository.GameResultRepository;
import com.jarvis.repository.GameSessionRepository;
import com.jarvis.repository.PatientRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GameService {
    private final CognitiveGameRepository games;
    private final GameSessionRepository sessions;
    private final GameResultRepository results;
    private final PatientService patients;
    private final PatientRepository patientRepository;
    private final PersonalizationService personalization;

    public GameService(
            CognitiveGameRepository games,
            GameSessionRepository sessions,
            GameResultRepository results,
            PatientService patients,
            PatientRepository patientRepository,
            PersonalizationService personalization) {
        this.games = games;
        this.sessions = sessions;
        this.results = results;
        this.patients = patients;
        this.patientRepository = patientRepository;
        this.personalization = personalization;
    }

    @Transactional(readOnly = true)
    public List<GamePayload> listGames() {
        return games.findByActiveTrueOrderByNameAsc().stream().map(JarvisMapper::game).toList();
    }

    @Transactional
    public GameSessionPayload startSession(GameSessionRequest request) {
        Patient patient = patients.getPatientEntity(request.patientId());
        CognitiveGame game = getGame(request.gameId());
        GameSession session = new GameSession();
        session.setPatient(patient);
        session.setGame(game);
        session.setDifficulty(request.difficulty());
        session.setStartedAt(Instant.now());
        session.setStatus("STARTED");
        return JarvisMapper.gameSession(sessions.save(session));
    }

    @Transactional
    public GameResultPayload submitResult(GameResultRequest request) {
        if (request.clientOperationId() != null && !request.clientOperationId().isBlank()) {
            var existing = results.findByClientOperationId(request.clientOperationId());
            if (existing.isPresent()) {
                return JarvisMapper.gameResult(existing.get());
            }
        }

        Patient patient = patients.getPatientEntity(request.patientId());
        CognitiveGame game = getGame(request.gameId());
        GameSession session = resolveSession(request, patient, game);
        session.setCompletedAt(Instant.now());
        session.setStatus("COMPLETED");

        List<GameResult> history = results.findTop12ByPatientIdOrderByCreatedAtDesc(patient.getId());
        int nextDifficulty = personalization.nextDifficulty(patient.getDifficultyLevel(), request.accuracy(),
                request.responseTimeSeconds(), request.attempts(), history);
        String recommendation = personalization.recommendation(nextDifficulty, request.accuracy(),
                request.responseTimeSeconds(), request.attempts());
        patient.setDifficultyLevel(nextDifficulty);

        GameResult result = new GameResult();
        result.setId(request.clientOperationId() == null || request.clientOperationId().isBlank()
                ? null
                : "result-" + request.clientOperationId());
        result.setPatient(patient);
        result.setGameSession(session);
        result.setClientOperationId(request.clientOperationId());
        result.setAccuracy(request.accuracy());
        result.setResponseTimeSeconds(request.responseTimeSeconds());
        result.setAttempts(request.attempts());
        result.setScore(request.score());
        result.setHintsUsed(request.hintsUsed());
        result.setDifficulty(request.difficulty());
        result.setSessionDurationSeconds(request.sessionDurationSeconds());
        result.setSummary(recommendation + " Next level: " + personalization.labelFor(nextDifficulty) + ".");

        patientRepository.save(patient);
        sessions.save(session);
        return JarvisMapper.gameResult(results.save(result));
    }

    @Transactional(readOnly = true)
    public List<GameResultPayload> listResults(String patientId) {
        return results.findByPatientIdOrderByCreatedAtDesc(patientId).stream()
                .map(JarvisMapper::gameResult)
                .toList();
    }

    private GameSession resolveSession(GameResultRequest request, Patient patient, CognitiveGame game) {
        if (request.sessionId() != null && !request.sessionId().isBlank()) {
            return sessions.findById(request.sessionId())
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "GAME_SESSION_NOT_FOUND", "Game session not found"));
        }
        GameSession session = new GameSession();
        session.setPatient(patient);
        session.setGame(game);
        session.setDifficulty(request.difficulty());
        session.setStartedAt(Instant.now().minusSeconds(Math.max(1, request.sessionDurationSeconds())));
        return session;
    }

    private CognitiveGame getGame(String id) {
        return games.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "GAME_NOT_FOUND", "Game not found"));
    }
}

