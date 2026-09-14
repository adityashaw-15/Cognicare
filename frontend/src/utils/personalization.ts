import { GameResult } from '../types/models';

export function difficultyLabel(level: number) {
  const safe = Math.max(1, Math.min(5, Math.round(level)));
  return ['Beginner', 'Easy', 'Moderate', 'Advanced', 'Challenging'][safe - 1];
}

export function calculateNextDifficulty(
  currentDifficulty: number,
  accuracy: number,
  responseTimeSeconds: number,
  attempts: number,
  history: GameResult[] = []
) {
  const recentAverage = history.length
    ? history.reduce((sum, result) => sum + result.accuracy, 0) / history.length
    : accuracy;
  let next = Math.max(1, Math.min(5, currentDifficulty));
  if (accuracy >= 85 && responseTimeSeconds <= 45 && attempts <= 4 && recentAverage >= 75) {
    next += 1;
  } else if (accuracy < 50 || attempts >= 9) {
    next -= 1;
  }
  return Math.max(1, Math.min(5, next));
}

export function recommendationFor(level: number, accuracy: number, responseTimeSeconds: number, attempts: number) {
  if (accuracy >= 85 && responseTimeSeconds <= 45 && attempts <= 4 && level < 5) {
    return 'Your recent performance is strong. Would you like to try a slightly harder memory activity?';
  }
  if (accuracy < 50 || attempts >= 9) {
    return 'A calmer activity may feel better next. CogniCare will make the next round gentler.';
  }
  return 'You are building a steady routine. CogniCare will keep the next activity at a comfortable level.';
}

