import React, { useState } from 'react';
import { X, TrendingDown, Bell, Check, ArrowDownRight, Store, ShieldCheck } from 'lucide-react';
import { PRICE_HISTORY, PRODUCTS, RETAILERS } from '../../server/seedData.js';
import { Special } from '../types/index.js';

interface PriceIntelligenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSpecial?: Special | null;
}

export const PriceIntelligenceModal: React.FC<PriceIntelligenceModalProps> = ({
  isOpen,
  onClose,
  selectedSpecial,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(
    selectedSpecial ? selectedSpecial.product_id : 'p-milk-2l'
  );
  const [alertTargetPrice, setAlertTargetPrice] = useState<string>('20.00');
  const [alertSubscribed, setAlertSubscribed] = useState<boolean>(false);

  if (!isOpen) return null;

  const history = PRICE_HISTORY[selectedProductId] || PRICE_HISTORY['p-milk-2l'];
  const currentProduct = PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[1];

  const lowestPrice = Math.min(...history.map((h) => h.price));
  const highestPrice = Math.max(...history.map((h) => h.price));
  const dropPercentage = Math.round(((highestPrice - lowestPrice) / highestPrice) * 100);

  const handleSubscribeAlert = (e: React.FormEvent) => {
    e.preventDefault();
    setAlertSubscribed(true);
    setTimeout(() => setAlertSubscribed(false), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]"
        id="price-intelligence-modal"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Price Intelligence</h3>
              <p className="text-xs text-slate-500">Every product builds historical transparency</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Product Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Tracked Product Intelligence
            </label>
            <div className="flex flex-wrap gap-2">
              {PRODUCTS.slice(0, 4).map((prod) => (
                <button
                  key={prod.id}
                  onClick={() => setSelectedProductId(prod.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    selectedProductId === prod.id
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {prod.name}
                </button>
              ))}
            </div>
          </div>

          {/* AI Intelligence Highlight Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50/40 border border-emerald-200/80 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                  AI Trend Analysis
                </span>
                <h4 className="text-base font-extrabold text-slate-900 mt-0.5">{currentProduct.name}</h4>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full flex items-center gap-1">
                <ArrowDownRight className="w-3.5 h-3.5" /> -{dropPercentage}% this week
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-emerald-200/60 text-center">
              <div>
                <span className="text-[10px] text-slate-500 block">Lowest Detected</span>
                <span className="text-sm font-black text-emerald-700">R{lowestPrice.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Peak Store Price</span>
                <span className="text-sm font-bold text-slate-600">R{highestPrice.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Cheapest Store</span>
                <span className="text-sm font-bold text-slate-900">Checkers</span>
              </div>
            </div>
          </div>

          {/* Historical Table — Faithful to IMG-20260912-WA0000.jpg */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Verified In-Store Price Progression</span>
              <span className="text-[11px] text-slate-500 font-medium">Community Verified</span>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="text-[11px] text-slate-400 uppercase tracking-wider bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Day / Date</th>
                  <th className="py-2.5 px-4 font-semibold">Retailer</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50/60 transition-colors ${
                      index === history.length - 1 ? 'bg-emerald-50/30 font-bold' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-medium text-slate-800 flex items-center gap-2">
                      <span>{item.day_label}</span>
                      {index === history.length - 1 && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                          Current
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-xs">{item.retailer_name}</td>
                    <td className="py-3 px-4 text-right font-black text-slate-900">
                      R{item.price.toFixed(item.price % 1 === 0 ? 0 : 2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Real-time Price Drop Alert Subscription */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-4 h-4 text-emerald-600" />
              <h5 className="font-bold text-xs text-slate-900">Set Real-Time Price Alert</h5>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              We'll notify you the moment {currentProduct.name} drops below your target price in your city.
            </p>

            <form onSubmit={handleSubscribeAlert} className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">R</span>
                <input
                  type="number"
                  step="0.50"
                  value={alertTargetPrice}
                  onChange={(e) => setAlertTargetPrice(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-500"
                  placeholder="20.00"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
              >
                {alertSubscribed ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Alert Set!
                  </>
                ) : (
                  <>Notify Me</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
