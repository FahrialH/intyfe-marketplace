import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, ChevronRight, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { QuantityStepper } from '../components/common/QuantityStepper';

export const Cart: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal, showToast, openAuthModal } = useCart();
  const { user } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const navigate = useNavigate();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'INTYFE20' || couponCode.toUpperCase() === 'BLOCKCHAIN') {
      setDiscountPercent(20);
      showToast('Promo code applied! 20% discount granted.');
    } else {
      showToast('Invalid promo code. Try "INTYFE20".');
    }
  };

  const discountAmount = Number(((subtotal * discountPercent) / 100).toFixed(4));
  const finalTotal = Number((subtotal - discountAmount).toFixed(4));

  const formatSol = (val: number) => {
    return `${Number(val.toFixed(4))} SOL`;
  };

  if (cartItems.length === 0) {
    return (
      <div className="pt-6 sm:pt-8 pb-20 sm:pb-24 container mx-auto px-4 max-w-[800px] text-center">
        <div className="bg-[#151515] border border-white/10 rounded-3xl p-12 space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-neutral-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Your Shopping Cart is Empty</h2>
          <p className="text-neutral-400 text-sm max-w-md mx-auto">
            Explore our curated catalog of director passes, screenplay NFTs, and cinema merchandise to get started.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#d81395] hover:bg-[#9a106a] text-white font-semibold text-sm shadow-[0_0_20px_rgba(216,19,149,0.3)] transition-all"
          >
            <span>Return to Marketplace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
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
        <span className="text-white font-medium">Shopping Cart</span>
      </nav>

      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
        <h1 className="text-3xl font-extrabold text-white">
          Shopping <span className="bg-gradient-to-r from-[#d81395] to-[#fff2c6] bg-clip-text text-transparent">Cart</span>
        </h1>
        <button
          onClick={clearCart}
          className="text-xs text-rose-400 hover:underline cursor-pointer"
        >
          Clear All Items
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Cart items list */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#151515] border border-white/10 rounded-2xl overflow-hidden">
            <div className="divide-y divide-white/10">
              {cartItems.map((item) => (
                <div key={item.product.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 w-full sm:flex-1 min-w-0">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-black shrink-0 border border-white/10"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] uppercase font-bold text-[#f4bb28] tracking-wider block">
                        {item.product.category}
                      </span>
                      <Link
                        to={`/product/${item.product.slug}`}
                        className="font-bold text-white text-sm sm:text-base hover:text-[#d81395] transition-colors truncate block"
                        title={item.product.title}
                      >
                        {item.product.title}
                      </Link>
                      <div className="text-xs text-[#f4bb28] font-mono mt-1 truncate">
                        Unit: {formatSol(item.product.price)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-white/5 shrink-0">
                    <QuantityStepper
                      quantity={item.quantity}
                      onQuantityChange={(q) => updateQuantity(item.product.id, q)}
                    />

                    <div className="text-right min-w-24 sm:min-w-28 shrink-0">
                      <div className="text-sm sm:text-base font-bold font-mono text-[#f4bb28]">
                        {formatSol(item.product.price * item.quantity)}
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 text-neutral-500 hover:text-rose-400 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coupon Code Section */}
          <div className="bg-[#151515] border border-white/10 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <Tag className="w-4 h-4 text-[#f4bb28]" />
              <span>Have a discount coupon? Use code <strong className="text-white font-mono">INTYFE20</strong> for 20% off</span>
            </div>
            <form onSubmit={handleApplyCoupon} className="flex gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Coupon Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#d81395] uppercase font-mono"
              />
              <button
                type="submit"
                className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-colors shrink-0 cursor-pointer"
              >
                Apply
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-4">
          <div className="bg-[#151515] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl sticky top-28">
            <h3 className="text-lg font-bold text-white pb-3 border-b border-white/10">
              Order Summary
            </h3>

            <div className="space-y-3 text-xs sm:text-sm text-neutral-300">
              <div className="flex justify-between">
                <span>Subtotal (SOL)</span>
                <span className="font-semibold font-mono text-white">{formatSol(subtotal)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-400 font-mono">
                  <span>Discount ({discountPercent}%)</span>
                  <span>-{formatSol(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Solana Network Fee</span>
                <span className="text-emerald-400 font-mono">~0.000005 SOL (Devnet)</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-white/10 font-bold text-base text-white">
                <span>Total Due</span>
                <div className="text-right">
                  <div className="font-mono text-[#f4bb28] text-lg">{formatSol(finalTotal)}</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (!user) {
                  openAuthModal();
                  return;
                }
                navigate('/checkout');
              }}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#d81395] hover:bg-[#9a106a] text-white font-semibold text-sm shadow-[0_0_20px_rgba(216,19,149,0.3)] transition-all active:scale-98 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-neutral-500 text-center leading-relaxed">
              Solana Web3 Devnet & card payments accepted. Passes will be minted directly to your connected wallet upon confirmation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
