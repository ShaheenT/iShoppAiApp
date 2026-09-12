import React, { useState } from 'react';
import { X, Navigation, ExternalLink, MapPin, Car, Footprints, Share2, Check } from 'lucide-react';
import { Special, Branch } from '../types/index.js';
import { RETAILERS } from '../../server/seedData.js';

interface DirectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  special?: Special | null;
  branch?: Branch | null;
}

export const DirectionsModal: React.FC<DirectionsModalProps> = ({
  isOpen,
  onClose,
  special,
  branch,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const branchName = special?.branch_name || branch?.name || 'Supermarket Branch';
  const branchAddress =
    special?.branch_address || branch?.address || 'Main Road, Cape Town';
  const retailerId = special?.retailer_id || branch?.retailer_id || 'picknpay';
  const retailer = RETAILERS.find((r) => r.id === retailerId) || RETAILERS[0];

  const lat = branch?.latitude || (special?.branch_id === 'b-pnp-seapoint' ? -33.918 : -33.905);
  const lng = branch?.longitude || (special?.branch_id === 'b-pnp-seapoint' ? 18.392 : 18.421);
  const distance = special?.distance_km || 1.4;
  const driveTime = special?.drive_time_mins || 8;
  const walkTime = special?.walk_time_mins || 18;

  // External Navigation URLs
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    branchName + ' ' + branchAddress
  )}&destination_place_id=&travelmode=driving`;
  const appleMapsUrl = `https://maps.apple.com/?daddr=${lat},${lng}&dirflg=d&q=${encodeURIComponent(
    branchName
  )}`;
  const wazeUrl = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;

  const handleShareLocation = () => {
    const text = `Check this deal at ${branchName} (${branchAddress}) on iShopp AI!`;
    if (navigator.share) {
      navigator.share({ title: branchName, text, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text} ${googleMapsUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        id="directions-modal"
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-xs"
              style={{ backgroundColor: retailer.primaryColor }}
            >
              {retailer.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{branchName}</h3>
              <p className="text-xs text-slate-500 truncate max-w-[240px]">{branchAddress}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Travel Info Bar */}
        <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 flex items-center justify-around text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>{distance} km away</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5 text-blue-600" />
            <span>~{driveTime} min drive</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-1.5">
            <Footprints className="w-3.5 h-3.5 text-amber-600" />
            <span>~{walkTime} min walk</span>
          </div>
        </div>

        {/* Navigation Provider Choices */}
        <div className="p-5 space-y-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Choose navigation app
          </p>

          {/* Google Maps */}
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="nav-google-maps"
            className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                G
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-900 text-sm">Google Maps</div>
                <div className="text-xs text-slate-500">Live traffic & turn-by-turn routing</div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
          </a>

          {/* Apple Maps */}
          <a
            href={appleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="nav-apple-maps"
            className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm">
                
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-900 text-sm">Apple Maps</div>
                <div className="text-xs text-slate-500">Optimized for iOS devices</div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
          </a>

          {/* Waze */}
          <a
            href={wazeUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="nav-waze"
            className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-black text-sm group-hover:bg-sky-500 group-hover:text-white transition-colors">
                W
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-900 text-sm">Waze</div>
                <div className="text-xs text-slate-500">Community speed trap & pothole alerts</div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
          </a>

          {/* Share location CTA */}
          <button
            onClick={handleShareLocation}
            className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Store link copied to clipboard!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share Store Location</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
