import React from 'react';
import { X, Award, Trophy, Star, ShieldCheck, Flame, Users } from 'lucide-react';
import { LEADERBOARD } from '../../server/seedData.js';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  userPoints: number;
  userSavings: number;
}

const BADGES = [
  { name: 'First Scan', description: 'Snapped first shelf special', icon: '📸', unlocked: true },
  { name: 'Deal Hunter', description: 'Logged 25+ verified specials', icon: '🎯', unlocked: true },
  { name: 'Weekend Warrior', description: 'Snapped Saturday braai specials', icon: '🔥', unlocked: true },
  { name: 'Grocery Hero', description: 'Saved the community over R5,000', icon: '🦸', unlocked: false },
  { name: 'Top Contributor', description: 'Ranked in national Top 10', icon: '👑', unlocked: false },
];

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  userPoints,
  userSavings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]"
        id="leaderboard-modal"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Community Leaderboard</h3>
              <p className="text-xs text-slate-500">Recognizing South Africa's top savings contributors</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* User Status Card */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-4 shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black text-lg">
                YH
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">You (Deal Hunter)</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Rank #12
                  </span>
                </div>
                <p className="text-xs text-slate-400">Cape Town • 18 verified specials</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-emerald-400">{userPoints} pts</span>
              <span className="block text-[10px] text-slate-400">R{userSavings.toFixed(0)} saved</span>
            </div>
          </div>

          {/* Badges Carousel */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
              Your Badges & Achievements
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {BADGES.map((b, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    b.unlocked
                      ? 'border-emerald-200 bg-emerald-50/50 text-slate-900 shadow-2xs'
                      : 'border-slate-100 bg-slate-50/50 text-slate-400 opacity-60'
                  }`}
                >
                  <span className="text-2xl block mb-1">{b.icon}</span>
                  <span className="text-xs font-bold block">{b.name}</span>
                  <span className="text-[10px] text-slate-500 leading-tight block mt-0.5">
                    {b.description}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Deal Hunters List */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
              National Rankings
            </span>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
              {LEADERBOARD.map((user) => (
                <div
                  key={user.id}
                  className="p-3.5 flex items-center justify-between hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 text-center font-black text-sm ${
                        user.rank === 1
                          ? 'text-amber-500'
                          : user.rank === 2
                          ? 'text-slate-400'
                          : user.rank === 3
                          ? 'text-amber-700'
                          : 'text-slate-500'
                      }`}
                    >
                      #{user.rank}
                    </span>
                    <img
                      src={user.avatar_url}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900">{user.name}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-semibold">
                          {user.badge}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {user.city} • {user.scans_count} scans
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-xs text-emerald-700 block">
                      {user.contribution_score} pts
                    </span>
                    <span className="text-[10px] text-slate-400">{user.reputation_score}% rep</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
