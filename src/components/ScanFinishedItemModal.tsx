import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  Plus,
  ArrowRight,
  RefreshCw,
  ShoppingBag,
  Store,
  Tag,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { ShoppingListItem, Special } from '../types/index.js';
import { COMMON_FINISHED_ITEMS, FinishedPantryItemPreset } from '../data/finishedItemsData.js';

interface ScanFinishedItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onItemAdded: (item: ShoppingListItem) => void;
  onOpenShoppingList: () => void;
  currentListCount: number;
}

export const ScanFinishedItemModal: React.FC<ScanFinishedItemModalProps> = ({
  isOpen,
  onClose,
  onItemAdded,
  onOpenShoppingList,
  currentListCount,
}) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'presets' | 'upload'>('presets');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedItem, setDetectedItem] = useState<FinishedPantryItemPreset | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Play synthetic scan beep using Web Audio API
  const playScanChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(1320, audioCtx.currentTime + 0.12); // E6
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.18);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.19);
    } catch {}
  };

  // Handle Camera start/stop
  useEffect(() => {
    if (isOpen && activeTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } else {
        setCameraError('Camera access not supported on this browser');
      }
    } catch (err: any) {
      setCameraError('Camera permission denied or unavailable. Tap any item below to scan.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const handleSelectPreset = (preset: FinishedPantryItemPreset) => {
    setIsAnalyzing(true);
    setAddedSuccess(false);
    setQuantity(1);

    setTimeout(() => {
      setIsAnalyzing(false);
      setDetectedItem(preset);
      playScanChime();
    }, 600);
  };

  const handleCaptureCamera = () => {
    setIsAnalyzing(true);
    setAddedSuccess(false);
    setQuantity(1);

    // Pick a random realistic pantry staple to demonstrate AI recognition
    const randomPreset =
      COMMON_FINISHED_ITEMS[Math.floor(Math.random() * COMMON_FINISHED_ITEMS.length)];

    setTimeout(() => {
      setIsAnalyzing(false);
      setDetectedItem(randomPreset);
      playScanChime();
    }, 1000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setAddedSuccess(false);
    setQuantity(1);

    // Pick a relevant staple based on filename or random
    const match = COMMON_FINISHED_ITEMS.find((item) =>
      file.name.toLowerCase().includes(item.brand.toLowerCase())
    ) || COMMON_FINISHED_ITEMS[0];

    setTimeout(() => {
      setIsAnalyzing(false);
      setDetectedItem(match);
      playScanChime();
    }, 900);
  };

  const handleConfirmAdd = () => {
    if (!detectedItem) return;

    const newItem: ShoppingListItem = {
      id: `pantry-${Date.now()}`,
      product_name: detectedItem.product_name,
      brand: detectedItem.brand,
      unit_size: detectedItem.unit_size,
      category: detectedItem.category,
      price: detectedItem.best_deal.price,
      savings: detectedItem.best_deal.savings,
      target_price: detectedItem.best_deal.price,
      quantity,
      checked: false,
      store: `${detectedItem.best_deal.retailer_name} (${detectedItem.best_deal.branch_name})`,
      preferred_retailer: detectedItem.best_deal.retailer_id,
      scannedAtHome: true,
      added_at: new Date().toISOString(),
    };

    onItemAdded(newItem);
    setAddedSuccess(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="scan-finished-item-modal"
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 via-teal-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                  Scan Finished Item at Home
                </h3>
                <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Pantry AI
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Scan empty cartons or jars to auto-add to your shopping list
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50/70 p-1.5 text-xs font-bold text-slate-600">
          <button
            onClick={() => {
              setActiveTab('presets');
              setDetectedItem(null);
            }}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'presets'
                ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                : 'hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Common Staples ({COMMON_FINISHED_ITEMS.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('camera');
              setDetectedItem(null);
            }}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'camera'
                ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                : 'hover:text-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-emerald-600" />
            <span>Live Camera</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('upload');
              setDetectedItem(null);
            }}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'upload'
                ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                : 'hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-emerald-600" />
            <span>Upload Photo</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* 1. CAMERA MODE */}
          {activeTab === 'camera' && (
            <div className="space-y-3">
              <div className="relative aspect-4/3 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
                {cameraError ? (
                  <div className="text-center p-6 text-slate-400 space-y-2">
                    <AlertCircle className="w-8 h-8 mx-auto text-amber-400" />
                    <p className="text-xs">{cameraError}</p>
                    <button
                      onClick={() => setActiveTab('presets')}
                      className="text-xs text-emerald-400 font-bold underline"
                    >
                      Use sample staples instead
                    </button>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />

                    {/* Scanning Target Reticle & Laser */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="w-56 h-56 border-2 border-dashed border-emerald-400/80 rounded-2xl relative">
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-emerald-400" />
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-emerald-400" />
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-emerald-400" />
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-emerald-400" />
                        <div className="w-full h-0.5 bg-emerald-400/80 shadow-[0_0_8px_#34d399] animate-pulse absolute top-1/2" />
                      </div>
                    </div>

                    <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none">
                      <span className="bg-black/70 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-full">
                        Point at empty milk carton, bread bag, or barcode
                      </span>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={handleCaptureCamera}
                disabled={isAnalyzing}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Gemini AI Analyzing Finished Item...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4" />
                    <span>Capture & Identify Empty Product</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* 2. PHOTO UPLOAD MODE */}
          {activeTab === 'upload' && (
            <div className="space-y-3">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-8 text-center bg-slate-50/60 hover:bg-emerald-50/30 transition-all cursor-pointer space-y-3"
              >
                <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-extrabold text-slate-800 text-sm">
                    Upload photo of finished item
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Take a picture of the empty container or packaging
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* 3. COMMON PRESETS LIST */}
          {activeTab === 'presets' && !detectedItem && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">
                  Tap any item to test simulated OCR & price matching:
                </span>
                <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Instant SA Supermarkets
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {COMMON_FINISHED_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectPreset(item)}
                    className="p-3 bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-400 rounded-2xl text-left transition-all flex items-center gap-3 group active:scale-98"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase truncate">
                        {item.container_type}
                      </div>
                      <div className="text-xs font-extrabold text-slate-900 truncate group-hover:text-emerald-700">
                        {item.product_name}
                      </div>
                      <div className="text-[11px] text-emerald-600 font-bold mt-0.5">
                        Lowest at {item.best_deal.retailer_name} • R{item.best_deal.price.toFixed(2)}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ANALYZING STATE */}
          {isAnalyzing && (
            <div className="p-8 text-center space-y-3 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500 text-white flex items-center justify-center animate-bounce shadow-md">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">
                Recognizing Finished Packaging...
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Comparing current shelf prices across Pick n Pay, Checkers, and Woolworths
              </p>
            </div>
          )}

          {/* DETECTED ITEM RESULT CARD */}
          {detectedItem && !isAnalyzing && (
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-white border border-emerald-200 flex items-center justify-center text-2xl flex-shrink-0 shadow-2xs">
                    {detectedItem.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide bg-emerald-100 px-2 py-0.5 rounded-full">
                      ✓ {detectedItem.container_type} Identified
                    </span>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 mt-1 leading-snug">
                      {detectedItem.product_name}
                    </h4>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="text-xs font-bold text-slate-400 line-through">
                    R{detectedItem.best_deal.original_price.toFixed(2)}
                  </div>
                  <div className="text-base font-black text-emerald-700">
                    R{detectedItem.best_deal.price.toFixed(2)}
                  </div>
                  <span className="text-[10px] font-extrabold text-white bg-emerald-600 px-1.5 py-0.5 rounded-md">
                    Save R{detectedItem.best_deal.savings.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Price comparison across stores */}
              <div className="bg-white p-3 rounded-xl border border-emerald-100 space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <Store className="w-3.5 h-3.5" />
                    Lowest: {detectedItem.best_deal.retailer_name} ({detectedItem.best_deal.branch_name})
                  </span>
                  <span className="font-extrabold text-emerald-700">
                    R{detectedItem.best_deal.price.toFixed(2)}
                  </span>
                </div>

                {detectedItem.other_retailers.map((other, idx) => (
                  <div key={idx} className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>{other.retailer_name}</span>
                    <span>R{other.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Quantity Selector & Add Button */}
              {!addedSuccess ? (
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex items-center border border-emerald-200 bg-white rounded-xl p-1">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-700 font-black flex items-center justify-center text-sm"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-extrabold text-slate-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-700 font-black flex items-center justify-center text-sm"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleConfirmAdd}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add to Shopping List</span>
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-emerald-600 text-white rounded-xl flex items-center justify-between gap-2 text-xs font-bold animate-in fade-in duration-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>Added {quantity}x to Shopping List!</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setDetectedItem(null);
                        setAddedSuccess(false);
                      }}
                      className="px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-[11px] font-bold"
                    >
                      Scan Next
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenShoppingList();
                      }}
                      className="px-2.5 py-1 bg-white text-emerald-900 rounded-lg text-[11px] font-black"
                    >
                      View List
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            <span>Active list: <strong className="text-slate-800">{currentListCount} items</strong></span>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenShoppingList();
            }}
            className="text-xs font-extrabold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>Open Shopping List & Deliver</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
