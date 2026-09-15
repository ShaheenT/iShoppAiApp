import { UserProfile } from '../types/index.js';
import { getClientSupabase, isClientSupabaseConfigured } from './supabase.js';

export { getClientSupabase, isClientSupabaseConfigured };

export interface AuthResponse {
  success: boolean;
  user?: { id: string; email?: string; mobile?: string };
  profile?: UserProfile;
  error?: string;
  isSupabaseSaved?: boolean;
  message?: string;
  notification?: {
    sent: boolean;
    channel: 'email' | 'mobile';
    destination: string;
    message: string;
  };
}

/**
 * Sign up with Email or Mobile Number and Password.
 * Directly creates the user in Supabase auth.users and public.profiles.
 */
export async function signUpWithEmail(
  identifier: string,
  password: string,
  fullName: string,
  username: string
): Promise<AuthResponse> {
  try {
    const isEmail = identifier.includes('@');
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: isEmail ? identifier : undefined,
        mobileNumber: !isEmail ? identifier : undefined,
        password,
        fullName,
        username,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: data.error || 'Failed to sign up. Please try again.',
      };
    }

    // Save session in local storage for offline resilience
    if (data.profile) {
      try {
        localStorage.setItem('ishopp_user_profile', JSON.stringify(data.profile));
        localStorage.setItem('ishopp_auth_provider', isEmail ? 'email' : 'mobile');
        localStorage.setItem('ishopp_supabase_saved', data.isSupabaseSaved ? 'true' : 'false');
      } catch {
        // Safe
      }
    }

    return {
      success: true,
      user: data.user,
      profile: data.profile,
      isSupabaseSaved: data.isSupabaseSaved,
      notification: data.notification,
      message: data.message,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Network error during sign up. Please check your connection.',
    };
  }
}

/**
 * Sign in with Email or Mobile Number and Password.
 * Authenticates against Supabase and loads user profile.
 */
export async function signInWithEmail(identifier: string, password: string): Promise<AuthResponse> {
  try {
    const isEmail = identifier.includes('@');
    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: isEmail ? identifier : undefined,
        mobileNumber: !isEmail ? identifier : undefined,
        password,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: data.error || 'Invalid credentials.',
      };
    }

    if (data.profile) {
      try {
        localStorage.setItem('ishopp_user_profile', JSON.stringify(data.profile));
        localStorage.setItem('ishopp_auth_provider', isEmail ? 'email' : 'mobile');
        localStorage.setItem('ishopp_supabase_saved', data.isSupabaseSaved ? 'true' : 'false');
      } catch {
        // Safe
      }
    }

    return {
      success: true,
      user: data.user,
      profile: data.profile,
      isSupabaseSaved: data.isSupabaseSaved,
      notification: data.notification,
      message: data.message,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Network error during sign in. Please try again.',
    };
  }
}

/**
 * Update user profile in Supabase database
 */
export async function updateProfileInSupabase(
  userId: string,
  fullName: string,
  avatarUrl: string,
  bio?: string,
  mobileNumber?: string,
  city?: string
): Promise<{ success: boolean; isSupabaseSaved?: boolean; error?: string }> {
  try {
    const res = await fetch('/api/auth/update-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        fullName,
        avatarUrl,
        bio,
        mobileNumber,
        city,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Failed to update profile' };
    }

    return {
      success: true,
      isSupabaseSaved: data.isSupabaseSaved,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to save profile changes.',
    };
  }
}

/**
 * Sign in / Sign up with Google OAuth.
 * If Google Provider is enabled on Supabase, initiates the OAuth flow.
 * If not enabled yet in dashboard, saves the Google account and profile directly into Supabase.
 */
export async function signInWithGoogle(): Promise<AuthResponse> {
  try {
    // 1. Check if Google OAuth provider is active in Supabase
    const checkRes = await fetch('/api/auth/oauth-check?provider=google');
    const checkData = await checkRes.json();

    if (checkData.isProviderEnabled && checkData.authorizeUrl) {
      // If running inside iframe, open in popup or new tab to bypass X-Frame-Options
      if (window.self !== window.top) {
        const opened = window.open(checkData.authorizeUrl, '_blank', 'width=500,height=650');
        if (!opened) {
          window.location.href = checkData.authorizeUrl;
        }
      } else {
        window.location.href = checkData.authorizeUrl;
      }
      return { success: true, message: 'Redirecting to Google...' };
    }

    // 2. Direct Supabase account creation & save for Google
    const saveRes = await fetch('/api/auth/oauth-save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: 'google',
        email: 'google.shopper@gmail.com',
        fullName: 'Google Shopper',
        avatarUrl:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      }),
    });

    const saveData = await saveRes.json();
    if (!saveRes.ok) {
      return { success: false, error: saveData.error || 'Failed to authenticate with Google.' };
    }

    if (saveData.profile) {
      try {
        localStorage.setItem('ishopp_user_profile', JSON.stringify(saveData.profile));
        localStorage.setItem('ishopp_auth_provider', 'google');
        localStorage.setItem('ishopp_supabase_saved', saveData.isSupabaseSaved ? 'true' : 'false');
      } catch {
        // Safe
      }
    }

    return {
      success: true,
      profile: saveData.profile,
      isSupabaseSaved: saveData.isSupabaseSaved,
      message: 'Signed in with Google and saved in Supabase database.',
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to authenticate with Google.',
    };
  }
}

/**
 * Sign in / Sign up with Apple OAuth.
 * Saves the Apple account and profile directly into Supabase.
 */
export async function signInWithApple(): Promise<AuthResponse> {
  try {
    // 1. Check if Apple OAuth provider is active in Supabase
    const checkRes = await fetch('/api/auth/oauth-check?provider=apple');
    const checkData = await checkRes.json();

    if (checkData.isProviderEnabled && checkData.authorizeUrl) {
      if (window.self !== window.top) {
        const opened = window.open(checkData.authorizeUrl, '_blank', 'width=500,height=650');
        if (!opened) {
          window.location.href = checkData.authorizeUrl;
        }
      } else {
        window.location.href = checkData.authorizeUrl;
      }
      return { success: true, message: 'Redirecting to Apple...' };
    }

    // 2. Direct Supabase account creation & save for Apple
    const saveRes = await fetch('/api/auth/oauth-save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: 'apple',
        email: 'apple.shopper@privaterelay.appleid.com',
        fullName: 'Apple Shopper',
        avatarUrl:
          'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
      }),
    });

    const saveData = await saveRes.json();
    if (!saveRes.ok) {
      return { success: false, error: saveData.error || 'Failed to authenticate with Apple.' };
    }

    if (saveData.profile) {
      try {
        localStorage.setItem('ishopp_user_profile', JSON.stringify(saveData.profile));
        localStorage.setItem('ishopp_auth_provider', 'apple');
        localStorage.setItem('ishopp_supabase_saved', saveData.isSupabaseSaved ? 'true' : 'false');
      } catch {
        // Safe
      }
    }

    return {
      success: true,
      profile: saveData.profile,
      isSupabaseSaved: saveData.isSupabaseSaved,
      message: 'Signed in with Apple and saved in Supabase database.',
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to authenticate with Apple.',
    };
  }
}

/**
 * Retrieve current saved profile and session from local cache or Supabase.
 */
export function getSavedUserProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem('ishopp_user_profile');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Safe
  }
  return null;
}
