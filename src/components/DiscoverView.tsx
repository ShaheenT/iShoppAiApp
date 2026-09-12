import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Map,
  Grid,
  Filter,
  ArrowRight,
  Compass,
  MapPin,
} from 'lucide-react';
import { Special, Category, RetailerId } from '../types/index.js';
import { RETAILERS } from '../../server/seedData.js';
import { FeedView } from './FeedView.js';
import { RadarView } from './RadarView.js';

interface DiscoverViewProps {
  specials: Special[];
  onOpenPriceIntelligence: (special: Special) => void;
  onAddToList: (special: Special) => void;
  onVerifyDeal: (specialId: string) => void;
  onOpenDirections: (special: Special) => void;
  onAskAI: (query: string) => void;
}

const AI_SUGGESTIONS = [
  'Where can I get the cheapest Coke near me?',
  'Cheapest milk in Sea Point',
  'Braai meat specials under R100',
  'Pampers deals today',
  'Albany bread under R16',
];

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  specials,
  onOpenPriceIntelligence,
  onAddToList,
  onVerifyDeal,
  onOpenDirections,
  onAskAI,
}) => {
  const [viewMode, setViewMode] = useState<'feed' | 'radar'>('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRetailer, setSelectedRetailer] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'savings' | 'distance' | 'price'>('savings');

  // Filter specials
  const filteredSpecials = specials
    .filter((s) => {
      const matchesSearch =
        searchQuery === '' ||
        s.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.branch_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.retailer_name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRetailer =
        selectedRetailer === 'all' || s.retailer_id === selectedRetailer;

      const matchesCat =
        selectedCategory === 'All' || s.category === selectedCategory;

      return matchesSearch && matchesRetailer && matchesCat;
    })
    .sort((a, b) => {
      if (sortBy === 'savings') return b.savings - a.savings;
      if (sortBy === 'distance') return (a.distance_km || 10) - (b.distance_km || 10);
      if (sortBy === 'price') return a.price - b.price;
      return 0;
    });

  const handleChipClick = (query: string) => {
    setSearchQuery(query);
    onAskAI(query);
  };

  return (
    <div id="discover-view-screen" className="space-y-4 pb-24 animate-in fade-in duration-200">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products, stores, or ask AI (e.g. cheapest Coke)..."
          className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-24 py-3 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => onAskAI(searchQuery)}
            className="absolute right-2.5 top-2 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 transition-colors"
          >
            <Sparkles className="w-3 h-3" />
            <span>Ask AI</span>
          </button>
        )}
      </div>

      {/* AI Smart Search Prompts */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 text-xs">
        <span className="flex-shrink-0 text-slate-400 font-bold flex items-center gap-1 self-center pl-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Ask:</span>
        </span>
        {AI_SUGGESTIONS.map((sug) => (
          <button
            key={sug}
            onClick={() => handleChipClick(sug)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 font-semibold transition-colors border border-slate-200/80 cursor-pointer"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Retailers Horizontal Selector */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4">
        <button
          onClick={() => setSelectedRetailer('all')}
          className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            selectedRetailer === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          All Stores
        </button>

        {RETAILERS.map((ret) => (
          <button
            key={ret.id}
            onClick={() => setSelectedRetailer(ret.id)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              selectedRetailer === ret.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: ret.primaryColor }}
            />
            <span>{ret.name}</span>
          </button>
        ))}
      </div>

      {/* View Toggle Bar (Feed vs. Waze Radar) */}
      <div className="flex items-center justify-between pt-1">
        <div className="text-xs font-bold text-slate-500">
          Showing <strong className="text-slate-900">{filteredSpecials.length}</strong> live specials
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setViewMode('feed')}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
              viewMode === 'feed'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Feed</span>
          </button>

          <button
            onClick={() => setViewMode('radar')}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
              viewMode === 'radar'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Map Radar</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'feed' ? (
        <FeedView
          specials={filteredSpecials}
          onOpenPriceIntelligence={onOpenPriceIntelligence}
          onAddToList={onAddToList}
          onVerifyDeal={onVerifyDeal}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      ) : (
        <RadarView
          specials={filteredSpecials}
          onSelectSpecial={onOpenPriceIntelligence}
        />
      )}
    </div>
  );
};
