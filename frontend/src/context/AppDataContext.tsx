import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { db, seedLocalDemoData } from '../database/db';
import { useConnectivity } from '../hooks/useConnectivity';
import { calculateNextDifficulty, recommendationFor } from '../utils/personalization';
import { markSyncFailure, pendingSyncCount, pullLatest, queueOperation, syncNow } from '../sync/syncManager';
import {
  CaregiverAlert,
  CognitiveGame,
  DailyActivity,
  DEFAULT_PATIENT_ID,
  GameMetrics,
  GameResult,
  Memory,
  MoodEntry,
  Patient,
  ProgressSummary,
  Reminder
} from '../types/models';

const makeId = (prefix: string) => `${prefix}-${globalThis.crypto?.randomUUID?.() ?? Math.random().toString(16).slice(2)}`;

interface AppDataContextValue {
  loading: boolean;
  online: boolean;
  backendOnline: boolean;
  browserOnline: boolean;
  syncMessage: string;
  pendingCount: number;
  patients: Patient[];
  activePatient: Patient;
  memories: Memory[];
  reminders: Reminder[];
  games: CognitiveGame[];
  gameResults: GameResult[];
  moodEntries: MoodEntry[];
  activities: DailyActivity[];
  alerts: CaregiverAlert[];
  progress: ProgressSummary;
  refreshData: () => Promise<void>;
  forceSync: () => Promise<void>;
  addMemory: (memory: Omit<Memory, 'id' | 'updatedAt'>) => Promise<void>;
  completeReminder: (reminderId: string, action: 'DONE' | 'SNOOZE' | 'SKIP') => Promise<void>;
  recordGameResult: (game: CognitiveGame, metrics: GameMetrics) => Promise<GameResult>;
  saveMood: (mood: string, note?: string) => Promise<void>;
  completeActivity: (activityId: string) => Promise<void>;
  updatePatientPreferences: (language: string, difficultyLevel?: number) => Promise<void>;
}

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const connectivity = useConnectivity();
  const [loading, setLoading] = useState(true);
  const [syncMessage, setSyncMessage] = useState('Saved on this device');
  const [pendingCountState, setPendingCountState] = useState(0);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [games, setGames] = useState<CognitiveGame[]>([]);
  const [gameResults, setGameResults] = useState<GameResult[]>([]);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [activities, setActivities] = useState<DailyActivity[]>([]);
  const [alerts, setAlerts] = useState<CaregiverAlert[]>([]);

  const loadLocal = useCallback(async () => {
    await seedLocalDemoData();
    const [patientRows, memoryRows, reminderRows, gameRows, resultRows, moodRows, activityRows, alertRows, queueCount] = await Promise.all([
      db.patients.toArray(),
      db.memories.toArray(),
      db.reminders.toArray(),
      db.games.toArray(),
      db.gameResults.reverse().sortBy('createdAt'),
      db.moodEntries.reverse().sortBy('entryDate'),
      db.activities.orderBy('time').toArray(),
      db.alerts.reverse().sortBy('generatedAt'),
      pendingSyncCount()
    ]);
    setPatients(patientRows);
    setMemories(memoryRows);
    setReminders(reminderRows.sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)));
    setGames(gameRows);
    setGameResults(resultRows);
    setMoodEntries(moodRows);
    setActivities(activityRows);
    setAlerts(alertRows);
    setPendingCountState(queueCount);
  }, []);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      await loadLocal();
      if (connectivity.backendOnline) {
        setSyncMessage('Back online - syncing your data...');
        await pullLatest();
        await loadLocal();
        setSyncMessage('Sync complete.');
      } else {
        setSyncMessage("You're offline. CogniCare is continuing in Local Mode.");
      }
    } finally {
      setLoading(false);
    }
  }, [connectivity.backendOnline, loadLocal]);

  useEffect(() => {
    void refreshData();
  }, [refreshData]);

  const forceSync = useCallback(async () => {
    if (!connectivity.backendOnline) {
      setSyncMessage("You're offline. CogniCare is continuing in Local Mode.");
      return;
    }
    setSyncMessage('Back online - syncing your data...');
    try {
      await syncNow();
      await loadLocal();
      setSyncMessage('Sync complete.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sync failed safely';
      await markSyncFailure(message);
      await loadLocal();
      setSyncMessage('CogniCare is currently in Local Mode. Your data is safe on this device.');
    }
  }, [connectivity.backendOnline, loadLocal]);

  useEffect(() => {
    if (connectivity.backendOnline) {
      void forceSync();
    }
  }, [connectivity.backendOnline, forceSync]);

  const activePatient = patients.find((patient) => patient.id === DEFAULT_PATIENT_ID) ?? patients[0] ?? {
    id: DEFAULT_PATIENT_ID,
    name: 'Anjali Sharma',
    age: 68,
    city: 'Guwahati',
    preferredLanguage: 'en',
    difficultyLevel: 2,
    online: connectivity.online,
    updatedAt: new Date().toISOString()
  };

  const progress = useMemo<ProgressSummary>(() => {
    const patientResults = gameResults.filter((result) => result.patientId === activePatient.id);
    const cognitive = patientResults.length
      ? Math.round(patientResults.reduce((sum, result) => sum + result.accuracy, 0) / patientResults.length)
      : 72;
    const routineRows = activities.filter((activity) => activity.patientId === activePatient.id);
    const reminderRows = reminders.filter((reminder) => reminder.patientId === activePatient.id);
    const mood = moodEntries.find((entry) => entry.patientId === activePatient.id)?.mood ?? 'Good';
    const latest = patientResults[0];
    return {
      patientId: activePatient.id,
      cognitiveActivity: cognitive,
      routineCompleted: routineRows.filter((activity) => activity.completed).length,
      routineTotal: routineRows.length,
      remindersCompleted: reminderRows.filter((reminder) => reminder.completed).length,
      remindersTotal: reminderRows.length,
      mood,
      difficultyLevel: activePatient.difficultyLevel,
      recommendation: latest
        ? recommendationFor(activePatient.difficultyLevel, latest.accuracy, latest.responseTimeSeconds, latest.attempts)
        : "Let's exercise your memory with a comfortable first activity."
    };
  }, [activePatient, activities, gameResults, moodEntries, reminders]);

  const afterLocalMutation = useCallback(async (message = 'Saved on this device') => {
    setSyncMessage(message);
    await loadLocal();
    if (connectivity.backendOnline) {
      await forceSync();
    }
  }, [connectivity.backendOnline, forceSync, loadLocal]);

  const addMemory = useCallback(async (input: Omit<Memory, 'id' | 'updatedAt'>) => {
    const memory: Memory = { ...input, id: makeId('memory'), updatedAt: new Date().toISOString() };
    await db.memories.put(memory);
    await queueOperation('Memory', memory.id, 'CREATE', memory);
    await afterLocalMutation('Saved on this device');
  }, [afterLocalMutation]);

  const completeReminder = useCallback(async (reminderId: string, action: 'DONE' | 'SNOOZE' | 'SKIP') => {
    const reminder = await db.reminders.get(reminderId);
    if (!reminder) {
      return;
    }
    const next: Reminder = {
      ...reminder,
      completed: action === 'DONE',
      time: action === 'SNOOZE' ? addMinutes(reminder.time, 15) : reminder.time,
      updatedAt: new Date().toISOString()
    };
    await db.reminders.put(next);
    if (action === 'SKIP') {
      const alert: CaregiverAlert = {
        id: makeId('alert'),
        patientId: reminder.patientId,
        message: `Reminder skipped: ${reminder.title}.`,
        severity: 'WARNING',
        resolved: false,
        generatedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await db.alerts.put(alert);
    }
    await queueOperation('Reminder', next.id, 'UPDATE', next);
    await afterLocalMutation(action === 'DONE' ? 'Reminder completed and saved on this device' : 'Reminder updated in Local Mode');
  }, [afterLocalMutation]);

  const recordGameResult = useCallback(async (game: CognitiveGame, metrics: GameMetrics) => {
    const operationId = makeId('game-result');
    const nextDifficulty = calculateNextDifficulty(activePatient.difficultyLevel, metrics.accuracy, metrics.responseTimeSeconds, metrics.attempts, gameResults.slice(0, 8));
    const result: GameResult = {
      id: operationId,
      patientId: activePatient.id,
      gameId: game.id,
      gameName: game.name,
      sessionId: makeId('session'),
      clientOperationId: operationId,
      ...metrics,
      difficulty: activePatient.difficultyLevel,
      summary: `${recommendationFor(nextDifficulty, metrics.accuracy, metrics.responseTimeSeconds, metrics.attempts)} Next level: ${nextDifficulty}.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await db.gameResults.put(result);
    const patient: Patient = { ...activePatient, difficultyLevel: nextDifficulty, updatedAt: new Date().toISOString() };
    await db.patients.put(patient);
    await queueOperation('GameResult', result.id, 'CREATE', result);
    await queueOperation('Patient', patient.id, 'UPDATE', patient);
    await afterLocalMutation('Game result saved on this device');
    return result;
  }, [activePatient, afterLocalMutation, gameResults]);

  const saveMood = useCallback(async (mood: string, note?: string) => {
    const entry: MoodEntry = {
      id: makeId('mood'),
      patientId: activePatient.id,
      clientOperationId: makeId('mood-op'),
      entryDate: new Date().toISOString().slice(0, 10),
      mood,
      note,
      updatedAt: new Date().toISOString()
    };
    await db.moodEntries.put(entry);
    await queueOperation('MoodEntry', entry.id, 'CREATE', entry);
    await afterLocalMutation('Well-being check-in saved on this device');
  }, [activePatient.id, afterLocalMutation]);

  const completeActivity = useCallback(async (activityId: string) => {
    const activity = await db.activities.get(activityId);
    if (!activity) {
      return;
    }
    const next = { ...activity, completed: true, updatedAt: new Date().toISOString() };
    await db.activities.put(next);
    await queueOperation('DailyActivity', next.id, 'UPDATE', next);
    await afterLocalMutation('Routine progress saved on this device');
  }, [afterLocalMutation]);

  const updatePatientPreferences = useCallback(async (language: string, difficultyLevel?: number) => {
    const next = {
      ...activePatient,
      preferredLanguage: language,
      difficultyLevel: difficultyLevel ?? activePatient.difficultyLevel,
      updatedAt: new Date().toISOString()
    };
    await db.patients.put(next);
    await queueOperation('Patient', next.id, 'UPDATE', next);
    await afterLocalMutation('Settings saved on this device');
  }, [activePatient, afterLocalMutation]);

  const value: AppDataContextValue = {
    loading,
    online: connectivity.online,
    backendOnline: connectivity.backendOnline,
    browserOnline: connectivity.browserOnline,
    syncMessage,
    pendingCount: pendingCountState,
    patients,
    activePatient,
    memories,
    reminders,
    games,
    gameResults,
    moodEntries,
    activities,
    alerts,
    progress,
    refreshData,
    forceSync,
    addMemory,
    completeReminder,
    recordGameResult,
    saveMood,
    completeActivity,
    updatePatientPreferences
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

function addMinutes(time: string, minutes: number) {
  const [hour = '0', minute = '0'] = time.split(':');
  const date = new Date();
  date.setHours(Number(hour), Number(minute) + minutes, 0, 0);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used inside AppDataProvider');
  }
  return context;
}

