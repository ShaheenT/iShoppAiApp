import React, { useState } from 'react';
import {
  Sparkles,
  Camera,
  Zap,
  Share2,
  TrendingDown,
  ShoppingBag,
  ArrowRight,
  Check,
  MapPin,
  CheckCircle2,
  Compass,
  X,
} from 'lucide-react';
import { IShoppIcon } from './IShoppIcon.js';
import { Category, RetailerId } from '../types/index.js';
import { RETAILERS } from '../../server/seedData.js';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: {
    categories: Category[];
    retailers: RetailerId[];
    city: string;
    notifications: {
      priceAlerts: boolean;
      nearbySpecials: boolean;
      newDeals: boolean;
      reminders: boolean;
    };
  }) => void;
  onLaunchScan: () => void;
}

const PRIMARY_CATEGORIES: Category[] = [
  'Groceries',
  'Fresh Produce',
  'Meat',
  'Frozen',
  'Household',
  'Baby',
];

const CITIES = ['Cape Town', 'Johannesburg', 'Durban', 'Pretoria', 'Stellenbosch'];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  onLaunchScan,
}) => {
  // Step 1: Welcome & The 4 Pillars (Snap • Scan • Share • Save)
  // Step 2: Customise your store & local area
  // Step 3: Fast start (Ready to Save & Shop)
  const [step, setStep] = useState<number>(1);
  const [selectedRetailers, setSelectedRetailers] = useState<RetailerId[]>([
    'picknpay',
    'checkers',
    'woolworths',
  ]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([
    'Groceries',
    'Fresh Produce',
    'Meat',
  ]);
  const [selectedCity, setSelectedCity] = useState<string>('Cape Town');

  if (!isOpen) return null;

  const toggleRetailer = (id: RetailerId) => {
    setSelectedRetailers((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const toggleCategory = (cat: Category) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleFinish = (launchScanDirectly = false) => {
    onComplete({
      categories: selectedCategories,
      retailers: selectedRetailers,
      city: selectedCity,
      notifications: {
        priceAlerts: true,
        nearbySpecials: true,
        newDeals: true,
        reminders: false,
      },
    });
    onClose();
    if (launchScanDirectly) {
      onLaunchScan();
    }
  };

  return (
    <div
      id="onboarding-modal-backdrop"
      className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-md overflow-y-auto overscroll-contain p-3 sm:p-5 flex min-h-full items-start sm:items-center justify-center py-4 sm:py-8 animate-in fade-in duration-200"
    >
      <div
        id="onboarding-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        className="bg-white w-full max-w-lg my-auto rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-3rem)] animate-in zoom-in-95 duration-200 shrink-0"
      >
        {/* Visual Progress Bar (3 Smooth Steps) */}
        <div className="w-full bg-slate-100 h-1.5 flex shrink-0">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-full transition-all duration-300 ${
                s <= step ? 'bg-emerald-500' : 'bg-transparent'
              }`}
            />
          ))}
        </div>

        {/* Modal Top Header */}
        <div className="px-5 sm:px-6 pt-4 sm:pt-5 pb-2 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Step {step} of 3
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-extrabold text-emerald-700">
              {step === 1 && 'Welcome'}
              {step === 2 && 'Your Stores'}
              {step === 3 && 'Ready to Save'}
            </span>
          </div>

          <button
            onClick={() => handleFinish(false)}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Skip to App
          </button>
        </div>

        {/* Modal Dynamic Body */}
        <div className="px-5 sm:px-6 py-4 flex-1 overflow-y-auto overscroll-contain">
          {/* STEP 1: VALUE PROPOSITION - SNAP, SCAN, SHARE, SAVE */}
          {step === 1 && (
            <div className="space-y-6 text-center py-2">
              <div className="w-18 h-18 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-rose-500 p-0.5 shadow-xl shadow-emerald-500/20 flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center">
                  <IShoppIcon size={42} withGlow />
                </div>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Welcome to iShopp
                </h2>
                <p className="text-sm font-bold text-emerald-600 mt-1">
                  Snap. Scan. Share. Save.
                </p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-2 leading-relaxed">
                  South Africa's community-driven retail intelligence network. Never overpay on groceries again.
                </p>
              </div>

              {/* 4 Pillars Explained Simply */}
              <div className="grid grid-cols-2 gap-2.5 text-left pt-1">
                {/* 1. SNAP */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-black text-xs mb-2">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-black text-slate-900 uppercase tracking-wide">
                    1. SNAP
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Take a photo of any grocery deal, yellow tag, or paper flyer.
                  </div>
                </div>

                {/* 2. SCAN */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-black text-xs mb-2">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-black text-slate-900 uppercase tracking-wide">
                    2. SCAN
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Instant AI extracts item, price, unit savings, and store branch.
                  </div>
                </div>

                {/* 3. SHARE */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-black text-xs mb-2">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-black text-slate-900 uppercase tracking-wide">
                    3. SHARE
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Specials publish to neighbors in real time. Earn reward points.
                  </div>
                </div>

                {/* 4. SAVE */}
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 hover:border-emerald-300 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black text-xs mb-2 shadow-xs">
                    <TrendingDown className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-black text-emerald-800 uppercase tracking-wide">
                    4. SAVE
                  </div>
                  <div className="text-[11px] text-emerald-700 mt-0.5 leading-snug">
                    Build smart shopping lists, optimize routes, or order delivery.
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                id="onboarding-step1-next"
                className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-black text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Get Started in 30 Seconds</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: STORES & CITY */}
          {step === 2 && (
            <div className="space-y-5 py-1">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Where do you shop?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  We customize your daily feed based on your supermarkets and city.
                </p>
              </div>

              {/* City Selection */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Your primary metro area:</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CITIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedCity(c)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all text-center ${
                        selectedCity === c
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Retailer Grid */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Favorite Supermarkets:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {RETAILERS.map((ret) => {
                    const isSelected = selectedRetailers.includes(ret.id);
                    return (
                      <button
                        key={ret.id}
                        type="button"
                        onClick={() => toggleRetailer(ret.id)}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-950 shadow-2xs'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: ret.primaryColor }}
                        />
                        <span className="truncate flex-1">{ret.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Key Categories */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Usual Shopping Categories:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PRIMARY_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-slate-100 text-slate-600 border border-transparent hover:bg-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-3 px-4 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  id="onboarding-step2-next"
                  className="flex-1 py-3 rounded-2xl bg-slate-900 hover:bg-black text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: READY TO SAVE & EASY SHOPPING */}
          {step === 3 && (
            <div className="space-y-6 text-center py-2">
              <div className="w-18 h-18 mx-auto rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  You’re All Set!
                </h3>
                <p className="text-sm font-bold text-emerald-600 mt-0.5">
                  Save time & money in {selectedCity}
                </p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-2 leading-relaxed">
                  Start scanning grocery tags, replenish finished pantry items from home, or check the lowest prices before you head out.
                </p>
              </div>

              {/* Innovative Feature Highlights */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 p-3.5 rounded-2xl text-left space-y-2">
                <div className="flex items-center gap-2 text-xs font-black text-slate-900">
                  <ShoppingBag className="w-4 h-4 text-emerald-600" />
                  <span>Next-Gen Grocery Features:</span>
                </div>
                <div className="text-[11px] text-slate-600 space-y-1 pl-6 list-disc">
                  <div>• <strong>Home Pantry Scan:</strong> Point camera at empty milk cartons to add to list.</div>
                  <div>• <strong>D3 Route Cartography:</strong> Travel the shortest distance between stores.</div>
                  <div>• <strong>3 Delivery Tiers:</strong> Compare walking vs. Concierge Multi-Store delivery.</div>
                </div>
              </div>

              <div className="space-y-2.5 pt-1">
                <button
                  onClick={() => handleFinish(true)}
                  id="onboarding-action-scan"
                  className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Camera className="w-4 h-4" />
                  <span>Scan a Price Tag Now</span>
                </button>

                <button
                  onClick={() => handleFinish(false)}
                  id="onboarding-action-explore"
                  className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
                >
                  Explore Today's Verified Specials
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
