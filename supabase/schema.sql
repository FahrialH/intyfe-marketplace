-- ==============================================================================
-- INTYFE MARKETPLACE - SUPABASE DATABASE SCHEMA & RLS POLICIES (UPDATED & BULLETPROOF)
-- Run this script in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ==============================================================================

-- 1. Create User Roles Enum (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('buyer', 'seller', 'admin');
    END IF;
END$$;

-- 2. Profiles Table (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role public.user_role DEFAULT 'buyer'::public.user_role NOT NULL,
  solana_wallet_address TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. News Articles Table (CMS)
CREATE TABLE IF NOT EXISTS public.news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  author_name TEXT,
  author_avatar TEXT,
  author_role TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  reading_time_minutes INT DEFAULT 5,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Products Table (Shop Catalog)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price_sol NUMERIC(10, 4) NOT NULL,
  price_idr NUMERIC(15, 2) NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  gallery_images TEXT[] DEFAULT '{}',
  seller_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  in_stock BOOLEAN DEFAULT TRUE,
  tier TEXT DEFAULT 'Standard',
  attributes JSONB DEFAULT '[]'::jsonb,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. Orders & Order Items
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  solana_tx_signature TEXT UNIQUE NOT NULL,
  total_price_sol NUMERIC(10, 4) NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL, -- 'pending', 'confirmed', 'failed'
  wallet_address TEXT NOT NULL,
  billing_details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE RESTRICT,
  quantity INT DEFAULT 1 NOT NULL,
  price_sol NUMERIC(10, 4) NOT NULL
);

-- Ensure all columns exist even if tables were previously created with older schema
ALTER TABLE public.news_articles 
  ADD COLUMN IF NOT EXISTS author_name TEXT,
  ADD COLUMN IF NOT EXISTS author_avatar TEXT,
  ADD COLUMN IF NOT EXISTS author_role TEXT,
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS attributes JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS billing_details JSONB DEFAULT '{}'::jsonb;

-- 6. Trigger to Auto-create Profile on Sign-up (Safe with explicit search_path & exception guard)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  assigned_role public.user_role;
  user_full_name TEXT;
BEGIN
  -- Safely extract full name
  user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');

  -- Safely determine role without crashing on null/empty/invalid metadata
  IF NEW.raw_user_meta_data IS NOT NULL AND NEW.raw_user_meta_data->>'role' = 'admin' THEN
    assigned_role := 'admin'::public.user_role;
  ELSIF NEW.raw_user_meta_data IS NOT NULL AND NEW.raw_user_meta_data->>'role' = 'seller' THEN
    assigned_role := 'seller'::public.user_role;
  ELSE
    assigned_role := 'buyer'::public.user_role;
  END IF;

  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    user_full_name,
    assigned_role
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      full_name = CASE WHEN EXCLUDED.full_name <> '' THEN EXCLUDED.full_name ELSE public.profiles.full_name END,
      role = CASE WHEN EXCLUDED.role IS NOT NULL THEN EXCLUDED.role ELSE public.profiles.role END;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Never abort user creation in auth.users
    RAISE WARNING 'handle_new_user exception: %', SQLERRM;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill any existing auth.users that don't have a profile yet
INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
  id, 
  COALESCE(email, ''), 
  COALESCE(raw_user_meta_data->>'full_name', ''), 
  CASE 
    WHEN raw_user_meta_data->>'role' = 'admin' THEN 'admin'::public.user_role
    WHEN raw_user_meta_data->>'role' = 'seller' THEN 'seller'::public.user_role
    ELSE 'buyer'::public.user_role
  END
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Helper function to check user role without recursion
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS public.user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Grant standard permissions to schema roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles are readable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are readable by everyone" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id OR auth.uid() IS NULL);

-- News Articles Policies
DROP POLICY IF EXISTS "News articles readable by everyone" ON public.news_articles;
CREATE POLICY "News articles readable by everyone" ON public.news_articles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only Admin can insert news" ON public.news_articles;
CREATE POLICY "Only Admin can insert news" ON public.news_articles FOR INSERT
  WITH CHECK (public.get_auth_role() = 'admin');

DROP POLICY IF EXISTS "Only Admin can update news" ON public.news_articles;
CREATE POLICY "Only Admin can update news" ON public.news_articles FOR UPDATE
  USING (public.get_auth_role() = 'admin');

DROP POLICY IF EXISTS "Only Admin can delete news" ON public.news_articles;
CREATE POLICY "Only Admin can delete news" ON public.news_articles FOR DELETE
  USING (public.get_auth_role() = 'admin');

-- Products Policies
DROP POLICY IF EXISTS "Products readable by everyone" ON public.products;
CREATE POLICY "Products readable by everyone" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Sellers and Admins can insert products" ON public.products;
CREATE POLICY "Sellers and Admins can insert products" ON public.products FOR INSERT
  WITH CHECK (public.get_auth_role() IN ('seller', 'admin'));

DROP POLICY IF EXISTS "Sellers can update own products, admin can update all" ON public.products;
CREATE POLICY "Sellers can update own products, admin can update all" ON public.products FOR UPDATE
  USING (auth.uid() = seller_id OR public.get_auth_role() = 'admin');

DROP POLICY IF EXISTS "Sellers can delete own products, admin can delete all" ON public.products;
CREATE POLICY "Sellers can delete own products, admin can delete all" ON public.products FOR DELETE
  USING (auth.uid() = seller_id OR public.get_auth_role() = 'admin');

-- Orders Policies
DROP POLICY IF EXISTS "Buyers can view own orders" ON public.orders;
CREATE POLICY "Buyers can view own orders" ON public.orders FOR SELECT
  USING (auth.uid() = buyer_id OR public.get_auth_role() = 'admin');

DROP POLICY IF EXISTS "Authenticated users can create orders" ON public.orders;
CREATE POLICY "Authenticated users can create orders" ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

-- Order Items Policies
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND (orders.buyer_id = auth.uid() OR public.get_auth_role() = 'admin')
    )
  );

DROP POLICY IF EXISTS "Authenticated users can create order items" ON public.order_items;
CREATE POLICY "Authenticated users can create order items" ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id AND orders.buyer_id = auth.uid()
    )
  );

-- ==============================================================================
-- STORAGE BUCKETS (article-images, product-images)
-- ==============================================================================
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('article-images', 'article-images', true)
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO storage.buckets (id, name, public)
  VALUES ('product-images', 'product-images', true)
  ON CONFLICT (id) DO NOTHING;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Notice creating storage buckets: %', SQLERRM;
END$$;

-- Storage Policies
DROP POLICY IF EXISTS "Public Access for article-images" ON storage.objects;
CREATE POLICY "Public Access for article-images" ON storage.objects
  FOR SELECT USING (bucket_id = 'article-images');

DROP POLICY IF EXISTS "Admin upload to article-images" ON storage.objects;
CREATE POLICY "Admin upload to article-images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'article-images' AND
    (public.get_auth_role() = 'admin' OR auth.role() = 'authenticated')
  );

DROP POLICY IF EXISTS "Admin update article-images" ON storage.objects;
CREATE POLICY "Admin update article-images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'article-images' AND
    (public.get_auth_role() = 'admin' OR auth.role() = 'authenticated')
  );

DROP POLICY IF EXISTS "Admin delete article-images" ON storage.objects;
CREATE POLICY "Admin delete article-images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'article-images' AND
    (public.get_auth_role() = 'admin' OR auth.role() = 'authenticated')
  );

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
