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
  price_idr: number;
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
}
