export type Role = 'PATIENT' | 'CAREGIVER' | 'HEALTHCARE_WORKER' | 'ADMIN';
export type SyncStatus = 'PENDING' | 'SYNCED' | 'FAILED';
export type SyncOperationType = 'CREATE' | 'UPDATE' | 'DELETE';
export type GameType =
  | 'MEMORY_MATCHING'
  | 'SEQUENCE_RECALL'
  | 'PATTERN_RECOGNITION'
  | 'OBJECT_RECOGNITION'
  | 'ROUTINE_RECALL'
  | 'ATTENTION';

export interface Patient {
  id: string;
  name: string;
  age: number;
  city: string;
  preferredLanguage: string;
  difficultyLevel: number;
  online: boolean;
  careNotes?: string;
  updatedAt: string;
}

export interface Memory {
  id: string;
  patientId: string;
  categoryId?: string;
  categoryName?: string;
  personName: string;
  relationship?: string;
  placeName?: string;
  eventName?: string;
  favoriteObject?: string;
  favoriteFood?: string;
  favoriteSong?: string;
  importantDate?: string;
  imageUrl?: string;
  note?: string;
  promptSeed?: string;
  updatedAt: string;
}

export interface Reminder {
  id: string;
  patientId: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | string;
  completed: boolean;
  repeatRule: string;
  updatedAt: string;
}

export interface CognitiveGame {
  id: string;
  name: string;
  type: GameType;
  description: string;
  suggestedDifficulty: number;
}

export interface GameResult {
  id: string;
  patientId: string;
  gameId: string;
  gameName?: string;
  sessionId?: string;
  clientOperationId?: string;
  accuracy: number;
  responseTimeSeconds: number;
  attempts: number;
  score: number;
  hintsUsed: number;
  difficulty: number;
  sessionDurationSeconds: number;
  summary: string;
  createdAt: string;
  updatedAt: string;
}

export interface MoodEntry {
  id: string;
  patientId: string;
  clientOperationId?: string;
  entryDate: string;
  mood: 'Good' | 'Okay' | 'Neutral' | 'Low' | 'Very Low' | string;
  note?: string;
  updatedAt: string;
}

export interface DailyActivity {
  id: string;
  patientId: string;
  title: string;
  time: string;
  category: string;
  completed: boolean;
  updatedAt: string;
}

export interface CaregiverAlert {
  id: string;
  patientId: string;
  message: string;
  severity: 'INFO' | 'WARNING' | 'URGENT' | string;
  resolved: boolean;
  generatedAt: string;
  updatedAt: string;
}

export interface ProgressSummary {
  patientId: string;
  cognitiveActivity: number;
  routineCompleted: number;
  routineTotal: number;
  remindersCompleted: number;
  remindersTotal: number;
  mood: string;
  difficultyLevel: number;
  recommendation: string;
}

export interface SyncQueueItem {
  id: string;
  operationId: string;
  entityType: string;
  entityId: string;
  operation: SyncOperationType;
  timestamp: string;
  payload: unknown;
  syncStatus: SyncStatus;
  attempts: number;
  lastError?: string;
}

export interface SyncPullResponse {
  serverTime: string;
  patients: Patient[];
  memories: Memory[];
  games: CognitiveGame[];
  gameResults: GameResult[];
  reminders: Reminder[];
  moodEntries: MoodEntry[];
  activities: DailyActivity[];
  alerts: CaregiverAlert[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  code: string;
  data: T;
  timestamp: string;
}

export interface GameMetrics {
  score: number;
  accuracy: number;
  responseTimeSeconds: number;
  attempts: number;
  hintsUsed: number;
  sessionDurationSeconds: number;
}

export const DEFAULT_PATIENT_ID = 'patient-anjali';
export const DEFAULT_CAREGIVER_ID = 'caregiver-rahul';
export const DEFAULT_WORKER_ID = 'worker-demo';

