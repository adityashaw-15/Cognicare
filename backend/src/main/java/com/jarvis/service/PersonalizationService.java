package com.jarvis.service;

import java.util.List;

import com.jarvis.entity.GameResult;
import org.springframework.stereotype.Service;

@Service
public class PersonalizationService {
    public int nextDifficulty(int currentDifficulty, double accuracy, double responseTimeSeconds, int attempts, List<GameResult> history) {
        int next = Math.max(1, Math.min(5, currentDifficulty));
        double recentAverage = history == null || history.isEmpty()
                ? accuracy
                : history.stream().mapToDouble(GameResult::getAccuracy).average().orElse(accuracy);

        if (accuracy >= 85 && responseTimeSeconds <= 45 && attempts <= 4 && recentAverage >= 75) {
            next += 1;
        } else if (accuracy < 50 || attempts >= 9) {
            next -= 1;
        }
        return Math.max(1, Math.min(5, next));
    }

    public String recommendation(int difficulty, double accuracy, double responseTimeSeconds, int attempts) {
        if (accuracy >= 85 && responseTimeSeconds <= 45 && attempts <= 4 && difficulty < 5) {
            return "Your recent performance is strong. Would you like to try a slightly harder memory activity?";
        }
        if (accuracy < 50 || attempts >= 9) {
            return "A calmer activity may feel better next. JARVIS will make the next round gentler.";
        }
        return "You are building a steady routine. JARVIS will keep the next activity at a comfortable level.";
    }

    public String labelFor(int difficulty) {
        return switch (Math.max(1, Math.min(5, difficulty))) {
            case 1 -> "Beginner";
            case 2 -> "Easy";
            case 3 -> "Moderate";
            case 4 -> "Advanced";
            default -> "Challenging";
        };
    }
}

