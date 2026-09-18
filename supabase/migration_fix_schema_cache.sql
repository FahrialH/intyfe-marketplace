-- ==============================================================================
-- INTYFE MARKETPLACE - SCHEMA REPAIR & POSTGREST CACHE RELOAD
-- Run this SQL in your Supabase Dashboard -> SQL Editor to resolve:
-- "Could not find the 'author_role' column of 'news_articles' in the schema cache"
-- ==============================================================================

-- 1. Add missing columns to public.news_articles if they do not exist
ALTER TABLE public.news_articles 
  ADD COLUMN IF NOT EXISTS author_name TEXT,
  ADD COLUMN IF NOT EXISTS author_avatar TEXT,
  ADD COLUMN IF NOT EXISTS author_role TEXT,
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- 2. Add missing columns to public.products if they do not exist
ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS attributes JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- 3. Add missing columns to public.orders if they do not exist
ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS billing_details JSONB DEFAULT '{}'::jsonb;

-- 4. Re-grant table permissions to API roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

-- 5. Force PostgREST schema cache to immediately refresh
NOTIFY pgrst, 'reload schema';
