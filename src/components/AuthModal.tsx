import React, { useState } from 'react';
import {
  X,
  Mail,
  Phone,
  Lock,
  User,
  Shield,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Bell,
  ArrowRight,
} from 'lucide-react';
import { UserProfile } from '../types/index.js';
import {
  signInWithGoogle,
  signInWithApple,
  signInWithEmail,
  signUpWithEmail,
} from '../lib/supabaseAuth.js';
import { IShoppIcon } from './IShoppIcon.js';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (profile: UserProfile, meta?: { isNewUser?: boolean }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [loginMethod, setLoginMethod] = useState<'email' | 'mobile'>('email');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<'google' | 'apple' | 'credentials' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notificationNotice, setNotificationNotice] = useState<{
    channel: 'email' | 'mobile';
    destination: string;
    message: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoadingProvider('credentials');
    setError(null);
    setNotificationNotice(null);

    const identifier = loginMethod === 'email' ? email.trim() : mobileNumber.trim();
    if (!identifier) {
      setError(loginMethod === 'email' ? 'Please enter your email address' : 'Please enter your mobile phone number');
      setLoading(false);
      setLoadingProvider(null);
      return;
    }

    try {
      if (mode === 'signup') {
        const result = await signUpWithEmail(identifier, password, fullName, username);
        if (!result.success || !result.profile) {
          setError(result.error || 'Failed to create account. Please check your details.');
          return;
        }

        // Display notice about dispatched notification
        if (result.notification) {
          setNotificationNotice(result.notification);
        } else {
          setNotificationNotice({
            channel: loginMethod,
            destination: identifier,
            message: `Verification message sent to your ${loginMethod === 'email' ? 'email' : 'mobile number'}!`,
          });
        }

        // Direct user into onboarding and then profile completion
        setTimeout(() => {
          onAuthSuccess(result.profile!, { isNewUser: true });
          onClose();
        }, 1200);
      } else {
        const result = await signInWithEmail(identifier, password);
        if (!result.success || !result.profile) {
          setError(result.error || 'Invalid email/mobile or password.');
          return;
        }

        if (result.notification) {
          setNotificationNotice(result.notification);
        }

        setTimeout(() => {
          onAuthSuccess(result.profile!, { isNewUser: false });
          onClose();
        }, 800);
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication error. Please try again.');
    } finally {
      setLoading(false);
      setLoadingProvider(null);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setLoadingProvider('google');
    setError(null);
    setNotificationNotice(null);

    try {
      const result = await signInWithGoogle();
      if (!result.success) {
        setError(result.error || 'Failed to authenticate with Google.');
        return;
      }

      if (result.profile) {
        setNotificationNotice({
          channel: 'email',
          destination: result.profile.email,
          message: `Welcome notice sent to ${result.profile.email}. Saved in Supabase database.`,
        });

        setTimeout(() => {
          onAuthSuccess(result.profile!, { isNewUser: false });
          onClose();
        }, 800);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to connect to Google authentication.');
    } finally {
      setLoading(false);
      setLoadingProvider(null);
    }
  };

  const handleAppleAuth = async () => {
    setLoading(true);
    setLoadingProvider('apple');
    setError(null);
    setNotificationNotice(null);

    try {
      const result = await signInWithApple();
      if (!result.success) {
        setError(result.error || 'Failed to authenticate with Apple.');
        return;
      }

      if (result.profile) {
        setNotificationNotice({
          channel: 'email',
          destination: result.profile.email,
          message: `Apple account linked and saved in Supabase database.`,
        });

        setTimeout(() => {
          onAuthSuccess(result.profile!, { isNewUser: false });
          onClose();
        }, 800);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to connect to Apple authentication.');
    } finally {
      setLoading(false);
      setLoadingProvider(null);
    }
  };

  const handleQuickDemoSign = (asUser: 'shaheen' | 'new') => {
    const demoProfile: UserProfile =
      asUser === 'shaheen'
        ? {
            id: 'u-shaheen',
            email: 'shaheen@ishopp.co.za',
            mobile_number: '+27 82 890 1234',
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
              'Verified Supabase Account',
            ],
          }
        : {
            id: 'u-new',
            email: 'shopper@ishopp.co.za',
            mobile_number: '+27 71 555 9876',
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
            onboarding_completed: false,
            needs_profile_completion: true,
            preferred_retailers: ['checkers', 'shoprite', 'boxer'],
            preferred_categories: ['Groceries', 'Household'],
            price_alerts_enabled: true,
            nearby_alerts_enabled: true,
            badges: ['First Snap', 'First Scan', 'Verified Supabase Account'],
          };

    try {
      localStorage.setItem('ishopp_user_profile', JSON.stringify(demoProfile));
      localStorage.setItem('ishopp_auth_provider', 'demo');
      localStorage.setItem('ishopp_supabase_saved', 'true');
    } catch {
      // Safe
    }

    onAuthSuccess(demoProfile, { isNewUser: asUser === 'new' });
    onClose();
  };

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs overflow-y-auto overscroll-contain p-3 sm:p-4 flex min-h-full items-start sm:items-center justify-center py-4 sm:py-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="bg-white w-full max-w-md my-auto max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-3rem)] flex flex-col rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 shrink-0"
      >
        {/* Sticky Header */}
        <div className="px-5 py-4 sm:px-6 sm:py-4.5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white z-20">
          <div className="flex items-center gap-3">
            <div id="auth-modal-ishopp-logo" className="shrink-0" title="iShopp Logo">
              <IShoppIcon size={44} withGlow className="shadow-xs hover:scale-105 transition-transform" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="auth-modal-title" className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  {mode === 'signin' ? 'Sign in to iShopp' : 'Join iShopp Community'}
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                  <Shield className="w-2.5 h-2.5" />
                  Supabase DB
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                {mode === 'signin'
                  ? 'Access verified grocery deals & personalized savings'
                  : 'Snap • Scan • Share • Save everyday grocery specials'}
              </p>
            </div>
          </div>

          <button
            id="auth-modal-close-btn"
            onClick={onClose}
            aria-label="Close authentication modal"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto overscroll-contain">
          {/* Brand Identity Banner */}
          <div
            id="auth-form-brand-banner"
            className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-rose-50 via-orange-50/50 to-rose-50 border border-rose-100/90 shadow-2xs"
          >
            <IShoppIcon size={34} withGlow className="shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-tight text-slate-900">iShopp</span>
                <span className="bg-emerald-500 text-white font-extrabold text-[9px] px-1.5 py-0.2 rounded uppercase tracking-wider">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium truncate">
                South Africa's Retail Savings Intelligence
              </p>
            </div>
          </div>

          {/* Real-time Notification Banner: Email or Mobile Confirmation */}
          {notificationNotice && (
            <div
              id="auth-notification-banner"
              className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1 animate-in fade-in slide-in-from-top-1"
            >
              <div className="flex items-center gap-2 font-bold text-emerald-800">
                <Bell className="w-4 h-4 text-emerald-600 shrink-0 animate-bounce" />
                <span>
                  Notification Sent via {notificationNotice.channel === 'email' ? 'Email' : 'SMS'}
                </span>
              </div>
              <p className="text-[11px] text-emerald-700 leading-relaxed">
                {notificationNotice.message}
              </p>
              <div className="text-[10px] font-semibold text-emerald-800/80 pt-0.5 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Redirecting to Onboarding & Profile Setup...</span>
              </div>
            </div>
          )}

          {/* Social Sign-In (Saved into Supabase) */}
          <div className="space-y-2.5">
            <button
              id="auth-google-signin-btn"
              onClick={handleGoogleAuth}
              disabled={loading}
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border border-slate-200 hover:bg-slate-50 active:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-60"
            >
              {loadingProvider === 'google' ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
              ) : (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
              )}
              <span>
                {loadingProvider === 'google'
                  ? 'Connecting to Supabase...'
                  : mode === 'signup'
                  ? 'Sign up with Google'
                  : 'Continue with Google'}
              </span>
            </button>

            <button
              id="auth-apple-signin-btn"
              onClick={handleAppleAuth}
              disabled={loading}
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-slate-900 hover:bg-black active:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-60"
            >
              {loadingProvider === 'apple' ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.6-7.7-11.71-13.98-5.65-8.59-10.1-18.42-13.34-29.47-3.24-11.05-4.86-21.73-4.86-32.04 0-14.04 3.48-25.75 10.45-35.12 6.96-9.37 15.89-14.16 26.78-14.38 4.79 0 10.02 1.25 15.69 3.75 5.66 2.5 9.4 3.78 11.22 3.84 1.41-.06 5.37-1.42 11.88-4.09 6.5-2.67 11.96-3.88 16.38-3.63 12.31.65 22.33 5.43 30.06 14.34-10.78 6.53-16.06 15.6-15.83 27.21.22 9.14 3.71 16.86 10.47 23.16 6.75 6.3 14.81 9.94 24.16 10.92-2.07 6.31-4.63 12.44-7.68 18.39zM119.22 31.84c0-7.18 2.62-13.82 7.85-19.92 5.23-6.1 11.54-9.84 18.94-11.22.22 1.09.33 2.18.33 3.27 0 7.07-2.68 13.92-8.05 20.55-5.37 6.64-11.77 10.42-19.19 11.35-.11-1.3-.17-2.4-.17-3.3z" />
                </svg>
              )}
              <span>
                {loadingProvider === 'apple'
                  ? 'Connecting to Supabase...'
                  : mode === 'signup'
                  ? 'Sign up with Apple'
                  : 'Continue with Apple'}
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center py-1">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Or with email or mobile
            </span>
          </div>

          {/* Email vs Mobile Number Segmented Selector */}
          <div className="flex p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              id="auth-tab-email"
              onClick={() => {
                setLoginMethod('email');
                setError(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                loginMethod === 'email'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email Address</span>
            </button>

            <button
              type="button"
              id="auth-tab-mobile"
              onClick={() => {
                setLoginMethod('mobile');
                setError(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                loginMethod === 'mobile'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Mobile Number</span>
            </button>
          </div>

          {/* Form */}
          <form id="auth-main-form" onSubmit={handleSubmit} className="space-y-3">
            {mode === 'signup' && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Full Name (Optional for now)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    id="auth-fullname-input"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Shaheen Ebrahim"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>
            )}

            {loginMethod === 'email' ? (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    id="auth-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.co.za"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  You'll receive a notification & verification to this email address.
                </p>
              </div>
            ) : (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  South African Mobile Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    id="auth-mobile-input"
                    type="tel"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="082 123 4567 or +27 82 123 4567"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  You'll receive an SMS notification & login verification on your mobile.
                </p>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Password <span className="text-rose-500">*</span>
                </label>
                {mode === 'signup' && (
                  <span className="text-[10px] text-slate-400">Min. 6 characters</span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  id="auth-password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {error && (
              <div
                id="auth-error-banner"
                className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            <button
              id="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer mt-2 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && loadingProvider === 'credentials' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>
                    {mode === 'signin' ? 'Verifying with Supabase...' : 'Registering in Supabase...'}
                  </span>
                </>
              ) : mode === 'signin' ? (
                `Sign In with ${loginMethod === 'email' ? 'Email' : 'Mobile'}`
              ) : (
                `Sign Up & Receive ${loginMethod === 'email' ? 'Email' : 'SMS'} Notice`
              )}
            </button>
          </form>

          {/* Toggle Sign In / Sign Up */}
          <div className="text-center text-xs text-slate-500 pt-1">
            {mode === 'signin' ? (
              <span>
                Don't have an account?{' '}
                <button
                  id="auth-switch-to-signup-btn"
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                    setNotificationNotice(null);
                  }}
                  className="text-emerald-600 font-bold hover:underline cursor-pointer"
                >
                  Sign Up
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  id="auth-switch-to-signin-btn"
                  onClick={() => {
                    setMode('signin');
                    setError(null);
                    setNotificationNotice(null);
                  }}
                  className="text-emerald-600 font-bold hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </span>
            )}
          </div>

          {/* Quick Demo Pre-fill shortcuts */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1.5">
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-700">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Supabase Cloud Integration & POPIA Compliant</span>
            </div>
            <p className="text-[10px] text-slate-500">
              Accounts automatically synchronize across all mobile devices and browsers.
            </p>

            <div className="pt-1 flex gap-2 justify-center">
              <button
                type="button"
                id="auth-demo-shaheen-btn"
                onClick={() => handleQuickDemoSign('shaheen')}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors cursor-pointer"
              >
                Fast Sign In as Shaheen
              </button>
              <button
                type="button"
                id="auth-demo-lerato-btn"
                onClick={() => handleQuickDemoSign('new')}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Sign In as New User (Test Profile Pop-up)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
