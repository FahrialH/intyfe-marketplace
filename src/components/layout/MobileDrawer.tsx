import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, ShoppingBag, User, Film, Compass, Store, Newspaper, Shield } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const { itemCount, wallet } = useCart();
  const { user, profile, isAdmin, signOut } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative ml-auto w-full max-w-xs bg-[#151515] border-l border-white/10 p-6 flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-right duration-200">
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <img src="/assets/images/cropped-image-1.png" alt="Intyfe Logo" className="h-7 w-auto" />
            <button
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white rounded-full hover:bg-white/5"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="mt-6 flex flex-col gap-2">
            <NavLink
              to="/"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-[#d81395] text-white' : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Film className="w-4 h-4" /> Home
            </NavLink>
            <NavLink
              to="/stories"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-[#d81395] text-white' : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Compass className="w-4 h-4" /> Stories
            </NavLink>
            <NavLink
              to="/shop"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-[#d81395] text-white' : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <ShoppingBag className="w-4 h-4" /> Shop
            </NavLink>
            <NavLink
              to="/news"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-[#d81395] text-white' : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Newspaper className="w-4 h-4" /> News & Updates
            </NavLink>
            <NavLink
              to="/sellers"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-[#d81395] text-white' : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Store className="w-4 h-4" /> Sellers
            </NavLink>
            <NavLink
              to="/cart"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-[#d81395] text-white' : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" /> Cart
              </div>
              {itemCount > 0 && (
                <span className="bg-[#f4bb28] text-black text-xs px-2 py-0.5 rounded-full font-bold">
                  {itemCount}
                </span>
              )}
            </NavLink>
          </nav>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
          {wallet.connected ? (
            <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-[#f4bb28]/30">
              <span className="text-xs font-mono text-neutral-300">
                {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
              </span>
              <button
                onClick={wallet.disconnect}
                className="text-xs text-rose-400 hover:underline"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                wallet.connect();
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-full text-xs font-bold text-black bg-[#f4bb28] hover:bg-[#e3ae24] transition-colors text-center"
            >
              Connect Wallet
            </button>
          )}

          {isAdmin && (
            <NavLink
              to="/admin/news"
              onClick={onClose}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-xs font-semibold bg-[#d81395]/20 border border-[#d81395]/50 text-[#d81395] hover:bg-[#d81395]/30 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" /> Admin News CMS
            </NavLink>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <NavLink
                to="/account"
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-xs font-medium border border-white/20 text-white hover:bg-white/10 transition-colors truncate"
              >
                <User className="w-3.5 h-3.5 text-[#f4bb28]" />
                <span className="truncate">{profile?.full_name || 'Account'}</span>
              </NavLink>
              <button
                onClick={() => {
                  signOut();
                  onClose();
                }}
                className="py-2.5 px-3 rounded-full text-xs text-rose-400 border border-white/10 hover:bg-rose-500/10 transition-colors"
              >
                Exit
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              onClick={onClose}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-xs font-semibold bg-[#d81395] text-white hover:bg-[#9a106a] transition-colors"
            >
              <User className="w-3.5 h-3.5" /> Sign in
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
};
