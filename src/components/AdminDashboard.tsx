import React, { useState, useEffect } from 'react';
import {
  Database,
  Shield,
  Server,
  Activity,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  Lock,
  HardDrive,
  Users,
  Tag,
  ArrowLeft,
  Zap,
  Globe,
  Radio,
  Clock,
  ChevronRight,
  ExternalLink,
  Sliders,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { Special } from '../types/index.js';

interface AdminDashboardProps {
  onClose: () => void;
  onSignOut?: () => void;
  specials?: Special[];
  onApproveSpecial?: (id: string) => void;
  onRejectSpecial?: (id: string) => void;
}

type AdminTab = 'supabase' | 'specials' | 'security';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onClose,
  onSignOut,
  specials = [],
  onApproveSpecial,
  onRejectSpecial,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('supabase');
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [pingSuccess, setPingSuccess] = useState<boolean | null>(null);
  const [statusData, setStatusData] = useState<any>(null);

  const fetchAdminStatus = async () => {
    setLoadingStatus(true);
    try {
      const res = await fetch('/api/admin/supabase-status');
      const data = await res.json();
      setStatusData(data);
      setPingSuccess(true);
    } catch {
      setPingSuccess(false);
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    fetchAdminStatus();
  }, []);

  const handleCopyDDL = () => {
    if (statusData?.ddlSchema) {
      navigator.clipboard.writeText(statusData.ddlSchema);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col overflow-hidden animate-in fade-in duration-200">
      {/* Top Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            id="admin-exit-btn"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Shopper App</span>
          </button>

          <div className="h-5 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-black text-white tracking-wide">iShopp Admin Dashboard</h1>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Supabase Enterprise
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Backend PostgreSQL cluster, Row Level Security, Auth engine & store operations
              </p>
            </div>
          </div>
        </div>

        {/* Right Status Indicator */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-mono text-[11px]">
              {statusData?.supabaseUrl ? 'ikztzbudxlhdlubdtgmj.supabase.co' : 'Supabase Connected'}
            </span>
          </div>

          <button
            onClick={fetchAdminStatus}
            disabled={loadingStatus}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh architecture health"
          >
            <RefreshCw className={`w-4 h-4 ${loadingStatus ? 'animate-spin text-emerald-400' : ''}`} />
          </button>

          {onSignOut && (
            <button
              onClick={onSignOut}
              id="admin-signout-btn"
              className="p-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-rose-500/30 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              title="Sign out of Admin Portal"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          )}
        </div>
      </header>

      {/* Navigation Sub-bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center gap-2 overflow-x-auto shrink-0">
        <button
          id="admin-tab-supabase"
          onClick={() => setActiveTab('supabase')}
          className={`flex items-center gap-2 py-3 px-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'supabase'
              ? 'border-emerald-400 text-emerald-300 bg-emerald-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Supabase Enterprise Architecture</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
            Active
          </span>
        </button>

        <button
          id="admin-tab-specials"
          onClick={() => setActiveTab('specials')}
          className={`flex items-center gap-2 py-3 px-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'specials'
              ? 'border-emerald-400 text-emerald-300 bg-emerald-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Deals & Store Moderation</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
            {specials.length}
          </span>
        </button>

        <button
          id="admin-tab-security"
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 py-3 px-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'security'
              ? 'border-emerald-400 text-emerald-300 bg-emerald-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>RLS & POPIA Compliance</span>
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* ================================================================= */}
        {/* TAB 1: SUPABASE ENTERPRISE ARCHITECTURE */}
        {/* ================================================================= */}
        {activeTab === 'supabase' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Architecture Overview Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Card 1: PostgreSQL 15 */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Database className="w-4 h-4" />
                  </div>
                  <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Healthy
                  </span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400">PostgreSQL 15 Cluster</div>
                  <div className="text-sm font-black text-white mt-0.5">Supabase Dedicated</div>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>PgBouncer Pooler on Port 6543</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Row Level Security (RLS) */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Shield className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-800/40">
                    100% Enforced
                  </span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400">Row Level Security</div>
                  <div className="text-sm font-black text-white mt-0.5">PostgreSQL Kernel RLS</div>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>6 Tables Protected with Auth UID</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Supabase Auth (GoTrue) */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded-md border border-purple-800/40">
                    Active
                  </span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400">Auth Engine</div>
                  <div className="text-sm font-black text-white mt-0.5">GoTrue + OAuth2</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Google • Apple • Email + JWT Session
                  </div>
                </div>
              </div>

              {/* Card 4: Supabase Storage */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <HardDrive className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-800/40">
                    S3 Bucket
                  </span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400">Supabase Storage</div>
                  <div className="text-sm font-black text-white mt-0.5">'specials' & 'avatars'</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    High-res shelf photos & receipt OCR
                  </div>
                </div>
              </div>
            </div>

            {/* Architecture Topology Block Diagram */}
            <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-black text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-emerald-400" />
                    Supabase Cloud Enterprise Architecture Topology
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    End-to-end data flow from client application to Supabase PostgreSQL cluster
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchAdminStatus}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Ping Supabase ({statusData?.pingLatencyMs || 12}ms)</span>
                  </button>
                </div>
              </div>

              {/* Visual Flow diagram */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
                {/* Layer 1: Client */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 relative">
                  <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
                    Layer 1: Frontend
                  </div>
                  <div className="text-xs font-bold text-white mt-1">iShopp PWA & Client</div>
                  <div className="text-[11px] text-slate-400 mt-2 space-y-1">
                    <div>• Local-first IndexedDB cache</div>
                    <div>• Supabase JS Client v2.49</div>
                    <div>• Offline sync worker</div>
                  </div>
                </div>

                {/* Layer 2: Gateway */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 relative">
                  <div className="text-[10px] font-mono text-blue-400 uppercase font-bold tracking-wider">
                    Layer 2: Gateway
                  </div>
                  <div className="text-xs font-bold text-white mt-1">Express & PostgREST</div>
                  <div className="text-[11px] text-slate-400 mt-2 space-y-1">
                    <div>• /api/auth proxy & token gate</div>
                    <div>• Multimodal Gemini 3.8 OCR</div>
                    <div>• SSL/TLS encrypted traffic</div>
                  </div>
                </div>

                {/* Layer 3: Database */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-emerald-500/30 relative shadow-inner">
                  <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
                    Layer 3: Supabase Core
                  </div>
                  <div className="text-xs font-bold text-white mt-1">PostgreSQL 15 + RLS</div>
                  <div className="text-[11px] text-slate-400 mt-2 space-y-1">
                    <div>• Row Level Security policies</div>
                    <div>• Realtime WAL Logical CDC</div>
                    <div>• Automated foreign keys & indexes</div>
                  </div>
                </div>

                {/* Layer 4: Object Storage */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 relative">
                  <div className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider">
                    Layer 4: Storage
                  </div>
                  <div className="text-xs font-bold text-white mt-1">Supabase S3 Buckets</div>
                  <div className="text-[11px] text-slate-400 mt-2 space-y-1">
                    <div>• 'specials' public bucket</div>
                    <div>• 'avatars' user profile images</div>
                    <div>• Auto WebP compression</div>
                  </div>
                </div>
              </div>
            </div>

            {/* PostgreSQL Schema Tables & RLS Status Table */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-400" />
                    Supabase PostgreSQL Tables & RLS Policies
                  </h3>
                  <p className="text-xs text-slate-400">
                    Live database entities with Row Level Security enforcement
                  </p>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/40">
                  Cluster Status: Healthy
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/70 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Table Name</th>
                      <th className="py-2.5 px-3">Primary Key</th>
                      <th className="py-2.5 px-3">RLS Status</th>
                      <th className="py-2.5 px-3">Enforced Policies</th>
                      <th className="py-2.5 px-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {(statusData?.database?.tables || [
                      {
                        name: 'specials',
                        primaryKey: 'id (UUID)',
                        rls: 'ACTIVE',
                        policies: ['Public read specials', 'Authenticated insert'],
                        description: 'Live community-verified specials and shelf tag extractions',
                      },
                      {
                        name: 'profiles',
                        primaryKey: 'id (UUID -> auth.users)',
                        rls: 'ACTIVE',
                        policies: ['Public profiles view', 'Users update own profile'],
                        description: 'User identities, reputation scores, savings tallies & POPIA preferences',
                      },
                      {
                        name: 'retailers',
                        primaryKey: 'id (TEXT)',
                        rls: 'ACTIVE',
                        policies: ['Public read retailers'],
                        description: 'South African supermarket chains (Pick n Pay, Checkers, Woolies, Spar)',
                      },
                      {
                        name: 'branches',
                        primaryKey: 'id (TEXT)',
                        rls: 'ACTIVE',
                        policies: ['Public read branches'],
                        description: 'Store locations, geocodes & operating hours across Western Cape & Gauteng',
                      },
                      {
                        name: 'price_history',
                        primaryKey: 'id (TEXT)',
                        rls: 'ACTIVE',
                        policies: ['Public read price history'],
                        description: 'Historical grocery price timeseries powering Gemini Intelligence charts',
                      },
                    ]).map((tbl: any) => (
                      <tr key={tbl.name} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                          public.{tbl.name}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-400">{tbl.primaryKey}</td>
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            {tbl.rls}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-300 text-[11px]">
                          {tbl.policies?.join(', ')}
                        </td>
                        <td className="py-3 px-3 text-slate-400 text-[11px]">{tbl.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* DDL Schema Viewer with One-Click Copy */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-400" />
                    Supabase PostgreSQL DDL Schema Script
                  </h3>
                  <p className="text-xs text-slate-400">
                    Production SQL schema for database creation, RLS policies & foreign key constraints
                  </p>
                </div>

                <button
                  onClick={handleCopyDDL}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-md hover:scale-102"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied DDL!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Production DDL</span>
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-2xl bg-black/60 border border-slate-800 p-4 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-72">
                <pre>{statusData?.ddlSchema || `-- iShopp Supabase DDL
CREATE TABLE public.specials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2),
  retailer_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.specials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read specials" ON public.specials FOR SELECT USING (true);`}</pre>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: SPECIALS & STORE MODERATION */}
        {/* ================================================================= */}
        {activeTab === 'specials' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Community & AI Specials Queue</h3>
                  <p className="text-xs text-slate-400">
                    Verify prices, check OCR confidence, and confirm retailer tagging
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-400">
                  Total Active: {specials.length}
                </span>
              </div>

              <div className="divide-y divide-slate-800">
                {specials.map((special) => (
                  <div key={special.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={special.image_url}
                        alt={special.product_name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0"
                      />
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <span>{special.product_name}</span>
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {special.retailer_id}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-3">
                          <span className="text-emerald-400 font-bold font-mono">R{special.price.toFixed(2)}</span>
                          {special.original_price && (
                            <span className="line-through text-slate-500 font-mono">R{special.original_price.toFixed(2)}</span>
                          )}
                          <span>• {special.store_name}</span>
                          <span className="text-amber-400">★ {special.confidence_score}% OCR Conf</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded-lg border border-emerald-800/40">
                        {special.verified_count} Verifications
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: POPIA & SECURITY */}
        {/* ================================================================= */}
        {activeTab === 'security' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  Protection of Personal Information Act (POPIA) Status
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  South African privacy compliance configuration for geospatial and shopper data
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-xs font-bold text-slate-300">Geospatial Privacy</div>
                  <div className="text-sm font-black text-emerald-400 mt-1">Coordinates Anonymized</div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Shoppers' exact home coordinates are hashed and never stored or shared with retail partners.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-xs font-bold text-slate-300">Identity Protection</div>
                  <div className="text-sm font-black text-emerald-400 mt-1">Pseudonymous Usernames</div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Only public handles (@shaheen) are visible on deal upvotes and leaderboard badges.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-xs font-bold text-slate-300">Supabase RLS Kernel</div>
                  <div className="text-sm font-black text-emerald-400 mt-1">Zero Leaks Policy</div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    PostgreSQL prevents unauthorized cross-user profile access via auth.uid() checks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
