import React from 'react';
import { RETAILERS } from '../../server/seedData.js';
import { RetailerId } from '../types/index.js';

interface RetailerBarProps {
  selectedRetailer: string;
  onSelectRetailer: (id: string) => void;
}

export const RetailerBar: React.FC<RetailerBarProps> = ({
  selectedRetailer,
  onSelectRetailer,
}) => {
  return (
    <div className="w-full bg-white border-y border-slate-100 py-3 px-4" id="retailer-bar">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto no-scrollbar scroll-smooth">
        <div className="flex items-center gap-2 flex-shrink-0 pr-3 border-r border-slate-200">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Retailers:
          </span>
          <button
            onClick={() => onSelectRetailer('all')}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
              selectedRetailer === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All (10)
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          {RETAILERS.map((retailer) => {
            const isSelected = selectedRetailer === retailer.id;
            return (
              <button
                key={retailer.id}
                onClick={() => onSelectRetailer(retailer.id)}
                id={`retailer-btn-${retailer.id}`}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm ring-2 ring-emerald-400/20'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: retailer.primaryColor }}
                />
                <span>{retailer.name}</span>
                {retailer.loyaltyProgram && (
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full font-normal hidden sm:inline">
                    {retailer.loyaltyProgram}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
