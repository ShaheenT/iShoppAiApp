import React from 'react';
import { Camera, Sparkles, Share2, ArrowRight, ShieldCheck, TrendingUp, Users } from 'lucide-react';

interface HeroSectionProps {
  onOpenScan: () => void;
  onOpenRadar: () => void;
  totalSavings: number;
  totalSpecialsCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenScan,
  onOpenRadar,
  totalSavings,
  totalSpecialsCount,
}) => {
  return (
    <div className="w-full bg-gradient-to-b from-slate-50 to-white pt-8 pb-10 px-4 sm:px-6 border-b border-slate-100">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Tagline & Headline */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live South African Retail Intelligence Network
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Save more together.
            <span className="block text-emerald-600">Snap • Scan • Share</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl font-normal">
            A real-time community-powered savings platform. Photograph in-store specials across Pick n Pay, Checkers, Woolworths, Shoprite & Spar. Our AI extracts pricing instantly and verifies deals for shoppers nearby.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={onOpenScan}
              id="hero-scan-btn"
              className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 hover:scale-102"
            >
              <Camera className="w-4 h-4" />
              <span>Snap & Scan a Special</span>
              <span className="bg-emerald-600 text-emerald-100 text-[11px] px-2 py-0.5 rounded-full font-bold">
                +50 pts
              </span>
            </button>

            <button
              onClick={onOpenRadar}
              id="hero-radar-btn"
              className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-sm transition-all flex items-center gap-2"
            >
              <span>Explore Store Radar</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* The Three Pillars: Snap • Scan • Share Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Snap */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-sm transition-shadow space-y-3 relative overflow-hidden group">
            <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <Camera className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black tracking-wider text-rose-600 bg-rose-100/60 px-2 py-0.5 rounded-md">
                  Pillar 01
                </span>
                <h3 className="font-extrabold text-slate-900 text-base">Snap In-Store</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Take a quick photo of any shelf price tag, flyer discount, or promotional banner during your grocery run.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1.5 text-[11px] font-semibold text-rose-700">
              <span>Mobile-first camera integration</span>
            </div>
          </div>

          {/* Card 2: Scan */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-sm transition-shadow space-y-3 relative overflow-hidden group">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black tracking-wider text-emerald-600 bg-emerald-100/60 px-2 py-0.5 rounded-md">
                  Pillar 02
                </span>
                <h3 className="font-extrabold text-slate-900 text-base">Scan with AI</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Gemini 3.8 multimodal OCR instantly extracts product, brand, unit size, price, and loyalty conditions with 98% accuracy.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
              <span>Automated price intelligence</span>
            </div>
          </div>

          {/* Card 3: Share */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-sm transition-shadow space-y-3 relative overflow-hidden group">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Share2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black tracking-wider text-blue-600 bg-blue-100/60 px-2 py-0.5 rounded-md">
                  Pillar 03
                </span>
                <h3 className="font-extrabold text-slate-900 text-base">Share with Community</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Publish verified specials directly to the live feed. Nearby shoppers save money and you earn points and reputation.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1.5 text-[11px] font-semibold text-blue-700">
              <span>Earn points & unlock badges</span>
            </div>
          </div>
        </div>

        {/* Community Ticker */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Community Savings
            </span>
            <span className="text-lg font-black text-slate-900">
              R {(1482900 + totalSavings).toLocaleString()}
            </span>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Live Verified Specials
            </span>
            <span className="text-lg font-black text-emerald-600">
              {totalSpecialsCount + 4820} deals
            </span>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Active Deal Hunters
            </span>
            <span className="text-lg font-black text-slate-900">1,290 shoppers</span>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Chains Covered
            </span>
            <span className="text-lg font-black text-slate-900">10 Major Retailers</span>
          </div>
        </div>
      </div>
    </div>
  );
};
