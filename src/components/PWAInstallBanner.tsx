import React, { useState } from 'react';
import { Download, X, Share2, PlusSquare, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall.js';
import { IShoppIcon } from './IShoppIcon.js';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // If running in standalone PWA or user dismissed this session
  if (isInstalled || isDismissed) {
    return null;
  }

  return (
    <>
      <div className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-4 py-2.5 text-xs flex items-center justify-between border-b border-slate-700/80 shadow-xs z-30">
        <div className="flex items-center gap-2.5">
          <IShoppIcon size={24} />
          <div>
            <span className="font-black text-white">Install iShopp AI</span>
            <span className="text-slate-300 hidden sm:inline ml-1.5">
              • Tap to add to home screen for instant camera scanning & offline mode
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isInstallable && (
            <button
              onClick={install}
              className="px-3 py-1 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-[11px] flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install PWA</span>
            </button>
          )}

          {isIOS && (
            <button
              onClick={() => setShowIOSGuide(true)}
              className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] flex items-center gap-1.5 transition-all border border-white/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install on iPhone</span>
            </button>
          )}

          {!isInstallable && !isIOS && (
            <button
              onClick={() => setShowIOSGuide(true)}
              className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-[11px]"
            >
              App Info
            </button>
          )}

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 text-slate-400 hover:text-white rounded-full transition-colors"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* iOS Installation Instructions Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-slate-900 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center space-y-3">
              <IShoppIcon size={64} withGlow />
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Add iShopp AI to Home Screen
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Enjoy a fast, native app experience on your phone with zero app-store download needed.
              </p>
            </div>

            <div className="mt-5 space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </span>
                <p className="text-slate-700 leading-snug">
                  Tap the <strong className="text-slate-900 inline-flex items-center gap-1 mx-0.5"><Share2 className="w-3.5 h-3.5 text-blue-500 inline" /> Share</strong> button in Safari's toolbar.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </span>
                <p className="text-slate-700 leading-snug">
                  Scroll down and tap <strong className="text-slate-900 inline-flex items-center gap-1 mx-0.5"><PlusSquare className="w-3.5 h-3.5 text-slate-800 inline" /> Add to Home Screen</strong>.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </span>
                <p className="text-slate-700 leading-snug">
                  Tap <strong className="text-slate-900">Add</strong> in the top-right corner. Launch iShopp directly from your app icons!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl shadow-sm transition-all"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
