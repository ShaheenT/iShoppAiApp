import React from 'react';
import {
  User,
  ShieldCheck,
  Award,
  TrendingDown,
  Camera,
  Eye,
  Users,
  Bell,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
  Sparkles,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { UserProfile } from '../types/index.js';

interface AccountViewProps {
  user: UserProfile;
  onOpenAuth: () => void;
  onReplayOnboarding: () => void;
  onOpenMyUploads?: () => void;
  onViewLandingPage?: () => void;
}

export const AccountView: React.FC<AccountViewProps> = ({
  user,
  onOpenAuth,
  onReplayOnboarding,
  onOpenMyUploads,
  onViewLandingPage,
}) => {
  const allBadges = [
    { name: 'First Snap', desc: 'Photographed your first shelf special', icon: '📸', unlocked: true },
    { name: 'First Scan', desc: 'Used AI OCR to read a shelf tag', icon: '⚡', unlocked: true },
    { name: 'Deal Hunter', desc: 'Contributed 50+ verified specials', icon: '🎯', unlocked: true },
    { name: 'Weekend Warrior', desc: 'Scanned specials during Saturday rush', icon: '🛒', unlocked: true },
    { name: 'Grocery Hero', desc: 'Saved community over R10,000', icon: '🦸', unlocked: true },
    { name: 'Top Contributor', desc: '94%+ verification rate by shoppers', icon: '⭐', unlocked: true },
    { name: 'Price Detective', desc: 'Spotted 10+ major price drops', icon: '🔍', unlocked: true },
    { name: 'Community Saver', desc: 'Helped 1,000+ local families save', icon: '🤝', unlocked: true },
  ];

  return (
    <div id="account-view-screen" className="space-y-6 pb-24 animate-in fade-in duration-200">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl overflow-hidden bg-slate-100 border-2 border-emerald-500 flex-shrink-0 shadow-sm">
            <img
              src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={user.full_name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg font-black text-slate-900 tracking-tight truncate">
                {user.full_name}
              </h2>
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            </div>

            <p className="text-xs text-slate-500 font-semibold">{user.username}</p>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                Level 12 • Trusted Contributor
              </span>
            </div>
          </div>
        </div>

        {/* iShopp Reputation Score Indicator */}
        <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/90 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-emerald-950 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>iShopp Contributor Score</span>
            </div>
            <p className="text-[11px] text-emerald-800 mt-0.5">
              Based on accuracy, community upvotes, and verification frequency
            </p>
          </div>

          <div className="text-right">
            <div className="text-2xl font-black text-emerald-800">
              {user.savings_score || 94}
              <span className="text-xs font-semibold text-emerald-600">/100</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700">Top 2% in Cape Town</span>
          </div>
        </div>
      </div>

      {/* 4 Key Metric Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
            <TrendingDown className="w-4 h-4" />
          </div>
          <div className="text-xl font-black text-slate-900">
            R{user.total_savings_unlocked.toFixed(0)}
          </div>
          <div className="text-xs font-semibold text-slate-400 mt-0.5">Savings Unlocked</div>
        </div>

        <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
            <Camera className="w-4 h-4" />
          </div>
          <div className="text-xl font-black text-slate-900">{user.total_specials_shared}</div>
          <div className="text-xs font-semibold text-slate-400 mt-0.5">Specials Shared</div>
        </div>

        <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
            <Users className="w-4 h-4" />
          </div>
          <div className="text-xl font-black text-slate-900">{user.total_views}</div>
          <div className="text-xs font-semibold text-slate-400 mt-0.5">Shoppers Helped</div>
        </div>

        <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
            <Award className="w-4 h-4" />
          </div>
          <div className="text-xl font-black text-slate-900">{user.total_scans}</div>
          <div className="text-xs font-semibold text-slate-400 mt-0.5">Shelf Tags Scanned</div>
        </div>
      </div>

      {/* Community Badges Collection */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" />
            <h3 className="font-extrabold text-slate-900 text-sm">Community Badges</h3>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
            {allBadges.length} of {allBadges.length} Earned
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {allBadges.map((b) => (
            <div
              key={b.name}
              className="p-3 rounded-2xl border border-slate-100 bg-slate-50/70 text-center space-y-1"
            >
              <div className="text-2xl">{b.icon}</div>
              <div className="font-extrabold text-slate-900 text-xs truncate">{b.name}</div>
              <div className="text-[10px] text-slate-500 line-clamp-2 leading-tight">
                {b.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Apple-style Grouped Settings List */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
          Preferences & Account
        </h4>

        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
          {/* Location */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Current Shopping Region</div>
                <div className="text-[11px] text-slate-500">{user.city}, {user.province}</div>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600">Active</span>
          </div>

          {/* Replay Onboarding */}
          <button
            onClick={onReplayOnboarding}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Replay App Walkthrough</div>
                <div className="text-[11px] text-slate-500">Configure stores, categories & alert rules</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </button>

          {/* View Steve Jobs Landing Page */}
          {onViewLandingPage && (
            <button
              onClick={onViewLandingPage}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors border-t border-slate-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-rose-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Steve Jobs Landing Page</div>
                  <div className="text-[11px] text-slate-500">View keynote presentation & activation flow</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </button>
          )}

          {/* Currency & Country */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                <span className="font-black text-xs">R</span>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Currency & Market</div>
                <div className="text-[11px] text-slate-500">South African Rand (ZAR) • ZA Retail</div>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-400">Default</span>
          </div>

          {/* POPIA & Privacy */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Location Privacy (POPIA)</div>
                <div className="text-[11px] text-slate-500">
                  Your exact location is never exposed to other shoppers
                </div>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600">Enforced</span>
          </div>

          {/* Switch Account */}
          <button
            onClick={onOpenAuth}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                <LogOut className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-red-600">Switch Account or Sign Out</div>
                <div className="text-[11px] text-slate-400">Currently signed in as {user.username}</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
