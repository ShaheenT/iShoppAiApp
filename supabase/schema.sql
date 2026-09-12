-- ========================================================================
-- iShopp AI — Production Supabase / PostgreSQL Schema v1.0
-- Architecture: Backend-First, Row Level Security (RLS) enabled everywhere.
-- Target: Supabase PostgreSQL (PostgREST + Auth + Storage)
-- ========================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES (Auto-synced with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  city TEXT DEFAULT 'Cape Town',
  avatar_url TEXT,
  reputation_score INT DEFAULT 100,
  contribution_score INT DEFAULT 50,
  total_savings_unlocked NUMERIC(10, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile." 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. RETAILERS
CREATE TABLE IF NOT EXISTS public.retailers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo TEXT NOT NULL,
  verified BOOLEAN DEFAULT true,
  primary_color TEXT DEFAULT '#10B981',
  loyalty_program TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.retailers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Retailers viewable by everyone" 
  ON public.retailers FOR SELECT USING (true);

-- 3. BRANCHES
CREATE TABLE IF NOT EXISTS public.branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  retailer_id TEXT REFERENCES public.retailers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  address TEXT,
  city TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Branches viewable by everyone" 
  ON public.branches FOR SELECT USING (true);

-- 4. PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand TEXT NOT NULL,
  name TEXT NOT NULL,
  barcode TEXT,
  category TEXT NOT NULL,
  unit_size TEXT DEFAULT '1 unit',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products viewable by everyone" 
  ON public.products FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create products" 
  ON public.products FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 5. SPECIALS (Live Deals Feed)
CREATE TABLE IF NOT EXISTS public.specials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
  retailer_id TEXT REFERENCES public.retailers(id) ON DELETE CASCADE,
  price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2),
  savings NUMERIC(10, 2) GENERATED ALWAYS AS (GREATEST(0, COALESCE(original_price, price) - price)) STORED,
  expires_at TIMESTAMPTZ,
  confidence_score NUMERIC(5, 2) DEFAULT 95.0,
  promotion_text TEXT,
  image_url TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT DEFAULT 'Shopper',
  verified_count INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.specials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Specials viewable by everyone" 
  ON public.specials FOR SELECT USING (true);

CREATE POLICY "Authenticated users can publish specials" 
  ON public.specials FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.role() = 'authenticated');

CREATE POLICY "Users can update specials they posted" 
  ON public.specials FOR UPDATE USING (auth.uid() = user_id);

-- 6. UPLOADS (Image scan audit and pipeline)
CREATE TABLE IF NOT EXISTS public.uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  processing_status TEXT DEFAULT 'pending',
  extracted_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Uploads viewable by owner or service" 
  ON public.uploads FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create uploads" 
  ON public.uploads FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.role() = 'authenticated');

-- 7. SHOPPING LISTS
CREATE TABLE IF NOT EXISTS public.shopping_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT DEFAULT 'My Shopping List',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.shopping_lists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own shopping lists" 
  ON public.shopping_lists FOR ALL USING (auth.uid() = user_id);

-- 8. SHOPPING LIST ITEMS
CREATE TABLE IF NOT EXISTS public.shopping_list_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID REFERENCES public.shopping_lists(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  quantity INT DEFAULT 1,
  checked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.shopping_list_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own shopping list items" 
  ON public.shopping_list_items FOR ALL USING (
    EXISTS (SELECT 1 FROM public.shopping_lists WHERE shopping_lists.id = shopping_list_items.list_id AND shopping_lists.user_id = auth.uid())
  );

-- 9. USER REWARDS & GAMIFICATION
CREATE TABLE IF NOT EXISTS public.user_rewards (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  points INT DEFAULT 50,
  badges TEXT[] DEFAULT ARRAY['First Scan']::TEXT[],
  savings_score NUMERIC(10, 2) DEFAULT 0.00,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Rewards viewable by everyone for leaderboard" 
  ON public.user_rewards FOR SELECT USING (true);

CREATE POLICY "Users can view and update own rewards" 
  ON public.user_rewards FOR ALL USING (auth.uid() = user_id);

-- 10. TRIGGER FOR AUTO-CREATING PROFILES ON AUTH SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url, city)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'),
    'Cape Town'
  );
  INSERT INTO public.user_rewards (user_id, points, badges)
  VALUES (NEW.id, 50, ARRAY['First Scan']::TEXT[]);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- SEED DATA: South African Top Retailers
INSERT INTO public.retailers (id, name, logo, verified, primary_color, loyalty_program) VALUES
  ('picknpay', 'Pick n Pay', 'https://upload.wikimedia.org/wikipedia/en/thumb/e/ee/Pick_n_Pay_logo.svg/320px-Pick_n_Pay_logo.svg.png', true, '#00539B', 'Smart Shopper'),
  ('checkers', 'Checkers', 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7b/Checkers_logo.svg/320px-Checkers_logo.svg.png', true, '#00833E', 'Xtra Savings'),
  ('shoprite', 'Shoprite', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Shoprite_South_Africa_logo.svg/320px-Shoprite_South_Africa_logo.svg.png', true, '#ED1C24', 'Xtra Savings'),
  ('woolworths', 'Woolworths Food', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Woolworths_South_Africa_logo.svg/320px-Woolworths_South_Africa_logo.svg.png', true, '#000000', 'WRewards'),
  ('spar', 'SPAR', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/SPAR_logo.svg/320px-SPAR_logo.svg.png', true, '#007A3D', 'SPAR Rewards'),
  ('boxer', 'Boxer Superstores', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Boxer_Superstores_logo.png/320px-Boxer_Superstores_logo.png', true, '#E30613', 'Boxer Club'),
  ('makro', 'Makro', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Makro_logo.svg/320px-Makro_logo.svg.png', true, '#003399', 'mCard'),
  ('game', 'Game Stores', 'https://upload.wikimedia.org/wikipedia/en/thumb/0/00/Game_Stores_Logo.svg/320px-Game_Stores_Logo.svg.png', true, '#EC008C', 'Game Rewards'),
  ('dischem', 'Dis-Chem Pharmacies', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Dis-Chem_Pharmacies_Logo.png/320px-Dis-Chem_Pharmacies_Logo.png', true, '#008542', 'Dis-Chem Benefit'),
  ('clicks', 'Clicks', 'https://upload.wikimedia.org/wikipedia/en/thumb/9/90/Clicks_Group_Logo.svg/320px-Clicks_Group_Logo.svg.png', true, '#004B87', 'ClubCard')
ON CONFLICT (id) DO NOTHING;
