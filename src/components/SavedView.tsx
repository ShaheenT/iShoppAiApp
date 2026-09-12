import React, { useState } from 'react';
import {
  Bookmark,
  ListTodo,
  Store,
  Bell,
  Navigation,
  Trash2,
  Plus,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  MapPin,
  ExternalLink,
  Camera,
  Truck,
  ShoppingBag,
} from 'lucide-react';
import { Special, SavedSpecial, PriceAlert, RetailerId } from '../types/index.js';
import { RETAILERS } from '../../server/seedData.js';

interface SavedViewProps {
  savedSpecials: Special[];
  onSelectSpecial: (special: Special) => void;
  onRemoveSaved: (specialId: string) => void;
  onOpenDirections: (special: Special) => void;
  onOpenShoppingList?: () => void;
  onOpenPantryScan?: () => void;
}

export const SavedView: React.FC<SavedViewProps> = ({
  savedSpecials,
  onSelectSpecial,
  onRemoveSaved,
  onOpenDirections,
  onOpenShoppingList,
  onOpenPantryScan,
}) => {
  const [activeTab, setActiveTab] = useState<'specials' | 'lists' | 'stores' | 'alerts'>('specials');

  // Interactive Shopping List State
  const [shoppingItems, setShoppingItems] = useState([
    { id: 'item-1', name: 'Coca-Cola Original 2L', completed: false, store: 'Pick n Pay Sea Point', price: 19.99 },
    { id: 'item-2', name: 'Albany Superior White Bread 700g', completed: false, store: 'Pick n Pay Sea Point', price: 14.99 },
    { id: 'item-3', name: 'Clover Fresh Full Cream Milk 2L', completed: true, store: 'Pick n Pay Sea Point', price: 24.99 },
    { id: 'item-4', name: 'Grabouw Boerewors 1kg', completed: false, store: 'Checkers Kloof Street', price: 79.99 },
  ]);
  const [newItemText, setNewItemText] = useState('');

  const [alerts, setAlerts] = useState<PriceAlert[]>([
    {
      id: 'a-1',
      user_id: 'u-current',
      product_name: 'Clover Milk 2L',
      target_price: 25.0,
      current_lowest_price: 24.99,
      is_active: true,
      created_at: '2026-09-10',
    },
    {
      id: 'a-2',
      user_id: 'u-current',
      product_name: 'Jacobs Coffee 200g',
      target_price: 90.0,
      current_lowest_price: 89.99,
      is_active: true,
      created_at: '2026-09-11',
    },
  ]);

  const [followedRetailers, setFollowedRetailers] = useState<RetailerId[]>([
    'picknpay',
    'checkers',
    'woolworths',
  ]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    setShoppingItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        name: newItemText.trim(),
        completed: false,
        store: 'Any nearby retailer',
        price: 25.0,
      },
    ]);
    setNewItemText('');
  };

  const toggleItem = (id: string) => {
    setShoppingItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, completed: !it.completed } : it))
    );
  };

  const deleteItem = (id: string) => {
    setShoppingItems((prev) => prev.filter((it) => it.id !== id));
  };

  const toggleRetailer = (retId: RetailerId) => {
    setFollowedRetailers((prev) =>
      prev.includes(retId) ? prev.filter((r) => r !== retId) : [...prev, retId]
    );
  };

  const totalListEst = shoppingItems.reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div id="saved-view-screen" className="space-y-5 pb-24 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Saved & Lists
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Your saved specials, planned trips, and price alerts
        </p>
      </div>

      {/* Segmented Control Tabs */}
      <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/80 text-xs font-bold text-slate-600">
        <button
          onClick={() => setActiveTab('specials')}
          className={`py-2 rounded-xl transition-all ${
            activeTab === 'specials'
              ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
              : 'hover:text-slate-900'
          }`}
        >
          Specials ({savedSpecials.length})
        </button>

        <button
          onClick={() => setActiveTab('lists')}
          className={`py-2 rounded-xl transition-all ${
            activeTab === 'lists'
              ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
              : 'hover:text-slate-900'
          }`}
        >
          Smart List
        </button>

        <button
          onClick={() => setActiveTab('stores')}
          className={`py-2 rounded-xl transition-all ${
            activeTab === 'stores'
              ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
              : 'hover:text-slate-900'
          }`}
        >
          Stores ({followedRetailers.length})
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`py-2 rounded-xl transition-all ${
            activeTab === 'alerts'
              ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
              : 'hover:text-slate-900'
          }`}
        >
          Alerts ({alerts.length})
        </button>
      </div>

      {/* 1. SAVED SPECIALS TAB */}
      {activeTab === 'specials' && (
        <div className="space-y-3">
          {savedSpecials.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">No saved specials yet</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Tap the bookmark icon on any special to save it here for your next shopping run.
              </p>
            </div>
          ) : (
            savedSpecials.map((special) => (
              <div
                key={special.id}
                className="p-4 bg-white rounded-3xl border border-slate-200 hover:border-emerald-500 hover:shadow-xs transition-all flex items-center justify-between gap-3 group"
              >
                <div
                  onClick={() => onSelectSpecial(special)}
                  className="flex items-center gap-3.5 flex-1 min-w-0 cursor-pointer"
                >
                  <img
                    src={special.image_url}
                    alt={special.product_name}
                    className="w-16 h-16 rounded-2xl object-cover bg-slate-100 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold text-slate-400 uppercase truncate">
                      {special.retailer_name} • {special.branch_name}
                    </div>
                    <div className="font-extrabold text-slate-900 text-xs truncate group-hover:text-emerald-700">
                      {special.product_name}
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-black text-slate-900 text-sm">
                        R{special.price.toFixed(2)}
                      </span>
                      <span className="text-xs font-bold text-emerald-600">
                        Save R{special.savings.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenDirections(special)}
                    title="Get Directions"
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden sm:inline">Directions</span>
                  </button>

                  <button
                    onClick={() => onRemoveSaved(special.id)}
                    title="Remove"
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 2. SMART SHOPPING LIST TAB (MULTI-STORE OPTIMIZER) */}
      {activeTab === 'lists' && (
        <div className="space-y-4">
          {/* Quick Action Buttons for Scan & Deliver */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={onOpenPantryScan}
              className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl flex items-center justify-between text-xs font-bold shadow-xs hover:shadow transition-all"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <Camera className="w-4 h-4" />
                </div>
                <div className="text-left leading-tight">
                  <span className="block font-black">Scan Finished Item</span>
                  <span className="text-[10px] text-emerald-100">Point at empty cartons / jars</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-200" />
            </button>

            <button
              onClick={onOpenShoppingList}
              className="p-3 bg-slate-900 text-white rounded-2xl flex items-center justify-between text-xs font-bold shadow-xs hover:bg-black transition-all"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center">
                  <Truck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-left leading-tight">
                  <span className="block font-black">Submit for Delivery</span>
                  <span className="text-[10px] text-slate-400">3 Tiers: Express or Saver</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Multi-Store Route Optimizer banner */}
          <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-black text-emerald-900">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Smart Route Savings Optimizer</span>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Buying Coke, Bread & Milk at <strong>Pick n Pay Sea Point</strong> (1.4 km) and Boerewors at <strong>Checkers Kloof</strong> saves you <strong>R42.00</strong> compared to a single-store trip.
            </p>
            <div className="flex items-center justify-between pt-1 text-xs font-bold text-emerald-900">
              <span>Estimated Total:</span>
              <span className="text-sm font-black">R{totalListEst.toFixed(2)}</span>
            </div>
          </div>

          {/* Add Item Input */}
          <form onSubmit={handleAddItem} className="flex gap-2">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder="Add item (e.g. Avocado, White Sugar 2.5kg)..."
              className="flex-1 bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </form>

          {/* List Items */}
          <div className="space-y-2">
            {shoppingItems.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                  item.completed
                    ? 'bg-slate-50 border-slate-200 opacity-60'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div
                  onClick={() => toggleItem(item.id)}
                  className="flex items-center gap-3 flex-1 cursor-pointer"
                >
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      item.completed
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-300'
                    }`}
                  >
                    {item.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>

                  <div>
                    <div
                      className={`text-xs font-bold ${
                        item.completed ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}
                    >
                      {item.name}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Store className="w-3 h-3 text-slate-400" />
                      <span>{item.store} • Est. R{item.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => deleteItem(item.id)}
                  className="text-slate-300 hover:text-red-500 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. FOLLOWED RETAILERS TAB */}
      {activeTab === 'stores' && (
        <div className="space-y-3">
          <p className="text-xs text-slate-500">
            Follow supermarkets to prioritize their flyers and shelf tags in your feed:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {RETAILERS.map((ret) => {
              const isFollowed = followedRetailers.includes(ret.id);
              return (
                <div
                  key={ret.id}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-white flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-2xs"
                      style={{ backgroundColor: ret.primaryColor }}
                    >
                      {ret.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-900 text-xs">{ret.name}</div>
                      <div className="text-[10px] text-slate-400">National Retailer</div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleRetailer(ret.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isFollowed
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isFollowed ? 'Following' : '+ Follow'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. PRICE ALERTS TAB */}
      {activeTab === 'alerts' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Get notified immediately when prices drop below your target:
            </p>
          </div>

          <div className="space-y-2.5">
            {alerts.map((al) => (
              <div
                key={al.id}
                className="p-4 rounded-3xl border border-slate-200 bg-white flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 text-xs">{al.product_name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Target: <strong className="text-slate-900">R{al.target_price.toFixed(2)}</strong> • Current Lowest: <span className="text-emerald-600 font-bold">R{al.current_lowest_price?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                  Deal Active
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
