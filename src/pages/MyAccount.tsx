import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wallet,
  User,
  Layers,
  LogOut,
  ChevronRight,
  Newspaper,
  Shield,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  ShoppingBag,
  Loader2,
  Receipt,
  Store,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getUserBoughtItems } from '../services/orderService';
import { updateSellerProfile } from '../services/sellerService';
import { UserBoughtItemRecord } from '../lib/supabase';

export const MyAccount: React.FC = () => {
  const { wallet, showToast } = useCart();
  const { user, profile, isAdmin, isSeller, role, signOut, linkSolanaWallet, signIn, signUp, demoSignIn, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLinking, setIsLinking] = useState(false);

  // Bought items from Supabase user_bought_items table
  const [boughtItems, setBoughtItems] = useState<UserBoughtItemRecord[]>([]);
  const [isLoadingBought, setIsLoadingBought] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchBoughtItems = async () => {
      if (user?.id) {
        setIsLoadingBought(true);
        const items = await getUserBoughtItems(user.id);
        if (active) {
          setBoughtItems(items);
          setIsLoadingBought(false);
        }
      } else {
        if (active) {
          setBoughtItems([]);
          setIsLoadingBought(false);
        }
      }
    };

    fetchBoughtItems();
    return () => {
      active = false;
    };
  }, [user?.id]);

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

  const handleUpgradeToSeller = async () => {
    if (!user?.id) return;
    const { error } = await updateSellerProfile(user.id, { role: 'seller' });
    if (error) {
      showToast(error.message);
      return;
    }
    await refreshProfile();
    showToast('Account upgraded to Creator! Welcome to Creator Studio.');
    navigate('/seller/profile');
  };

  // Dynamic portfolio calculations
  const totalPassesCount = boughtItems.reduce((acc, it) => acc + (it.quantity || 1), 0);
  const totalPortfolioSol = boughtItems.reduce((acc, it) => acc + (Number(it.price_sol) || 0), 0);
  const votingPower = totalPassesCount > 0 ? totalPassesCount * 50 : 25;

  const network = import.meta.env.VITE_SOLANA_NETWORK || 'devnet';
  const clusterParam = network === 'mainnet-beta' ? '' : `?cluster=${network}`;

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

            {/* Creator Studio Banner for Sellers */}
            {isSeller ? (
              <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-[#f4bb28]/15 via-[#d81395]/15 to-transparent border border-[#f4bb28]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Store className="w-5 h-5 text-[#f4bb28]" />
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Creator Studio Active
                    </h4>
                    <p className="text-xs text-neutral-300">
                      Manage your public storefront profile, catalog items, and view real-time Solana wallet payout receipts.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to="/seller/dashboard"
                    className="px-4 py-1.5 rounded-full bg-[#f4bb28] hover:bg-[#e3ae24] text-black text-xs font-bold transition-all shrink-0"
                  >
                    Open Studio &rarr;
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Store className="w-5 h-5 text-[#d81395]" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Sell Your Own Screenplays & Passes</h4>
                    <p className="text-xs text-neutral-400">
                      Upgrade to a Creator profile to open your custom store and receive direct Solana wallet payouts.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleUpgradeToSeller}
                  className="px-4 py-1.5 rounded-full bg-[#d81395] hover:bg-[#9a106a] text-white text-xs font-semibold transition-all shrink-0 cursor-pointer"
                >
                  Become a Creator
                </button>
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
                    className="text-xs text-neutral-400 hover:text-rose-400 underline self-start sm:self-auto cursor-pointer"
                  >
                    Unlink
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-xs text-neutral-400">
                    {wallet.connected
                      ? `Active Wallet: ${wallet.address?.slice(0, 8)}...${wallet.address?.slice(-6)}`
                      : 'Connect your Phantom or Solflare wallet on Devnet to link your on-chain ownership.'}
                  </p>
                  <button
                    onClick={handleLinkWallet}
                    disabled={isLinking}
                    className="px-4 py-2 rounded-full bg-[#f4bb28] hover:bg-[#e3ae24] text-black text-xs font-bold transition-all shrink-0 cursor-pointer"
                  >
                    {wallet.connected ? 'Bind Active Wallet' : 'Connect & Link Wallet'}
                  </button>
                </div>
              )}
            </div>

            {/* Dynamic Dashboard Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <span className="text-xs text-neutral-400 block mb-1">Minted Script Passes</span>
                <span className="text-2xl font-extrabold text-white">{totalPassesCount}</span>
                <span className="text-[11px] text-emerald-400 block mt-1">Stored in user_bought_items</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <span className="text-xs text-neutral-400 block mb-1">Producer Voting Weight</span>
                <span className="text-2xl font-extrabold text-[#f4bb28]">{votingPower} VP</span>
                <span className="text-[11px] text-neutral-400 block mt-1">Snapshot Protocol Devnet</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <span className="text-xs text-neutral-400 block mb-1">Total Pass Portfolio Value</span>
                <span className="text-2xl font-extrabold text-[#d81395]">
                  {totalPortfolioSol.toFixed(4)} SOL
                </span>
                <span className="text-[11px] text-neutral-400 block mt-1">Solana Devnet Assets</span>
              </div>
            </div>
          </div>

          {/* Owned Passes & Bought Items Section */}
          <div className="bg-[#151515] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#d81395]" />
                <span>Your Registered Screenplay Passes & Bought Items ({boughtItems.length})</span>
              </h3>
              <Link
                to="/shop"
                className="text-xs text-[#f4bb28] hover:underline flex items-center gap-1"
              >
                <span>Browse Marketplace</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {isLoadingBought ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-neutral-400">
                <Loader2 className="w-6 h-6 animate-spin text-[#d81395]" />
                <span className="text-xs">Fetching your collectible passes from Supabase database...</span>
              </div>
            ) : boughtItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {boughtItems.map((item) => {
                  const explorerUrl = item.solana_tx_signature
                    ? `https://explorer.solana.com/tx/${item.solana_tx_signature}${clusterParam}`
                    : null;

                  return (
                    <div
                      key={item.id}
                      className="bg-white/5 border border-white/10 hover:border-white/20 transition-all rounded-2xl p-4 flex flex-col justify-between gap-4 shadow-sm"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={item.image_url || '/assets/images/deziqettd-e.jpg'}
                          alt={item.title}
                          className="w-20 h-20 rounded-xl object-cover shrink-0 bg-neutral-900 border border-white/10"
                        />
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-[#f4bb28] font-bold uppercase tracking-wider bg-[#f4bb28]/10 border border-[#f4bb28]/20 px-2 py-0.5 rounded-md">
                              {item.tier || 'Pass'}
                            </span>
                            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md uppercase">
                              {item.status || 'Active'}
                            </span>
                          </div>
                          <h4 className="text-white font-bold text-sm truncate" title={item.title}>
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-neutral-400 font-mono">
                            Token: <span className="text-neutral-200">{item.access_token}</span> • Qty: {item.quantity}
                          </p>
                          <div className="text-[11px] text-neutral-400 flex items-center gap-2 pt-0.5">
                            <span className="text-[#f4bb28] font-mono font-semibold">{item.price_sol} SOL</span>
                            {item.created_at && (
                              <span>• {new Date(item.created_at).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {explorerUrl && (
                        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                          <span className="text-neutral-400 font-mono truncate max-w-[170px]" title={item.solana_tx_signature || ''}>
                            Tx: {item.solana_tx_signature?.slice(0, 8)}...{item.solana_tx_signature?.slice(-6)}
                          </span>
                          <a
                            href={explorerUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[#d81395] hover:underline shrink-0"
                          >
                            <span>Solana Explorer ({network})</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-white/10 text-neutral-400 flex items-center justify-center mx-auto">
                  <Receipt className="w-6 h-6 text-[#f4bb28]" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-white">No Bought Items in Your Vault Yet</h4>
                  <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                    You haven't purchased any screenplay passes yet. Explore independent film releases on the Intyfe Marketplace and mint passes directly to your Solana wallet.
                  </p>
                </div>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#d81395] hover:bg-[#9a106a] text-white text-xs font-semibold shadow-md transition-all"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Browse Marketplace</span>
                </Link>
              </div>
            )}
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
