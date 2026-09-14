import { useCallback, useEffect, useState } from 'react';
import { jarvisApi } from '../api/client';

export function useConnectivity() {
  const [browserOnline, setBrowserOnline] = useState(() => navigator.onLine);
  const [backendOnline, setBackendOnline] = useState(false);
  const [checking, setChecking] = useState(true);

  const checkBackend = useCallback(async () => {
    setChecking(true);
    try {
      await jarvisApi.health();
      setBackendOnline(true);
    } catch {
      setBackendOnline(false);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    const onOnline = () => setBrowserOnline(true);
    const onOffline = () => setBrowserOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    void checkBackend();
    const interval = window.setInterval(checkBackend, 8000);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      window.clearInterval(interval);
    };
  }, [checkBackend]);

  return {
    browserOnline,
    backendOnline,
    online: browserOnline && backendOnline,
    checking,
    refreshConnectivity: checkBackend
  };
}

