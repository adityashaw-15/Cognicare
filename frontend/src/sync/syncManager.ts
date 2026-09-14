import { jarvisApi } from '../api/client';
import { db } from '../database/db';
import { SyncOperationType, SyncPullResponse, SyncQueueItem } from '../types/models';

const id = () => crypto.randomUUID();

export async function queueOperation(entityType: string, entityId: string, operation: SyncOperationType, payload: unknown) {
  const operationId = id();
  const item: SyncQueueItem = {
    id: operationId,
    operationId,
    entityType,
    entityId,
    operation,
    timestamp: new Date().toISOString(),
    payload,
    syncStatus: 'PENDING',
    attempts: 0
  };
  await db.syncQueue.put(item);
  return item;
}

export async function hydrateFromPull(data: SyncPullResponse) {
  await db.transaction('rw', [db.patients, db.memories, db.games, db.gameResults, db.reminders, db.moodEntries, db.activities, db.alerts, db.meta], async () => {
    await db.patients.bulkPut(data.patients ?? []);
    await db.memories.bulkPut(data.memories ?? []);
    await db.games.bulkPut(data.games ?? []);
    await db.gameResults.bulkPut(data.gameResults ?? []);
    await db.reminders.bulkPut(data.reminders ?? []);
    await db.moodEntries.bulkPut(data.moodEntries ?? []);
    await db.activities.bulkPut(data.activities ?? []);
    await db.alerts.bulkPut(data.alerts ?? []);
    await db.meta.put({ key: 'lastPulledAt', value: data.serverTime });
  });
}

export async function pullLatest() {
  const last = await db.meta.get('lastPulledAt');
  const pulled = await jarvisApi.pull(last?.value);
  await hydrateFromPull(pulled);
  return pulled;
}

export async function syncNow() {
  const pending = await db.syncQueue.where('syncStatus').equals('PENDING').sortBy('timestamp');
  if (pending.length > 0) {
    await jarvisApi.push(pending);
    await db.transaction('rw', db.syncQueue, async () => {
      await Promise.all(pending.map((item) => db.syncQueue.update(item.id, { syncStatus: 'SYNCED', attempts: item.attempts + 1 })));
    });
  }
  await pullLatest();
  return pending.length;
}

export async function markSyncFailure(message: string) {
  const pending = await db.syncQueue.where('syncStatus').equals('PENDING').toArray();
  await Promise.all(
    pending.map((item) =>
      db.syncQueue.update(item.id, {
        attempts: item.attempts + 1,
        lastError: message
      })
    )
  );
}

export async function pendingSyncCount() {
  return db.syncQueue.where('syncStatus').equals('PENDING').count();
}

