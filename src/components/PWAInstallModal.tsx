import React from 'react';
import { Download, X, Share2, PlusSquare, Sparkles, Smartphone, CheckCircle2, ArrowRight } from 'lucide-react';
import { IShoppIcon } from './IShoppIcon.js';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInstallable: boolean;
  isIOS: boolean;
  onInstall: () => Promise<boolean>;
  onContinueToWeb?: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  isInstallable,
  isIOS,
  onInstall,
  onContinueToWeb,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="pwa-install-modal-backdrop"
      className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        id="pwa-install-modal"
        role="dialog"
        aria-modal="true"
        className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-sm w-full p-6 text-white shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-gradient-to-b from-rose-500/20 to-transparent blur-2xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors z-10 cursor-pointer"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="flex flex-col items-center text-center space-y-3 relative z-10">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-500 via-rose-600 to-orange-500 p-0.5 shadow-xl shadow-rose-500/25 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
                <IShoppIcon size={46} withGlow />
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-[10px] font-black uppercase text-white px-2 py-0.5 rounded-full border border-slate-900 shadow-sm">
              App
            </span>
          </div>

          <div>
            <h3 className="text-xl font-black text-white tracking-tight">
              Get iShopp App
            </h3>
            <p className="text-xs text-rose-400 font-semibold mt-0.5">
              Add to Home Screen • Runs like a Native App
            </p>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Save directly to your phone's home screen. Enjoy full-screen camera price scanning, offline store specials, and instant access without App Store downloads.
            </p>
          </div>
        </div>

        {/* Install Action Area */}
        <div className="mt-5 space-y-3 relative z-10">
          {isInstallable ? (
            <button
              onClick={async () => {
                const installed = await onInstall();
                if (installed) {
                  onClose();
                }
              }}
              id="pwa-prompt-install-btn"
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Install to Home Screen</span>
            </button>
          ) : isIOS ? (
            /* iOS Safari 3-Step Guided Prompt */
            <div className="space-y-2.5 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 text-xs">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300 mb-1">
                <Smartphone className="w-3.5 h-3.5 text-rose-400" />
                <span>3 Fast Steps on iPhone / iPad:</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                  1
                </span>
                <p className="text-slate-300 leading-snug">
                  Tap <strong className="text-white inline-flex items-center gap-1 mx-0.5"><Share2 className="w-3.5 h-3.5 text-blue-400 inline" /> Share</strong> at the bottom of Safari.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                  2
                </span>
                <p className="text-slate-300 leading-snug">
                  Scroll and choose <strong className="text-white inline-flex items-center gap-1 mx-0.5"><PlusSquare className="w-3.5 h-3.5 text-rose-300 inline" /> Add to Home Screen</strong>.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                  3
                </span>
                <p className="text-slate-300 leading-snug">
                  Tap <strong className="text-white">Add</strong>. The iShopp icon will appear on your phone's Home Screen!
                </p>
              </div>
            </div>
          ) : (
            /* Desktop Chrome / Other Browsers Guide */
            <div className="space-y-2 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 text-xs">
              <p className="text-slate-300 leading-relaxed">
                Tap your browser menu (<strong className="text-white">⋮</strong> or <strong className="text-white">Share</strong>) and select <strong className="text-emerald-400">"Install App"</strong> or <strong className="text-emerald-400">"Add to Home screen"</strong>.
              </p>
            </div>
          )}

          {/* Fallback button to launch directly in browser */}
          <button
            onClick={() => {
              onClose();
              if (onContinueToWeb) onContinueToWeb();
            }}
            className="w-full py-2.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Continue in web browser instead</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
