import React, { useState } from 'react';
import { X, MapPin, Store, Navigation, Filter, Sparkles, Compass } from 'lucide-react';
import { BRANCHES, RETAILERS } from '../../server/seedData.js';
import { Special } from '../types/index.js';

interface NearbyMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  specials: Special[];
  currentCity: string;
}

export const NearbyMapModal: React.FC<NearbyMapModalProps> = ({
  isOpen,
  onClose,
  specials,
  currentCity,
}) => {
  const [selectedBranchId, setSelectedBranchId] = useState<string>(BRANCHES[0].id);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const cityBranches = BRANCHES.filter(
    (b) => b.city.toLowerCase() === currentCity.toLowerCase() || currentCity === 'all'
  );
  const selectedBranch = BRANCHES.find((b) => b.id === selectedBranchId) || cityBranches[0] || BRANCHES[0];
  const retailer = RETAILERS.find((r) => r.id === selectedBranch.retailer_id) || RETAILERS[0];
  const branchDeals = specials.filter((s) => s.retailer_id === selectedBranch.retailer_id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-100 flex flex-col h-[85vh]"
        id="nearby-map-modal"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                Nearby Discovery & Store Radar
                <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
                  {currentCity}
                </span>
              </h3>
              <p className="text-xs text-slate-500">Live verified specials mapped across local branches</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout: Radar Canvas + Store Side Panel */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Visual Interactive Map / Radar Stage */}
          <div className="flex-1 bg-slate-900 relative p-6 flex flex-col justify-between overflow-hidden">
            {/* Map Background Grid & Radar rings */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
            
            {/* Concentric radar range circles */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 rounded-full border border-emerald-500/20 animate-ping opacity-25" style={{ animationDuration: '4s' }} />
              <div className="w-96 h-96 rounded-full border border-emerald-500/15" />
              <div className="w-[500px] h-[500px] rounded-full border border-slate-700/40" />
            </div>

            {/* Radar status overlay */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="bg-slate-800/80 backdrop-blur text-emerald-400 text-xs px-3 py-1.5 rounded-full font-mono flex items-center gap-2 border border-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Radar: {cityBranches.length} Stores Located
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                GPS: -33.9249° S, 18.4241° E
              </span>
            </div>

            {/* Store Pins inside interactive radar space */}
            <div className="relative z-10 my-auto h-64 flex items-center justify-center">
              {cityBranches.map((branch, idx) => {
                const bRetailer = RETAILERS.find((r) => r.id === branch.retailer_id) || RETAILERS[0];
                const isSelected = selectedBranchId === branch.id;
                // Generate distributed positions around center
                const angles = [0, 45, 90, 135, 180, 225, 270, 315];
                const angle = (angles[idx % angles.length] * Math.PI) / 180;
                const distance = 70 + (idx % 3) * 35;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;

                return (
                  <button
                    key={branch.id}
                    onClick={() => setSelectedBranchId(branch.id)}
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                    }}
                    className={`absolute flex flex-col items-center group cursor-pointer transition-all duration-300 ${
                      isSelected ? 'scale-125 z-20' : 'hover:scale-110 opacity-80 hover:opacity-100 z-10'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform ${
                        isSelected ? 'ring-4 ring-emerald-400' : ''
                      }`}
                      style={{ backgroundColor: bRetailer.primaryColor }}
                    >
                      <Store className="w-4 h-4" />
                    </div>
                    <span
                      className={`mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow ${
                        isSelected
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-800 text-slate-200 group-hover:bg-slate-700'
                      }`}
                    >
                      {branch.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}

              {/* User Center Pulse */}
              <div className="w-4 h-4 rounded-full bg-emerald-400 shadow-[0_0_15px_#10B981] ring-4 ring-emerald-400/30" />
            </div>

            {/* Bottom radar footer */}
            <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400">
              <span>Center: Your Location</span>
              <span>Map Engine: Mapbox Vector Core</span>
            </div>
          </div>

          {/* Store & Deals Side Panel */}
          <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-200 flex flex-col bg-slate-50/50 p-4 overflow-y-auto">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: retailer.primaryColor }}
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm leading-tight">{selectedBranch.name}</h4>
                  <p className="text-[11px] text-slate-500">{selectedBranch.address}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 text-slate-600">
                <span>Loyalty:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {retailer.loyaltyProgram || 'Special Offers'}
                </span>
              </div>
            </div>

            {/* Specials available at this store */}
            <div className="mt-4 space-y-2 flex-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Live In-Store Specials ({branchDeals.length})
              </span>

              {branchDeals.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-4 text-center">
                  No specials logged for this branch yet. Be the first to snap one!
                </p>
              ) : (
                branchDeals.map((deal) => (
                  <div
                    key={deal.id}
                    className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-emerald-300 transition-colors space-y-1.5"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-slate-900 leading-tight">
                        {deal.product_name}
                      </span>
                      <span className="text-xs font-black text-emerald-700">R{deal.price}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 line-through">
                        {deal.original_price ? `R${deal.original_price}` : ''}
                      </span>
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">
                        Save R{deal.savings}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
