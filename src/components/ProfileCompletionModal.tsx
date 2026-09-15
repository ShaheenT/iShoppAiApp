import React, { useState, useRef } from 'react';
import {
  User,
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  MapPin,
  FileText,
  Phone,
  Database,
  Loader2,
} from 'lucide-react';
import { UserProfile } from '../types/index.js';
import { updateProfileInSupabase } from '../lib/supabaseAuth.js';
import { IShoppIcon } from './IShoppIcon.js';

interface ProfileCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onProfileUpdated: (updatedProfile: UserProfile) => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
];

export const ProfileCompletionModal: React.FC<ProfileCompletionModalProps> = ({
  isOpen,
  onClose,
  user,
  onProfileUpdated,
}) => {
  const [fullName, setFullName] = useState(user.full_name || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || AVATAR_PRESETS[0]);
  const [bio, setBio] = useState(user.bio || 'Smart grocery shopper saving everyday on essentials');
  const [mobileNumber, setMobileNumber] = useState(user.mobile_number || '');
  const [city, setCity] = useState(user.city || 'Cape Town');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please choose a valid image file (PNG or JPG)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarUrl(reader.result);
        setError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Full name is required');
      return;
    }
    if (!avatarUrl) {
      setError('Please upload or select a profile picture');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Sync to Supabase auth & profiles table
      const res = await updateProfileInSupabase(
        user.id,
        fullName.trim(),
        avatarUrl,
        bio.trim(),
        mobileNumber.trim(),
        city
      );

      const updatedProfile: UserProfile = {
        ...user,
        full_name: fullName.trim(),
        avatar_url: avatarUrl,
        bio: bio.trim(),
        mobile_number: mobileNumber.trim(),
        city,
        needs_profile_completion: false,
      };

      try {
        localStorage.setItem('ishopp_user_profile', JSON.stringify(updatedProfile));
        localStorage.setItem('ishopp_profile_completed', 'true');
      } catch {}

      onProfileUpdated(updatedProfile);
      setSuccess(true);

      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      setError(err?.message || 'Failed to update personal details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="profile-completion-modal-overlay"
      className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs overflow-y-auto overscroll-contain p-3 sm:p-4 flex min-h-full items-start sm:items-center justify-center py-4 sm:py-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="profile-completion-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-completion-title"
        className="bg-white w-full max-w-lg my-auto max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-3rem)] flex flex-col rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 shrink-0"
      >
        {/* Sticky Header */}
        <div className="px-5 py-4 sm:px-6 sm:py-4.5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white z-20">
          <div className="flex items-center gap-3">
            <div className="shrink-0" title="iShopp Logo">
              <IShoppIcon size={40} withGlow className="shadow-xs" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="profile-completion-title" className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Complete Your Profile
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                  <Sparkles className="w-2.5 h-2.5" />
                  Account Setup
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                Add your full name and profile photo to personalize your savings badge
              </p>
            </div>
          </div>

          <button
            id="profile-completion-close-btn"
            onClick={onClose}
            aria-label="Close profile modal"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto overscroll-contain">
          {success && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold">
                Personal profile saved to Supabase! Updating dashboard...
              </span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form id="profile-completion-form" onSubmit={handleSave} className="space-y-4">
            {/* Profile Photo Upload & Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">
                Profile Photo <span className="text-emerald-600">*</span>
              </label>

              <div className="flex items-center gap-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="relative group shrink-0">
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-white border-2 border-emerald-500 shadow-sm">
                    <img
                      src={avatarUrl}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Upload photo"
                    className="absolute inset-0 bg-black/40 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-[10px] font-bold"
                  >
                    <Camera className="w-4 h-4 mb-0.5" />
                    Change
                  </button>
                </div>

                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/png, image/jpeg, image/webp"
                      className="hidden"
                      id="profile-photo-file-input"
                    />
                    <button
                      type="button"
                      id="profile-upload-device-btn"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-emerald-600" />
                      Upload From Device
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    JPG, PNG or WebP under 5MB. Or pick a preset below:
                  </p>
                </div>
              </div>

              {/* Avatar Presets */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-500 block">
                  Quick Avatar Options:
                </span>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatarUrl(preset)}
                      className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        avatarUrl === preset
                          ? 'border-emerald-500 ring-2 ring-emerald-300 scale-105'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={preset}
                        alt={`Preset ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Full Name Input */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Full Name <span className="text-emerald-600">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  id="profile-fullname-input"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Shaheen Ebrahim"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Mobile Number Input */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Mobile Number (for SMS savings & receipts)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  id="profile-mobile-input"
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="e.g. 082 123 4567 or +27821234567"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Metro Shopping City */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Primary Shopping City
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <select
                  id="profile-city-select"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors cursor-pointer"
                >
                  <option value="Cape Town">Cape Town (Western Cape)</option>
                  <option value="Johannesburg">Johannesburg (Gauteng)</option>
                  <option value="Durban">Durban (KwaZulu-Natal)</option>
                  <option value="Pretoria">Pretoria (Gauteng)</option>
                  <option value="Stellenbosch">Stellenbosch (Western Cape)</option>
                </select>
              </div>
            </div>

            {/* Bio / Shopper Motto */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Shopper Bio / Motto
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  id="profile-bio-input"
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="e.g. Weekend grocery hunter & budget saver"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Supabase Cloud Sync Guarantee */}
            <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-100 flex items-center gap-2.5 text-[11px] text-emerald-900">
              <Database className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Personal details are securely synced to Supabase PostgreSQL database under your user record.
              </span>
            </div>

            {/* Submit Button */}
            <button
              id="profile-completion-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving to Supabase...</span>
                </>
              ) : (
                'Save Profile & Continue to Dashboard'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
