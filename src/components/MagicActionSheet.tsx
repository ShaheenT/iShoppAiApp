import React from 'react';
import { Camera, Sparkles, Search, Receipt, X, ArrowRight, Zap, ShoppingBag, Truck } from 'lucide-react';
import { Logo } from './Logo.js';

interface MagicActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSnap: () => void;
  onSelectScan: () => void;
  onSelectAskAI: () => void;
  onSelectReceipt?: () => void;
  onSelectScanFinished?: () => void;
  onSelectShoppingList?: () => void;
}

export const MagicActionSheet: React.FC<MagicActionSheetProps> = ({
  isOpen,
  onClose,
  onSelectSnap,
  onSelectScan,
  onSelectAskAI,
  onSelectReceipt,
  onSelectScanFinished,
  onSelectShoppingList,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        id="magic-action-sheet"
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-200"
      >
        {/* Top Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>iShopp Magic</span>
                <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  AI Powered
                </span>
              </h3>
              <p className="text-xs text-slate-500">Show iShopp anything to find the lowest price</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Core Primary Actions */}
        <div className="p-6 space-y-3">
          {/* SCAN FINISHED ITEM AT HOME (NEW INNOVATION) */}
          <button
            onClick={() => {
              onClose();
              if (onSelectScanFinished) onSelectScanFinished();
            }}
            id="magic-action-scan-finished"
            className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-emerald-500 bg-emerald-50/70 hover:bg-emerald-100/70 transition-all text-left group shadow-xs"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <div className="font-extrabold text-slate-900 text-base flex items-center gap-1.5">
                  <span>SCAN FINISHED ITEM</span>
                  <span className="text-[10px] font-black uppercase bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded-md">
                    Home AI
                  </span>
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  Point at empty milk carton, bread bag, or jar to restock grocery list
                </div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* SNAP */}
          <button
            onClick={() => {
              onClose();
              onSelectSnap();
            }}
            id="magic-action-snap"
            className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <div className="font-extrabold text-slate-900 text-base flex items-center gap-1.5">
                  <span>SNAP</span>
                  <span className="text-xs text-emerald-600 font-semibold">• Take a photo</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Photograph in-store shelf tags, specials, or flyers
                </div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* SCAN */}
          <button
            onClick={() => {
              onClose();
              onSelectScan();
            }}
            id="magic-action-scan"
            className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Zap className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <div className="font-extrabold text-slate-900 text-base flex items-center gap-1.5">
                  <span>SCAN</span>
                  <span className="text-xs text-slate-500 font-semibold">• Analyse image</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Upload supermarket shelf photos for instant Gemini AI price extraction
                </div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* SEARCH / ASK AI */}
          <button
            onClick={() => {
              onClose();
              onSelectAskAI();
            }}
            id="magic-action-ask-ai"
            className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <div className="font-extrabold text-slate-900 text-base flex items-center gap-1.5">
                  <span>SEARCH</span>
                  <span className="text-xs text-teal-600 font-semibold">• Ask iShopp AI</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  "Where can I buy Coke cheapest?" or "Cheapest braai meat near me"
                </div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* RECEIPT */}
          <button
            onClick={() => {
              onClose();
              if (onSelectReceipt) onSelectReceipt();
              else onSelectScan();
            }}
            id="magic-action-receipt"
            className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-800 text-xs">Receipt Scanner</span>
                <span className="text-[11px] text-slate-500 block">Extract line-item savings from slip</span>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
              Beta
            </span>
          </button>
        </div>

        {/* Footer philosophy reminder */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="font-bold text-slate-700">Snap • Scan • Share • Save</span>
          <span>Never miss a special again</span>
        </div>
      </div>
    </div>
  );
};
