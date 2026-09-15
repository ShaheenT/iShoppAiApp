import React from 'react';
import {
  Sparkles,
  MapPin,
  Flame,
  TrendingDown,
  Navigation,
  ChevronRight,
  ShieldCheck,
  Camera,
  Zap,
  ShoppingBag,
  Truck,
  ArrowRight,
  Share2,
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
      {/* 1. CLEAN VALUE HERO: Snap • Scan • Share • Save */}
      <div className="bg-gradient-to-b from-emerald-50/80 via-white to-white pt-4 pb-2 px-4 -mx-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <MapPin className="w-3.5 h-3.5" />
              <span>{user.city} • Sea Point & Waterfront</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              Hello, {user.full_name.split(' ')[0]} 👋
            </h1>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Personal Savings</span>
            <span className="text-lg font-black text-emerald-700">
              R{user.total_savings_unlocked.toLocaleString('en-ZA', { minimumFractionDigits: 0 })}
            </span>
          </div>
        </div>

        {/* 4 Pillars Interactive Action Bar (Snap • Scan • Share • Save) */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          {/* SNAP */}
          <button
            onClick={onSnapSpecial}
            id="home-action-snap"
            className="p-2.5 rounded-2xl bg-white border border-slate-200 hover:border-rose-400 hover:shadow-xs transition-all flex flex-col items-center text-center cursor-pointer group active:scale-95"
          >
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform mb-1">
              <Camera className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-black text-slate-900">SNAP</span>
            <span className="text-[9px] text-slate-400">Photo tag</span>
          </button>

          {/* SCAN */}
          <button
            onClick={onScanSpecial}
            id="home-action-scan"
            className="p-2.5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xs transition-all flex flex-col items-center text-center cursor-pointer group active:scale-95"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform mb-1">
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-black text-slate-900">SCAN</span>
            <span className="text-[9px] text-slate-400">AI Price</span>
          </button>

          {/* SHARE */}
          <button
            onClick={onSnapSpecial}
            id="home-action-share"
            className="p-2.5 rounded-2xl bg-white border border-slate-200 hover:border-sky-400 hover:shadow-xs transition-all flex flex-col items-center text-center cursor-pointer group active:scale-95"
          >
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform mb-1">
              <Share2 className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-black text-slate-900">SHARE</span>
            <span className="text-[9px] text-slate-400">With locals</span>
          </button>

          {/* SAVE */}
          <button
            onClick={onOpenShoppingList}
            id="home-action-save"
            className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-300 hover:bg-emerald-100/70 hover:shadow-xs transition-all flex flex-col items-center text-center cursor-pointer group active:scale-95"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center group-hover:scale-105 transition-transform mb-1 shadow-2xs">
              <TrendingDown className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-black text-emerald-900">SAVE</span>
            <span className="text-[9px] text-emerald-700 font-bold">{shoppingListCount} items</span>
          </button>
        </div>
      </div>

      {/* 2. INNOVATIVE SHOPPING CARD: Easy Restock & Delivery */}
      <section
        id="home-shopping-list-card"
        className="p-4 sm:p-5 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden border border-slate-800"
      >
        <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-emerald-500/15 to-transparent pointer-events-none" />

        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                  Smart Shopping List
                </h3>
                <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {shoppingListCount} Items
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-store route or 3-tier doorstep delivery
              </p>
            </div>
          </div>

          <div className="hidden sm:block text-right shrink-0">
            <div className="text-[10px] text-slate-400 font-medium">Estimated Trip Savings</div>
            <div className="text-sm font-black text-emerald-400">Save ~R42.00</div>
          </div>
        </div>

        {/* 2 Focused Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800 relative z-10">
          {/* Action 1: Scan Finished Item */}
          <button
            onClick={onOpenPantryScan}
            id="home-scan-finished-item-btn"
            className="py-2.5 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-between transition-colors cursor-pointer group active:scale-98"
          >
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>Scan Finished Item at Home</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Action 2: View List & Plan Trip */}
          <button
            onClick={onOpenShoppingList}
            id="home-open-shopping-list-btn"
            className="py-2.5 px-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-between transition-colors cursor-pointer group active:scale-98 shadow-xs"
          >
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              <span>View List & Store Routes</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </section>

      {/* 3. NEARBY NOW (CLEAN PRODUCT CARDS - NO EXCESSIVE CLUTTER) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-emerald-600" />
            <h2 className="font-black text-slate-900 text-base tracking-tight">
              Nearby Deals
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

        {/* Horizontal Card Scroll with clean, focused metadata */}
        <div className="flex gap-3.5 overflow-x-auto pb-2 pt-1 scrollbar-none -mx-4 px-4">
          {nearbySpecials.map((special) => {
            const retailer = RETAILERS.find((r) => r.id === special.retailer_id) || RETAILERS[0];
            return (
              <div
                key={special.id}
                onClick={() => onSelectSpecial(special)}
                className="w-60 shrink-0 bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-emerald-500 cursor-pointer transition-all overflow-hidden flex flex-col group"
              >
                {/* Clean Image Banner with 1 Anchor Badge */}
                <div className="h-34 relative bg-slate-100 overflow-hidden">
                  <img
                    src={special.image_url}
                    alt={special.product_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2.5 right-2.5 bg-emerald-600 text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-xs">
                    Save R{special.savings.toFixed(2)}
                  </span>
                  <span className="absolute bottom-2 left-2 bg-slate-950/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>{special.distance_km || 1.4} km</span>
                  </span>
                </div>

                {/* Details */}
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: retailer.primaryColor }}
                      />
                      <span className="truncate">{special.retailer_name}</span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-xs line-clamp-1 group-hover:text-emerald-700">
                      {special.product_name}
                    </h3>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-baseline justify-between">
                    <div>
                      <span className="text-base font-black text-slate-900">
                        R{special.price.toFixed(2)}
                      </span>
                      <span className="text-xs text-slate-400 line-through ml-1.5">
                        R{(special.original_price || special.price + special.savings).toFixed(2)}
                      </span>
                    </div>

                    <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      -{special.savings_percentage}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. COMMUNITY TRENDING */}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {trendingSpecials.map((special) => (
            <div
              key={special.id}
              onClick={() => onSelectSpecial(special)}
              className="p-3 rounded-2xl border border-slate-200/90 bg-white hover:border-emerald-500 hover:shadow-xs transition-all cursor-pointer flex items-center gap-3 group"
            >
              <img
                src={special.image_url}
                alt={special.product_name}
                className="w-14 h-14 rounded-xl object-cover bg-slate-100 shrink-0"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                  <span>{special.retailer_name}</span>
                </div>

                <div className="font-extrabold text-slate-900 text-xs truncate mt-0.5 group-hover:text-emerald-700">
                  {special.product_name}
                </div>

                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="font-black text-slate-900 text-sm">
                    R{special.price.toFixed(2)}
                  </span>
                  <span className="text-[11px] text-emerald-600 font-bold">
                    Save R{special.savings.toFixed(2)}
                  </span>
                </div>

                <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>{special.verified_count} verified</span>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 shrink-0" />
            </div>
          ))}
        </div>
      </section>

      {/* 5. TOP SAVINGS DEALS */}
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
              className="p-3 bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-500 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="h-26 rounded-xl overflow-hidden bg-slate-100 relative mb-2">
                <img
                  src={special.image_url}
                  alt={special.product_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute top-1.5 right-1.5 bg-emerald-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md">
                  -{special.savings_percentage}%
                </span>
              </div>

              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase truncate">
                  {special.retailer_name}
                </div>
                <div className="font-extrabold text-slate-900 text-xs line-clamp-1 mt-0.5">
                  {special.product_name}
                </div>
              </div>

              <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-baseline justify-between">
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
