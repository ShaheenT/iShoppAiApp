import React, { useState } from 'react';
import {
  Sparkles,
  TrendingDown,
  Clock,
  MapPin,
  CheckCircle2,
  Plus,
  ArrowUpRight,
  Filter,
  Layers,
  ShoppingBag,
  Store,
  Check,
} from 'lucide-react';
import { Special, Category } from '../types/index.js';
import { RETAILERS } from '../../server/seedData.js';

interface FeedViewProps {
  specials: Special[];
  onOpenPriceIntelligence: (special: Special) => void;
  onAddToList: (special: Special) => void;
  onVerifyDeal: (specialId: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  sortBy: 'savings' | 'distance' | 'price';
  onSortChange: (sort: 'savings' | 'distance' | 'price') => void;
}

const CATEGORIES = [
  'All',
  'Groceries',
  'Fresh Produce',
  'Meat',
  'Frozen',
  'Household',
  'Baby',
  'Pharmacy',
];

export const FeedView: React.FC<FeedViewProps> = ({
  specials,
  onOpenPriceIntelligence,
  onAddToList,
  onVerifyDeal,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
}) => {
  const [verifiedIds, setVerifiedIds] = useState<Set<string>>(new Set());
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const handleVerify = (id: string) => {
    if (verifiedIds.has(id)) return;
    setVerifiedIds((prev) => new Set(prev).add(id));
    onVerifyDeal(id);
  };

  const handleAdd = (special: Special) => {
    setAddedIds((prev) => new Set(prev).add(special.id));
    onAddToList(special);
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(special.id);
        return next;
      });
    }, 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6" id="feed-container">
      {/* Feed Controls Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 flex-shrink-0 text-xs font-semibold text-slate-500">
          <Filter className="w-3.5 h-3.5" />
          <span>Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="bg-slate-100 border-none rounded-lg px-2.5 py-1 text-slate-800 font-bold focus:outline-none cursor-pointer"
          >
            <option value="savings">Biggest Savings (ZAR)</option>
            <option value="distance">Closest to Me</option>
            <option value="price">Lowest Price</option>
          </select>
        </div>
      </div>

      {/* Specials Count Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
        <span>Showing {specials.length} verified live specials</span>
        <span className="flex items-center gap-1 text-emerald-600 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          Real-time community sync active
        </span>
      </div>

      {/* Deals Grid */}
      {specials.length === 0 ? (
        <div className="p-12 text-center bg-slate-50 rounded-3xl border border-slate-200 space-y-2">
          <p className="text-sm font-bold text-slate-700">No specials found matching this filter</p>
          <p className="text-xs text-slate-400">Try selecting "All" or be the first to snap a deal!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {specials.map((special) => {
            const retailer = RETAILERS.find((r) => r.id === special.retailer_id) || RETAILERS[0];
            const isVerified = verifiedIds.has(special.id);
            const isAdded = addedIds.has(special.id);

            return (
              <div
                key={special.id}
                id={`deal-card-${special.id}`}
                className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col group"
              >
                {/* Image Header & Badges */}
                <div
                  onClick={() => onOpenPriceIntelligence(special)}
                  className="h-48 relative overflow-hidden bg-slate-100 cursor-pointer"
                >
                  <img
                    src={special.image_url}
                    alt={special.product_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Top Retailer Tag */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm text-xs font-bold text-slate-800">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: retailer.primaryColor }}
                    />
                    <span>{retailer.name}</span>
                  </div>

                  {/* Savings Pill */}
                  <div className="absolute top-3 right-3 bg-emerald-500 text-white px-2.5 py-1 rounded-full text-xs font-black shadow-sm flex items-center gap-1">
                    <span>Save R{special.savings.toFixed(2)}</span>
                    {special.savings_percentage && (
                      <span className="text-[10px] opacity-90">({special.savings_percentage}%)</span>
                    )}
                  </div>

                  {/* Bottom Distance & Store Banner */}
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-white bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-xl">
                    <span className="truncate max-w-[65%] font-medium">{special.branch_name}</span>
                    <span className="font-bold flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      {special.distance_km ? `${special.distance_km} km` : 'Nearby'}
                    </span>
                  </div>
                </div>

                {/* Deal Details Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                      <span>{special.category}</span>
                      <span>{special.created_at}</span>
                    </div>

                    <h4
                      onClick={() => onOpenPriceIntelligence(special)}
                      className="font-extrabold text-slate-900 text-base line-clamp-1 leading-snug cursor-pointer group-hover:text-emerald-700 transition-colors"
                    >
                      {special.product_name}
                    </h4>

                    {special.promotion_text && (
                      <p className="text-xs text-emerald-700 font-semibold line-clamp-1 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                        {special.promotion_text}
                      </p>
                    )}
                  </div>

                  {/* Pricing Row */}
                  <div className="flex items-baseline justify-between pt-1 border-t border-slate-100">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900">
                        R{special.price.toFixed(2)}
                      </span>
                      {special.original_price && (
                        <span className="text-xs text-slate-400 line-through font-medium">
                          R{special.original_price.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Unit Size */}
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {special.unit_size}
                    </span>
                  </div>

                  {/* Contributor & Verification Info */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700">
                        {special.user_name.charAt(0)}
                      </div>
                      <span className="text-slate-600 font-medium truncate max-w-[110px]">
                        {special.user_name}
                      </span>
                    </div>

                    {/* Community Verification Button */}
                    <button
                      onClick={() => handleVerify(special.id)}
                      title="Verify this in-store price"
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                        isVerified
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isVerified ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span>{special.verified_count + (isVerified ? 1 : 0)} verified</span>
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => onOpenPriceIntelligence(special)}
                      className="py-2 px-3 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 hover:bg-slate-50 transition-colors"
                    >
                      <TrendingDown className="w-3.5 h-3.5 text-slate-500" />
                      <span>Price History</span>
                    </button>

                    <button
                      onClick={() => handleAdd(special)}
                      className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Added
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" /> Add to List
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
