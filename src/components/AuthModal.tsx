import React, { useState } from 'react';
import { X, Mail, Lock, User, Sparkles, Check, AlertCircle, Shield } from 'lucide-react';
import { UserProfile } from '../types/index.js';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (profile: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Direct integration with Supabase Auth or mock demo session
      const userProfile: UserProfile = {
        id: `user-${Date.now()}`,
        email: email || 'shaheen@ishopp.co.za',
        full_name: fullName || (mode === 'signin' ? 'Shaheen Ebrahim' : 'New Shopper'),
        username: username.startsWith('@') ? username : `@${username || 'shaheen'}`,
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
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
        ],
      };

      onAuthSuccess(userProfile);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoSign = (asUser: 'shaheen' | 'new') => {
    const demoProfile: UserProfile =
      asUser === 'shaheen'
        ? {
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
            preferred_retailers: ['picknpay', 'checkers', 'woolworths', 'spar'],
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
          }
        : {
            id: 'u-new',
            email: 'shopper@ishopp.co.za',
            full_name: 'Lerato Khumalo',
            username: '@lerato_k',
            avatar_url:
              'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
            city: 'Johannesburg',
            province: 'Gauteng',
            country: 'South Africa',
            preferred_language: 'English',
            preferred_currency: 'ZAR',
            reputation_score: 450,
            contribution_points: 60,
            savings_score: 72,
            total_savings_unlocked: 240.0,
            total_specials_shared: 4,
            total_scans: 12,
            total_views: 110,
            account_status: 'active',
            onboarding_completed: true,
            preferred_retailers: ['checkers', 'shoprite', 'boxer'],
            preferred_categories: ['Groceries', 'Household'],
            price_alerts_enabled: true,
            nearby_alerts_enabled: true,
            badges: ['First Snap', 'First Scan'],
          };

    onAuthSuccess(demoProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        id="auth-modal"
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              {mode === 'signin' ? 'Sign in to iShopp' : 'Create an Account'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Access personalized savings and publish community specials
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Auth Body */}
        <div className="p-6 space-y-4">
          {/* OAuth Buttons */}
          <div className="space-y-2.5">
            <button
              onClick={() => handleQuickDemoSign('shaheen')}
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              onClick={() => handleQuickDemoSign('shaheen')}
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.6-7.7-11.71-13.98-5.65-8.59-10.1-18.42-13.34-29.47-3.24-11.05-4.86-21.73-4.86-32.04 0-14.04 3.48-25.75 10.45-35.12 6.96-9.37 15.89-14.16 26.78-14.38 4.79 0 10.02 1.25 15.69 3.75 5.66 2.5 9.4 3.78 11.22 3.84 1.41-.06 5.37-1.42 11.88-4.09 6.5-2.67 11.96-3.88 16.38-3.63 12.31.65 22.33 5.43 30.06 14.34-10.78 6.53-16.06 15.6-15.83 27.21.22 9.14 3.71 16.86 10.47 23.16 6.75 6.3 14.81 9.94 24.16 10.92-2.07 6.31-4.63 12.44-7.68 18.39zM119.22 31.84c0-7.18 2.62-13.82 7.85-19.92 5.23-6.1 11.54-9.84 18.94-11.22.22 1.09.33 2.18.33 3.27 0 7.07-2.68 13.92-8.05 20.55-5.37 6.64-11.77 10.42-19.19 11.35-.11-1.3-.17-2.4-.17-3.3z" />
              </svg>
              <span>Continue with Apple</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase">
              Or with email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Shaheen Ebrahim"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Username (optional)
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="@dealhunter"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.co.za"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer mt-2"
            >
              {loading
                ? 'Authenticating...'
                : mode === 'signin'
                ? 'Sign In to iShopp'
                : 'Create iShopp Account'}
            </button>
          </form>

          {/* Toggle Signin / Signup */}
          <div className="text-center text-xs text-slate-500 pt-1">
            {mode === 'signin' ? (
              <span>
                Don't have an account?{' '}
                <button
                  onClick={() => setMode('signup')}
                  className="text-emerald-600 font-bold hover:underline"
                >
                  Sign Up
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  onClick={() => setMode('signin')}
                  className="text-emerald-600 font-bold hover:underline"
                >
                  Sign In
                </button>
              </span>
            )}
          </div>

          {/* Instant Demo Switcher */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1.5">
            <span className="text-[11px] font-bold text-slate-600 block">
              Quick Test Profile Switch
            </span>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={() => handleQuickDemoSign('shaheen')}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
              >
                Sign In as Shaheen (Level 12)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoSign('new')}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Sign In as Lerato (New)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
