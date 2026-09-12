import React, { useState } from 'react';
import {
  X,
  Truck,
  CheckCircle2,
  Navigation,
  Sparkles,
  ShoppingBag,
  Clock,
  ShieldCheck,
  MapPin,
  Phone,
  ArrowRight,
  Store,
  ChevronRight,
} from 'lucide-react';
import { ShoppingListItem, DeliveryTier, DeliveryOrder } from '../types/index.js';

interface DeliveryTierModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ShoppingListItem[];
  userCity: string;
  onOrderCompleted?: (order: DeliveryOrder) => void;
}

export const DeliveryTierModal: React.FC<DeliveryTierModalProps> = ({
  isOpen,
  onClose,
  items,
  userCity,
  onOrderCompleted,
}) => {
  const [selectedTier, setSelectedTier] = useState<DeliveryTier>('ondemand_express');
  const [address, setAddress] = useState(`127 Ocean View Drive, Sea Point, ${userCity}`);
  const [phone, setPhone] = useState('082 555 1234');
  const [deliverySlot, setDeliverySlot] = useState('Within 45-60 minutes');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<DeliveryOrder | null>(null);

  if (!isOpen) return null;

  const totalSpend = items.reduce((acc, curr) => acc + (curr.price || 25), 0);
  const totalSavings = items.reduce((acc, curr) => acc + (curr.savings || 0), 0);

  const tierDetails = {
    self_shopper: {
      name: 'Self-Shopper (Free)',
      badge: 'In-Store Route',
      fee: 0,
      description: 'You shop in-store with our smart multi-retailer route. We guide you aisle-by-aisle.',
      benefit: 'Maximum personal savings & zero delivery fees.',
      eta: 'Your own schedule',
    },
    ondemand_express: {
      name: 'On-Demand Delivery (Express)',
      badge: 'Most Popular',
      fee: 35.0,
      description: '1-click submit grocery list to Checkers Sixty60, Pick n Pay ASAP! or Woolies Dash.',
      benefit: 'Delivered directly to your door in 45-60 minutes.',
      eta: '45-60 mins',
    },
    concierge_multistore: {
      name: 'iShopp Concierge Runner',
      badge: 'VIP Multi-Store Saver',
      fee: 49.0,
      description: 'An iShopp personal shopper visits both Checkers & Pick n Pay to get the cheapest deal on each item!',
      benefit: 'Combines multi-store discounts with 1 doorstep delivery.',
      eta: '60-75 mins',
    },
  };

  const currentFee = tierDetails[selectedTier].fee;
  const grandTotal = totalSpend + currentFee;

  const handleSubmitOrder = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/shopping-list/deliver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          address,
          phone,
          tier: selectedTier,
          deliveryTime: deliverySlot,
        }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setConfirmedOrder(data.order);
        if (onOrderCompleted) onOrderCompleted(data.order);
      }
    } catch (err) {
      console.warn('Delivery API error, using simulated order:', err);
      const simulated: DeliveryOrder = {
        id: `ISHOPP-DELIV-${Math.floor(100000 + Math.random() * 900000)}`,
        tier: selectedTier,
        address,
        phone,
        deliveryTime: deliverySlot,
        items,
        totalSpend,
        totalSavings,
        deliveryFee: currentFee,
        status: 'confirmed',
        assignedShopper: selectedTier === 'self_shopper' ? undefined : 'Sipho Ndlovu (iShopp Courier #412)',
        etaMinutes: selectedTier === 'self_shopper' ? 0 : 50,
        storesCovered: ['Checkers Kloof Street', 'Pick n Pay Sea Point'],
        createdAt: new Date().toISOString(),
      };
      setConfirmedOrder(simulated);
      if (onOrderCompleted) onOrderCompleted(simulated);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="delivery-tier-modal"
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md">
              <Truck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base leading-tight flex items-center gap-1.5">
                <span>Submit & Deliver Grocery List</span>
                <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase">
                  Fulfillment
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Choose your shopping preference & delivery speed
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Confirmed Order State */}
          {confirmedOrder ? (
            <div className="space-y-4 text-center py-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-[11px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
                  Order Dispatched • {confirmedOrder.id}
                </span>
                <h4 className="text-xl font-black text-slate-900 mt-2">
                  {confirmedOrder.tier === 'self_shopper'
                    ? 'In-Store Route Ready!'
                    : 'Grocery List Submitted for Delivery!'}
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {confirmedOrder.tier === 'self_shopper'
                    ? 'Your optimized shopping list is ready with aisle directions.'
                    : `Your personal shopper ${confirmedOrder.assignedShopper} is picking your items!`}
                </p>
              </div>

              {/* Order summary box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Address:</span>
                  <span className="font-bold text-slate-900">{confirmedOrder.address}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Estimated Arrival:</span>
                  <span className="font-bold text-emerald-600">
                    {confirmedOrder.tier === 'self_shopper' ? 'In-Store Checklist' : '45-60 minutes'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Grocery Items ({items.length}):</span>
                  <span className="font-bold text-slate-900">R{totalSpend.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Fee:</span>
                  <span className="font-bold text-slate-900">
                    {currentFee === 0 ? 'FREE' : `R${currentFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between font-black text-sm text-slate-900">
                  <span>Total:</span>
                  <span>R{(totalSpend + currentFee).toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-xs transition-all shadow-md cursor-pointer"
              >
                Done & Return to Shopping List
              </button>
            </div>
          ) : (
            <>
              {/* Basket Overview */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-semibold">Shopping List Basket</div>
                  <div className="text-lg font-black text-white">
                    {items.length} items • Est. R{totalSpend.toFixed(2)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-emerald-400 font-bold">Total Savings</div>
                  <div className="text-base font-black text-emerald-400">
                    Save R{totalSavings.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Tier Selection */}
              <div className="space-y-2.5">
                <label className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                  Select Delivery / Fulfillment Tier:
                </label>

                {/* Tier 1 */}
                <div
                  onClick={() => setSelectedTier('self_shopper')}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    selectedTier === 'self_shopper'
                      ? 'border-emerald-500 bg-emerald-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="mt-0.5">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedTier === 'self_shopper'
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {selectedTier === 'self_shopper' && <span className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 text-xs">
                        {tierDetails.self_shopper.name}
                      </span>
                      <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        FREE
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      {tierDetails.self_shopper.description}
                    </p>
                  </div>
                </div>

                {/* Tier 2 */}
                <div
                  onClick={() => setSelectedTier('ondemand_express')}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    selectedTier === 'ondemand_express'
                      ? 'border-emerald-500 bg-emerald-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="mt-0.5">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedTier === 'ondemand_express'
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {selectedTier === 'ondemand_express' && <span className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                        <span>{tierDetails.ondemand_express.name}</span>
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full">
                          Sixty60 / ASAP / Dash
                        </span>
                      </span>
                      <span className="text-xs font-black text-slate-900">
                        +R35.00
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      {tierDetails.ondemand_express.description}
                    </p>
                  </div>
                </div>

                {/* Tier 3 */}
                <div
                  onClick={() => setSelectedTier('concierge_multistore')}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    selectedTier === 'concierge_multistore'
                      ? 'border-emerald-500 bg-emerald-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="mt-0.5">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedTier === 'concierge_multistore'
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {selectedTier === 'concierge_multistore' && <span className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                        <span>{tierDetails.concierge_multistore.name}</span>
                        <span className="text-[10px] font-black bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded-full">
                          VIP Multi-Store
                        </span>
                      </span>
                      <span className="text-xs font-black text-slate-900">
                        +R49.00
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      {tierDetails.concierge_multistore.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery Details Inputs */}
              {selectedTier !== 'self_shopper' && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Delivery Address
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                        placeholder="Street address & suburb"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Contact Phone
                      </label>
                      <div className="relative">
                        <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Delivery Speed
                      </label>
                      <select
                        value={deliverySlot}
                        onChange={(e) => setDeliverySlot(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="Within 45-60 minutes">Now (45-60 mins)</option>
                        <option value="Today 5:00 PM - 7:00 PM">Today Evening</option>
                        <option value="Tomorrow 8:00 AM - 10:00 AM">Tomorrow Morning</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 active:scale-95 transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Submitting Grocery List...</span>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>
                        {selectedTier === 'self_shopper'
                          ? 'Generate In-Store Shopping Checklist'
                          : `Submit List & Deliver (Total R${grandTotal.toFixed(2)})`}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
