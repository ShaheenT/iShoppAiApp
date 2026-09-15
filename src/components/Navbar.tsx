import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  MapPin,
  TrendingDown,
  ShoppingBag,
  Sparkles,
  Trophy,
  Search,
  ChevronDown,
  Compass,
  Zap,
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
  onOpenRouteOptimizer?: () => void;
  onOpenPantryScan?: () => void;
  shoppingListCount?: number;
  onOpenLeaderboard: () => void;
  onOpenSupabaseStatus?: () => void;
  onOpenMagic?: () => void;
  onOpenLanding?: () => void;
  onOpenAuth?: () => void;
  userAvatar?: string;
  userName?: string;
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
  onOpenRouteOptimizer,
  onOpenPantryScan,
  shoppingListCount = 4,
  onOpenLeaderboard,
  onOpenSupabaseStatus,
  onOpenMagic,
  onOpenLanding,
  onOpenAuth,
  userAvatar,
  userName,
  searchQuery,
  onSearchChange,
}) => {
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const toolsDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(event.target as Node)) {
        setIsToolsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCenterAction = onOpenMagic || onOpenScan;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs pt-safe">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2.5 sm:gap-4">
        {/* Left: Brand Logo & Minimal City Indicator */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Logo size="md" />

          {/* Clean City Dropdown */}
          <div className="relative hidden md:flex items-center">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200/80 transition-colors text-xs font-semibold text-slate-700 cursor-pointer">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
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

        {/* Center: Search Bar & Quick Magic Button */}
        <div className="flex-1 max-w-md flex items-center justify-center gap-2">
          {/* Magic Button */}
          <button
            onClick={handleCenterAction}
            id="navbar-centre-ishopp-button"
            title="Snap, Scan & Share"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 hover:from-emerald-100 hover:to-teal-100 border border-emerald-200/80 shadow-2xs hover:shadow-xs active:scale-95 transition-all cursor-pointer group shrink-0"
          >
            <IShoppIcon size={24} withGlow className="group-hover:scale-105 transition-transform" />
            <span className="text-xs font-black text-slate-900 tracking-tight hidden sm:inline">
              Magic
            </span>
          </button>

          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search Milk, Coke, Bread, Pampers..."
              className="w-full pl-8 pr-7 py-1.5 bg-slate-100 focus:bg-white border border-transparent focus:border-emerald-500 rounded-full text-xs text-slate-800 focus:outline-none transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right Actions: Clean, Uncluttered Essential Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* 1. SMART GROCERY LIST (Essential Shopping Action) */}
          <button
            onClick={onOpenShoppingList}
            id="nav-shopping-list-btn"
            title="My Smart Grocery List"
            className="relative px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="hidden sm:inline font-black">List</span>
            {shoppingListCount > 0 && (
              <span className="bg-emerald-600 text-white text-[10px] font-black min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
                {shoppingListCount}
              </span>
            )}
          </button>

          {/* 2. PRIMARY SNAP / SCAN DEAL BUTTON */}
          <button
            onClick={onOpenScan}
            id="nav-primary-scan-btn"
            title="Snap & Scan a Special"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs hover:shadow transition-all active:scale-95 cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">Scan</span>
          </button>

          {/* 3. INNOVATIVE TOOLS DROPDOWN (Consolidates secondary tools into one clean menu) */}
          <div className="relative" ref={toolsDropdownRef}>
            <button
              onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
              id="nav-tools-dropdown-btn"
              title="More Features & Tools"
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-full text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 flex items-center gap-1 transition-all cursor-pointer ${
                isToolsDropdownOpen ? 'bg-slate-100 border-slate-300' : ''
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden md:inline font-bold">Tools</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Dropdown Menu Panel */}
            {isToolsDropdownOpen && (
              <div
                id="nav-tools-dropdown-menu"
                className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Value & Smart Tools
                </div>

                {/* AI Assistant */}
                <button
                  onClick={() => {
                    setIsToolsDropdownOpen(false);
                    onOpenAssistant();
                  }}
                  className="w-full px-3 py-2 rounded-xl text-left hover:bg-slate-50 flex items-center gap-2.5 text-xs text-slate-800 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold">Ask AI Shopping Assistant</div>
                    <div className="text-[10px] text-slate-400">Best price comparisons & advice</div>
                  </div>
                </button>

                {/* Price Intelligence & Trends */}
                <button
                  onClick={() => {
                    setIsToolsDropdownOpen(false);
                    onOpenPriceIntelligence();
                  }}
                  className="w-full px-3 py-2 rounded-xl text-left hover:bg-slate-50 flex items-center gap-2.5 text-xs text-slate-800 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <TrendingDown className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold">Price Intelligence</div>
                    <div className="text-[10px] text-slate-400">Track 90-day price trends</div>
                  </div>
                </button>

                {/* Store Radar / Nearby Map */}
                <button
                  onClick={() => {
                    setIsToolsDropdownOpen(false);
                    onOpenRadar();
                  }}
                  className="w-full px-3 py-2 rounded-xl text-left hover:bg-slate-50 flex items-center gap-2.5 text-xs text-slate-800 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Compass className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold">Store Radar Map</div>
                    <div className="text-[10px] text-slate-400">Branches & distances near you</div>
                  </div>
                </button>

                {/* Route Optimizer (D3) */}
                {onOpenRouteOptimizer && (
                  <button
                    onClick={() => {
                      setIsToolsDropdownOpen(false);
                      onOpenRouteOptimizer();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left hover:bg-slate-50 flex items-center gap-2.5 text-xs text-slate-800 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold">Route Map (D3)</div>
                      <div className="text-[10px] text-slate-400">Shortest path multi-store trip</div>
                    </div>
                  </button>
                )}

                {/* Leaderboard Points */}
                <button
                  onClick={() => {
                    setIsToolsDropdownOpen(false);
                    onOpenLeaderboard();
                  }}
                  className="w-full px-3 py-2 rounded-xl text-left hover:bg-slate-50 flex items-center gap-2.5 text-xs text-slate-800 transition-colors border-t border-slate-100 mt-1"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Trophy className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold flex items-center gap-1.5">
                      <span>Community Leaderboard</span>
                      <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full">
                        {userPoints} pts
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">Top contributors & badges</div>
                  </div>
                </button>

                {/* Keynote Landing Page */}
                {onOpenLanding && (
                  <button
                    onClick={() => {
                      setIsToolsDropdownOpen(false);
                      onOpenLanding();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left hover:bg-slate-50 flex items-center gap-2.5 text-xs text-slate-800 transition-colors border-t border-slate-100"
                  >
                    <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    </div>
                    <div>
                      <div className="font-bold">Landing Page Experience</div>
                      <div className="text-[10px] text-slate-400">Keynote showcase & philosophy</div>
                    </div>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 4. USER PROFILE / AUTH AVATAR */}
          {onOpenAuth && (
            <button
              onClick={onOpenAuth}
              id="nav-account-auth-btn"
              title={`Account: ${userName || 'Sign In / Sign Up'}`}
              className="p-0.5 rounded-full hover:ring-2 hover:ring-emerald-400 transition-all shrink-0 cursor-pointer"
            >
              <img
                src={userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt="Account"
                className="w-7 h-7 rounded-full object-cover border border-slate-200"
              />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
