import React, { useState } from 'react';
import { MapPin, Navigation, Sparkles, Store, Compass, ArrowUpRight, Flame, Clock } from 'lucide-react';
import { Special, Branch } from '../types/index.js';
import { BRANCHES, RETAILERS } from '../../server/seedData.js';

interface RadarViewProps {
  specials: Special[];
  onSelectSpecial: (special: Special) => void;
}

export const RadarView: React.FC<RadarViewProps> = ({ specials, onSelectSpecial }) => {
  const [selectedBranchId, setSelectedBranchId] = useState<string>(BRANCHES[0]?.id || 'b-pnp-seapoint');

  const selectedBranch =
    BRANCHES.find((b) => b.id === selectedBranchId) || BRANCHES[0];
  const retailer =
    RETAILERS.find((r) => r.id === selectedBranch?.retailer_id) || RETAILERS[0];

  const branchSpecials = specials.filter(
    (s) =>
      s.retailer_id === selectedBranch?.retailer_id ||
      s.branch_name.toLowerCase().includes(selectedBranch?.name.toLowerCase() || '')
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs space-y-0">
      {/* Interactive Radar Stage (Waze-style Map Mockup with interactive store nodes) */}
      <div className="h-64 sm:h-80 bg-slate-950 relative overflow-hidden flex items-center justify-center p-6">
        {/* Radar concentric rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 rounded-full border border-emerald-500/10" />
          <div className="w-72 h-72 rounded-full border border-emerald-500/15" />
          <div className="w-48 h-48 rounded-full border border-emerald-500/20" />
          <div className="w-24 h-24 rounded-full border border-emerald-500/30" />
          {/* Pulsing radar beam line */}
          <div className="absolute w-48 h-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-400/40 to-emerald-400 origin-left animate-spin duration-7000" />
        </div>

        {/* User Centered Position */}
        <div className="absolute z-10 flex flex-col items-center">
          <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center animate-pulse">
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>
          <span className="mt-1 px-2 py-0.5 rounded-md bg-black/80 text-[10px] text-white font-bold backdrop-blur-xs">
            You (Sea Point)
          </span>
        </div>

        {/* Nearby Retailer Branch Nodes (Waze-like Pins) */}
        {BRANCHES.slice(0, 6).map((branch, idx) => {
          const ret = RETAILERS.find((r) => r.id === branch.retailer_id) || RETAILERS[0];
          const isSelected = branch.id === selectedBranchId;
          const count = specials.filter((s) => s.retailer_id === branch.retailer_id).length;

          // Positions around the center
          const angles = [45, 120, 210, 300, 160, 30];
          const distances = [90, 110, 85, 120, 100, 130];
          const angle = (angles[idx % angles.length] * Math.PI) / 180;
          const dist = distances[idx % distances.length];
          const x = Math.cos(angle) * dist;
          const y = Math.sin(angle) * dist;

          return (
            <button
              key={branch.id}
              onClick={() => setSelectedBranchId(branch.id)}
              style={{
                transform: `translate(${x}px, ${y}px)`,
              }}
              className={`absolute z-20 flex flex-col items-center group cursor-pointer transition-transform hover:scale-110 ${
                isSelected ? 'scale-110 z-30' : 'opacity-85 hover:opacity-100'
              }`}
            >
              <div
                className={`px-2 py-1 rounded-full text-white text-[11px] font-black flex items-center gap-1 shadow-md border ${
                  isSelected
                    ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 border-white'
                    : 'border-white/30'
                }`}
                style={{ backgroundColor: ret.primaryColor }}
              >
                <Store className="w-3 h-3" />
                <span>{branch.name.replace('Sea Point', '').trim() || ret.name}</span>
                <span className="w-4 h-4 rounded-full bg-black/40 text-[9px] flex items-center justify-center font-bold">
                  {count || 3}
                </span>
              </div>
              <span className="text-[9px] text-slate-300 font-semibold mt-0.5 bg-black/60 px-1.5 rounded">
                ~{0.9 + idx * 0.4} km
              </span>
            </button>
          );
        })}

        {/* Live Indicator overlay */}
        <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] text-emerald-400 font-bold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Waze Community Radar • Live Store Specials</span>
        </div>
      </div>

      {/* Selected Branch Header & Deals list */}
      <div className="p-4 sm:p-5 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: retailer.primaryColor }}
              />
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                {selectedBranch.name}
              </h3>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{selectedBranch.address}, {selectedBranch.city}</span>
              <span>•</span>
              <Clock className="w-3 h-3 text-slate-400" />
              <span className="text-emerald-700 font-semibold">{selectedBranch.opening_hours}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              {branchSpecials.length} active specials
            </span>
          </div>
        </div>

        {/* Store specials horizontal/grid cards */}
        <div className="pt-4 space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Active Deals at this branch
          </h4>

          {branchSpecials.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-3">
              No live specials submitted for this branch yet. Be the first to snap!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {branchSpecials.map((s) => (
                <div
                  key={s.id}
                  onClick={() => onSelectSpecial(s)}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 cursor-pointer transition-all group"
                >
                  <img
                    src={s.image_url}
                    alt={s.product_name}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-extrabold text-slate-900 truncate group-hover:text-emerald-700">
                      {s.product_name}
                    </p>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-sm font-black text-slate-900">
                        R{s.price.toFixed(2)}
                      </span>
                      {s.original_price && (
                        <span className="text-[10px] text-slate-400 line-through">
                          R{s.original_price.toFixed(2)}
                        </span>
                      )}
                      <span className="text-[10px] text-emerald-600 font-bold">
                        Save R{s.savings.toFixed(2)}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">{s.unit_size}</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
