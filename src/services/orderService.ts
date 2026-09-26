import { supabase, isSupabaseConfigured, OrderRecord, UserBoughtItemRecord } from '../lib/supabase';
import { CartItem } from '../types';

export interface CreateOrderParams {
  buyerId?: string | null;
  solanaTxSignature: string;
  totalPriceSol: number;
  walletAddress: string;
  billingDetails: Record<string, unknown>;
  items: CartItem[];
}

export const createOrderWithItems = async (
  params: CreateOrderParams
): Promise<{ order: OrderRecord | null; error: Error | null }> => {
  const { buyerId, solanaTxSignature, totalPriceSol, walletAddress, billingDetails, items } = params;

  if (!isSupabaseConfigured()) {
    // Return mock order in demo mode
    const mockOrder: OrderRecord = {
      id: 'demo-order-' + Date.now(),
      buyer_id: buyerId || 'demo-buyer',
      solana_tx_signature: solanaTxSignature,
      total_price_sol: totalPriceSol,
      status: 'confirmed',
      wallet_address: walletAddress,
      billing_details: billingDetails,
      created_at: new Date().toISOString(),
    };
    return { order: mockOrder, error: null };
  }

  try {
    // 1. Insert into orders table
    const orderPayload: Record<string, unknown> = {
      buyer_id: buyerId || null,
      solana_tx_signature: solanaTxSignature,
      total_price_sol: totalPriceSol,
      status: 'pending',
      wallet_address: walletAddress,
      billing_details: billingDetails,
    };

    let { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert(orderPayload)
      .select()
      .single();

    // Fallback if billing_details column is not yet present in Supabase table
    if (orderError && (orderError.message.includes('billing_details') || orderError.message.includes('schema cache'))) {
      console.warn('[orderService] Column billing_details not found in schema cache. Retrying order insert without it.');
      delete orderPayload.billing_details;
      const retryResult = await supabase
        .from('orders')
        .insert(orderPayload)
        .select()
        .single();
      orderData = retryResult.data;
      orderError = retryResult.error;
    }

    if (orderError || !orderData) {
      return { order: null, error: new Error(orderError?.message || 'Failed to create order') };
    }

    const createdOrder = orderData as OrderRecord;

    // 2. Insert order items if any products
    if (items.length > 0) {
      const orderItemsToInsert = items.map((item) => ({
        order_id: createdOrder.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price_sol: item.product.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert);

      if (itemsError) {
        console.warn('Notice inserting order items:', itemsError.message);
      }
    }

    // 3. Insert into user_bought_items table so user can view & own their collectibles/passes
    if (buyerId && items.length > 0) {
      const boughtItemsToInsert = items.map((item) => ({
        user_id: buyerId,
        order_id: createdOrder.id,
        product_id: item.product.id,
        title: item.product.title,
        description: item.product.description || '',
        image_url: item.product.image || '',
        category: item.product.category || 'Screenplay Pass',
        tier: item.product.tier || 'Standard',
        quantity: item.quantity,
        price_sol: item.product.price,
        price_idr: null,
        solana_tx_signature: solanaTxSignature,
        wallet_address: walletAddress,
        access_token: `INTYFE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        metadata: {
          attributes: item.product.attributes || [],
          tags: item.product.tags || [],
        },
        status: 'active',
      }));

      const { error: boughtError } = await supabase
        .from('user_bought_items')
        .insert(boughtItemsToInsert);

      if (boughtError) {
        console.warn('Notice inserting user_bought_items:', boughtError.message);
      }
    }

    // 4. Trigger backend verification via Supabase Edge Function (if available)
    try {
      await supabase.functions.invoke('verify-solana-tx', {
        body: {
          signature: solanaTxSignature,
          orderId: createdOrder.id,
          expectedSol: totalPriceSol,
          network: import.meta.env.VITE_SOLANA_NETWORK || 'devnet',
        },
      });
    } catch (edgeErr) {
      // Non-blocking: edge function might not be deployed yet on local/staging
      console.warn('Edge function verify-solana-tx skipped or offline:', edgeErr);
    }

    return { order: createdOrder, error: null };
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error('Order creation failed');
    return { order: null, error };
  }
};

export const getUserBoughtItems = async (userId: string): Promise<UserBoughtItemRecord[]> => {
  if (!isSupabaseConfigured() || !userId) {
    return [];
  }
  try {
    const { data, error } = await supabase
      .from('user_bought_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[orderService] Error fetching user bought items:', error.message);
      return [];
    }
    return (data as UserBoughtItemRecord[]) || [];
  } catch (err) {
    console.warn('[orderService] Failed to get user bought items:', err);
    return [];
  }
};

