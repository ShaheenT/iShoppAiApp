import React from 'react';
import {
  Sparkles,
  MapPin,
  Flame,
  TrendingDown,
  Navigation,
  ChevronRight,
  ShieldCheck,
  Clock,
  Camera,
  Zap,
  Share2,
  Tag,
  ArrowUpRight,
  ArrowRight,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import { Special, UserProfile } from '../types/index.js';
import { RETAILERS } from '../../server/seedData.js';

interface HomeViewProps {
  user: UserProfile;
  specials: Special[];
  onSelectSpecial: (special: Special) => void;
  onOpenMagic: () => void;
  onOpenDiscover: () => void;
  onSnapSpecial: () => void;
  onScanSpecial: () => void;
  onOpenShoppingList?: () => void;
  onOpenPantryScan?: () => void;
  shoppingListCount?: number;
}

export const HomeView: React.FC<HomeViewProps> = ({
  user,
  specials,
  onSelectSpecial,
  onOpenMagic,
  onOpenDiscover,
  onSnapSpecial,
  onScanSpecial,
  onOpenShoppingList,
  onOpenPantryScan,
  shoppingListCount = 4,
}) => {
  const nearbySpecials = specials.slice(0, 4);
  const trendingSpecials = [...specials].sort((a, b) => b.verified_count - a.verified_count).slice(0, 4);
  const topDiscountSpecials = [...specials].sort((a, b) => b.savings_percentage - a.savings_percentage).slice(0, 4);

  return (
    <div id="home-view-container" className="space-y-6 pb-24 animate-in fade-in duration-200">
      {/* Personalized Header & Location Bar */}
      <div className="bg-gradient-to-b from-emerald-50/70 to-white pt-4 pb-6 px-4 -mx-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <MapPin className="w-3.5 h-3.5" />
              <span>{user.city} • Sea Point & Waterfront</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              Good day, {user.full_name.split(' ')[0]} 👋
            </h1>
          </div>

          <button
            onClick={onOpenMagic}
            className="w-10 h-10 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-md transition-all group"
            title="Open iShopp Magic"
          >
            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          </button>
        </div>

        {/* Community Intelligence & Savings Card */}
        <div className="mt-4 p-4 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-emerald-500/20 to-transparent pointer-events-none" />

          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Live Retail Intelligence
            </span>
            <span className="text-[11px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
              Waze for Groceries
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <div className="text-2xl font-black text-white tracking-tight">
                R{user.total_savings_unlocked.toLocaleString('en-ZA', { minimumFractionDigits: 0 })}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 font-medium">
                Saved by you
              </div>
            </div>

            <div className="border-l border-slate-800 pl-3">
              <div className="text-2xl font-black text-emerald-400 tracking-tight">
                R428,920
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 font-medium">
                Community savings
              </div>
            </div>
          </div>

          {/* Core Philosophy Fast Actions */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
            <button
              onClick={onSnapSpecial}
              className="flex-1 py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-emerald-400" />
              <span>Snap Deal</span>
            </button>

            <button
              onClick={onScanSpecial}
              className="flex-1 py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Scan Shelf</span>
            </button>

            <button
              onClick={onOpenMagic}
              className="flex-1 py-2 px-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* INNOVATIVE FEATURE: SMART SHOPPING LIST & PANTRY REPLENISH */}
      <section
        id="home-shopping-list-card"
        className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-900 text-white shadow-xl relative overflow-hidden border border-emerald-500/20"
      >
        <div className="absolute right-0 top-0 bottom-0 w-48 bg-gradient-to-l from-emerald-400/15 via-teal-400/10 to-transparent pointer-events-none" />

        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg flex-shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                  Smart Shopping List
                </h3>
                <span className="text-[10px] font-black uppercase bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full">
                  {shoppingListCount} Items
                </span>
              </div>
              <p className="text-xs text-emerald-100/80 mt-0.5">
                Scan finished items at home or submit list for direct delivery
              </p>
            </div>
          </div>

          <div className="hidden sm:block text-right flex-shrink-0">
            <div className="text-[11px] text-emerald-300 font-bold">Multi-Store Route</div>
            <div className="text-xs font-black text-emerald-400">Save ~R42.00</div>
          </div>
        </div>

        {/* 2 Primary Core Action Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4 pt-3 border-t border-emerald-800/60 relative z-10">
          {/* Action 1: Scan Finished Item at Home */}
          <button
            onClick={onOpenPantryScan}
            id="home-scan-finished-item-btn"
            className="py-3 px-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-xs flex items-center justify-between shadow-md active:scale-98 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center">
                <Camera className="w-4 h-4 text-white" />
              </div>
              <div className="text-left leading-tight">
                <span className="block font-black">Scan Finished Item</span>
                <span className="text-[10px] text-emerald-100 font-medium">Point at empty cartons / jars</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Action 2: View List & Deliver */}
          <button
            onClick={onOpenShoppingList}
            id="home-open-shopping-list-btn"
            className="py-3 px-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-extrabold text-xs flex items-center justify-between active:scale-98 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center">
                <Truck className="w-4 h-4 text-emerald-300" />
              </div>
              <div className="text-left leading-tight">
                <span className="block font-black">View List & Delivery</span>
                <span className="text-[10px] text-slate-300 font-medium">3 Tiers: Walk or Delivered</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </section>

      {/* 1. NEARBY NOW (DEALS WITHIN 1-3 KM) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-emerald-600" />
            <h2 className="font-black text-slate-900 text-base tracking-tight">
              Nearby Now
            </h2>
            <span className="text-xs text-slate-400 font-medium">Within 3 km</span>
          </div>

          <button
            onClick={onOpenDiscover}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5"
          >
            <span>See map</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Horizontal Card Scroll */}
        <div className="flex gap-3.5 overflow-x-auto pb-2 pt-1 scrollbar-none -mx-4 px-4">
          {nearbySpecials.map((special) => {
            const retailer = RETAILERS.find((r) => r.id === special.retailer_id) || RETAILERS[0];
            return (
              <div
                key={special.id}
                onClick={() => onSelectSpecial(special)}
                className="w-64 flex-shrink-0 bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-emerald-500 cursor-pointer transition-all overflow-hidden flex flex-col group"
              >
                {/* Image & Badges */}
                <div className="h-36 relative bg-slate-100 overflow-hidden">
                  <img
                    src={special.image_url}
                    alt={special.product_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2.5 right-2.5 bg-emerald-500 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                    Save R{special.savings.toFixed(2)}
                  </span>
                  <span className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>{special.distance_km || 1.4} km away</span>
                  </span>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: retailer.primaryColor }}
                      />
                      <span>{special.retailer_name}</span>
                      <span>•</span>
                      <span className="truncate">{special.branch_name.replace(special.retailer_name, '')}</span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-sm line-clamp-1 group-hover:text-emerald-700">
                      {special.product_name}
                    </h3>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-baseline justify-between">
                    <div>
                      <span className="text-lg font-black text-slate-900">
                        R{special.price.toFixed(2)}
                      </span>
                      <span className="text-xs text-slate-400 line-through ml-1.5">
                        R{(special.original_price || special.price + special.savings).toFixed(2)}
                      </span>
                    </div>

                    <span className="text-[11px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      -{special.savings_percentage}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. TRENDING DEALS (HIGH VERIFICATION) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500" />
            <h2 className="font-black text-slate-900 text-base tracking-tight">
              Community Trending
            </h2>
          </div>

          <span className="text-xs font-semibold text-slate-400">Verified by local shoppers</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {trendingSpecials.map((special) => (
            <div
              key={special.id}
              onClick={() => onSelectSpecial(special)}
              className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-emerald-500 hover:shadow-xs transition-all cursor-pointer flex items-center gap-3.5 group"
            >
              <img
                src={special.image_url}
                alt={special.product_name}
                className="w-16 h-16 rounded-2xl object-cover bg-slate-100 flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                  <span>{special.retailer_name}</span>
                  <span>•</span>
                  <span className="truncate">{special.branch_name}</span>
                </div>

                <div className="font-extrabold text-slate-900 text-xs truncate mt-0.5 group-hover:text-emerald-700">
                  {special.product_name}
                </div>

                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-black text-slate-900 text-sm">
                    R{special.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-emerald-600 font-bold">
                    Save R{special.savings.toFixed(2)}
                  </span>
                </div>

                <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>{special.verified_count} verified • {special.created_at}</span>
                </div>
              </div>

              <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 flex-shrink-0" />
            </div>
          ))}
        </div>
      </section>

      {/* 3. BIGGEST SAVINGS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-emerald-600" />
            <h2 className="font-black text-slate-900 text-base tracking-tight">
              Biggest Discounts Today
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-400">Up to 34% off</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {topDiscountSpecials.map((special) => (
            <div
              key={special.id}
              onClick={() => onSelectSpecial(special)}
              className="p-3 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="h-28 rounded-xl overflow-hidden bg-slate-100 relative mb-2">
                <img
                  src={special.image_url}
                  alt={special.product_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute top-1.5 right-1.5 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                  -{special.savings_percentage}%
                </span>
              </div>

              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase truncate">
                  {special.retailer_name}
                </div>
                <div className="font-extrabold text-slate-900 text-xs line-clamp-2 mt-0.5">
                  {special.product_name}
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 flex items-baseline justify-between">
                <span className="font-black text-slate-900 text-sm">
                  R{special.price.toFixed(2)}
                </span>
                <span className="text-[10px] font-bold text-emerald-600">
                  Save R{special.savings.toFixed(0)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
