import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project.supabase.co') &&
    !supabaseAnonKey.includes('your-anon-key')
  );
};

// Fallback empty client or valid client
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);

export type UserRole = 'buyer' | 'seller' | 'admin';

export interface ProfileRecord {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  solana_wallet_address: string | null;
  store_slug?: string | null;
  store_name?: string | null;
  tagline?: string | null;
  bio?: string | null;
  banner_url?: string | null;
  location?: string | null;
  founded_year?: number | null;
  socials?: {
    twitter?: string;
    discord?: string;
    website?: string;
  } | null;
  is_verified?: boolean;
  created_at: string;
}

export interface NewsArticleRecord {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  category: string;
  author_id: string | null;
  author_name: string | null;
  author_avatar: string | null;
  author_role: string | null;
  published_at: string;
  featured: boolean;
  reading_time_minutes: number;
  tags: string[];
  created_at: string;
}

export interface ProductRecord {
  id: string;
  slug: string;
  title: string;
  description: string;
  price_sol: number;
  price_idr?: number | null;
  category: string;
  image_url: string;
  gallery_images: string[];
  seller_id: string | null;
  in_stock: boolean;
  tier: string;
  attributes: { trait: string; value: string }[];
  tags: string[];
  created_at: string;
}

export interface OrderRecord {
  id: string;
  buyer_id: string;
  solana_tx_signature: string;
  total_price_sol: number;
  status: 'pending' | 'confirmed' | 'failed';
  wallet_address: string;
  billing_details?: Record<string, unknown>;
  created_at: string;
}

export interface OrderItemRecord {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_sol: number;
  seller_id?: string | null;
  seller_wallet?: string | null;
  payout_tx_signature?: string | null;
  payout_status?: 'completed' | 'pending' | 'failed';
}

export interface UserBoughtItemRecord {
  id: string;
  user_id: string;
  order_id?: string | null;
  product_id: string;
  title: string;
  description?: string | null;
  image_url?: string | null;
  category?: string | null;
  tier?: string;
  quantity: number;
  price_sol: number;
  price_idr?: number | null;
  solana_tx_signature?: string | null;
  wallet_address?: string | null;
  access_token: string;
  metadata?: Record<string, unknown>;
  status: 'active' | 'redeemed' | 'transferred';
  created_at: string;
}
