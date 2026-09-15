import React, { useState } from 'react';
import { WifiOff, Wifi, RefreshCw, Database, CheckCircle2, ShieldCheck } from 'lucide-react';
import { UseOnlineStatusReturn } from '../hooks/useOnlineStatus.js';

interface OfflineStatusBannerProps {
  onlineStatus: UseOnlineStatusReturn;
  specialsCount: number;
  shoppingListCount: number;
}

export const OfflineStatusBanner: React.FC<OfflineStatusBannerProps> = ({
  onlineStatus,
  specialsCount,
  shoppingListCount,
}) => {
  const { isOnline, isOffline, lastSyncTime, pendingSyncCount, syncStatus, syncOfflineData } =
    onlineStatus;
  const [isDismissed, setIsDismissed] = useState(false);

  // Formatted last sync time
  const formattedSyncTime = lastSyncTime
    ? new Date(lastSyncTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Recently';

  if (isOnline && isDismissed && pendingSyncCount === 0) {
    return null;
  }

  // When completely offline (e.g. basement supermarket aisle)
  if (isOffline) {
    return (
      <div
        id="offline-status-banner"
        className="w-full bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white px-3.5 py-2 text-xs flex flex-wrap items-center justify-between gap-2 shadow-md z-40 border-b border-amber-500/40 animate-in fade-in duration-200"
      >
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <WifiOff className="w-3.5 h-3.5 text-white animate-pulse" />
          </div>
          <div>
            <div className="font-black flex items-center gap-1.5">
              <span>Offline Mode Active</span>
              <span className="bg-amber-950/60 text-amber-200 text-[10px] font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5 border border-amber-400/30">
                <Database className="w-2.5 h-2.5" />
                IndexedDB
              </span>
            </div>
            <p className="text-amber-100 text-[11px] leading-tight">
              Using {specialsCount} cached specials & {shoppingListCount} grocery items. All list edits save locally.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-[10px] text-amber-200 bg-black/20 px-2 py-0.5 rounded-full">
            Auto-syncs when online
          </span>
        </div>
      </div>
    );
  }

  // When back online with pending sync or syncing status
  if (syncStatus === 'syncing' || pendingSyncCount > 0) {
    return (
      <div
        id="sync-status-banner"
        className="w-full bg-slate-900 text-white px-3.5 py-1.5 text-xs flex items-center justify-between gap-2 border-b border-slate-700 z-30"
      >
        <div className="flex items-center gap-2">
          <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
          <span className="font-semibold text-[11px]">
            Syncing offline edits & updating store specials catalog...
          </span>
        </div>
        <span className="text-[10px] text-slate-400">IndexedDB Synced</span>
      </div>
    );
  }

  return null;
};
