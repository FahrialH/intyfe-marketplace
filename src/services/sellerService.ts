import { supabase, isSupabaseConfigured, ProfileRecord, ProductRecord } from '../lib/supabase';
import { Product, Studio } from '../types';
import { mockProducts, mockStudios } from '../data/mockData';

// Map database ProductRecord to UI Product
export const mapProductRecordToProduct = (
  record: ProductRecord,
  sellerProfile?: Partial<ProfileRecord> | null
): Product => {
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    description: record.description,
    price: Number(record.price_sol),
    originalPrice: undefined,
    category: record.category,
    rating: 5.0,
    reviewsCount: 1,
    image: record.image_url,
    galleryImages: record.gallery_images || [],
    inStock: record.in_stock,
    tier: (record.tier as Product['tier']) || 'Standard',
    attributes: record.attributes || [],
    tags: record.tags || [],
    sellerId: record.seller_id || undefined,
    sellerName: sellerProfile?.store_name || sellerProfile?.full_name || 'Independent Creator',
    sellerWallet: sellerProfile?.solana_wallet_address || undefined,
    storeSlug: sellerProfile?.store_slug || undefined,
  };
};

// Map database ProfileRecord to UI Studio
export const mapProfileRecordToStudio = (
  profile: ProfileRecord,
  productsCount = 0,
  totalVolumeSol = 0
): Studio => {
  return {
    id: profile.id,
    slug: profile.store_slug || `creator-${profile.id.slice(0, 8)}`,
    name: profile.store_name || profile.full_name || 'Creator Studio',
    tagline: profile.tagline || 'Independent Web3 Cinema Creator',
    bio: profile.bio || 'Creating original screenplay passes and cinematic collectibles on Solana.',
    bannerImage: profile.banner_url || '/assets/images/default-store-banner.png',
    avatarImage: profile.avatar_url || '/assets/images/cropped-image-180x180.png',
    verified: profile.is_verified ?? true,
    foundedYear: profile.founded_year || 2026,
    location: profile.location || 'Decentralized / Remote',
    totalStories: 1,
    totalVolumeSol,
    productsCount,
    sellerId: profile.id,
    walletAddress: profile.solana_wallet_address || undefined,
    socials: profile.socials || {
      twitter: '',
      discord: '',
      website: '',
    },
  };
};

// Local storage key for fallback demo creator products
const LOCAL_STORAGE_PRODUCTS_KEY = 'intyfe_creator_products_v1';
const LOCAL_STORAGE_PROFILE_KEY = 'intyfe_creator_profile_v1';

const getLocalDemoProducts = (): ProductRecord[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalDemoProducts = (products: ProductRecord[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(products));
  } catch (err) {
    console.warn('Failed to save to localStorage:', err);
  }
};

export const getSellerProfile = async (userId: string): Promise<ProfileRecord | null> => {
  if (!isSupabaseConfigured() || !userId) {
    try {
      const raw = localStorage.getItem(`${LOCAL_STORAGE_PROFILE_KEY}_${userId}`);
      if (raw) return JSON.parse(raw);
    } catch {
      // fallback
    }
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.warn('[sellerService] Error fetching seller profile:', error.message);
      return null;
    }
    return data as ProfileRecord;
  } catch (err) {
    console.warn('[sellerService] getSellerProfile failed:', err);
    return null;
  }
};

export const getSellerBySlug = async (slug: string): Promise<ProfileRecord | null> => {
  if (!slug) return null;

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('store_slug', slug)
        .single();

      if (!error && data) {
        return data as ProfileRecord;
      }
    } catch (err) {
      console.warn('[sellerService] getSellerBySlug DB error:', err);
    }
  }

  // Fallback check in localStorage
  try {
    const allKeys = Object.keys(localStorage);
    for (const key of allKeys) {
      if (key.startsWith(LOCAL_STORAGE_PROFILE_KEY)) {
        const parsed = JSON.parse(localStorage.getItem(key) || '{}');
        if (parsed.store_slug === slug) return parsed;
      }
    }
  } catch {
    // ignore
  }

  return null;
};

