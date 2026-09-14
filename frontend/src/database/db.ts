import Dexie, { Table } from 'dexie';
import {
  CaregiverAlert,
  CognitiveGame,
  DailyActivity,
  GameResult,
  Memory,
  MoodEntry,
  Patient,
  Reminder,
  SyncQueueItem
} from '../types/models';
import {
  demoActivities,
  demoAlerts,
  demoGames,
  demoMemories,
  demoMoods,
  demoPatient,
  demoReminders,
  demoResults
} from '../data/demoData';

export class CogniCareDatabase extends Dexie {
  patients!: Table<Patient, string>;
  memories!: Table<Memory, string>;
  reminders!: Table<Reminder, string>;
  games!: Table<CognitiveGame, string>;
  gameResults!: Table<GameResult, string>;
  moodEntries!: Table<MoodEntry, string>;
  activities!: Table<DailyActivity, string>;
  alerts!: Table<CaregiverAlert, string>;
  syncQueue!: Table<SyncQueueItem, string>;
  meta!: Table<{ key: string; value: string }, string>;

  constructor() {
    super('cognicare-offline-care');
    this.version(1).stores({
      patients: 'id, updatedAt',
      memories: 'id, patientId, updatedAt',
      reminders: 'id, patientId, date, time, completed, updatedAt',
      games: 'id, type',
      gameResults: 'id, patientId, gameId, createdAt, updatedAt',
      moodEntries: 'id, patientId, entryDate, updatedAt',
      activities: 'id, patientId, time, completed, updatedAt',
      alerts: 'id, patientId, severity, generatedAt, updatedAt',
      syncQueue: 'id, operationId, entityType, entityId, syncStatus, timestamp',
      meta: 'key'
    });
  }
}

export const db = new CogniCareDatabase();

export async function seedLocalDemoData() {
  const count = await db.patients.count();
  if (count > 0) {
    return;
  }
  await db.transaction('rw', [db.patients, db.memories, db.reminders, db.games, db.gameResults, db.moodEntries, db.activities, db.alerts], async () => {
    await db.patients.put(demoPatient);
    await db.memories.bulkPut(demoMemories);
    await db.reminders.bulkPut(demoReminders);
    await db.games.bulkPut(demoGames);
    await db.gameResults.bulkPut(demoResults);
    await db.moodEntries.bulkPut(demoMoods);
    await db.activities.bulkPut(demoActivities);
    await db.alerts.bulkPut(demoAlerts);
  });
}

export async function resetLocalDemoData() {
  await db.transaction('rw', db.tables, async () => {
    await Promise.all(db.tables.map((table) => table.clear()));
  });
  await seedLocalDemoData();
}

