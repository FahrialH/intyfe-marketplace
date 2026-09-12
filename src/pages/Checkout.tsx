import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Wallet, CreditCard, CheckCircle, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Checkout: React.FC = () => {
  const { cartItems, subtotal, subtotalEth, clearCart, wallet, showToast } = useCart();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'card'>('crypto');
  const [walletInput, setWalletInput] = useState(wallet.address || '0x742d35Cc6634C0532925a3b844Bc454e4438f44e');
  const [formData, setFormData] = useState({
    firstName: 'Alex',
    lastName: 'Vance',
    email: 'alex.vance@cinephile.io',
    address: 'Jl. Sudirman No. 45',
    city: 'Jakarta Selatan',
    country: 'Indonesia',
    postalCode: '12190',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

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

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setOrderComplete(true);
      clearCart();
      showToast('Transaction confirmed! Tokens minted to your address.');
    }, 1800);
  };

  if (orderComplete) {
    return (
      <div className="pt-36 pb-24 container mx-auto px-4 max-w-[700px] text-center">
        <div className="bg-[#151515] border border-emerald-500/30 rounded-3xl p-10 sm:p-12 space-y-6 shadow-[0_0_50px_rgba(0,195,6,0.15)]">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10" />
          </div>

          <span className="text-xs uppercase font-mono tracking-widest text-[#f4bb28] block">
            BLOCKCHAIN TX HASH: 0x8f2d...93b1
          </span>

          <h1 className="text-3xl font-extrabold text-white">
            Order Confirmed & Tokens Minted!
          </h1>

          <p className="text-neutral-300 text-sm leading-relaxed max-w-md mx-auto">
            Thank you for supporting independent cinema. Your collectible NFT passes have been registered on the blockchain and deposited to:
          </p>

          <div className="bg-black/60 p-3 rounded-xl border border-white/10 text-xs font-mono text-[#f4bb28] break-all max-w-md mx-auto">
            {walletInput}
          </div>

          <div className="pt-4 flex justify-center gap-4">
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
    <div className="pt-32 pb-24 container mx-auto px-4 max-w-[1200px]">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-8">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/cart" className="hover:text-white transition-colors">Cart</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-white font-medium">Checkout</span>
      </nav>

      <h1 className="text-3xl font-extrabold text-white mb-8">
        Secure <span className="bg-gradient-to-r from-[#d81395] to-[#fff2c6] bg-clip-text text-transparent">Checkout</span>
      </h1>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left column: Billing & Wallet Details */}
          <div className="lg:col-span-7 space-y-8">
            {/* Delivery Wallet Address */}
            <div className="bg-[#151515] border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <Wallet className="w-4 h-4 text-[#f4bb28]" />
                <span>Web3 Token Delivery Destination</span>
              </div>
              <p className="text-xs text-neutral-400">
                Your NFT tokens, producer passes, and digital script rights will be minted and transferred to this wallet:
              </p>
              <input
                type="text"
                required
                value={walletInput}
                onChange={(e) => setWalletInput(e.target.value)}
                placeholder="0x..."
                className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-[#f4bb28] focus:outline-none focus:border-[#d81395]"
              />
            </div>

            {/* Billing Information */}
            <div className="bg-[#151515] border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white mb-2">Billing Details</h3>

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

            {/* Payment Method Selector */}
            <div className="bg-[#151515] border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white mb-2">Payment Option</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  onClick={() => setPaymentMethod('crypto')}
                  className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'crypto'
                      ? 'border-[#d81395] bg-[#d81395]/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <Wallet className="w-5 h-5 text-[#f4bb28]" />
                  <div>
                    <span className="block text-xs font-bold text-white">Cryptocurrency (ETH)</span>
                    <span className="text-[11px] text-neutral-400">MetaMask, WalletConnect, Coinbase</span>
                  </div>
                </label>

                <label
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#d81395] bg-[#d81395]/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-[#d81395]" />
                  <div>
                    <span className="block text-xs font-bold text-white">Credit Card / Debit</span>
                    <span className="text-[11px] text-neutral-400">Visa, Mastercard, Bank Transfer</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right column: Order Review & Place Order */}
          <div className="lg:col-span-5">
            <div className="bg-[#151515] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl sticky top-28">
              <h3 className="text-lg font-bold text-white pb-3 border-b border-white/10">
                Your Order ({cartItems.length} item{cartItems.length !== 1 ? 's' : ''})
              </h3>

              <div className="max-h-60 overflow-y-auto divide-y divide-white/5 pr-1">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="pr-4">
                      <span className="font-semibold text-white line-clamp-1">{item.product.title}</span>
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
                  <span>Subtotal</span>
                  <span className="font-semibold text-white">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated ETH</span>
                  <span className="font-mono text-[#f4bb28]">{subtotalEth.toFixed(4)} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span>Gas & Platform Fees</span>
                  <span className="text-emerald-400 font-medium">Free / Zero Gas</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-white/10 font-bold text-base text-white">
                  <span>Total</span>
                  <div className="text-right">
                    <div>{formatCurrency(subtotal)}</div>
                    <div className="text-xs text-[#f4bb28] font-mono font-normal">
                      ≈ {subtotalEth.toFixed(4)} ETH
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-full bg-[#d81395] hover:bg-[#9a106a] disabled:opacity-50 text-white font-semibold text-sm shadow-[0_0_25px_rgba(216,19,149,0.4)] transition-all active:scale-98 cursor-pointer"
              >
                {isProcessing ? (
                  <span>Broadcasting Transaction...</span>
                ) : (
                  <>
                    <span>Place Order & Mint Pass</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400 pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>256-Bit Encrypted Decentralized Protocol</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