export const updateSellerProfile = async (
  userId: string,
  updates: Partial<ProfileRecord>
): Promise<{ profile: ProfileRecord | null; error: Error | null }> => {
  if (!userId) {
    return { profile: null, error: new Error('User ID is required to update profile.') };
  }

  // Always keep localStorage updated as fallback
  try {
    const existing = await getSellerProfile(userId);
    const updated = { ...(existing || { id: userId, email: '', role: 'seller', created_at: new Date().toISOString() }), ...updates };
    localStorage.setItem(`${LOCAL_STORAGE_PROFILE_KEY}_${userId}`, JSON.stringify(updated));
  } catch {
    // ignore
  }

  if (!isSupabaseConfigured()) {
    const updatedLocal = await getSellerProfile(userId);
    return { profile: updatedLocal, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      // If columns like store_slug are not yet added to profiles table, handle gracefully
      if (error.message.includes('column') || error.message.includes('schema cache')) {
        console.warn('[sellerService] Custom profile columns may not yet exist in schema cache:', error.message);
        // Retry with basic columns
        const basicUpdates: Partial<ProfileRecord> = {};
        if (updates.full_name !== undefined) basicUpdates.full_name = updates.full_name;
        if (updates.avatar_url !== undefined) basicUpdates.avatar_url = updates.avatar_url;
        if (updates.solana_wallet_address !== undefined) basicUpdates.solana_wallet_address = updates.solana_wallet_address;
        if (updates.role !== undefined) basicUpdates.role = updates.role;

        const { data: retryData, error: retryError } = await supabase
          .from('profiles')
          .update(basicUpdates)
          .eq('id', userId)
          .select()
          .single();

        if (retryError) return { profile: null, error: new Error(retryError.message) };
        return { profile: { ...(retryData as ProfileRecord), ...updates }, error: null };
      }
      return { profile: null, error: new Error(error.message) };
    }

    return { profile: data as ProfileRecord, error: null };
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error('Failed to update seller profile');
    return { profile: null, error };
  }
};

export const getSellerProducts = async (sellerId: string): Promise<ProductRecord[]> => {
  const localItems = getLocalDemoProducts().filter((p) => p.seller_id === sellerId);

  if (!isSupabaseConfigured() || !sellerId) {
    return localItems;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[sellerService] Error fetching seller products:', error.message);
      return localItems;
    }

    // Merge supabase items with any local items
    const dbItems = (data as ProductRecord[]) || [];
    const combined = [...dbItems];
    for (const item of localItems) {
      if (!combined.some((c) => c.id === item.id)) {
        combined.push(item);
      }
    }
    return combined;
  } catch (err) {
    console.warn('[sellerService] getSellerProducts error:', err);
    return localItems;
  }
};

export const createProduct = async (
  product: Partial<ProductRecord>
): Promise<{ product: ProductRecord | null; error: Error | null }> => {
  const slug =
    product.slug ||
    product.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') ||
    `item-${Date.now()}`;

  const newProduct: ProductRecord = {
    id: 'prod-' + Date.now(),
    slug,
    title: product.title || 'Untitled Item',
    description: product.description || '',
    price_sol: Number(product.price_sol || 0.1),
    price_idr: product.price_idr || null,
    category: product.category || 'Screenplay Pass',
    image_url: product.image_url || '/assets/images/default-store-banner.png',
    gallery_images: product.gallery_images || [],
    seller_id: product.seller_id || null,
    in_stock: product.in_stock ?? true,
    tier: product.tier || 'Standard',
    attributes: product.attributes || [],
    tags: product.tags || [],
    created_at: new Date().toISOString(),
  };

  // Always save locally first as fallback
  const localList = getLocalDemoProducts();
  localList.unshift(newProduct);
  saveLocalDemoProducts(localList);

  if (!isSupabaseConfigured()) {
    return { product: newProduct, error: null };
  }

  try {
    const payload = {
      slug: newProduct.slug,
      title: newProduct.title,
      description: newProduct.description,
      price_sol: newProduct.price_sol,
      price_idr: newProduct.price_idr || Math.round(newProduct.price_sol * 2500000),
      category: newProduct.category,
      image_url: newProduct.image_url,
      gallery_images: newProduct.gallery_images,
      seller_id: newProduct.seller_id,
      in_stock: newProduct.in_stock,
      tier: newProduct.tier,
      attributes: newProduct.attributes,
      tags: newProduct.tags,
    };

    const { data, error } = await supabase
      .from('products')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.warn('[sellerService] Insert product DB warning:', error.message);
      // Fall back to local creation
      return { product: newProduct, error: null };
    }

    return { product: data as ProductRecord, error: null };
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error('Failed to create product');
    return { product: newProduct, error: null };
  }
};

export const updateProduct = async (
  productId: string,
  updates: Partial<ProductRecord>
): Promise<{ product: ProductRecord | null; error: Error | null }> => {
  // Update local
  const localList = getLocalDemoProducts();
  const idx = localList.findIndex((p) => p.id === productId);
  if (idx !== -1) {
    localList[idx] = { ...localList[idx], ...updates };
    saveLocalDemoProducts(localList);
  }

  if (!isSupabaseConfigured()) {
    return { product: localList[idx] || null, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', productId)
      .select()
      .single();

    if (error) {
      return { product: localList[idx] || null, error: new Error(error.message) };
    }
    return { product: data as ProductRecord, error: null };
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error('Failed to update product');
    return { product: null, error };
  }
};

export const deleteProduct = async (
  productId: string
): Promise<{ success: boolean; error: Error | null }> => {
  // Remove from local
  const localList = getLocalDemoProducts().filter((p) => p.id !== productId);
  saveLocalDemoProducts(localList);

  if (!isSupabaseConfigured()) {
    return { success: true, error: null };
  }

  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      return { success: false, error: new Error(error.message) };
    }
    return { success: true, error: null };
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error('Failed to delete product');
    return { success: false, error };
  }
};

