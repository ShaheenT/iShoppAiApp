import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Camera,
  MapPin,
  TrendingDown,
  ShieldCheck,
  Zap,
  Smartphone,
  Send,
  MessageSquare,
  Mail,
  X,
  Store,
  Download,
  Lock,
} from 'lucide-react';
import { IShoppIcon } from './IShoppIcon.js';
import { RetailerLogo, LEADING_RETAILERS } from './RetailerLogo.js';
import { PWAInstallModal } from './PWAInstallModal.js';
import { usePWAInstall } from '../hooks/usePWAInstall.js';

interface SteveJobsLandingPageProps {
  onActivateAccount: (contactInfo: string) => void;
  onEnterAppDirectly: () => void;
  onOpenScan?: () => void;
  onOpenRadar?: () => void;
  onOpenPriceIntelligence?: () => void;
  onOpenAssistant?: () => void;
  onOpenShoppingList?: () => void;
  onOpenAuth?: () => void;
  onOpenAdminLogin?: () => void;
  shoppingListCount?: number;
}

export const SteveJobsLandingPage: React.FC<SteveJobsLandingPageProps> = ({
  onActivateAccount,
  onEnterAppDirectly,
  onOpenScan,
  onOpenRadar,
  onOpenPriceIntelligence,
  onOpenAssistant,
  onOpenShoppingList,
  onOpenAuth,
  onOpenAdminLogin,
  shoppingListCount = 0,
}) => {
  const [contactInput, setContactInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentToContact, setSentToContact] = useState<string | null>(null);
  const [showSimulatedBanner, setShowSimulatedBanner] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // Hook into browser PWA install capabilities
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  const handleGetAppClick = async () => {
    // If the browser provides a native beforeinstallprompt, trigger it directly or open guided install modal
    if (isInstallable) {
      const outcome = await install();
      if (!outcome) {
        setIsInstallModalOpen(true);
      }
    } else {
      // Shows the tailored mobile install modal (iOS Safari Add to Home Screen steps or Android/Desktop instructions)
      setIsInstallModalOpen(true);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    const trimmed = contactInput.trim();
    if (!trimmed) {
      setErrorMsg('Please enter your email address or South African mobile number.');
      return;
    }

    // Validate simple format (either email or phone)
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    const isPhone = /^[0-9+\s()-]{9,15}$/.test(trimmed);

    if (!isEmail && !isPhone) {
      setErrorMsg('Please enter a valid email (e.g. you@gmail.com) or phone number (e.g. 082 123 4567).');
      return;
    }

    setIsSubmitting(true);

    // Simulate sending activation link
    setTimeout(() => {
      setIsSubmitting(false);
      setSentToContact(trimmed);
      setShowSimulatedBanner(true);
    }, 600);
  };

  const handleSimulateClickLink = () => {
    if (sentToContact) {
      onActivateAccount(sentToContact);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-rose-500 selection:text-white antialiased overflow-x-hidden">
      {/* Top Keynote Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-rose-600/20 via-orange-600/10 to-transparent blur-3xl pointer-events-none -z-0" />

      {/* Minimalist Apple-Style Header with All Navigation Buttons */}
      <header className="sticky top-0 z-30 w-full border-b border-white/10 bg-black/85 backdrop-blur-xl pt-safe">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-3">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <IShoppIcon size={34} withGlow />
            <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
              iShopp <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white/90 border border-white/10">AI</span>
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-3 lg:gap-5 text-xs font-semibold text-white/70 shrink-0">
            <button
              onClick={() => {
                const el = document.getElementById('retailers-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Retailers
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('breakthroughs-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Breakthroughs
            </button>
            <button
              onClick={onOpenRadar || onEnterAppDirectly}
              className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>Radar</span>
            </button>
            <button
              onClick={onOpenPriceIntelligence || onEnterAppDirectly}
              className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
              <span>Prices</span>
            </button>
            <button
              onClick={onOpenAssistant || onEnterAppDirectly}
              className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Assistant</span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Scan button */}
            <button
              onClick={onOpenScan || onEnterAppDirectly}
              id="landing-nav-scan-btn"
              title="Scan Deals"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-xs transition-all active:scale-95 shrink-0"
            >
              <Camera className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Scan</span>
            </button>

            {/* Get App button (Prompts PWA Install & Home Screen icon save) */}
            <button
              onClick={handleGetAppClick}
              id="landing-nav-get-app-btn"
              className="text-xs font-black text-black bg-white hover:bg-white/90 px-3 sm:px-4 py-1.5 rounded-full transition-all shadow-md active:scale-95 whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
              title="Get iShopp app on your phone home screen"
            >
              <Download className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>Get App</span>
            </button>

            {/* Sign In / Sign Up buttons */}
            {onOpenAuth ? (
              <button
                onClick={onOpenAuth}
                id="landing-nav-signin-btn"
                className="px-3 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-600 to-orange-500 text-white font-bold text-xs hover:opacity-90 transition-all shadow-md active:scale-95 whitespace-nowrap hidden sm:inline-flex shrink-0 cursor-pointer"
              >
                Sign In / Up
              </button>
            ) : (
              <button
                onClick={() => {
                  const el = document.getElementById('signup-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                id="landing-nav-signup-btn"
                className="px-3 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-600 to-orange-500 text-white font-bold text-xs hover:opacity-90 transition-all shadow-md active:scale-95 whitespace-nowrap hidden sm:inline-flex shrink-0"
              >
                Sign Up
              </button>
            )}
          </div>
        </div>

        {/* Mobile Quick Navbar Strip (< md) */}
        <div className="flex items-center gap-1.5 px-3 py-2 border-t border-white/10 bg-white/[0.03] md:hidden overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              const el = document.getElementById('retailers-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-2.5 py-1 rounded-full bg-white/10 text-white/90 text-[11px] font-semibold whitespace-nowrap shrink-0 border border-white/10"
          >
            Retailers
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('breakthroughs-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-2.5 py-1 rounded-full bg-white/10 text-white/90 text-[11px] font-semibold whitespace-nowrap shrink-0 border border-white/10"
          >
            Breakthroughs
          </button>
          <button
            onClick={onOpenRadar || onEnterAppDirectly}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-300 text-[11px] font-semibold whitespace-nowrap shrink-0 border border-rose-500/30"
          >
            <MapPin className="w-3 h-3 text-rose-400" />
            <span>Store Radar</span>
          </button>
          <button
            onClick={onOpenPriceIntelligence || onEnterAppDirectly}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-[11px] font-semibold whitespace-nowrap shrink-0 border border-emerald-500/30"
          >
            <TrendingDown className="w-3 h-3 text-emerald-400" />
            <span>Price Tracker</span>
          </button>
          <button
            onClick={onOpenAssistant || onEnterAppDirectly}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 text-[11px] font-semibold whitespace-nowrap shrink-0 border border-amber-500/30"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>AI Assistant</span>
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('signup-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-2.5 py-1 rounded-full bg-gradient-to-r from-rose-600 to-orange-500 text-white text-[11px] font-bold whitespace-nowrap shrink-0"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero Section — Steve Jobs Keynote Style */}
      <section className="relative z-10 pt-20 pb-16 px-6 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-rose-400 text-xs font-semibold mb-8 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Retail Intelligence Revolution</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.08]">
          This changes shopping. <br />
          <span className="bg-gradient-to-r from-rose-400 via-orange-300 to-rose-500 bg-clip-text text-transparent">
            Forever.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-2xl font-normal text-white/70 max-w-2xl mx-auto leading-relaxed">
          One breakthrough app. Instant shelf vision. Live store radar across South Africa’s largest retailers.
        </p>

        {/* The Simple Sign Up Input Bar (Requested by User) */}
        <div id="signup-section" className="mt-12 max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex flex-col sm:flex-row items-center gap-2.5 p-1.5 rounded-3xl sm:rounded-full bg-white/10 border border-white/20 backdrop-blur-xl focus-within:border-rose-400 focus-within:ring-2 focus-within:ring-rose-500/30 transition-all shadow-2xl">
              <input
                type="text"
                value={contactInput}
                onChange={(e) => {
                  setContactInput(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Enter email or mobile number"
                className="w-full sm:flex-1 px-5 py-3.5 bg-transparent text-white placeholder:text-white/40 text-sm focus:outline-none"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-gradient-to-r from-rose-500 via-rose-600 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-rose-500/25 active:scale-95 shrink-0 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Sending link...</span>
                ) : (
                  <>
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {errorMsg && (
              <p className="mt-2 text-xs text-rose-400 font-medium text-left px-4">
                {errorMsg}
              </p>
            )}
          </form>

          <p className="mt-3 text-xs text-white/50">
            Instant activation link sent directly to your phone or inbox. No passwords required.
          </p>
        </div>

        {/* Steve Jobs Keynote Floating Phone Preview */}
        <div className="mt-16 relative max-w-sm mx-auto">
          <div className="absolute inset-0 bg-gradient-to-t from-rose-500/20 to-transparent rounded-[48px] blur-2xl -z-10 transform scale-110" />
          
          <div className="rounded-[44px] border-4 border-white/20 p-2.5 bg-black shadow-2xl overflow-hidden backdrop-blur-md">
            {/* Phone Screen Mockup */}
            <div className="rounded-[36px] bg-slate-900 border border-white/10 p-5 text-left relative overflow-hidden">
              {/* Top Notch / Dynamic Island */}
              <div className="w-24 h-4 bg-black rounded-full mx-auto mb-4" />

              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <IShoppIcon size={26} />
                  <div>
                    <h4 className="text-xs font-black text-white leading-tight">Pick n Pay Sea Point</h4>
                    <p className="text-[10px] text-white/50">1.4 km away • Verified 12m ago</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Save 34%
                </span>
              </div>

              {/* Deal Card Inside Phone */}
              <div className="mt-4 p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=200&q=80"
                  alt="Coca Cola"
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">Coca-Cola Original 2L</p>
                  <p className="text-[10px] text-white/50">Smart Shopper Special</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-base font-black text-white">R19.99</span>
                    <span className="text-xs text-white/40 line-through">R29.99</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Mockup */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/30 text-center">
                  <p className="text-[10px] font-bold text-rose-300">Live AI OCR</p>
                  <p className="text-xs font-black text-white">99.4% Accurate</p>
                </div>
                <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-center">
                  <p className="text-[10px] font-bold text-emerald-300">Route Savings</p>
                  <p className="text-xs font-black text-white">+R340 / month</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steve Jobs 3-Act Breakthrough Grid */}
      <section id="breakthroughs-section" className="py-24 border-t border-white/10 bg-gradient-to-b from-black via-zinc-950 to-black px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Three revolutionary breakthroughs. <br />
              <span className="text-white/50">One pocket device.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Breakthrough 1 */}
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-rose-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">1. Snap Shelf Vision</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Point your camera at any supermarket shelf tag or printed flyer. Powered by Gemini AI, iShopp decodes prices, dates, and fine print in 1.2 seconds.
              </p>
            </div>

            {/* Breakthrough 2 */}
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-orange-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">2. Live Store Radar</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Like Waze for groceries. See real-time prices verified by local shoppers right around the corner in Cape Town, Joburg, Durban, and Pretoria.
              </p>
            </div>

            {/* Breakthrough 3 */}
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-emerald-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingDown className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">3. Route Optimization</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Don’t just buy at one store. Our dual-store shopping route shows you which items to pick at Checkers and which at Pick n Pay for massive monthly savings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Supermarket Giants in South Africa */}
      <section id="retailers-section" className="py-16 sm:py-20 border-t border-white/10 bg-black text-center px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-white/40 font-bold mb-10">
            Intelligence across South Africa’s leading retailers
          </p>

          {/* Keynote Brands Layout matching Screenshot with Logo & Name */}
          <div className="space-y-3 sm:space-y-4 max-w-3xl mx-auto">
            {/* Row 1: Checkers & Pick n Pay */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex items-center justify-center sm:justify-start gap-3.5 px-5 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-emerald-500/30 transition-all group shadow-sm">
                <RetailerLogo retailerId="checkers" size={38} className="group-hover:scale-105 transition-transform" />
                <div className="text-left">
                  <span className="text-base sm:text-lg font-black tracking-wider text-white block leading-tight">CHECKERS</span>
                  <span className="text-[10px] text-white/40 font-medium tracking-normal">Sixty60 & Supermarkets</span>
                </div>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-3.5 px-5 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-blue-500/30 transition-all group shadow-sm">
                <RetailerLogo retailerId="picknpay" size={38} className="group-hover:scale-105 transition-transform" />
                <div className="text-left">
                  <span className="text-base sm:text-lg font-black tracking-wider text-white block leading-tight">PICK N PAY</span>
                  <span className="text-[10px] text-white/40 font-medium tracking-normal">Smart Shopper & asap!</span>
                </div>
              </div>
            </div>

            {/* Row 2: Woolworths & Shoprite */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex items-center justify-center sm:justify-start gap-3.5 px-5 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-zinc-400/30 transition-all group shadow-sm">
                <RetailerLogo retailerId="woolworths" size={38} className="group-hover:scale-105 transition-transform" />
                <div className="text-left">
                  <span className="text-base sm:text-lg font-black tracking-wider text-white block leading-tight">WOOLWORTHS</span>
                  <span className="text-[10px] text-white/40 font-medium tracking-normal">Food & WRewards</span>
                </div>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-3.5 px-5 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-red-500/30 transition-all group shadow-sm">
                <RetailerLogo retailerId="shoprite" size={38} className="group-hover:scale-105 transition-transform" />
                <div className="text-left">
                  <span className="text-base sm:text-lg font-black tracking-wider text-white block leading-tight">SHOPRITE</span>
                  <span className="text-[10px] text-white/40 font-medium tracking-normal">Lower Prices & Xtra Savings</span>
                </div>
              </div>
            </div>

            {/* Row 3: SPAR, Dis-Chem, Clicks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="flex items-center justify-center sm:justify-start gap-3.5 px-4 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-emerald-600/30 transition-all group shadow-sm">
                <RetailerLogo retailerId="spar" size={36} className="group-hover:scale-105 transition-transform" />
                <div className="text-left">
                  <span className="text-sm sm:text-base font-black tracking-wider text-white block leading-tight">SPAR</span>
                  <span className="text-[10px] text-white/40 font-medium tracking-normal">SUPERSPAR & KWIKSPAR</span>
                </div>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-3.5 px-4 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-teal-500/30 transition-all group shadow-sm">
                <RetailerLogo retailerId="dischem" size={36} className="group-hover:scale-105 transition-transform" />
                <div className="text-left">
                  <span className="text-sm sm:text-base font-black tracking-wider text-white block leading-tight">DIS-CHEM</span>
                  <span className="text-[10px] text-white/40 font-medium tracking-normal">Pharmacies & Wellness</span>
                </div>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-3.5 px-4 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-sky-500/30 transition-all group shadow-sm">
                <RetailerLogo retailerId="clicks" size={36} className="group-hover:scale-105 transition-transform" />
                <div className="text-left">
                  <span className="text-sm sm:text-base font-black tracking-wider text-white block leading-tight">CLICKS</span>
                  <span className="text-[10px] text-white/40 font-medium tracking-normal">Pharmacy & ClubCard</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Second Sign-Up Call to Action */}
      <section className="py-24 border-t border-white/10 bg-gradient-to-t from-rose-950/30 to-black px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <IShoppIcon size={56} withGlow className="mx-auto mb-6" />
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Stop overpaying on groceries.
          </h2>
          <p className="mt-4 text-white/70 text-base sm:text-lg">
            Join thousands of South African shoppers unlocking R300+ in verified savings every single week.
          </p>

          <div className="mt-10">
            <button
              onClick={() => {
                const el = document.getElementById('signup-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 rounded-full bg-white text-black font-bold text-base hover:bg-white/90 transition-all shadow-xl active:scale-95"
            >
              Enter Your Email or Phone to Start
            </button>
          </div>
        </div>
      </section>

      {/* Minimalist Footer */}
      <footer className="py-10 border-t border-white/10 text-center text-xs text-white/40 px-6">
        <p>© 2026 iShopp AI. Built for South African Shoppers. POPIA Compliant.</p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={handleGetAppClick}
            id="footer-get-app-btn"
            className="hover:text-rose-400 text-white/70 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Download className="w-3 h-3 text-rose-500" />
            <span>Get App (Install PWA)</span>
          </button>
          <span>•</span>
          <button onClick={onEnterAppDirectly} className="hover:text-white underline cursor-pointer">
            Direct App Access
          </button>
          <span>•</span>
          {onOpenAdminLogin && (
            <>
              <button
                onClick={onOpenAdminLogin}
                id="footer-admin-login-link"
                className="hover:text-emerald-400 text-white/50 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Lock className="w-3 h-3 text-emerald-500" />
                <span>Admin Login (/admin/login)</span>
              </button>
              <span>•</span>
            </>
          )}
          <span>Terms & Conditions</span>
          <span>•</span>
          <span>Privacy Policy</span>
        </div>
      </footer>

      {/* PWA Home Screen Install Modal (Runs like native app from home screen icon) */}
      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        isInstallable={isInstallable}
        isIOS={isIOS}
        onInstall={install}
        onContinueToWeb={onEnterAppDirectly}
      />

      {/* Simulated iOS Activation Link Banner & Modal */}
      {sentToContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-zinc-950 border border-white/20 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl relative">
            <button
              onClick={() => setSentToContact(null)}
              className="absolute top-4 right-4 text-white/40 hover:text-white p-2 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Apple Notification Banner Preview */}
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 flex items-start gap-3 mb-5">
              <div className="p-2 rounded-xl bg-rose-500 text-white shrink-0">
                {sentToContact.includes('@') ? <Mail className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">iShopp Security</span>
                  <span className="text-[10px] text-white/40">Now</span>
                </div>
                <p className="text-xs text-white/80 mt-0.5 leading-snug">
                  Your instant activation link is ready. Tap below to activate your account and configure your preferences.
                </p>
              </div>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Activation Link Dispatched
              </h3>
              <p className="text-xs text-white/60 leading-relaxed">
                We sent a secure activation link to <strong className="text-white">{sentToContact}</strong>.
              </p>
            </div>

            {/* Direct Activation CTA Button (as requested by User) */}
            <div className="mt-6 space-y-3">
              <button
                onClick={handleSimulateClickLink}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-rose-500/20 active:scale-95 transition-all"
              >
                <span>Click Activation Link & Start Setup</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setSentToContact(null)}
                className="w-full py-2.5 text-xs text-white/50 hover:text-white transition-colors"
              >
                Change email or phone number
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
