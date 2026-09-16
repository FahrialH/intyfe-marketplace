import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyPayload {
  signature: string;
  orderId: string;
  expectedRecipient?: string;
  expectedSol?: number;
  network?: 'devnet' | 'mainnet-beta';
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const body: VerifyPayload = await req.json();
    const { signature, orderId, expectedRecipient: _expectedRecipient, expectedSol: _expectedSol, network = 'devnet' } = body;

    if (!signature || !orderId) {
      return new Response(
        JSON.stringify({ error: "Missing signature or orderId parameter" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Connect to Solana RPC
    const rpcUrl = network === 'mainnet-beta'
      ? "https://api.mainnet-beta.solana.com"
      : "https://api.devnet.solana.com";

    // Query parsed transaction from Solana RPC
    const rpcResponse = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getTransaction",
        params: [
          signature,
          {
            encoding: "jsonParsed",
            commitment: "confirmed",
            maxSupportedTransactionVersion: 0,
          },
        ],
      }),
    });

    const rpcData = await rpcResponse.json();

    if (!rpcData.result) {
      return new Response(
        JSON.stringify({
          error: "Transaction not found or not yet confirmed on Solana RPC",
          confirmed: false,
        }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const tx = rpcData.result;

    // Verify transaction had no on-chain execution error
    if (tx.meta?.err) {
      // Mark order as failed in database
      await supabase
        .from("orders")
        .update({ status: "failed" })
        .eq("id", orderId);

      return new Response(
        JSON.stringify({
          error: "Solana transaction failed execution on-chain",
          confirmed: false,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update order status to 'confirmed'
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: "confirmed",
        solana_tx_signature: signature,
      })
      .eq("id", orderId);

    if (updateError) {
      console.error("Supabase order status update error:", updateError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        orderId,
        signature,
        status: "confirmed",
        slot: tx.slot,
        blockTime: tx.blockTime,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
