import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Navigation,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  Store,
  ArrowRight,
  Truck,
  Clock,
  ShieldCheck,
  Camera,
  MapPin,
  Phone,
  Check,
  Receipt,
  RotateCcw,
} from 'lucide-react';
import { ShoppingListItem, Special, DeliveryTier, DeliveryOrder } from '../types/index.js';
import { DELIVERY_TIERS, DeliveryTierDetail } from '../data/finishedItemsData.js';

interface ShoppingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  specials: Special[];
  items: ShoppingListItem[];
  onAddItem: (nameOrItem: string | ShoppingListItem) => void;
  onRemoveItem: (id: string) => void;
  onToggleItem: (id: string) => void;
  onOpenPantryScan: () => void;
  userCity?: string;
}

export const ShoppingListModal: React.FC<ShoppingListModalProps> = ({
  isOpen,
  onClose,
  specials,
  items,
  onAddItem,
  onRemoveItem,
  onToggleItem,
  onOpenPantryScan,
  userCity = 'Cape Town',
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'deliver' | 'orders'>('list');
  const [newItemText, setNewItemText] = useState('');
  const [selectedTier, setSelectedTier] = useState<DeliveryTier>('concierge_multistore');

  // Delivery order form state
  const [address, setAddress] = useState(`42 Regent Road, Sea Point, ${userCity}`);
  const [phone, setPhone] = useState('082 555 0192');
  const [instructions, setInstructions] = useState('Please buzz apartment 304 or leave with security.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState<DeliveryOrder | null>(null);

  if (!isOpen) return null;

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.price || 25.0) * item.quantity, 0);
  const totalSavings = items.reduce((sum, item) => sum + (item.savings || 6.0) * item.quantity, 0);
  const currentTierObj = DELIVERY_TIERS.find((t) => t.id === selectedTier) || DELIVERY_TIERS[0];
  const deliveryFee = currentTierObj.fee;
  const finalTotal = subtotal + deliveryFee;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    onAddItem(newItemText.trim());
    setNewItemText('');
  };

  const handlePlaceDeliveryOrder = () => {
    if (items.length === 0) return;
    setIsSubmitting(true);

    const newOrder: DeliveryOrder = {
      id: `ord-${Date.now()}`,
      tier: selectedTier,
      address,
      phone,
      deliveryTime: currentTierObj.deliveryTime,
      items: [...items],
      totalSpend: finalTotal,
      totalSavings,
      deliveryFee,
      status: 'confirmed',
      assignedShopper: 'Sipho Dlamini (4.9 ★ • 620 trips)',
      etaMinutes: selectedTier === 'ondemand_express' ? 45 : 120,
      storesCovered: ['Checkers Kloof Street', 'Pick n Pay Sea Point'],
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setOrderPlaced(newOrder);
      setActiveTab('orders');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="shopping-list-modal"
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]"
      >
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 via-teal-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                  iShopp Smart Grocery List
                </h3>
                <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  {items.length} items
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Scan finished items at home • Multi-store route or direct delivery
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenPantryScan();
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Scan Finished Item</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50/70 p-1.5 text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'list'
                ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                : 'hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
            <span>My List & Store Route</span>
          </button>

          <button
            onClick={() => setActiveTab('deliver')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'deliver'
                ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                : 'hover:text-slate-900'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Submit for Delivery (3 Tiers)</span>
          </button>

          {orderPlaced && (
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'orders'
                  ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                  : 'hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Live Order Tracking</span>
            </button>
          )}
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: LIST & IN-STORE ROUTE */}
          {activeTab === 'list' && (
            <div className="space-y-4">
              {/* Scan Finished Item Prompt Card */}
              <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-slate-900">
                      Finished milk, bread or coffee at home?
                    </div>
                    <div className="text-[11px] text-slate-600 truncate">
                      Point camera at empty container to auto-add to this list!
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onOpenPantryScan();
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex-shrink-0 shadow-2xs"
                >
                  Scan Now
                </button>
              </div>

              {/* Add item manual bar */}
              <form onSubmit={handleFormSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  placeholder="Add item (e.g. Avocado, White Sugar 2.5kg, Jacobs Coffee)..."
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-slate-900 hover:bg-black text-white font-extrabold text-xs rounded-2xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </form>

              {/* Items List */}
              {items.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6 space-y-2">
                  <ShoppingBag className="w-8 h-8 mx-auto text-slate-300" />
                  <div className="text-xs font-bold text-slate-700">Your grocery list is empty</div>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                    Type an item above or scan finished containers from your fridge & pantry!
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenPantryScan();
                    }}
                    className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                  >
                    <Camera className="w-3.5 h-3.5" /> Scan Finished Item
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        item.checked
                          ? 'bg-slate-50/70 border-slate-200 opacity-60'
                          : 'bg-white border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      <div
                        onClick={() => onToggleItem(item.id)}
                        className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                      >
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
                            item.checked
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-slate-300 hover:border-emerald-500'
                          }`}
                        >
                          {item.checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-xs font-extrabold truncate ${
                                item.checked ? 'line-through text-slate-400' : 'text-slate-900'
                              }`}
                            >
                              {item.product_name}
                            </span>
                            {item.scannedAtHome && (
                              <span className="text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full flex-shrink-0">
                                📸 Scanned at Home
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>{item.store || 'Pick n Pay Sea Point'}</span>
                            <span>•</span>
                            <span className="font-bold text-slate-600">
                              R{((item.price || 25.0) * item.quantity).toFixed(2)}
                            </span>
                            {item.savings && item.savings > 0 && (
                              <span className="text-emerald-600 font-bold">
                                (Save R{(item.savings * item.quantity).toFixed(2)})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                          Qty: {item.quantity}
                        </span>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-slate-300 hover:text-rose-500 p-1 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* In-Store Optimal Supermarket Route Banner */}
              {items.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-400">
                      <Navigation className="w-3.5 h-3.5" />
                      <span>In-Store Walk & Multi-Store Savings</span>
                    </div>
                    <span className="text-xs font-black text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full">
                      Save R{totalSavings.toFixed(2)} Total
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Splitting your items between <strong>Checkers Kloof Street</strong> (Dairy & Meat) and <strong>Pick n Pay Sea Point</strong> (Bakery & Pantry) saves you <strong>R{totalSavings.toFixed(2)}</strong> versus buying at a single store.
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                    <span className="text-slate-400">Estimated Items Total:</span>
                    <span className="text-sm font-black text-white">R{subtotal.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={() => setActiveTab('deliver')}
                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Or Have iShopp Deliver This List</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SUBMIT FOR DELIVERY WITH 3 TIERS */}
          {activeTab === 'deliver' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500">
                Choose your preferred fulfillment tier to submit your grocery list:
              </div>

              {/* Tier Selection Cards */}
              <div className="space-y-2.5">
                {DELIVERY_TIERS.map((tier) => {
                  const isSelected = selectedTier === tier.id;
                  return (
                    <div
                      key={tier.id}
                      onClick={() => setSelectedTier(tier.id)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-slate-900 text-xs sm:text-sm">
                              {tier.title}
                            </span>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${tier.badgeColor}`}>
                              {tier.badge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1">{tier.description}</p>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <div className="text-sm font-black text-slate-900">
                            {tier.fee === 0 ? 'Free' : `R${tier.fee.toFixed(2)}`}
                          </div>
                          <div className="text-[10px] font-bold text-slate-400 flex items-center justify-end gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            <span>{tier.deliveryTime}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
                        {tier.features.slice(0, 2).map((feat, idx) => (
                          <span key={idx} className="flex items-center gap-1 text-slate-600">
                            <Check className="w-3 h-3 text-emerald-600" />
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Delivery Address & Contact Details Form */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Delivery Address & Contact</span>
                </h4>

                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Street Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full mt-0.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Mobile Phone</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full mt-0.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Shopper Instructions</label>
                      <input
                        type="text"
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        className="w-full mt-0.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Price Summary Breakdown */}
                <div className="pt-2 border-t border-slate-200 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Items Subtotal ({items.length} items):</span>
                    <span>R{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>iShopp Specials Savings:</span>
                    <span>-R{totalSavings.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>{currentTierObj.title} Delivery Fee:</span>
                    <span>{deliveryFee === 0 ? 'Free (In-Store Self Shop)' : `R${deliveryFee.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between font-black text-slate-900 text-sm pt-1 border-t border-slate-200">
                    <span>Total to Pay:</span>
                    <span>R{finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Submit Order Action */}
                <button
                  onClick={handlePlaceDeliveryOrder}
                  disabled={isSubmitting || items.length === 0}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                >
                  {isSubmitting ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      <span>Dispatching Personal Shopper & Optimizing Route...</span>
                    </>
                  ) : (
                    <>
                      <Truck className="w-4 h-4" />
                      <span>Submit Grocery List & Confirm Delivery (R{finalTotal.toFixed(2)})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: LIVE ORDER TRACKING */}
          {activeTab === 'orders' && orderPlaced && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-500 text-white rounded-2xl space-y-3 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-black">
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>Order Placed & Confirmed!</span>
                  </div>
                  <span className="text-[10px] font-black bg-white/20 px-2 py-0.5 rounded-full">
                    {orderPlaced.id}
                  </span>
                </div>

                <div className="text-lg font-black">
                  Estimated Arrival: in {orderPlaced.etaMinutes} mins
                </div>

                <p className="text-xs text-emerald-100">
                  Delivering to: {orderPlaced.address}
                </p>
              </div>

              {/* Progress Milestones */}
              <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3">
                <h4 className="text-xs font-black text-slate-900">Fulfillment Status</h4>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center gap-3 text-emerald-700 font-bold">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">
                      ✓
                    </div>
                    <span>1. Order Received & Multi-Store Split Optimized</span>
                  </div>

                  <div className="flex items-center gap-3 text-emerald-700 font-bold">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">
                      ✓
                    </div>
                    <span>2. Shopper Assigned: {orderPlaced.assignedShopper}</span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-700 font-bold">
                    <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs animate-pulse">
                      ⏳
                    </div>
                    <span>3. Picking items at Checkers & Pick n Pay (Checking expiries)</span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-400">
                    <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs">
                      4
                    </div>
                    <span>4. Out for delivery in cooler bags</span>
                  </div>
                </div>
              </div>

              {/* Items in order */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                <div className="font-extrabold text-slate-900">
                  Ordered Items ({orderPlaced.items.length}):
                </div>
                <div className="divide-y divide-slate-200">
                  {orderPlaced.items.map((it, idx) => (
                    <div key={idx} className="py-1.5 flex items-center justify-between">
                      <span className="text-slate-700 font-medium">{it.product_name}</span>
                      <span className="text-slate-900 font-bold">
                        R{((it.price || 25.0) * it.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Best price guarantee across SA Supermarkets</span>
          </div>

          <button
            onClick={onClose}
            className="text-xs font-extrabold text-slate-700 hover:text-slate-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
