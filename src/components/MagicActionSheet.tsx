import React from 'react';
import {
  Camera,
  Zap,
  Sparkles,
  Receipt,
  X,
  ArrowRight,
  Navigation,
  Share2,
} from 'lucide-react';
import { IShoppIcon } from './IShoppIcon.js';

interface MagicActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSnap: () => void;
  onSelectScan: () => void;
  onSelectAskAI: () => void;
  onSelectReceipt?: () => void;
  onSelectScanFinished?: () => void;
  onSelectRouteOptimizer?: () => void;
}

export const MagicActionSheet: React.FC<MagicActionSheetProps> = ({
  isOpen,
  onClose,
  onSelectSnap,
  onSelectScan,
  onSelectAskAI,
  onSelectReceipt,
  onSelectScanFinished,
  onSelectRouteOptimizer,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="magic-action-sheet-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
    >
      {/* Tap outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div
        id="magic-action-sheet"
        className="relative bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] z-10 animate-in slide-in-from-bottom-6 duration-200"
      >
        {/* Header with App Brand Icon */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center">
              <IShoppIcon size={34} withGlow />
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-base leading-tight">
                iShopp Magic Actions
              </div>
              <div className="text-[11px] font-bold text-emerald-600">
                Snap • Scan • Share • Save
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action List organized clearly */}
        <div className="p-4 space-y-2.5 overflow-y-auto">
          {/* 1. SNAP (Yellow Tag / Deal Photo) */}
          <button
            onClick={() => {
              onClose();
              onSelectSnap();
            }}
            id="magic-action-snap"
            className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                  <span>1. SNAP PHOTO</span>
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded">
                    In-Store
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Photograph shelf yellow tags, discounts, or flyers
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-rose-500 group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* 2. SCAN (AI Price Extraction) */}
          <button
            onClick={() => {
              onClose();
              onSelectScan();
            }}
            id="magic-action-scan"
            className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                  <span>2. SCAN & EXTRACT</span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded">
                    Gemini AI
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Auto-detect product name, store branch & savings
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* 3. HOME PANTRY SCAN (Innovative feature) */}
          {onSelectScanFinished && (
            <button
              onClick={() => {
                onClose();
                onSelectScanFinished();
              }}
              id="magic-action-scan-finished"
              className="w-full flex items-center justify-between p-3.5 rounded-2xl border-2 border-emerald-500 bg-emerald-50/70 hover:bg-emerald-100/70 transition-all text-left group shadow-xs cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                    <span>SCAN EMPTY PANTRY ITEM</span>
                    <span className="text-[10px] font-black uppercase bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded-md">
                      Home
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Point at empty milk carton or jar to auto-add to grocery list
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition-all" />
            </button>
          )}

          {/* 4. OPTIMIZE STORE ROUTE (D3) */}
          {onSelectRouteOptimizer && (
            <button
              onClick={() => {
                onClose();
                onSelectRouteOptimizer();
              }}
              id="magic-action-route-optimizer"
              className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                    <span>OPTIMIZE STORE ROUTE</span>
                    <span className="text-[10px] font-black uppercase bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded-md">
                      D3 Cartography
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Map shortest path visiting your list supermarkets
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
            </button>
          )}

          {/* 5. ASK AI ASSISTANT */}
          <button
            onClick={() => {
              onClose();
              onSelectAskAI();
            }}
            id="magic-action-ask-ai"
            className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-xs">Ask iShopp AI Assistant</div>
                <div className="text-[11px] text-slate-500">"Where can I buy Coke or meat cheapest?"</div>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* 6. RECEIPT SCANNER */}
          <button
            onClick={() => {
              onClose();
              if (onSelectReceipt) onSelectReceipt();
              else onSelectScan();
            }}
            id="magic-action-receipt"
            className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-800 text-xs">Receipt Slip Scanner</span>
                <span className="text-[11px] text-slate-500 block">Extract line-item savings from slip</span>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
              Beta
            </span>
          </button>
        </div>

        {/* Footer philosophy reminder */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="font-black text-slate-800 tracking-tight">Snap • Scan • Share • Save</span>
          <span className="text-[11px] text-emerald-700 font-bold">Easy grocery shopping</span>
        </div>
      </div>
    </div>
  );
};
