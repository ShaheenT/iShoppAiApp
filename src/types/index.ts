import { z } from 'zod';

export type RetailerId =
  | 'picknpay'
  | 'checkers'
  | 'shoprite'
  | 'woolworths'
  | 'spar'
  | 'boxer'
  | 'makro'
  | 'game'
  | 'dischem'
  | 'clicks';

export type Category =
  | 'Groceries'
  | 'Fresh Produce'
  | 'Meat'
  | 'Frozen'
  | 'Household'
  | 'Baby'
  | 'Electronics'
  | 'Clothing'
  | 'Beauty'
  | 'Pharmacy';

export interface Retailer {
  id: RetailerId;
  name: string;
  logo: string;
  primaryColor: string;
  accentColor: string;
  verified: boolean;
  loyaltyProgram?: string; // e.g., 'Smart Shopper', 'Xtra Savings', 'WRewards'
}

export interface Branch {
  id: string;
  retailer_id: RetailerId;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  province?: string;
  postal_code?: string;
  phone?: string;
  opening_hours?: string;
  verified?: boolean;
}

export interface Product {
  id: string;
  brand: string;
  name: string;
  barcode?: string;
  category: Category;
  unit_size: string;
}

export interface Special {
  id: string;
  product_id: string;
  product_name: string;
  brand: string;
  unit_size: string;
  category: Category;
  branch_id: string;
  branch_name: string;
  branch_address?: string;
  retailer_id: RetailerId;
  retailer_name: string;
  price: number;
  original_price: number;
  savings: number;
  savings_percentage: number;
  expires_at: string;
  confidence_score: number;
  promotion_text?: string;
  image_url: string;
  user_id: string;
  user_name: string;
  user_username?: string;
  user_reputation_title?: string;
  user_reputation: number;
  created_at: string;
  verified_count: number;
  distance_km?: number;
  drive_time_mins?: number;
  walk_time_mins?: number;
  is_expired?: boolean;
}

export interface PriceHistoryPoint {
  id: string;
  product_id: string;
  date: string;
  day_label: string;
  price: number;
  original_price?: number;
  retailer_id: RetailerId;
  retailer_name: string;
}

export interface Profile {
  id: string;
  email: string;
  name: string;
  city: string;
  avatar_url: string;
  reputation_score: number;
  contribution_score: number;
  total_savings_unlocked: number;
  badges: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  username: string;
  avatar_url: string;
  mobile_number?: string;
  city: string;
  province: string;
  country: string;
  bio?: string;
  preferred_language: string;
  preferred_currency: string;
  reputation_score: number;
  contribution_points: number;
  savings_score: number;
  total_savings_unlocked: number;
  total_specials_shared: number;
  total_scans: number;
  total_views: number;
  account_status: string;
  onboarding_completed: boolean;
  needs_profile_completion?: boolean;
  preferred_retailers: RetailerId[];
  preferred_categories: Category[];
  price_alerts_enabled: boolean;
  nearby_alerts_enabled: boolean;
  badges: string[];
  created_at?: string;
  updated_at?: string;
}

export interface SavedSpecial {
  id: string;
  special_id: string;
  special: Special;
  saved_at: string;
}

export interface PriceAlert {
  id: string;
  product_name: string;
  target_price: number;
  current_lowest_price: number;
  retailer_name: string;
  active: boolean;
}

export interface ShoppingListItem {
  id: string;
  product_name: string;
  brand?: string;
  target_price?: number;
  quantity: number;
  checked: boolean;
  preferred_retailer?: RetailerId;
  matched_special?: Special;
  store?: string;
  price?: number;
  savings?: number;
  scannedAtHome?: boolean;
  unit_size?: string;
  category?: Category;
  added_at?: string;
}

export type DeliveryTier = 'self_shopper' | 'ondemand_express' | 'concierge_multistore';

export interface DeliveryOrder {
  id: string;
  tier: DeliveryTier;
  address: string;
  phone: string;
  deliveryTime: string;
  items: ShoppingListItem[];
  totalSpend: number;
  totalSavings: number;
  deliveryFee: number;
  status: 'confirmed' | 'shopper_assigned' | 'picking_deals' | 'out_for_delivery' | 'delivered';
  assignedShopper?: string;
  etaMinutes: number;
  storesCovered: string[];
  createdAt: string;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingListItem[];
  created_at: string;
}

export interface ShoppingRouteOption {
  type: 'single_store' | 'multi_store_optimal';
  retailers: {
    retailer_id: RetailerId;
    retailer_name: string;
    branch_name: string;
    items: {
      product_name: string;
      price: number;
      savings: number;
    }[];
    subtotal: number;
  }[];
  total_spend: number;
  total_savings: number;
  recommended_label: string;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  city: string;
  avatar_url: string;
  contribution_score: number;
  reputation_score: number;
  scans_count: number;
  rank: number;
  badge: string;
}

// Zod Schemas for API Validation
export const ScanImageRequestSchema = z.object({
  imageUrl: z.string().min(1, 'Image URL or base64 data required'),
  clientLocation: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
      city: z.string().optional(),
    })
    .optional(),
});

export type ScanImageRequest = z.infer<typeof ScanImageRequestSchema>;

export const ExtractedDealDataSchema = z.object({
  product_name: z.string(),
  brand: z.string(),
  unit_size: z.string(),
  price: z.number().positive(),
  original_price: z.number().optional(),
  retailer_id: z.string(),
  retailer_name: z.string(),
  promotion_text: z.string().optional(),
  expires_at: z.string().optional(),
  category: z.string(),
  confidence_score: z.number().min(0).max(100),
});

export type ExtractedDealData = z.infer<typeof ExtractedDealDataSchema>;

export const ShareDealRequestSchema = z.object({
  product_name: z.string().min(2, 'Product name is required'),
  brand: z.string().default('Generic'),
  unit_size: z.string().default('Unit'),
  category: z.string().default('Groceries'),
  price: z.number().positive('Price must be greater than 0'),
  original_price: z.number().optional(),
  retailer_id: z.string(),
  branch_id: z.string().optional(),
  branch_name: z.string().optional(),
  expires_at: z.string().optional(),
  promotion_text: z.string().optional(),
  image_url: z.string(),
  confidence_score: z.number().default(90),
  user_id: z.string().optional(),
  user_name: z.string().optional(),
});

export type ShareDealRequest = z.infer<typeof ShareDealRequestSchema>;

export const AssistantQuerySchema = z.object({
  query: z.string().min(3, 'Query too short'),
  city: z.string().default('Cape Town'),
});

export type AssistantQuery = z.infer<typeof AssistantQuerySchema>;

export const OptimizeListSchema = z.object({
  items: z.array(z.string().min(1)),
  city: z.string().default('Cape Town'),
});

export type OptimizeListRequest = z.infer<typeof OptimizeListSchema>;
