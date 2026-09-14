import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const { showToast } = useCart();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    showToast('Subscribed successfully to the Intyfe newsletter!');
    setEmail('');
  };

  return (
    <footer className="bg-[#0a0a0a] border-t border-white/10 pt-16 pb-12">
      <div className="container mx-auto px-4 max-w-[1200px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <img
                src="/assets/images/cropped-image-1.png"
                alt="Intyfe Logo"
                className="h-8 w-auto object-contain"
              />
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
              The premier blockchain-powered cinema marketplace connecting filmmakers, investors, and fans globally.
            </p>
          </div>

          {/* Col 2: Explore */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4 tracking-tight">Explore</h4>
            <div className="flex flex-col gap-2.5 text-sm text-neutral-400">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <Link to="/stories" className="hover:text-white transition-colors">Stories & Scripts</Link>
              <Link to="/shop" className="hover:text-white transition-colors">Marketplace</Link>
              <Link to="/news" className="hover:text-white transition-colors">News & Updates</Link>
              <Link to="/sellers" className="hover:text-white transition-colors">Sellers & Studios</Link>
              <Link to="/cart" className="hover:text-white transition-colors">Shopping Cart</Link>
            </div>
          </div>

          {/* Col 3: Resources */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4 tracking-tight">Resources</h4>
            <div className="flex flex-col gap-2.5 text-sm text-neutral-400">
              <a href="#doc" onClick={(e) => { e.preventDefault(); showToast('Documentation is coming soon.'); }} className="hover:text-white transition-colors">Documentation</a>
              <a href="#tokenomics" onClick={(e) => { e.preventDefault(); showToast('Tokenomics whitepaper v1.0 available in Q3.'); }} className="hover:text-white transition-colors">Tokenomics</a>
              <a href="#support" onClick={(e) => { e.preventDefault(); showToast('Support hub available on Discord.'); }} className="hover:text-white transition-colors">Support Hub</a>
              <a href="#privacy" onClick={(e) => { e.preventDefault(); showToast('Privacy Policy updated.'); }} className="hover:text-white transition-colors">Privacy Policy</a>
            </div>
          </div>

          {/* Col 4: Newsletter & Community */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4 tracking-tight">Stay Updated</h4>
            <p className="text-neutral-400 text-xs mb-4 leading-relaxed">
              Subscribe to receive greenlight announcements and early script drops.
            </p>
            <form onSubmit={handleSubmit} className="flex gap-2 mb-5">
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#d81395]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#d81395] hover:bg-[#9a106a] text-white text-xs font-semibold rounded-full transition-colors shrink-0 shadow-md"
              >
                Send
              </button>
            </form>

            {/* Social Media Icon Buttons */}
            <div>
              <span className="block text-xs font-medium text-neutral-400 mb-2.5">
                Join our community:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#d81395] text-neutral-400 hover:text-white border border-white/10 hover:border-[#d81395] flex items-center justify-center text-xs transition-all duration-200 hover:scale-110 shadow-sm"
                  aria-label="Instagram"
                >
                  <i className="fa-brands fa-instagram"></i>
                </a>
                <a
                  href="https://telegram.org"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#d81395] text-neutral-400 hover:text-white border border-white/10 hover:border-[#d81395] flex items-center justify-center text-xs transition-all duration-200 hover:scale-110 shadow-sm"
                  aria-label="Telegram"
                >
                  <i className="fa-brands fa-telegram"></i>
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#d81395] text-neutral-400 hover:text-white border border-white/10 hover:border-[#d81395] flex items-center justify-center text-xs transition-all duration-200 hover:scale-110 shadow-sm"
                  aria-label="X Twitter"
                >
                  <i className="fa-brands fa-x-twitter"></i>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#d81395] text-neutral-400 hover:text-white border border-white/10 hover:border-[#d81395] flex items-center justify-center text-xs transition-all duration-200 hover:scale-110 shadow-sm"
                  aria-label="YouTube"
                >
                  <i className="fa-brands fa-youtube"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <span>© All Copyright Reserved by Intyfe Marketplace.</span>
          <div className="flex items-center gap-4 text-sm">
            <a href="https://x.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" aria-label="X Twitter">
              <i className="fa-brands fa-x-twitter"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" aria-label="Instagram">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" aria-label="YouTube">
              <i className="fa-brands fa-youtube"></i>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" aria-label="Facebook">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
