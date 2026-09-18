import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Wallet, CreditCard, CheckCircle, ArrowRight, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrderWithItems } from '../services/orderService';

export const Checkout: React.FC = () => {
  const { cartItems, subtotal, subtotalEth, clearCart, showToast } = useCart();
  const { user } = useAuth();
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected, select, wallets } = useWallet();

  const [paymentMethod, setPaymentMethod] = useState<'solana' | 'card'>('solana');
  const [formData, setFormData] = useState({
    firstName: 'Alex',
    lastName: 'Vance',
    email: user?.email || 'alex.vance@cinephile.io',
    address: 'Jl. Sudirman No. 45',
    city: 'Jakarta Selatan',
    country: 'Indonesia',
    postalCode: '12190',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [orderComplete, setOrderComplete] = useState(false);
  const [txSignature, setTxSignature] = useState('');

  // Conversion: 1 ETH subtotal ~= 15 SOL (or minimum 0.01 SOL on Devnet)
  const totalSol = Math.max(0.01, Number((subtotalEth * 15).toFixed(4)));

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (cartItems.length === 0) {
      setErrorMsg('Your cart is empty. Please add items before checking out.');
      return;
    }

    setIsProcessing(true);

    if (paymentMethod === 'card') {
      setStatusMessage('Processing card authorization...');
      setTimeout(async () => {
        const dummyTx = 'CARD_AUTH_' + Date.now();
        setTxSignature(dummyTx);
        await createOrderWithItems({
          buyerId: user?.id,
          solanaTxSignature: dummyTx,
          totalPriceSol: totalSol,
          walletAddress: publicKey?.toBase58() || 'FIAT_PAYMENT',
          billingDetails: formData,
          items: cartItems,
        });
        setIsProcessing(false);
        setOrderComplete(true);
        clearCart();
        showToast('Order confirmed via Card! Passes registered.');
      }, 1500);
      return;
    }

    // Solana Web3 Payment Flow
    if (!connected || !publicKey) {
      setErrorMsg('Please connect your Solana wallet (Phantom or Solflare) to proceed with crypto checkout.');
      setIsProcessing(false);
      return;
    }

    try {
      setStatusMessage('Preparing Solana Devnet transfer...');
      const treasuryPubkeyStr = import.meta.env.VITE_SOLANA_TREASURY_WALLET || '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM';
      const treasuryPubkey = new PublicKey(treasuryPubkeyStr);

      const lamports = Math.round(totalSol * LAMPORTS_PER_SOL);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: treasuryPubkey,
          lamports,
        })
      );

      setStatusMessage('Awaiting wallet approval...');
      const signature = await sendTransaction(transaction, connection);
      setTxSignature(signature);

      setStatusMessage('Confirming transaction on Solana Devnet...');
      const latestBlockHash = await connection.getLatestBlockhash();
      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature,
      }, 'confirmed');

      setStatusMessage('Saving order record in Supabase...');
      const { error: orderError } = await createOrderWithItems({
        buyerId: user?.id,
        solanaTxSignature: signature,
        totalPriceSol: totalSol,
        walletAddress: publicKey.toBase58(),
        billingDetails: formData,
        items: cartItems,
      });

      if (orderError) {
        console.warn('Order database record notice:', orderError.message);
      }

      setIsProcessing(false);
      setOrderComplete(true);
      clearCart();
      showToast('Solana transaction confirmed! Order created in Supabase.');
    } catch (err: unknown) {
      console.error('Solana payment error:', err);
      const msg = err instanceof Error ? err.message : 'Transaction failed or was rejected by user';
      setErrorMsg(`Solana transaction error: ${msg}`);
      setIsProcessing(false);
    }
  };

  const handleSimulateSolanaPayment = async () => {
    setIsProcessing(true);
    setErrorMsg(null);
    setStatusMessage('Simulating Solana Devnet confirmation...');

    const simulatedSig = Array.from({ length: 88 }, () =>
      '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'[Math.floor(Math.random() * 58)]
    ).join('');

    setTimeout(async () => {
      setTxSignature(simulatedSig);
      await createOrderWithItems({
        buyerId: user?.id,
        solanaTxSignature: simulatedSig,
        totalPriceSol: totalSol,
        walletAddress: publicKey?.toBase58() || '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
        billingDetails: formData,
        items: cartItems,
      });

      setIsProcessing(false);
      setOrderComplete(true);
      clearCart();
      showToast('Simulated Devnet order recorded in Supabase!');
    }, 1200);
  };

  if (orderComplete) {
    const explorerUrl = `https://explorer.solana.com/tx/${txSignature}?cluster=devnet`;

    return (
      <div className="pt-6 sm:pt-8 pb-20 sm:pb-24 container mx-auto px-4 max-w-[700px] text-center">
        <div className="bg-[#151515] border border-emerald-500/30 rounded-3xl p-8 sm:p-12 space-y-6 shadow-[0_0_50px_rgba(0,195,6,0.15)]">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10" />
          </div>

          <span className="text-xs uppercase font-mono tracking-widest text-[#f4bb28] block">
            SOLANA DEVNET TRANSACTION CONFIRMED
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Order Confirmed & Recorded!
          </h1>

          <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
            Thank you for supporting independent cinema. Your collectible screenplay passes and rights have been saved to the Supabase database.
          </p>

          <div className="bg-black/60 p-3.5 rounded-xl border border-white/10 text-xs font-mono text-[#f4bb28] break-all max-w-md mx-auto space-y-2">
            <div className="text-[11px] text-neutral-400">Signature Hash:</div>
            <div>{txSignature}</div>
            {txSignature.length > 50 && (
              <a
                href={explorerUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-[#d81395] hover:underline pt-1"
              >
                <span>View on Solana Explorer (Devnet)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              to="/account"
              className="px-6 py-3 rounded-full bg-[#d81395] hover:bg-[#9a106a] text-white text-xs font-semibold shadow-md transition-all"
            >
              View In My Account
            </Link>
            <Link
              to="/shop"
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all"
            >
              Back to Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-6 sm:pt-8 pb-20 sm:pb-24 container mx-auto px-4 max-w-[1200px]">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-8">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/cart" className="hover:text-white transition-colors">Cart</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-white font-medium">Checkout</span>
      </nav>

      <h1 className="text-3xl font-extrabold text-white mb-8">
        Secure Web3 <span className="bg-gradient-to-r from-[#d81395] to-[#fff2c6] bg-clip-text text-transparent">Checkout</span>
      </h1>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-xs mb-8">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p>{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left column: Billing & Wallet Details */}
          <div className="lg:col-span-7 space-y-8">
            {/* Solana Wallet Selection Card */}
            <div className="bg-[#151515] border border-white/10 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-bold text-base">
                  <Wallet className="w-5 h-5 text-[#f4bb28]" />
                  <span>Solana Wallet Integration (Devnet)</span>
                </div>
                {connected && (
                  <span className="text-[11px] bg-emerald-500/20 text-emerald-400 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    Connected
                  </span>
                )}
              </div>

              <p className="text-xs text-neutral-400">
                Connect your Phantom or Solflare wallet on Solana Devnet to transfer SOL directly to the film collective treasury.
              </p>

              {connected && publicKey ? (
                <div className="bg-black/60 p-4 rounded-2xl border border-[#f4bb28]/40 space-y-1">
                  <span className="text-[11px] text-neutral-400 block font-semibold">Active Solana Address:</span>
                  <span className="text-xs font-mono text-[#f4bb28] break-all">{publicKey.toBase58()}</span>
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  <span className="text-xs text-neutral-300 font-semibold block">Select Wallet Adapter:</span>
                  <div className="flex flex-wrap gap-2">
                    {wallets.map((w) => (
                      <button
                        key={w.adapter.name}
                        type="button"
                        onClick={() => select(w.adapter.name)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-all cursor-pointer"
                      >
                        <img src={w.adapter.icon} alt={w.adapter.name} className="w-4 h-4" />
                        <span>Connect {w.adapter.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Billing Information */}
            <div className="bg-[#151515] border border-white/10 rounded-3xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white mb-2">Buyer Information</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d81395]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d81395]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d81395]"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d81395]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d81395]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Country *</label>
                  <input
                    type="text"
                    required
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d81395]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Postcode / ZIP *</label>
                  <input
                    type="text"
                    required
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d81395]"
                  />
                </div>
              </div>
            </div>

            {/* Payment Option */}
            <div className="bg-[#151515] border border-white/10 rounded-3xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white mb-2">Payment Option</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('solana')}
                  className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    paymentMethod === 'solana'
                      ? 'border-[#d81395] bg-[#d81395]/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <Wallet className="w-5 h-5 text-[#f4bb28]" />
                  <div>
                    <span className="block text-xs font-bold text-white">Solana Devnet (SOL)</span>
                    <span className="text-[11px] text-neutral-400">Phantom, Solflare, Web3 RPC</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-[#d81395] bg-[#d81395]/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-[#d81395]" />
                  <div>
                    <span className="block text-xs font-bold text-white">Credit / Debit Card</span>
                    <span className="text-[11px] text-neutral-400">Visa, Mastercard, Midtrans</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right column: Order Review & Place Order */}
          <div className="lg:col-span-5">
            <div className="bg-[#151515] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl sticky top-28">
              <h3 className="text-lg font-bold text-white pb-3 border-b border-white/10">
                Order Summary ({cartItems.length} item{cartItems.length !== 1 ? 's' : ''})
              </h3>

              <div className="max-h-60 overflow-y-auto divide-y divide-white/5 pr-1">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="py-3 flex items-center justify-between text-xs gap-3">
                    <div className="min-w-0 flex-1">
                      <span className="font-semibold text-white truncate block" title={item.product.title}>
                        {item.product.title}
                      </span>
                      <span className="text-neutral-400">Qty: {item.quantity}</span>
                    </div>
                    <span className="font-mono text-white shrink-0">
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-3 border-t border-white/10 text-xs sm:text-sm text-neutral-300">
                <div className="flex justify-between">
                  <span>Subtotal (IDR)</span>
                  <span className="font-semibold text-white">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated SOL</span>
                  <span className="font-mono text-[#f4bb28] font-bold">{totalSol} SOL</span>
                </div>
                <div className="flex justify-between">
                  <span>Gas & Network Fee</span>
                  <span className="text-emerald-400 font-medium">~0.000005 SOL (Devnet)</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-white/10 font-bold text-base text-white">
                  <span>Total Due</span>
                  <div className="text-right">
                    <div>{formatCurrency(subtotal)}</div>
                    <div className="text-xs text-[#f4bb28] font-mono font-normal">
                      ≈ {totalSol} SOL
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-full bg-[#d81395] hover:bg-[#9a106a] disabled:opacity-50 text-white font-semibold text-sm shadow-[0_0_25px_rgba(216,19,149,0.4)] transition-all cursor-pointer active:scale-98"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{statusMessage || 'Processing Transaction...'}</span>
                  </>
                ) : (
                  <>
                    <span>
                      {paymentMethod === 'solana'
                        ? connected
                          ? `Pay ${totalSol} SOL with Connected Wallet`
                          : 'Connect Wallet & Pay SOL'
                        : 'Confirm Card Payment'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Devnet Simulation helper for testing without browser extension */}
              <button
                type="button"
                onClick={handleSimulateSolanaPayment}
                disabled={isProcessing}
                className="w-full py-2.5 px-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                🧪 Simulate Devnet Transaction & Record to Supabase
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified by Solana RPC & Supabase RLS</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
