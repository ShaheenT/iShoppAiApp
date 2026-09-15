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
import { RouteOptimizerModal } from './components/RouteOptimizerModal.js';
import { ScanFinishedItemModal } from './components/ScanFinishedItemModal.js';
import { LeaderboardModal } from './components/LeaderboardModal.js';
import { SupabaseStatusModal } from './components/SupabaseStatusModal.js';
import { ProfileCompletionModal } from './components/ProfileCompletionModal.js';
import { AdminDashboard } from './components/AdminDashboard.js';
import { SteveJobsLandingPage } from './components/SteveJobsLandingPage.js';
import { PWAInstallBanner } from './components/PWAInstallBanner.js';
import { OfflineStatusBanner } from './components/OfflineStatusBanner.js';
import { useOnlineStatus } from './hooks/useOnlineStatus.js';
import {
  getOfflineSpecials,
  saveOfflineSpecials,
  putOfflineSpecial,
  getOfflineShoppingList,
  saveOfflineShoppingList,
  deleteOfflineShoppingItem,
  enqueueOfflineSync,
} from './lib/offlineDb.js';
import { getSavedUserProfile, getClientSupabase } from './lib/supabaseAuth.js';
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

  // User Profile State (Saved in Supabase or defaults to Shaheen)
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = getSavedUserProfile();
    if (saved) return saved;
    return {
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
        'Verified Account',
      ],
    };
  });

  // Admin Dashboard (Supabase Enterprise Architecture & Store Ops)
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('view') === 'admin' || urlParams.get('admin') === 'true';
    } catch {
      return false;
    }
  });

  // Active Modals & Overlays
  const [isMagicSheetOpen, setIsMagicSheetOpen] = useState(false);
  const [selectedSpecialForDetails, setSelectedSpecialForDetails] = useState<Special | null>(null);
  const [isDirectionsModalOpen, setIsDirectionsModalOpen] = useState(false);
  const [directionSpecial, setDirectionSpecial] = useState<Special | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileCompletionOpen, setIsProfileCompletionOpen] = useState(false);

  // Feature Modals
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [isPriceIntelligenceOpen, setIsPriceIntelligenceOpen] = useState(false);
  const [selectedDealForHistory, setSelectedDealForHistory] = useState<Special | null>(null);
  const [isRadarOpen, setIsRadarOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);
  const [isRouteOptimizerOpen, setIsRouteOptimizerOpen] = useState(false);
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

  // Online / Offline Connectivity and Background Sync Hook
  const onlineStatus = useOnlineStatus(() => {
    fetchSpecials();
  });

  // Initial data loading with local-first IndexedDB hydration
  useEffect(() => {
    async function initOfflineStoreData() {
      try {
        // 1. Instantly hydrate shopping list items from IndexedDB
        const cachedList = await getOfflineShoppingList();
        if (cachedList && cachedList.length > 0) {
          setShoppingListItems(cachedList);
        } else {
          await saveOfflineShoppingList(shoppingListItems);
        }

        // 2. Instantly hydrate store specials from IndexedDB
        const cachedSpecials = await getOfflineSpecials();
        if (cachedSpecials && cachedSpecials.length > 0) {
          setSpecials(cachedSpecials);
        } else {
          await saveOfflineSpecials(INITIAL_SPECIALS);
        }
      } catch (err) {
        console.warn('IndexedDB initial hydration note:', err);
      }
    }

    initOfflineStoreData();
    fetchSpecials();

    // Check if onboarding was completed previously; if not, gently show smooth onboarding
    try {
      const onboardingCompleted = localStorage.getItem('ishopp_onboarding_completed');
      if (!onboardingCompleted) {
        setIsOnboardingOpen(true);
      }
    } catch {}

    // 3. Supabase Auth session listener & auto-restore
    const client = getClientSupabase();
    if (client) {
      client.auth.getSession().then(({ data }) => {
        if (data?.session?.user) {
          const su = data.session.user;
          const meta = su.user_metadata || {};
          setUser((prev) => {
            const updated = {
              ...prev,
              id: su.id,
              email: su.email || prev.email,
              full_name: meta.full_name || prev.full_name,
              username: meta.username || prev.username,
              avatar_url: meta.avatar_url || prev.avatar_url,
            };
            try {
              localStorage.setItem('ishopp_user_profile', JSON.stringify(updated));
            } catch {}
            return updated;
          });
        }
      });

      const { data: authSub } = client.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const su = session.user;
          const meta = su.user_metadata || {};
          setUser((prev) => {
            const updated = {
              ...prev,
              id: su.id,
              email: su.email || prev.email,
              full_name: meta.full_name || prev.full_name,
              username: meta.username || prev.username,
              avatar_url: meta.avatar_url || prev.avatar_url,
            };
            try {
              localStorage.setItem('ishopp_user_profile', JSON.stringify(updated));
            } catch {}
            return updated;
          });
        }
      });

      return () => {
        authSub?.subscription?.unsubscribe();
      };
    }
  }, []);

  const fetchSpecials = async () => {
    try {
      const res = await fetch('/api/feed');
      const data = await res.json();
      if (data.specials && data.specials.length > 0) {
        setSpecials(data.specials);
        // Persist newly fetched catalog into IndexedDB for offline operation
        await saveOfflineSpecials(data.specials);
      }
    } catch (err) {
      console.warn('Using local IndexedDB store specials (offline):', err);
      const cached = await getOfflineSpecials();
      if (cached && cached.length > 0) {
        setSpecials(cached);
      }
    }
  };

  const handleAddItemToList = (nameOrItem: string | ShoppingListItem) => {
    let newItem: ShoppingListItem;
    if (typeof nameOrItem === 'string') {
      newItem = {
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
    } else {
      newItem = nameOrItem;
    }

    setShoppingListItems((prev) => {
      const updated = [newItem, ...prev];
      // Sync immediately with local IndexedDB
      saveOfflineShoppingList(updated);
      return updated;
    });

    if (!navigator.onLine) {
      enqueueOfflineSync('ADD_SHOPPING_ITEM', newItem);
    }
  };

  const handleRemoveItemFromList = (id: string) => {
    setShoppingListItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      saveOfflineShoppingList(updated);
      return updated;
    });
    deleteOfflineShoppingItem(id);
  };

  const handleToggleItemInList = (id: string) => {
    setShoppingListItems((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      );
      saveOfflineShoppingList(updated);
      return updated;
    });
  };

  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isSupabaseStatusOpen, setIsSupabaseStatusOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDealPublished = (newDeal: Special) => {
    setSpecials((prev) => {
      const updated = [newDeal, ...prev];
      saveOfflineSpecials(updated);
      return updated;
    });
    putOfflineSpecial(newDeal);
    if (!navigator.onLine) {
      enqueueOfflineSync('PUBLISH_DEAL', newDeal);
    }
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
    if (navigator.onLine) {
      try {
        await fetch('/api/verify-deal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ special_id: specialId }),
        });
      } catch (err) {
        console.warn('Verify sync queuing offline:', err);
        enqueueOfflineSync('VERIFY_DEAL', { special_id: specialId });
      }
    } else {
      enqueueOfflineSync('VERIFY_DEAL', { special_id: specialId });
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
      mobile_number: !isEmail ? contactInfo : prev.mobile_number,
      username: isEmail ? `@${contactInfo.split('@')[0]}` : `@member_${contactInfo.slice(-4)}`,
      full_name: isEmail ? contactInfo.split('@')[0] : `Shopper ${contactInfo.slice(-4)}`,
      account_status: 'active',
      needs_profile_completion: true,
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
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenScan={() => {
          setViewMode('app');
          setIsScanOpen(true);
        }}
        onOpenRadar={() => {
          setViewMode('app');
          setCurrentTab('discover');
        }}
        onOpenPriceIntelligence={() => {
          setViewMode('app');
          setSelectedDealForHistory(null);
          setIsPriceIntelligenceOpen(true);
        }}
        onOpenAssistant={() => {
          setViewMode('app');
          setIsAssistantOpen(true);
        }}
        onOpenShoppingList={() => {
          setViewMode('app');
          setIsShoppingListOpen(true);
        }}
        shoppingListCount={shoppingListItems.length}
      />
    );
  }

  // CORE PWA MOBILE APP EXPERIENCE
  return (
    <div className="min-h-screen w-full max-w-full bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-rose-100 selection:text-rose-900 antialiased overscroll-none overflow-x-hidden">
      {/* Offline Status & IndexedDB Cache Banner */}
      <OfflineStatusBanner
        onlineStatus={onlineStatus}
        specialsCount={specials.length}
        shoppingListCount={shoppingListItems.length}
      />

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
        onOpenRouteOptimizer={() => setIsRouteOptimizerOpen(true)}
        onOpenPantryScan={() => setIsScanFinishedModalOpen(true)}
        shoppingListCount={shoppingListItems.length}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenSupabaseStatus={() => setIsSupabaseStatusOpen(true)}
        onOpenMagic={() => setIsMagicSheetOpen(true)}
        onOpenLanding={() => setViewMode('landing')}
        onOpenAuth={() => setIsAuthOpen(true)}
        userAvatar={user.avatar_url}
        userName={user.full_name}
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
            onOpenProfileCompletion={() => setIsProfileCompletionOpen(true)}
            onViewLandingPage={() => setViewMode('landing')}
            onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
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
        onSelectRouteOptimizer={() => setIsRouteOptimizerOpen(true)}
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
        onClose={() => {
          setIsOnboardingOpen(false);
          // When onboarding closes and profile still needs full name / photo, open completion modal
          const profileDone = localStorage.getItem('ishopp_profile_completed');
          if (!profileDone && (user.needs_profile_completion || !user.full_name || user.full_name.includes('@') || user.full_name.startsWith('Shopper '))) {
            setIsProfileCompletionOpen(true);
          }
        }}
        onComplete={handleOnboardingComplete}
        onLaunchScan={() => setIsScanOpen(true)}
      />

      {/* Supabase Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(newProfile, meta) => {
          setUser(newProfile);
          try {
            localStorage.setItem('ishopp_user_profile', JSON.stringify(newProfile));
            localStorage.setItem('ishopp_activated', 'true');
          } catch {}

          if (meta?.isNewUser || newProfile.needs_profile_completion) {
            // Direct user into onboarding first or profile completion modal
            const onboardingDone = localStorage.getItem('ishopp_onboarding_completed');
            if (!onboardingDone) {
              setIsOnboardingOpen(true);
            } else {
              setIsProfileCompletionOpen(true);
            }
          }
        }}
      />

      {/* Profile Completion Modal (Full Name & Profile Pic Upload) */}
      <ProfileCompletionModal
        isOpen={isProfileCompletionOpen}
        onClose={() => setIsProfileCompletionOpen(false)}
        user={user}
        onProfileUpdated={(updatedProfile) => {
          setUser(updatedProfile);
        }}
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
        onOpenRouteOptimizer={() => setIsRouteOptimizerOpen(true)}
        userCity={user.city}
      />

      {/* D3 Route Optimizer Modal (Visiting stores in optimal distance sequence) */}
      <RouteOptimizerModal
        isOpen={isRouteOptimizerOpen}
        onClose={() => setIsRouteOptimizerOpen(false)}
        items={shoppingListItems}
        specials={specials}
        userCity={user.city}
        onToggleItemCheck={handleToggleItemInList}
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

      {/* iShopp Admin Dashboard (Supabase Enterprise Architecture & Store Ops) */}
      {isAdminDashboardOpen && (
        <AdminDashboard
          onClose={() => setIsAdminDashboardOpen(false)}
          specials={specials}
        />
      )}
    </div>
  );
}
