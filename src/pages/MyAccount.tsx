import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet, User, Layers, LogOut, ChevronRight, Newspaper, Shield, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { mockStories, mockProducts } from '../data/mockData';

export const MyAccount: React.FC = () => {
  const { wallet, showToast } = useCart();
  const { user, profile, isAdmin, isSeller, role, signOut, linkSolanaWallet, signIn, signUp, demoSignIn } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLinking, setIsLinking] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const { error } = await signIn(email, password);
    if (error) {
      setAuthError(error.message);
      return;
    }
    showToast(`Signed in successfully!`);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const { error } = await signUp(email, password, fullName || email.split('@')[0], 'buyer');
    if (error) {
      setAuthError(error.message);
      return;
    }
    showToast(`Account created! Welcome to Intyfe.`);
  };

  const handleLinkWallet = async () => {
    if (!wallet.address) {
      wallet.connect();
      return;
    }
    setIsLinking(true);
    const res = await linkSolanaWallet(wallet.address);
    setIsLinking(false);
    if (res.success) {
      showToast('Solana wallet linked to your Intyfe profile!');
    } else {
      showToast(res.error || 'Failed to link wallet');
    }
  };

  return (
    <div className="pt-6 sm:pt-8 pb-20 sm:pb-24 container mx-auto px-4 max-w-[1000px]">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-8">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-white font-medium">My Account</span>
      </nav>

      {user ? (
        /* Logged In User View */
        <div className="space-y-8">
          {/* Profile Card */}
          <div className="bg-[#151515] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#d81395] to-[#f4bb28] p-0.5">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                    <User className="w-7 h-7 text-[#f4bb28]" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">
                      {profile?.full_name || user.email?.split('@')[0] || 'Intyfe Member'}
                    </h2>
                    <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${
                      isAdmin
                        ? 'bg-[#d81395]/20 text-[#d81395] border-[#d81395]/40'
                        : isSeller
                        ? 'bg-[#f4bb28]/20 text-[#f4bb28] border-[#f4bb28]/40'
                        : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    }`}>
                      {role || 'Buyer'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {isAdmin && (
                  <button
                    onClick={() => navigate('/admin/news')}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#d81395] hover:bg-[#9a106a] text-white text-xs font-semibold transition-all shadow-[0_0_15px_rgba(216,19,149,0.3)]"
                  >
                    <Newspaper className="w-3.5 h-3.5" />
                    <span>Admin News CMS</span>
                  </button>
                )}

                <button
                  onClick={signOut}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-300 border border-white/10 text-xs font-semibold transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Admin Banner if Admin */}
            {isAdmin && (
              <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-[#d81395]/20 to-[#f4bb28]/10 border border-[#d81395]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[#f4bb28]" />
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Administrator Dashboard Active
                    </h4>
                    <p className="text-xs text-neutral-300">
                      You have full access to publish, edit, and moderate editorial dispatches and marketplace catalogs.
                    </p>
                  </div>
                </div>
                <Link
                  to="/admin/news"
                  className="px-4 py-1.5 rounded-full bg-[#d81395] hover:bg-[#9a106a] text-white text-xs font-semibold transition-all shrink-0"
                >
                  Manage News &rarr;
                </Link>
              </div>
            )}

            {/* Solana Wallet Linking Section */}
            <div className="mt-6 p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Wallet className="w-4 h-4 text-[#f4bb28]" />
                  <span>Solana Web3 Wallet Integration</span>
                </div>
                {profile?.solana_wallet_address ? (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Linked
                  </span>
                ) : (
                  <span className="text-[11px] text-neutral-400">Not Linked</span>
                )}
              </div>

              {profile?.solana_wallet_address ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="font-mono text-xs text-[#f4bb28] bg-black/50 px-3 py-2 rounded-xl border border-white/10 break-all">
                    {profile.solana_wallet_address}
                  </span>
                  <button
                    onClick={() => linkSolanaWallet('')}
                    className="text-xs text-neutral-400 hover:text-rose-400 underline self-start sm:self-auto"
                  >
                    Unlink
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-xs text-neutral-400">
                    {wallet.connected
                      ? `Active Wallet: ${wallet.address?.slice(0, 8)}...${wallet.address?.slice(-6)}`
                      : 'Connect your Phantom or Solflare wallet to bind your on-chain credentials.'}
                  </p>
                  <button
                    onClick={handleLinkWallet}
                    disabled={isLinking}
                    className="px-4 py-2 rounded-full bg-[#f4bb28] hover:bg-[#e3ae24] text-black text-xs font-bold transition-all shrink-0"
                  >
                    {wallet.connected ? 'Bind Active Wallet' : 'Connect & Link Wallet'}
                  </button>
                </div>
              )}
            </div>

            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <span className="text-xs text-neutral-400 block mb-1">Minted Script Passes</span>
                <span className="text-2xl font-extrabold text-white">3</span>
                <span className="text-[11px] text-emerald-400 block mt-1">+1 this month</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <span className="text-xs text-neutral-400 block mb-1">Producer Voting Weight</span>
                <span className="text-2xl font-extrabold text-[#f4bb28]">125 VP</span>
                <span className="text-[11px] text-neutral-400 block mt-1">Snapshot Protocol v2</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <span className="text-xs text-neutral-400 block mb-1">Portfolio Value</span>
                <span className="text-2xl font-extrabold text-[#d81395]">0.084 SOL</span>
                <span className="text-[11px] text-neutral-400 block mt-1">≈ 12.60 USD</span>
              </div>
            </div>
          </div>

          {/* Owned Passes & Activity */}
          <div className="bg-[#151515] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#d81395]" />
              <span>Your Registered Screenplay Passes</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                <img
                  src={mockStories[0].coverImage}
                  alt=""
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div>
                  <span className="text-[10px] text-[#f4bb28] font-bold uppercase block">Executive Pass</span>
                  <h4 className="text-white font-bold text-sm">{mockStories[0].title}</h4>
                  <p className="text-xs text-neutral-400 mt-1">Token ID: #0074 • 1 Producer Vote</p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                <img
                  src={mockProducts[0].image}
                  alt=""
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div>
                  <span className="text-[10px] text-[#d81395] font-bold uppercase block">Director Edition</span>
                  <h4 className="text-white font-bold text-sm">{mockProducts[0].title}</h4>
                  <p className="text-xs text-neutral-400 mt-1">Token ID: #0112 • Commercial Spec Rights</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Sign In / Register Tabbed View */
        <div className="max-w-md mx-auto">
          {/* Quick Sign In / Sign Up Card */}
          <div className="bg-[#151515] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-xl font-bold text-white">Intyfe Member Portal</h2>
              <p className="text-xs text-neutral-400">Sign in with your email or Solana web3 wallet</p>
            </div>

            {authError && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{authError}</p>
              </div>
            )}

            {/* Tabs */}
            <div className="grid grid-cols-2 p-1 bg-white/5 rounded-full text-center">
              <button
                type="button"
                onClick={() => { setActiveTab('login'); setAuthError(null); }}
                className={`py-2 rounded-full text-xs font-semibold transition-all ${
                  activeTab === 'login' ? 'bg-[#d81395] text-white shadow-sm' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('register'); setAuthError(null); }}
                className={`py-2 rounded-full text-xs font-semibold transition-all ${
                  activeTab === 'register' ? 'bg-[#d81395] text-white shadow-sm' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Register
              </button>
            </div>

            {activeTab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="creator@intyfe.io"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d81395]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d81395]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-6 rounded-full bg-[#d81395] hover:bg-[#9a106a] text-white font-semibold text-xs shadow-md transition-all mt-4 cursor-pointer"
                >
                  Sign in
                </button>

                <div className="pt-2 text-center">
                  <Link to="/signup" className="text-xs text-[#f4bb28] hover:underline">
                    Need a Seller / Creator account? Register here
                  </Link>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d81395]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="writer@studio.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d81395]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d81395]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-6 rounded-full bg-[#d81395] hover:bg-[#9a106a] text-white font-semibold text-xs shadow-md transition-all mt-4 cursor-pointer"
                >
                  Create Account
                </button>
              </form>
            )}

            {/* Quick Demo Logins */}
            <div className="pt-4 border-t border-white/10">
              <span className="text-[11px] text-neutral-400 flex items-center gap-1 mb-2 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#f4bb28]" /> Instant Demo Roles:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    setAuthError(null);
                    const { error } = await demoSignIn('admin');
                    if (error) setAuthError(error.message);
                    else showToast('Signed in as ADMIN');
                  }}
                  className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-[#d81395]/20 border border-white/10 text-[11px] text-neutral-300 hover:text-white transition-colors cursor-pointer"
                >
                  👑 Admin
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setAuthError(null);
                    const { error } = await demoSignIn('seller');
                    if (error) setAuthError(error.message);
                    else showToast('Signed in as SELLER');
                  }}
                  className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-[#f4bb28]/20 border border-white/10 text-[11px] text-neutral-300 hover:text-white transition-colors cursor-pointer"
                >
                  🎬 Seller
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setAuthError(null);
                    const { error } = await demoSignIn('buyer');
                    if (error) setAuthError(error.message);
                    else showToast('Signed in as BUYER');
                  }}
                  className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-emerald-500/20 border border-white/10 text-[11px] text-neutral-300 hover:text-white transition-colors cursor-pointer"
                >
                  🎟️ Buyer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
