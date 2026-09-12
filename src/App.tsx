import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.js';
import { BottomNav, NavTab } from './components/BottomNav.js';
import { HomeView } from './components/HomeView.js';
import { DiscoverView } from './components/DiscoverView.js';
import { SavedView } from './components/SavedView.js';
import { AccountView } from './components/AccountView.js';
import { MagicActionSheet } from './components/MagicActionSheet.js';
import { SpecialDetailsModal } from './components/SpecialDetailsModal.js';
import { DirectionsModal } from './components/DirectionsModal.js';
import { OnboardingModal } from './components/OnboardingModal.js';
import { AuthModal } from './components/AuthModal.js';
import { SnapScanModal } from './components/SnapScanModal.js';
import { PriceIntelligenceModal } from './components/PriceIntelligenceModal.js';
import { NearbyMapModal } from './components/NearbyMapModal.js';
import { AIAssistantDrawer } from './components/AIAssistantDrawer.js';
import { ShoppingListModal } from './components/ShoppingListModal.js';
import { ScanFinishedItemModal } from './components/ScanFinishedItemModal.js';
import { LeaderboardModal } from './components/LeaderboardModal.js';
import { SupabaseStatusModal } from './components/SupabaseStatusModal.js';
import { SteveJobsLandingPage } from './components/SteveJobsLandingPage.js';
import { PWAInstallBanner } from './components/PWAInstallBanner.js';
import { Special, UserProfile, Category, RetailerId, ShoppingListItem } from './types/index.js';
import { INITIAL_SPECIALS } from '../server/seedData.js';

