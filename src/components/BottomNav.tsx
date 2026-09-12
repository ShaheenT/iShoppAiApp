import React from 'react';
import { Home, Compass, Bookmark, User, Sparkles, ShoppingBag } from 'lucide-react';
import { IShoppIcon } from './IShoppIcon.js';

export type NavTab = 'home' | 'discover' | 'saved' | 'account';

interface BottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenMagic: () => void;
  savedCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  onOpenMagic,
  savedCount = 0,
}) => {
  return (
    <nav
      id="bottom-navigation-bar"
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-lg"
    >
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between relative">
        {/* 1. HOME */}
        <button
          onClick={() => onTabChange('home')}
          id="nav-tab-home"
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors ${
            currentTab === 'home'
              ? 'text-emerald-600 font-extrabold'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <Home className={`w-5 h-5 ${currentTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] tracking-tight mt-0.5">Home</span>
        </button>

        {/* 2. DISCOVER */}
        <button
          onClick={() => onTabChange('discover')}
          id="nav-tab-discover"
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors ${
            currentTab === 'discover'
              ? 'text-emerald-600 font-extrabold'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <Compass className={`w-5 h-5 ${currentTab === 'discover' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] tracking-tight mt-0.5">Discover</span>
        </button>

        {/* 3. iSHOPP MAGIC (ELEVATED CENTRE BUTTON WITH OFFICIAL LOGO) */}
        <div className="flex-1 flex items-center justify-center relative -top-4">
          <button
            onClick={onOpenMagic}
            id="nav-magic-center-button"
            aria-label="iShopp Magic"
            className="w-14 h-14 rounded-2xl shadow-xl shadow-rose-500/25 flex items-center justify-center border-4 border-white hover:scale-105 active:scale-95 transition-all cursor-pointer group relative overflow-hidden"
          >
            {/* The official logo icon with gradient, shopping bag outline and heart */}
            <IShoppIcon size={48} withGlow className="group-hover:scale-105 transition-transform" />
            
            {/* Pulsing indicator pill */}
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-300 rounded-full border-2 border-white animate-ping" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-300 rounded-full border-2 border-white" />
          </button>
        </div>

        {/* 4. LIST & SAVED */}
        <button
          onClick={() => onTabChange('saved')}
          id="nav-tab-saved"
          className={`flex-1 flex flex-col items-center justify-center py-1 relative transition-colors ${
            currentTab === 'saved'
              ? 'text-emerald-600 font-extrabold'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <div className="relative">
            <ShoppingBag className={`w-5 h-5 ${currentTab === 'saved' ? 'stroke-[2.5] text-emerald-600' : 'stroke-2'}`} />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 bg-emerald-500 text-white rounded-full text-[9px] font-black flex items-center justify-center shadow-xs">
                {savedCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">List & Saved</span>
        </button>

        {/* 5. ACCOUNT */}
        <button
          onClick={() => onTabChange('account')}
          id="nav-tab-account"
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors ${
            currentTab === 'account'
              ? 'text-emerald-600 font-extrabold'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <User className={`w-5 h-5 ${currentTab === 'account' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] tracking-tight mt-0.5">Account</span>
        </button>
      </div>
    </nav>
  );
};
