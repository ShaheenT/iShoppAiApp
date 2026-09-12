import React from 'react';
import {
  Camera,
  MapPin,
  TrendingDown,
  ShoppingBag,
  Sparkles,
  Trophy,
  Database,
  Search,
} from 'lucide-react';
import { Logo } from './Logo.js';
import { IShoppIcon } from './IShoppIcon.js';

interface NavbarProps {
  currentCity: string;
  onCityChange: (city: string) => void;
  userPoints: number;
  onOpenScan: () => void;
  onOpenRadar: () => void;
  onOpenPriceIntelligence: () => void;
  onOpenAssistant: () => void;
  onOpenShoppingList: () => void;
  onOpenPantryScan?: () => void;
  shoppingListCount?: number;
  onOpenLeaderboard: () => void;
  onOpenSupabaseStatus: () => void;
  onOpenMagic?: () => void;
  onOpenLanding?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const CITIES = ['Cape Town', 'Johannesburg', 'Durban', 'Pretoria', 'Stellenbosch'];

export const Navbar: React.FC<NavbarProps> = ({
  currentCity,
  onCityChange,
  userPoints,
  onOpenScan,
  onOpenRadar,
  onOpenPriceIntelligence,
  onOpenAssistant,
  onOpenShoppingList,
  onOpenPantryScan,
  shoppingListCount = 4,
  onOpenLeaderboard,
  onOpenSupabaseStatus,
  onOpenMagic,
  onOpenLanding,
  searchQuery,
  onSearchChange,
}) => {
  const handleCenterAction = onOpenMagic || onOpenScan;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: Brand Logo & City Selector */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Logo size="md" />

          {/* City Selector */}
          <div className="relative hidden md:flex items-center">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 transition-colors text-xs font-semibold text-slate-700 cursor-pointer">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <select
                value={currentCity}
                onChange={(e) => onCityChange(e.target.value)}
                className="bg-transparent border-none focus:outline-none cursor-pointer text-xs font-bold text-slate-800"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Center: Prominent Centre IShopp Button & Search Bar */}
        <div className="flex-1 max-w-lg flex items-center justify-center gap-2">
          {/* Centre IShopp Logo Button */}
          <button
            onClick={handleCenterAction}
            id="navbar-centre-ishopp-button"
            title="iShopp Magic Snap & Scan"
            className="flex items-center gap-2 px-2.5 py-1.5 sm:px-3 rounded-2xl bg-gradient-to-r from-rose-50 via-orange-50 to-rose-50 hover:from-rose-100 hover:to-orange-100 border border-rose-200/90 shadow-xs hover:shadow-md hover:scale-102 active:scale-95 transition-all cursor-pointer group shrink-0"
          >
            <IShoppIcon size={28} withGlow className="group-hover:scale-110 transition-transform" />
            <div className="flex flex-col text-left pr-1">
              <span className="text-xs font-black tracking-tight text-slate-900 leading-none flex items-center gap-1">
                iShopp
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              </span>
              <span className="text-[9px] font-bold text-rose-600 tracking-wide uppercase mt-0.5 hidden xs:inline">
                Magic
              </span>
            </div>
          </button>

          {/* Search Input on desktop */}
          <div className="flex-1 relative hidden md:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search specials (Milk, Coke, Bread, Pampers...)"
              className="w-full pl-9 pr-4 py-1.5 bg-slate-100/90 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-rose-400 rounded-full text-xs text-slate-800 focus:outline-none transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Steve Jobs Keynote Landing Page button */}
          {onOpenLanding && (
            <button
              onClick={onOpenLanding}
              id="nav-landing-page-btn"
              title="Steve Jobs Keynote Landing Page"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold bg-black text-white hover:bg-zinc-800 transition-all border border-zinc-700 shadow-xs active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Landing</span>
            </button>
          )}

          {/* AI Assistant button */}
          <button
            onClick={onOpenAssistant}
            id="nav-assistant-btn"
            title="Ask AI Shopping Assistant"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden sm:inline">AI Assistant</span>
          </button>

          {/* Price Tracker button */}
          <button
            onClick={onOpenPriceIntelligence}
            id="nav-price-intelligence-btn"
            title="Price Trends & History"
            className="p-2 sm:px-3 sm:py-1.5 rounded-full text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5 border border-slate-200/80 hidden sm:flex"
          >
            <TrendingDown className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden md:inline">Price Tracker</span>
          </button>

          {/* Store Radar button */}
          <button
            onClick={onOpenRadar}
            id="nav-radar-btn"
            title="Store Radar & Nearby Map"
            className="p-2 sm:px-3 sm:py-1.5 rounded-full text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5 border border-slate-200/80 hidden sm:flex"
          >
            <MapPin className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden md:inline">Store Radar</span>
          </button>

          {/* Shopping List Button with Badge */}
          <button
            onClick={onOpenShoppingList}
            id="nav-shopping-list-btn"
            title="My Smart Grocery List & Delivery"
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-full text-xs font-bold text-slate-800 bg-emerald-50 hover:bg-emerald-100 transition-all flex items-center gap-1.5 border border-emerald-200/80 active:scale-95 cursor-pointer"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 text-emerald-700" />
              {shoppingListCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-emerald-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {shoppingListCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline text-emerald-900">Grocery List</span>
          </button>

          {/* Leaderboard points */}
          <button
            onClick={onOpenLeaderboard}
            id="nav-leaderboard-btn"
            title="Community Leaderboard"
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-full text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors flex items-center gap-1 border border-amber-200/60"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-bold text-xs">{userPoints} pts</span>
          </button>

          {/* Scan button */}
          <button
            onClick={onOpenScan}
            id="nav-primary-scan-btn"
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-xs hover:shadow transition-all hover:scale-102"
          >
            <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="whitespace-nowrap hidden xs:inline">Scan Deal</span>
          </button>

          {/* Supabase Status Icon */}
          <button
            onClick={onOpenSupabaseStatus}
            id="nav-supabase-btn"
            title="Supabase & Health Status"
            className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          >
            <Database className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="px-4 py-2 border-t border-slate-100 md:hidden">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search specials (Milk, Coke, Bread, Pampers...)"
            className="w-full pl-9 pr-4 py-1.5 bg-slate-100 rounded-full text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-rose-500"
          />
        </div>
      </div>
    </header>
  );
};
