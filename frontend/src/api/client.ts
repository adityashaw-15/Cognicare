import { ApiResponse, SyncPullResponse, SyncQueueItem } from '../types/models';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8080/api';

export class FriendlyApiError extends Error {
  code: string;
  status: number;

  constructor(message: string, code = 'NETWORK_ERROR', status = 0) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}, timeoutMs = 4500): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers ?? {})
      },
      signal: controller.signal
    });
    const body = (await response.json().catch(() => null)) as ApiResponse<T> | null;
    if (!response.ok || !body?.success) {
      throw new FriendlyApiError(
        body?.message ?? 'CogniCare is currently in Local Mode. Your data is safe on this device.',
        body?.code ?? 'API_ERROR',
        response.status
      );
    }
    return body.data;
  } catch (error) {
    if (error instanceof FriendlyApiError) {
      throw error;
    }
    throw new FriendlyApiError('CogniCare is currently in Local Mode. Your data is safe on this device.');
  } finally {
    window.clearTimeout(timeout);
  }
}

export const jarvisApi = {
  health: () => request<{ status: string; serverTime: string }>('/health', {}, 1500),
  login: (email: string, password: string, role: string) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role })
    }),
  pull: (since?: string) =>
    request<SyncPullResponse>(`/sync/pull${since ? `?since=${encodeURIComponent(since)}` : ''}`, {}, 6000),
  push: (operations: SyncQueueItem[]) =>
    request('/sync/push', {
      method: 'POST',
      body: JSON.stringify({
        operations: operations.map(({ operationId, entityType, entityId, operation, timestamp, payload }) => ({
          operationId,
          entityType,
          entityId,
          operation,
          timestamp,
          payload
        }))
      })
    }, 8000)
};

