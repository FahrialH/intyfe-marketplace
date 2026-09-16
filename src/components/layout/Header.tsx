import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, ShoppingBag, Wallet, User as UserIcon } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { MobileDrawer } from './MobileDrawer';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { itemCount, wallet } = useCart();
  const { user, profile, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          isScrolled ? 'py-2 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/10' : 'py-3 sm:py-4 bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 max-w-[1200px]">
          <div className="flex items-center justify-between bg-[#151515]/80 backdrop-blur-xl border border-white/10 rounded-full px-4 sm:px-6 py-2 sm:py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] min-h-[58px] sm:min-h-[64px]">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <img
                src="/assets/images/cropped-image-1.png"
                alt="Intyfe Logo"
                className="h-8 md:h-9 w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <ul className="flex items-center gap-5 lg:gap-8 list-none m-0 p-0">
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `text-sm font-medium transition-colors ${
                        isActive ? 'text-white border-b-2 border-[#d81395] pb-1' : 'text-neutral-400 hover:text-white'
                      }`
                    }
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/stories"
                    className={({ isActive }) =>
                      `text-sm font-medium transition-colors ${
                        isActive ? 'text-white border-b-2 border-[#d81395] pb-1' : 'text-neutral-400 hover:text-white'
                      }`
                    }
                  >
                    Stories
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/shop"
                    className={({ isActive }) =>
                      `text-sm font-medium transition-colors ${
                        isActive ? 'text-white border-b-2 border-[#d81395] pb-1' : 'text-neutral-400 hover:text-white'
                      }`
                    }
                  >
                    Shop
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/news"
                    className={({ isActive }) =>
                      `text-sm font-medium transition-colors ${
                        isActive ? 'text-white border-b-2 border-[#d81395] pb-1' : 'text-neutral-400 hover:text-white'
                      }`
                    }
                  >
                    News
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/sellers"
                    className={({ isActive }) =>
                      `text-sm font-medium transition-colors ${
                        isActive ? 'text-white border-b-2 border-[#d81395] pb-1' : 'text-neutral-400 hover:text-white'
                      }`
                    }
                  >
                    Sellers
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/cart"
                    className={({ isActive }) =>
                      `text-sm font-medium flex items-center gap-1.5 transition-colors ${
                        isActive ? 'text-white border-b-2 border-[#d81395] pb-1' : 'text-neutral-400 hover:text-white'
                      }`
                    }
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Cart</span>
                    {itemCount > 0 && (
                      <span className="bg-[#f4bb28] text-black text-[11px] font-bold px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
                        {itemCount}
                      </span>
                    )}
                  </NavLink>
                </li>
              </ul>
            </nav>

            {/* Header Actions */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {wallet.connected ? (
                <button
                  onClick={wallet.disconnect}
                  className="hidden sm:flex items-center gap-2 bg-[#151515] border border-[#f4bb28]/50 px-3.5 py-1.5 rounded-full text-xs font-mono text-[#f4bb28] hover:bg-[#f4bb28]/10 transition-colors"
                  title="Disconnect wallet"
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span>{wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}</span>
                </button>
              ) : (
                <button
                  onClick={wallet.connect}
                  className="hidden sm:flex items-center gap-2 bg-[#f4bb28] text-black px-3.5 py-1.5 rounded-full text-xs font-semibold hover:bg-[#e3ae24] transition-colors shadow-sm"
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span>Connect</span>
                </button>
              )}

              {user ? (
                <Link
                  to="/account"
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 sm:px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all"
                >
                  <UserIcon className="w-3.5 h-3.5 text-[#f4bb28]" />
                  <span className="max-w-[80px] sm:max-w-[120px] truncate">
                    {profile?.full_name || user.email?.split('@')[0]}
                  </span>
                  {isAdmin && (
                    <span className="text-[10px] bg-[#d81395] text-white px-1.5 py-0.2 rounded-full font-bold">
                      Admin
                    </span>
                  )}
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="text-xs font-semibold px-3.5 sm:px-4 py-2 rounded-full bg-[#d81395] text-white hover:bg-[#9a106a] transition-all shadow-[0_0_15px_rgba(216,19,149,0.3)]"
                >
                  Sign in
                </Link>
              )}

              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden text-white/80 hover:text-white p-1.5 sm:p-2"
                aria-label="Open mobile navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
};
