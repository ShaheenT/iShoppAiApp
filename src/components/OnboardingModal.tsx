import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  MapPin,
  Bell,
  ArrowRight,
  Store,
  ShoppingBag,
  Camera,
  ShieldCheck,
  X,
} from 'lucide-react';
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

const ALL_CATEGORIES: Category[] = [
  'Groceries',
  'Fresh Produce',
  'Meat',
  'Frozen',
  'Household',
  'Baby',
  'Beauty',
  'Pharmacy',
  'Electronics',
  'Clothing',
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  onLaunchScan,
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([
    'Groceries',
    'Fresh Produce',
    'Meat',
  ]);
  const [selectedRetailers, setSelectedRetailers] = useState<RetailerId[]>([
    'picknpay',
    'checkers',
    'woolworths',
  ]);
  const [selectedCity, setSelectedCity] = useState<string>('Cape Town');
  const [locationGranted, setLocationGranted] = useState<boolean>(true);
  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    nearbySpecials: true,
    newDeals: true,
    reminders: false,
  });

  if (!isOpen) return null;

  const toggleCategory = (cat: Category) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleRetailer = (retId: RetailerId) => {
    setSelectedRetailers((prev) =>
      prev.includes(retId) ? prev.filter((r) => r !== retId) : [...prev, retId]
    );
  };

  const handleFinish = (launchScanDirectly = false) => {
    onComplete({
      categories: selectedCategories,
      retailers: selectedRetailers,
      city: selectedCity,
      notifications,
    });
    onClose();
    if (launchScanDirectly) {
      onLaunchScan();
    }
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div
        id="onboarding-modal"
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Step Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 flex">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div
              key={s}
              className={`flex-1 h-full transition-colors duration-300 ${
                s <= step ? 'bg-emerald-500' : 'bg-transparent'
              }`}
            />
          ))}
        </div>

        {/* Modal Header */}
        <div className="px-6 pt-5 pb-2 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Step {step} of 6
          </span>
          {step > 1 && (
            <button
              onClick={() => handleFinish(false)}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600"
            >
              Skip
            </button>
          )}
        </div>

        {/* Dynamic Step Content */}
        <div className="px-6 py-4 flex-1 overflow-y-auto">
          {/* SCREEN 1: Welcome to iShopp */}
          {step === 1 && (
            <div className="space-y-6 text-center py-4">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Sparkles className="w-10 h-10 animate-bounce-short" />
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                  Welcome to iShopp.
                </h2>
                <p className="text-base font-semibold text-emerald-600">
                  Your smarter way to shop.
                </p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto pt-1 leading-relaxed">
                  Never miss a special again. Join South Africa's community-powered retail intelligence network.
                </p>
              </div>

              {/* 4 Pillars Mini Cards */}
              <div className="grid grid-cols-4 gap-2 pt-2">
                <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <div className="text-xs font-black text-slate-800">SNAP</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Photo</div>
                </div>
                <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <div className="text-xs font-black text-slate-800">SCAN</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">AI OCR</div>
                </div>
                <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <div className="text-xs font-black text-slate-800">SHARE</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Publish</div>
                </div>
                <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                  <div className="text-xs font-black text-emerald-700">SAVE</div>
                  <div className="text-[10px] text-emerald-600 mt-0.5">Together</div>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                id="onboarding-step1-next"
                className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-black text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Let’s Go</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* SCREEN 2: What do you shop for? */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  What do you shop for?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Select your usual categories to tailor your deals feed.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {ALL_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`p-3 rounded-2xl border text-left flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/60 text-emerald-950'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{cat}</span>
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                          isSelected
                            ? 'bg-emerald-500 text-white'
                            : 'border border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5" />}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setStep(3)}
                id="onboarding-step2-next"
                className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-black text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* SCREEN 3: Which stores do you use? */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  Which stores do you use?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Pick your favorite South African supermarkets to track specials.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {RETAILERS.map((ret) => {
                  const isSelected = selectedRetailers.includes(ret.id);
                  return (
                    <button
                      key={ret.id}
                      type="button"
                      onClick={() => toggleRetailer(ret.id)}
                      className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/60 text-emerald-950'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: ret.primaryColor }}
                      />
                      <span className="truncate flex-1">{ret.name}</span>
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${
                          isSelected
                            ? 'bg-emerald-500 text-white'
                            : 'border border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5" />}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setStep(4)}
                id="onboarding-step3-next"
                className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-black text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* SCREEN 4: Location Permission */}
          {step === 4 && (
            <div className="space-y-6 text-center py-2">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <MapPin className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  See specials near you.
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Location enables live nearby deals, accurate distance calculation (e.g., 1.4 km away), store branch discovery, and turn-by-turn navigation.
                </p>
              </div>

              {/* City Selector Fallback */}
              <div className="text-left bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Select your primary metro area:
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                >
                  <option value="Cape Town">Cape Town (Sea Point, Waterfront, Gardens)</option>
                  <option value="Johannesburg">Johannesburg (Sandton, Rosebank, CBD)</option>
                  <option value="Durban">Durban (Umhlanga, Morningside)</option>
                  <option value="Pretoria">Pretoria (Menlyn, Brooklyn)</option>
                  <option value="Stellenbosch">Stellenbosch</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setLocationGranted(true);
                  setStep(5);
                }}
                id="onboarding-step4-next"
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MapPin className="w-4 h-4" />
                <span>Enable Location & Continue</span>
              </button>
            </div>
          )}

          {/* SCREEN 5: Notifications */}
          {step === 5 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  Want to know when prices drop?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Choose which alerts keep you updated on grocery savings.
                </p>
              </div>

              <div className="space-y-2.5">
                <label className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 bg-slate-50 cursor-pointer">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Price Drop Alerts</div>
                    <div className="text-[11px] text-slate-500">When staple goods reach their lowest price</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.priceAlerts}
                    onChange={(e) =>
                      setNotifications((prev) => ({ ...prev, priceAlerts: e.target.checked }))
                    }
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 bg-slate-50 cursor-pointer">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Nearby Specials</div>
                    <div className="text-[11px] text-slate-500">Deals discovered within 3 km of you</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.nearbySpecials}
                    onChange={(e) =>
                      setNotifications((prev) => ({ ...prev, nearbySpecials: e.target.checked }))
                    }
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 bg-slate-50 cursor-pointer">
                  <div>
                    <div className="text-xs font-bold text-slate-900">New Verified Deals</div>
                    <div className="text-[11px] text-slate-500">Specials shared by Trusted Contributors</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.newDeals}
                    onChange={(e) =>
                      setNotifications((prev) => ({ ...prev, newDeals: e.target.checked }))
                    }
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                </label>
              </div>

              <button
                onClick={() => setStep(6)}
                id="onboarding-step5-next"
                className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-black text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* SCREEN 6: You're ready */}
          {step === 6 && (
            <div className="space-y-6 text-center py-4">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Check className="w-10 h-10 stroke-[3]" />
              </div>

              <div className="space-y-2">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                  You’re ready.
                </h3>
                <p className="text-base font-bold text-emerald-600">
                  Never miss a special again.
                </p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Start by scanning a shelf price tag or exploring live specials near you in {selectedCity}.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={() => handleFinish(true)}
                  id="onboarding-action-scan"
                  className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Scan a Special</span>
                </button>

                <button
                  onClick={() => handleFinish(false)}
                  id="onboarding-action-explore"
                  className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Explore Deals Feed
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