export default function App() {
  // Navigation & View Mode ('landing' for Steve Jobs keynote page, 'app' for core mobile experience)
  const [viewMode, setViewMode] = useState<'landing' | 'app'>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('view') === 'landing') return 'landing';
      if (urlParams.get('view') === 'app') return 'app';
      return localStorage.getItem('ishopp_activated') === 'true' ? 'app' : 'landing';
    } catch {
      return 'landing';
    }
  });

  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [specials, setSpecials] = useState<Special[]>(INITIAL_SPECIALS);
  const [savedSpecials, setSavedSpecials] = useState<Special[]>(() => {
    return [INITIAL_SPECIALS[0], INITIAL_SPECIALS[1]];
  });

  // User Profile State (Defaulting to Shaheen, Trusted Contributor)
  const [user, setUser] = useState<UserProfile>({
    id: 'u-shaheen',
    email: 'shaheen@ishopp.co.za',
    full_name: 'Shaheen Ebrahim',
    username: '@shaheen',
    avatar_url:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    city: 'Cape Town',
    province: 'Western Cape',
    country: 'South Africa',
    preferred_language: 'English',
    preferred_currency: 'ZAR',
    reputation_score: 2840,
    contribution_points: 350,
    savings_score: 94,
    total_savings_unlocked: 1284.0,
    total_specials_shared: 87,
    total_scans: 142,
    total_views: 1942,
    account_status: 'active',
    onboarding_completed: true,
    preferred_retailers: ['picknpay', 'checkers', 'woolworths'],
    preferred_categories: ['Groceries', 'Fresh Produce', 'Meat'],
    price_alerts_enabled: true,
    nearby_alerts_enabled: true,
    badges: [
      'First Snap',
      'First Scan',
      'Deal Hunter',
      'Weekend Warrior',
      'Grocery Hero',
      'Top Contributor',
      'Price Detective',
      'Community Saver',
    ],
  });

  // Active Modals & Overlays
  const [isMagicSheetOpen, setIsMagicSheetOpen] = useState(false);
  const [selectedSpecialForDetails, setSelectedSpecialForDetails] = useState<Special | null>(null);
  const [isDirectionsModalOpen, setIsDirectionsModalOpen] = useState(false);
  const [directionSpecial, setDirectionSpecial] = useState<Special | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Feature Modals
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [isPriceIntelligenceOpen, setIsPriceIntelligenceOpen] = useState(false);
  const [selectedDealForHistory, setSelectedDealForHistory] = useState<Special | null>(null);
  const [isRadarOpen, setIsRadarOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);
  const [isScanFinishedModalOpen, setIsScanFinishedModalOpen] = useState(false);
  const [shoppingListItems, setShoppingListItems] = useState<ShoppingListItem[]>([
    {
      id: 'item-1',
      product_name: 'Clover Fresh Full Cream Milk 2L',
      brand: 'Clover',
      unit_size: '2L',
      category: 'Groceries',
      price: 24.99,
      savings: 7.0,
      quantity: 1,
      checked: false,
      store: 'Checkers Kloof Street',
      preferred_retailer: 'checkers',
      scannedAtHome: true,
    },
    {
      id: 'item-2',
      product_name: 'Albany Superior Thick Sliced White Bread 700g',
      brand: 'Albany',
      unit_size: '700g',
      category: 'Groceries',
      price: 15.99,
      savings: 4.0,
      quantity: 1,
      checked: false,
      store: 'Pick n Pay Sea Point',
      preferred_retailer: 'picknpay',
      scannedAtHome: false,
    },
    {
      id: 'item-3',
      product_name: 'Nescafé Gold Rich & Smooth 200g',
      brand: 'Nescafé',
      unit_size: '200g',
      category: 'Groceries',
      price: 119.99,
      savings: 35.0,
      quantity: 1,
      checked: false,
      store: 'Pick n Pay V&A Waterfront',
      preferred_retailer: 'picknpay',
      scannedAtHome: true,
    },
    {
      id: 'item-4',
      product_name: 'Sunlight Dishwashing Liquid Lemon 750ml',
      brand: 'Sunlight',
      unit_size: '750ml',
      category: 'Household',
      price: 29.99,
      savings: 10.0,
      quantity: 1,
      checked: true,
      store: 'Checkers Regent Road',
      preferred_retailer: 'checkers',
      scannedAtHome: false,
    },
  ]);

  const handleAddItemToList = (nameOrItem: string | ShoppingListItem) => {
    if (typeof nameOrItem === 'string') {
      const newItem: ShoppingListItem = {
        id: `item-${Date.now()}`,
        product_name: nameOrItem,
        price: 25.0,
        savings: 6.0,
        quantity: 1,
        checked: false,
        store: 'Nearest Supermarket',
        scannedAtHome: false,
        added_at: new Date().toISOString(),
      };
      setShoppingListItems((prev) => [newItem, ...prev]);
    } else {
      setShoppingListItems((prev) => [nameOrItem, ...prev]);
    }
  };

  const handleRemoveItemFromList = (id: string) => {
    setShoppingListItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleToggleItemInList = (id: string) => {
    setShoppingListItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isSupabaseStatusOpen, setIsSupabaseStatusOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Initial data loading
  useEffect(() => {
    fetchSpecials();
  }, []);

  const fetchSpecials = async () => {
    try {
      const res = await fetch('/api/feed');
      const data = await res.json();
      if (data.specials && data.specials.length > 0) {
        setSpecials(data.specials);
      }
    } catch (err) {
      console.warn('Using local store specials:', err);
    }
  };

  const handleDealPublished = (newDeal: Special) => {
    setSpecials((prev) => [newDeal, ...prev]);
    setUser((prev) => ({
      ...prev,
      contribution_points: prev.contribution_points + 50,
      total_specials_shared: prev.total_specials_shared + 1,
      total_scans: prev.total_scans + 1,
      total_savings_unlocked: prev.total_savings_unlocked + newDeal.savings,
    }));
  };

  const handleVerifyDeal = async (specialId: string) => {
    setUser((prev) => ({
      ...prev,
      contribution_points: prev.contribution_points + 10,
    }));
    try {
      await fetch('/api/verify-deal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ special_id: specialId }),
      });
    } catch (err) {
      console.warn('Verify sync:', err);
    }
  };

  const handleToggleSaveSpecial = (special: Special) => {
    setSavedSpecials((prev) => {
      const exists = prev.some((s) => s.id === special.id);
      if (exists) {
        return prev.filter((s) => s.id !== special.id);
      }
      return [special, ...prev];
    });
  };

  const handleRemoveSaved = (specialId: string) => {
    setSavedSpecials((prev) => prev.filter((s) => s.id !== specialId));
  };

  const handleOpenDirections = (special: Special) => {
    setDirectionSpecial(special);
    setIsDirectionsModalOpen(true);
  };

  const handleOnboardingComplete = (data: {
    categories: Category[];
    retailers: RetailerId[];
    city: string;
    notifications: any;
  }) => {
    localStorage.setItem('ishopp_onboarding_completed', 'true');
    setUser((prev) => ({
      ...prev,
      city: data.city,
      preferred_categories: data.categories,
      preferred_retailers: data.retailers,
    }));
  };

  // Activation from Steve Jobs Landing Page
  const handleActivateAccount = (contactInfo: string) => {
    try {
      localStorage.setItem('ishopp_activated', 'true');
      localStorage.setItem('ishopp_contact', contactInfo);
    } catch {}

    const isEmail = contactInfo.includes('@');
    setUser((prev) => ({
      ...prev,
      email: isEmail ? contactInfo : prev.email,
      username: isEmail ? `@${contactInfo.split('@')[0]}` : `@member_${contactInfo.slice(-4)}`,
      full_name: isEmail ? contactInfo.split('@')[0] : `Shopper ${contactInfo.slice(-4)}`,
      account_status: 'active',
    }));

    // Transition smoothly into the app and trigger the celebrated 6-step onboarding!
    setViewMode('app');
    setIsOnboardingOpen(true);
  };

  // IF ON STEVE JOBS LANDING PAGE
  if (viewMode === 'landing') {
    return (
      <SteveJobsLandingPage
        onActivateAccount={handleActivateAccount}
        onEnterAppDirectly={() => setViewMode('app')}
      />
    );
  }

  // CORE PWA MOBILE APP EXPERIENCE
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-rose-100 selection:text-rose-900 antialiased overscroll-none">
      {/* PWA In-App Install Prompt Banner */}
      <PWAInstallBanner />

      {/* Top Navbar */}
      <Navbar
        currentCity={user.city}
        onCityChange={(newCity) => setUser((prev) => ({ ...prev, city: newCity }))}
        userPoints={user.contribution_points}
        onOpenScan={() => setIsScanOpen(true)}
        onOpenRadar={() => {
          setCurrentTab('discover');
        }}
        onOpenPriceIntelligence={() => {
          setSelectedDealForHistory(null);
          setIsPriceIntelligenceOpen(true);
        }}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenShoppingList={() => setIsShoppingListOpen(true)}
        onOpenPantryScan={() => setIsScanFinishedModalOpen(true)}
        shoppingListCount={shoppingListItems.length}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenSupabaseStatus={() => setIsSupabaseStatusOpen(true)}
        onOpenMagic={() => setIsMagicSheetOpen(true)}
        onOpenLanding={() => setViewMode('landing')}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q.trim()) {
            setCurrentTab('discover');
          }
        }}
      />

      {/* Main Responsive Mobile-App Container with Safe-Area Offsets */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-3.5 sm:px-6 pt-3 pb-28 md:pb-12">
        {/* 1. HOME TAB */}
        {currentTab === 'home' && (
          <HomeView
            user={user}
            specials={specials}
            onSelectSpecial={(s) => setSelectedSpecialForDetails(s)}
            onOpenMagic={() => setIsMagicSheetOpen(true)}
            onOpenDiscover={() => setCurrentTab('discover')}
            onSnapSpecial={() => setIsScanOpen(true)}
            onScanSpecial={() => setIsScanOpen(true)}
            onOpenShoppingList={() => setIsShoppingListOpen(true)}
            onOpenPantryScan={() => setIsScanFinishedModalOpen(true)}
            shoppingListCount={shoppingListItems.length}
          />
        )}

        {/* 2. DISCOVER TAB (WAZE + INSTAGRAM EXPERIENCE) */}
        {currentTab === 'discover' && (
          <DiscoverView
            specials={specials}
            onOpenPriceIntelligence={(s) => setSelectedSpecialForDetails(s)}
            onAddToList={handleToggleSaveSpecial}
            onVerifyDeal={handleVerifyDeal}
            onOpenDirections={handleOpenDirections}
            onAskAI={(query) => {
              setIsAssistantOpen(true);
            }}
          />
        )}

        {/* 3. SAVED TAB (SAVED SPECIALS, SMART LIST & MULTI-STORE ROUTE OPTIMIZER) */}
        {currentTab === 'saved' && (
          <SavedView
            savedSpecials={savedSpecials}
            onSelectSpecial={(s) => setSelectedSpecialForDetails(s)}
            onRemoveSaved={handleRemoveSaved}
            onOpenDirections={handleOpenDirections}
            onOpenShoppingList={() => setIsShoppingListOpen(true)}
            onOpenPantryScan={() => setIsScanFinishedModalOpen(true)}
          />
        )}

        {/* 4. ACCOUNT TAB (APPLE-STYLE DASHBOARD & REPUTATION) */}
        {currentTab === 'account' && (
          <AccountView
            user={user}
            onOpenAuth={() => setIsAuthOpen(true)}
            onReplayOnboarding={() => setIsOnboardingOpen(true)}
            onViewLandingPage={() => setViewMode('landing')}
          />
        )}
      </main>

      {/* Mobile-Native Bottom Navigation Bar with Safe-Area Offset */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenMagic={() => setIsMagicSheetOpen(true)}
        savedCount={savedSpecials.length + shoppingListItems.length}
      />

      {/* iShopp Magic Radial / Action Sheet */}
      <MagicActionSheet
        isOpen={isMagicSheetOpen}
        onClose={() => setIsMagicSheetOpen(false)}
        onSelectSnap={() => setIsScanOpen(true)}
        onSelectScan={() => setIsScanOpen(true)}
        onSelectAskAI={() => setIsAssistantOpen(true)}
        onSelectReceipt={() => setIsScanOpen(true)}
        onSelectScanFinished={() => setIsScanFinishedModalOpen(true)}
        onSelectShoppingList={() => setIsShoppingListOpen(true)}
      />

      {/* Dedicated Special Details Screen */}
      <SpecialDetailsModal
        isOpen={!!selectedSpecialForDetails}
        onClose={() => setSelectedSpecialForDetails(null)}
        special={selectedSpecialForDetails}
        onSaveToggle={handleToggleSaveSpecial}
        isSaved={
          selectedSpecialForDetails
            ? savedSpecials.some((s) => s.id === selectedSpecialForDetails.id)
            : false
        }
        onVerify={handleVerifyDeal}
        onOpenSpecial={(s) => setSelectedSpecialForDetails(s)}
        nearbySpecials={specials}
      />

      {/* Navigation App Directions Launcher */}
      <DirectionsModal
        isOpen={isDirectionsModalOpen}
        onClose={() => setIsDirectionsModalOpen(false)}
        special={directionSpecial}
      />

      {/* Apple-Style 6-Step Onboarding */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={handleOnboardingComplete}
        onLaunchScan={() => setIsScanOpen(true)}
      />

      {/* Supabase Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(newProfile) => setUser(newProfile)}
      />

      {/* Camera Snap & AI Scan Modal */}
      <SnapScanModal
        isOpen={isScanOpen}
        onClose={() => setIsScanOpen(false)}
        onDealPublished={handleDealPublished}
        currentCity={user.city}
      />

      {/* Price Intelligence Modal */}
      <PriceIntelligenceModal
        isOpen={isPriceIntelligenceOpen}
        onClose={() => setIsPriceIntelligenceOpen(false)}
        selectedSpecial={selectedDealForHistory}
      />

      {/* Store Radar Modal */}
      <NearbyMapModal
        isOpen={isRadarOpen}
        onClose={() => setIsRadarOpen(false)}
        specials={specials}
        currentCity={user.city}
      />

      {/* AI Assistant Drawer */}
      <AIAssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        specials={specials}
      />

      {/* iShopp Smart Shopping List & Delivery Hub Modal */}
      <ShoppingListModal
        isOpen={isShoppingListOpen}
        onClose={() => setIsShoppingListOpen(false)}
        specials={specials}
        items={shoppingListItems}
        onAddItem={handleAddItemToList}
        onRemoveItem={handleRemoveItemFromList}
        onToggleItem={handleToggleItemInList}
        onOpenPantryScan={() => setIsScanFinishedModalOpen(true)}
        userCity={user.city}
      />

      {/* Scan Empty or Finished Item at Home Modal */}
      <ScanFinishedItemModal
        isOpen={isScanFinishedModalOpen}
        onClose={() => setIsScanFinishedModalOpen(false)}
        onItemAdded={handleAddItemToList}
        onOpenShoppingList={() => setIsShoppingListOpen(true)}
        currentListCount={shoppingListItems.length}
      />

      {/* Community Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        userPoints={user.contribution_points}
        userSavings={user.total_savings_unlocked}
      />

      {/* Supabase Status Modal */}
      <SupabaseStatusModal
        isOpen={isSupabaseStatusOpen}
        onClose={() => setIsSupabaseStatusOpen(false)}
      />
    </div>
  );
}
