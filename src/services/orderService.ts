import { supabase, isSupabaseConfigured, OrderRecord } from '../lib/supabase';
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
        price_sol: item.product.priceSol ?? item.product.priceEth ?? 0.1,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert);

      if (itemsError) {
        console.warn('Notice inserting order items:', itemsError.message);
      }
    }

    // 3. Trigger backend verification via Supabase Edge Function (if available)
    try {
      await supabase.functions.invoke('verify-solana-tx', {
        body: {
          signature: solanaTxSignature,
          orderId: createdOrder.id,
          expectedSol: totalPriceSol,
          network: import.meta.env.VITE_SOLANA_NETWORK || 'mainnet-beta',
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
