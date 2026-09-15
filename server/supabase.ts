import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let client: SupabaseClient | null = null;
let adminClient: SupabaseClient | null = null;
let anonClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (client) return client;
  if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project')) {
    try {
      client = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
        auth: {
          persistSession: false,
        },
      });
      return client;
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return null;
}

export function getSupabaseAdmin(): SupabaseClient | null {
  if (adminClient) return adminClient;
  if (supabaseUrl && supabaseServiceKey && !supabaseUrl.includes('your-project')) {
    try {
      adminClient = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
      return adminClient;
    } catch (err) {
      console.warn('Failed to initialize Supabase admin client:', err);
      return null;
    }
  }
  return getSupabase();
}

export function getSupabaseAnon(): SupabaseClient | null {
  if (anonClient) return anonClient;
  if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project')) {
    try {
      anonClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
        },
      });
      return anonClient;
    } catch (err) {
      console.warn('Failed to initialize Supabase anon client:', err);
      return null;
    }
  }
  return null;
}

export function getSupabasePublicConfig() {
  return {
    url: supabaseUrl || null,
    anonKey: supabaseAnonKey || null,
    isConfigured: Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project')),
  };
}

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project'));
}
