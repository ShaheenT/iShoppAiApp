import { useState, useEffect, useCallback } from 'react';
import {
  getOfflineMetadata,
  setOfflineMetadata,
  getOfflineSyncQueue,
  clearOfflineSyncQueue,
  getOfflineSpecials,
  saveOfflineSpecials,
  getOfflineShoppingList,
  saveOfflineShoppingList,
} from '../lib/offlineDb.js';

export interface UseOnlineStatusReturn {
  isOnline: boolean;
  isOffline: boolean;
  lastSyncTime: string | null;
  pendingSyncCount: number;
  syncStatus: 'idle' | 'syncing' | 'synced';
  syncOfflineData: () => Promise<void>;
}

export function useOnlineStatus(onReconnect?: () => void): UseOnlineStatusReturn {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced'>('idle');

  // Load last sync metadata on mount
  useEffect(() => {
    getOfflineMetadata('last_specials_sync').then((ts) => {
      if (ts) setLastSyncTime(ts);
    });

    getOfflineSyncQueue().then((queue) => {
      setPendingSyncCount(queue.length);
    });
  }, []);

  const syncOfflineData = useCallback(async () => {
    if (!navigator.onLine) return;
    setSyncStatus('syncing');

    try {
      // 1. Check offline sync queue (e.g. deals or verifications recorded offline)
      const queue = await getOfflineSyncQueue();
      if (queue.length > 0) {
        for (const item of queue) {
          try {
            if (item.action === 'VERIFY_DEAL') {
              await fetch('/api/verify-deal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item.payload),
              });
            } else if (item.action === 'PUBLISH_DEAL') {
              await fetch('/api/share-deal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item.payload),
              });
            }
          } catch (e) {
            console.warn('Queue sync item failed:', e);
          }
        }
        await clearOfflineSyncQueue();
        setPendingSyncCount(0);
      }

      // 2. Fetch fresh catalog from API and update IndexedDB cache
      const res = await fetch('/api/feed');
      if (res.ok) {
        const data = await res.json();
        if (data.specials && data.specials.length > 0) {
          await saveOfflineSpecials(data.specials);
        }
      }

      const now = new Date().toISOString();
      await setOfflineMetadata('last_specials_sync', now);
      setLastSyncTime(now);
      setSyncStatus('synced');

      setTimeout(() => setSyncStatus('idle'), 3000);
      if (onReconnect) onReconnect();
    } catch (err) {
      console.warn('Offline sync encountered an issue:', err);
      setSyncStatus('idle');
    }
  }, [onReconnect]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineData();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncOfflineData]);

  return {
    isOnline,
    isOffline: !isOnline,
    lastSyncTime,
    pendingSyncCount,
    syncStatus,
    syncOfflineData,
  };
}
