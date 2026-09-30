import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Lock, X, UserPlus, LogIn, Sparkles, ShieldCheck, Ticket } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export const AuthRequiredModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, pendingProduct, showToast, addToCart } = useCart();
  const { demoSignIn } = useAuth();
  const location = useLocation();

  if (!isAuthModalOpen) return null;

  const handleDemoBuyerLogin = async () => {
    try {
      showToast('Signing in as Demo Buyer...');
      const { error } = await demoSignIn('buyer');
      if (error) {
        showToast(error.message);
        return;
      }
      closeAuthModal();
      showToast('Signed in successfully as Buyer!');
      // If there was a pending product, add it now
      if (pendingProduct) {
        setTimeout(() => {
          addToCart(pendingProduct, 1);
        }, 200);
      }
    } catch {
      showToast('Failed to sign in demo buyer.');
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        onClick={closeAuthModal}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-[#151515] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(216,19,149,0.25)] z-10 animate-in zoom-in-95 duration-200 space-y-6">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon & Title */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#d81395] to-[#f4bb28] p-0.5 mx-auto shadow-lg">
            <div className="w-full h-full rounded-[14px] bg-black flex items-center justify-center">
              <Lock className="w-6 h-6 text-[#f4bb28]" />
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-[#d81395] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Buyer Authentication Required</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Sign In to Purchase
          </h2>

          <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
            Buyers must have an active Intyfe account before adding items to their cart or minting screenplay passes.
          </p>
        </div>

        {/* Pending Product preview (if any) */}
        {pendingProduct && (
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
            <img
              src={pendingProduct.image}
              alt={pendingProduct.title}
              className="w-12 h-12 rounded-xl object-cover border border-white/10 bg-neutral-900 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-[#f4bb28] tracking-wider">
                  {pendingProduct.tier}
                </span>
                <span className="text-[10px] text-neutral-400">• {pendingProduct.category}</span>
              </div>
              <h4 className="text-xs font-bold text-white truncate" title={pendingProduct.title}>
                {pendingProduct.title}
              </h4>
              <span className="font-mono text-xs font-bold text-[#f4bb28]">
                {pendingProduct.price} SOL
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <Link
            to="/login"
            state={{ from: location }}
            onClick={closeAuthModal}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#d81395] hover:bg-[#9a106a] text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(216,19,149,0.35)] transition-all cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Your Account</span>
          </Link>

          <Link
            to="/signup"
            state={{ from: location }}
            onClick={closeAuthModal}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-white/5 hover:bg-white/10 text-white font-semibold text-xs border border-white/10 transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create New Buyer Account</span>
          </Link>

          {/* Quick Demo Buyer login */}
          <button
            type="button"
            onClick={handleDemoBuyerLogin}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-[#f4bb28]/10 hover:bg-[#f4bb28]/20 border border-[#f4bb28]/30 text-[#f4bb28] font-mono text-[11px] font-bold transition-all cursor-pointer"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>⚡ Instant Demo Buyer Login</span>
          </button>
        </div>

        <div className="pt-2 border-t border-white/5 flex items-center justify-center gap-2 text-[11px] text-neutral-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Verifiable on-chain collectible ownership</span>
        </div>
      </div>
    </div>
  );
};