export const getAllPublicProducts = async (): Promise<Product[]> => {
  const localRecords = getLocalDemoProducts();
  const localProducts = localRecords.map((r) => mapProductRecordToProduct(r));

  if (!isSupabaseConfigured()) {
    return [...localProducts, ...mockProducts];
  }

  try {
    const { data: productsData, error } = await supabase
      .from('products')
      .select('*, seller:profiles(id, full_name, store_name, store_slug, solana_wallet_address)')
      .order('created_at', { ascending: false });

    if (error || !productsData || productsData.length === 0) {
      return [...localProducts, ...mockProducts];
    }

    const fetchedProducts: Product[] = productsData.map((item: any) => {
      const sellerProfile = item.seller;
      return mapProductRecordToProduct(item as ProductRecord, sellerProfile);
    });

    // Merge with presets if not already duplicated
    const finalProducts = [...fetchedProducts, ...localProducts];
    for (const mockP of mockProducts) {
      if (!finalProducts.some((p) => p.slug === mockP.slug)) {
        finalProducts.push(mockP);
      }
    }

    return finalProducts;
  } catch (err) {
    console.warn('[sellerService] getAllPublicProducts error:', err);
    return [...localProducts, ...mockProducts];
  }
};

export const getAllSellers = async (): Promise<Studio[]> => {
  if (!isSupabaseConfigured()) {
    return mockStudios;
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .in('role', ['seller', 'admin'])
      .not('store_slug', 'is', null);

    if (error || !data || data.length === 0) {
      return mockStudios;
    }

    const studiosFromDB: Studio[] = data.map((prof: any) =>
      mapProfileRecordToStudio(prof as ProfileRecord)
    );

    const merged = [...studiosFromDB];
    for (const mockS of mockStudios) {
      if (!merged.some((s) => s.slug === mockS.slug)) {
        merged.push(mockS);
      }
    }
    return merged;
  } catch (err) {
    console.warn('[sellerService] getAllSellers error:', err);
    return mockStudios;
  }
};

export const getSellerSalesAnalytics = async (
  sellerId: string
): Promise<{
  totalSol: number;
  totalSales: number;
  recentOrders: {
    id: string;
    productTitle: string;
    priceSol: number;
    buyerWallet: string;
    txSignature: string;
    createdAt: string;
  }[];
}> => {
  if (!isSupabaseConfigured() || !sellerId) {
    return {
      totalSol: 0,
      totalSales: 0,
      recentOrders: [],
    };
  }

  try {
    const { data, error } = await supabase
      .from('order_items')
      .select('id, price_sol, quantity, created_at, seller_wallet, payout_tx_signature, product:products(title), order:orders(buyer_id, solana_tx_signature, wallet_address, created_at)')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false });

    if (error || !data) {
      return { totalSol: 0, totalSales: 0, recentOrders: [] };
    }

    let totalSol = 0;
    const recentOrders = data.map((item: any) => {
      const price = Number(item.price_sol || 0);
      totalSol += price * (item.quantity || 1);
      return {
        id: item.id,
        productTitle: item.product?.title || 'Screenplay Pass',
        priceSol: price,
        buyerWallet: item.order?.wallet_address || 'Unknown Buyer',
        txSignature: item.payout_tx_signature || item.order?.solana_tx_signature || '',
        createdAt: item.order?.created_at || item.created_at || new Date().toISOString(),
      };
    });

    return {
      totalSol: Number(totalSol.toFixed(4)),
      totalSales: recentOrders.length,
      recentOrders,
    };
  } catch (err) {
    console.warn('[sellerService] getSellerSalesAnalytics error:', err);
    return { totalSol: 0, totalSales: 0, recentOrders: [] };
  }
};

export const uploadSellerAsset = async (
  file: File,
  bucket: 'product-images' | 'store-banners'
): Promise<{ url: string | null; error: Error | null }> => {
  if (!isSupabaseConfigured()) {
    // Generate object URL for preview in local demo mode
    return { url: URL.createObjectURL(file), error: null };
  }

  try {
    const ext = file.name.split('.').pop() || 'png';
    const filePath = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { cacheControl: '3600', upsert: true });

    if (uploadError) {
      console.warn('[sellerService] Storage upload failed:', uploadError.message);
      // Fallback to local object URL
      return { url: URL.createObjectURL(file), error: null };
    }

    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return { url: publicUrl, error: null };
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error('Upload failed');
    return { url: URL.createObjectURL(file), error: null };
  }
};
