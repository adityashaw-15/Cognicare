package com.jarvis.controller;

import java.util.List;

import com.jarvis.dto.ApiResponse;
import com.jarvis.dto.Payloads.GamePayload;
import com.jarvis.dto.Payloads.GameResultPayload;
import com.jarvis.dto.Payloads.GameResultRequest;
import com.jarvis.dto.Payloads.GameSessionPayload;
import com.jarvis.dto.Payloads.GameSessionRequest;
import com.jarvis.service.GameService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class GameController {
    private final GameService games;

    public GameController(GameService games) {
        this.games = games;
    }

    @GetMapping("/games")
    public ApiResponse<List<GamePayload>> list() {
        return ApiResponse.ok("Games loaded", games.listGames());
    }

    @PostMapping("/game-sessions")
    public ApiResponse<GameSessionPayload> start(@Valid @RequestBody GameSessionRequest request) {
        return ApiResponse.ok("Game session started", games.startSession(request));
    }

    @PostMapping("/game-results")
    public ApiResponse<GameResultPayload> result(@Valid @RequestBody GameResultRequest request) {
        return ApiResponse.ok("Game result saved", games.submitResult(request));
    }

    @GetMapping("/patients/{patientId}/game-results")
    public ApiResponse<List<GameResultPayload>> results(@PathVariable String patientId) {
        return ApiResponse.ok("Game results loaded", games.listResults(patientId));
    }
}

