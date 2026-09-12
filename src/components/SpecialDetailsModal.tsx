import React, { useState } from 'react';
import {
  X,
  MapPin,
  Navigation,
  Clock,
  CheckCircle2,
  Bookmark,
  Share2,
  TrendingDown,
  AlertTriangle,
  Car,
  Footprints,
  Calendar,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Tag,
  ArrowUpRight,
  Check,
} from 'lucide-react';
import { Special, PriceHistoryPoint } from '../types/index.js';
import { RETAILERS, PRICE_HISTORY } from '../../server/seedData.js';
import { DirectionsModal } from './DirectionsModal.js';

interface SpecialDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  special: Special | null;
  onSaveToggle: (special: Special) => void;
  isSaved: boolean;
  onVerify: (specialId: string) => void;
  onOpenSpecial?: (special: Special) => void;
  nearbySpecials: Special[];
}

export const SpecialDetailsModal: React.FC<SpecialDetailsModalProps> = ({
  isOpen,
  onClose,
  special,
  onSaveToggle,
  isSaved,
  onVerify,
  onOpenSpecial,
  nearbySpecials,
}) => {
  const [isDirectionsOpen, setIsDirectionsOpen] = useState(false);
  const [hasVerified, setHasVerified] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);

  if (!isOpen || !special) return null;

  const retailer = RETAILERS.find((r) => r.id === special.retailer_id) || RETAILERS[0];
  const historyPoints: PriceHistoryPoint[] =
    PRICE_HISTORY[special.product_id] || [
      {
        id: 'h-1',
        product_id: special.product_id,
        date: '2026-09-08',
        day_label: 'Mon',
        price: special.original_price || special.price + 10,
        retailer_id: special.retailer_id,
        retailer_name: special.retailer_name,
      },
      {
        id: 'h-2',
        product_id: special.product_id,
        date: '2026-09-10',
        day_label: 'Wed',
        price: special.price + 4,
        retailer_id: special.retailer_id,
        retailer_name: special.retailer_name,
      },
      {
        id: 'h-3',
        product_id: special.product_id,
        date: '2026-09-12',
        day_label: 'Fri (Today)',
        price: special.price,
        retailer_id: special.retailer_id,
        retailer_name: special.retailer_name,
      },
    ];

  // More specials at this store / nearby
  const moreAtStore = nearbySpecials
    .filter((s) => s.id !== special.id && (s.retailer_id === special.retailer_id || s.branch_id === special.branch_id))
    .slice(0, 3);

  const handleVerifyClick = () => {
    if (hasVerified) return;
    setHasVerified(true);
    onVerify(special.id);
  };

  const handleShare = () => {
    const text = `Check this deal on iShopp AI: ${special.product_name} at ${special.retailer_name} (${special.branch_name}) for R${special.price.toFixed(2)} (Save R${special.savings.toFixed(2)})!`;
    if (navigator.share) {
      navigator.share({ title: special.product_name, text, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text} ${window.location.origin}`);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2500);
    }
  };

  const handleReport = () => {
    setReportSubmitted(true);
    setTimeout(() => setReportSubmitted(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div
        id="special-details-screen"
        className="bg-white w-full max-w-2xl sm:rounded-3xl shadow-2xl border border-slate-200 min-h-screen sm:min-h-0 max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Sticky Header Bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: retailer.primaryColor }}
            />
            <span className="font-extrabold text-sm text-slate-900">{retailer.name}</span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-semibold text-slate-500 truncate max-w-[180px]">
              {special.branch_name}
            </span>
          </div>

          <button
            onClick={onClose}
            id="close-special-details-btn"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* Main Hero Product Section */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Image Box */}
            <div className="w-full md:w-5/12 h-64 sm:h-72 rounded-3xl overflow-hidden relative bg-slate-100 border border-slate-200 flex-shrink-0">
              <img
                src={special.image_url}
                alt={special.product_name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-black shadow-md">
                Save R{special.savings.toFixed(2)} ({special.savings_percentage}%)
              </div>
              {special.confidence_score && (
                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs text-white px-2.5 py-1 rounded-xl text-[11px] font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>{special.confidence_score}% AI Verified</span>
                </div>
              )}
            </div>

            {/* Title & Pricing Breakdown */}
            <div className="w-full md:w-7/12 space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>{special.brand}</span>
                  <span>•</span>
                  <span>{special.category}</span>
                  <span>•</span>
                  <span>{special.unit_size}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  {special.product_name}
                </h1>
              </div>

              {/* Price Banner */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 flex items-baseline justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-500">Special Price</div>
                  <div className="text-3xl font-black text-slate-900 tracking-tight">
                    R{special.price.toFixed(2)}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-semibold text-slate-400">Regular Price</div>
                  <div className="text-lg font-bold text-slate-400 line-through">
                    R{(special.original_price || special.price + special.savings).toFixed(2)}
                  </div>
                </div>

                <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 px-3 py-1.5 rounded-xl text-center">
                  <div className="text-[10px] uppercase font-bold text-emerald-700">Discount</div>
                  <div className="text-sm font-black text-emerald-800">
                    -{special.savings_percentage}%
                  </div>
                </div>
              </div>

              {/* Promotion Condition & Loyalty Tag */}
              {special.promotion_text && (
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-900">
                  <Tag className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">{special.promotion_text}</span>
                    {special.expires_at && (
                      <p className="text-[11px] text-emerald-700 mt-0.5">
                        Expires: {special.expires_at}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Contributor Trust & Reputation Layer */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-black text-slate-700 text-xs">
                    {special.user_name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{special.user_username || `@${special.user_name.toLowerCase().replace(/\s+/g, '')}`}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {special.user_reputation_title || 'Trusted Contributor'} • {special.created_at}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleVerifyClick}
                  disabled={hasVerified}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    hasVerified
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs'
                  }`}
                >
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${hasVerified ? 'text-emerald-600' : 'text-slate-400'}`}
                  />
                  <span>
                    {special.verified_count + (hasVerified ? 1 : 0)} Verified
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Store Information & Travel Intelligence Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-xs"
                  style={{ backgroundColor: retailer.primaryColor }}
                >
                  {retailer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">{special.branch_name}</h3>
                  <p className="text-xs text-slate-500">{special.branch_address || 'Main Road, Sea Point'}</p>
                </div>
              </div>

              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                Open until 18:00
              </span>
            </div>

            {/* Travel Time Bar */}
            <div className="grid grid-cols-3 gap-2 bg-white rounded-2xl p-3 border border-slate-200/80 text-center text-xs">
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-bold">Distance</div>
                <div className="font-black text-slate-800 text-sm flex items-center justify-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  {special.distance_km || 1.4} km
                </div>
              </div>

              <div>
                <div className="text-slate-400 text-[10px] uppercase font-bold">Driving</div>
                <div className="font-black text-slate-800 text-sm flex items-center justify-center gap-1 mt-0.5">
                  <Car className="w-3.5 h-3.5 text-blue-600" />
                  ~{special.drive_time_mins || 8} min
                </div>
              </div>

              <div>
                <div className="text-slate-400 text-[10px] uppercase font-bold">Walking</div>
                <div className="font-black text-slate-800 text-sm flex items-center justify-center gap-1 mt-0.5">
                  <Footprints className="w-3.5 h-3.5 text-amber-600" />
                  ~{special.walk_time_mins || 18} min
                </div>
              </div>
            </div>

            {/* Visual Route Preview Box */}
            <div className="h-28 rounded-2xl bg-slate-200 border border-slate-300 relative overflow-hidden flex items-center justify-between px-6">
              {/* Map background styling */}
              <div
                className="absolute inset-0 opacity-40 bg-cover bg-center"
                style={{
                  backgroundImage:
                    'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80")',
                }}
              />
              <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-2xs" />

              {/* Journey Nodes */}
              <div className="relative z-10 flex items-center justify-between w-full">
                <div className="flex items-center gap-2 bg-white/95 px-3 py-1.5 rounded-full shadow-md text-xs font-bold text-slate-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                  <span>You</span>
                </div>

                <div className="flex-1 mx-4 border-t-2 border-dashed border-white/80 relative flex items-center justify-center">
                  <span className="bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {special.distance_km || 1.4} km direct
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-emerald-500 text-white px-3 py-1.5 rounded-full shadow-md text-xs font-black">
                  <MapPin className="w-3 h-3 text-white" />
                  <span>{special.branch_name.split(' ')[2] || 'Store'}</span>
                </div>
              </div>
            </div>

            {/* Get Directions CTA */}
            <button
              onClick={() => setIsDirectionsOpen(true)}
              id="special-get-directions-btn"
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions to {special.branch_name}</span>
            </button>
          </div>

          {/* Price Intelligence & Progression Timeline */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-emerald-600" />
                <h3 className="font-extrabold text-slate-900 text-sm">Price History Timeline</h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">Past 7 days</span>
            </div>

            {/* Price Step Visualizer */}
            <div className="grid grid-cols-3 gap-2">
              {historyPoints.map((pt, idx) => (
                <div
                  key={pt.id || idx}
                  className={`p-3 rounded-2xl border text-center ${
                    idx === historyPoints.length - 1
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="text-[11px] font-semibold text-slate-400">{pt.day_label}</div>
                  <div className="text-base font-black mt-1">R{pt.price.toFixed(2)}</div>
                  {idx === historyPoints.length - 1 && (
                    <span className="inline-block mt-1 text-[10px] font-extrabold bg-emerald-500 text-white px-1.5 py-0.5 rounded">
                      Lowest
                    </span>
                  )}
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Price dropped by <strong className="text-slate-900">R{special.savings.toFixed(2)}</strong> this week. Verified by {special.verified_count + (hasVerified ? 1 : 0)} local community shoppers in {special.branch_name}.
            </p>
          </div>

          {/* More Specials Nearby ("While you're there...") */}
          {moreAtStore.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                  <span>While you’re there…</span>
                  <span className="text-xs font-semibold text-slate-400">More deals nearby</span>
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {moreAtStore.map((nearby) => (
                  <div
                    key={nearby.id}
                    onClick={() => onOpenSpecial && onOpenSpecial(nearby)}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-emerald-500 hover:shadow-sm cursor-pointer transition-all flex items-center gap-3 group"
                  >
                    <img
                      src={nearby.image_url}
                      alt={nearby.product_name}
                      className="w-14 h-14 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-bold text-slate-400 uppercase truncate">
                        {nearby.retailer_name}
                      </div>
                      <div className="font-bold text-slate-900 text-xs truncate group-hover:text-emerald-700">
                        {nearby.product_name}
                      </div>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="font-black text-slate-900 text-sm">
                          R{nearby.price.toFixed(2)}
                        </span>
                        <span className="text-[11px] text-emerald-600 font-bold">
                          Save R{nearby.savings.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Persistent Bottom Action Bar */}
        <div className="sticky bottom-0 z-20 bg-white border-t border-slate-200 px-5 py-3.5 flex items-center justify-between gap-3 shadow-lg">
          {/* Save Button */}
          <button
            onClick={() => onSaveToggle(special)}
            id="special-action-save"
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-bold transition-colors ${
              isSaved
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-emerald-600 text-emerald-600' : ''}`} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            id="special-action-share"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold transition-colors"
          >
            {shareSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </>
            )}
          </button>

          {/* Primary Action: Get Directions */}
          <button
            onClick={() => setIsDirectionsOpen(true)}
            id="special-action-directions"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-slate-900 hover:bg-black text-white text-xs font-extrabold shadow-sm transition-all"
          >
            <Navigation className="w-3.5 h-3.5 text-emerald-400" />
            <span>Get Directions</span>
          </button>

          {/* Report Button */}
          <button
            onClick={handleReport}
            title="Report inaccurate deal"
            className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
          >
            <AlertTriangle className="w-4 h-4" />
          </button>
        </div>

        {/* Report toast feedback */}
        {reportSubmitted && (
          <div className="bg-amber-500 text-white text-xs font-bold text-center py-2 animate-in fade-in">
            Report received. Our community verifiers will check this shelf tag.
          </div>
        )}
      </div>

      {/* Directions modal selector */}
      <DirectionsModal
        isOpen={isDirectionsOpen}
        onClose={() => setIsDirectionsOpen(false)}
        special={special}
      />
    </div>
  );
};
