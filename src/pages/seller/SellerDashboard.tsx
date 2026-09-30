import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Store,
  Package,
  PlusCircle,
  TrendingUp,
  Wallet,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Layers,
  Sparkles,
  ShoppingBag,
  ArrowUpRight,
  Edit3,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  getSellerProfile,
  getSellerProducts,
  getSellerSalesAnalytics,
} from '../../services/sellerService';
import { ProfileRecord, ProductRecord } from '../../lib/supabase';

export const SellerDashboard: React.FC = () => {
  const { user, profile: authProfile } = useAuth();

  const [profile, setProfile] = useState<ProfileRecord | null>(authProfile);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [analytics, setAnalytics] = useState<{
    totalSol: number;
    totalSales: number;
    recentOrders: any[];
  }>({ totalSol: 0, totalSales: 0, recentOrders: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadSellerData = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const [prof, prods, stats] = await Promise.all([
          getSellerProfile(user.id),
          getSellerProducts(user.id),
          getSellerSalesAnalytics(user.id),
        ]);
        if (mounted) {
          if (prof) setProfile(prof);
          setProducts(prods);
          setAnalytics(stats);
        }
      } catch (err) {
        console.warn('Error loading seller dashboard:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadSellerData();
    return () => {
      mounted = false;
    };
  }, [user?.id]);

  const storeSlug = profile?.store_slug || `creator-${user?.id.slice(0, 8)}`;
  const storeName = profile?.store_name || profile?.full_name || 'My Creator Studio';
  const payoutWallet = profile?.solana_wallet_address;

  const network = import.meta.env.VITE_SOLANA_NETWORK || 'devnet';
  const clusterParam = network === 'mainnet-beta' ? '' : `?cluster=${network}`;

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#d81395] animate-spin" />
        <p className="text-xs text-neutral-400">Loading Creator Studio dashboard...</p>
      </div>
    );
  }

  return (
    <div className="pt-6 sm:pt-8 pb-20 sm:pb-24 container mx-auto px-4 max-w-[1200px]">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-6">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/account" className="hover:text-white transition-colors">My Account</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-white font-medium">Creator Studio</span>
      </nav>

      {/* Creator Studio Hero Card */}
      <div className="bg-[#151515] border border-white/10 rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#d81395]/10 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-white/15 bg-black shadow-xl shrink-0">
              <img
                src={profile?.avatar_url || '/assets/images/cropped-image-180x180.png'}
                alt={storeName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{storeName}</h1>
                <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-[#f4bb28]/20 text-[#f4bb28] border border-[#f4bb28]/40 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Creator Studio
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
                {profile?.tagline || 'Manage your film script passes, digital collectibles, and real-time Solana wallet payouts.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={`/store/${storeSlug}`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-all"
            >
              <span>View Public Store</span>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
            </Link>
            <Link
              to="/seller/profile"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#f4bb28]" />
              <span>Edit Profile</span>
            </Link>
            <Link
              to="/seller/products/new"
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#d81395] hover:bg-[#9a106a] text-white text-xs font-semibold shadow-[0_0_15px_rgba(216,19,149,0.3)] transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Item</span>
            </Link>
          </div>
        </div>

        {/* Creator Navigation Tabs */}
        <div className="flex items-center gap-6 mt-8 pt-6 border-t border-white/10 text-xs sm:text-sm font-semibold overflow-x-auto scrollbar-none">
          <Link
            to="/seller/dashboard"
            className="text-white border-b-2 border-[#d81395] pb-2 flex items-center gap-1.5 shrink-0"
          >
            <TrendingUp className="w-4 h-4 text-[#d81395]" />
            <span>Dashboard Overview</span>
          </Link>
          <Link
            to="/seller/products"
            className="text-neutral-400 hover:text-white pb-2 flex items-center gap-1.5 shrink-0 transition-colors"
          >
            <Package className="w-4 h-4" />
            <span>Items & Inventory ({products.length})</span>
          </Link>
          <Link
            to="/seller/products/new"
            className="text-neutral-400 hover:text-white pb-2 flex items-center gap-1.5 shrink-0 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publish New Item</span>
          </Link>
          <Link
            to="/seller/profile"
            className="text-neutral-400 hover:text-white pb-2 flex items-center gap-1.5 shrink-0 transition-colors"
          >
            <Store className="w-4 h-4" />
            <span>Storefront Settings</span>
          </Link>
        </div>
      </div>

      {/* Warning banner if payout wallet is missing */}
      {!payoutWallet && (
        <div className="mb-8 p-5 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-amber-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Action Required: Payout Wallet Not Bound
              </h4>
              <p className="text-xs text-neutral-300 mt-0.5">
                When buyers purchase your items, SOL payments cannot be deposited into your account until you configure your Solana payout wallet.
              </p>
            </div>
          </div>
          <Link
            to="/seller/profile"
            className="px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition-all shrink-0 cursor-pointer"
          >
            Bind Payout Wallet
          </Link>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#151515] border border-white/10 rounded-3xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span>Total Sales Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-[#d81395]/10 text-[#d81395] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {analytics.totalSol} SOL
          </div>
          <span className="text-[11px] text-emerald-400 mt-1 block">
            100% Direct On-Chain Payouts
          </span>
        </div>

        <div className="bg-[#151515] border border-white/10 rounded-3xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span>Active Products Listed</span>
            <div className="w-8 h-8 rounded-xl bg-[#f4bb28]/10 text-[#f4bb28] flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {products.length}
          </div>
          <Link
            to="/seller/products"
            className="text-[11px] text-[#f4bb28] hover:underline mt-1 flex items-center gap-1"
          >
            <span>Manage Catalog</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="bg-[#151515] border border-white/10 rounded-3xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span>Total Passes Sold</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {analytics.totalSales}
          </div>
          <span className="text-[11px] text-neutral-400 mt-1 block">
            Recorded in order items
          </span>
        </div>

        <div className="bg-[#151515] border border-white/10 rounded-3xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span>Solana Payout Wallet</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xs font-mono text-[#f4bb28] truncate font-bold">
            {payoutWallet ? `${payoutWallet.slice(0, 6)}...${payoutWallet.slice(-4)}` : 'None linked'}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-400">
            {payoutWallet ? (
              <>
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified Direct Payout</span>
              </>
            ) : (
              <span className="text-rose-400">Not Configured</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Products Quick View & Recent Payouts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Creator Catalog Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#d81395]" />
              <span>Your Listed Items</span>
            </h3>
            <Link
              to="/seller/products/new"
              className="text-xs text-[#d81395] hover:underline font-semibold flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Item</span>
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="p-8 rounded-3xl bg-[#151515] border border-white/10 text-center space-y-3">
              <Package className="w-10 h-10 text-neutral-500 mx-auto" />
              <h4 className="text-sm font-bold text-white">No items listed yet</h4>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Start monetizing your original screenplays, passes, or digital studio assets today.
              </p>
              <Link
                to="/seller/products/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#d81395] text-white text-xs font-semibold shadow-md"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Your First Item</span>
              </Link>
            </div>
          ) : (
            <div className="bg-[#151515] border border-white/10 rounded-3xl divide-y divide-white/5 overflow-hidden">
              {products.slice(0, 5).map((prod) => (
                <div key={prod.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={prod.image_url}
                      alt={prod.title}
                      className="w-12 h-12 rounded-xl object-cover border border-white/10 bg-neutral-900 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate" title={prod.title}>
                        {prod.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                        <span className="text-[#f4bb28] font-mono font-bold">{prod.price_sol} SOL</span>
                        <span>•</span>
                        <span>{prod.category}</span>
                        <span>•</span>
                        <span className={prod.in_stock ? 'text-emerald-400' : 'text-rose-400'}>
                          {prod.in_stock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to={`/seller/products/edit/${prod.id}`}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-medium border border-white/10 transition-colors"
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/product/${prod.slug}`}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                      title="View live product"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}

              {products.length > 5 && (
                <div className="p-3 text-center bg-white/[0.02]">
                  <Link
                    to="/seller/products"
                    className="text-xs text-neutral-400 hover:text-white transition-colors font-medium"
                  >
                    View all {products.length} products &rarr;
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Recent Sales & Transactions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#f4bb28]" />
              <span>Recent Sales & Payouts</span>
            </h3>
            <span className="text-xs text-neutral-400 font-mono">
              Solana {network.toUpperCase()}
            </span>
          </div>

          {analytics.recentOrders.length === 0 ? (
            <div className="p-8 rounded-3xl bg-[#151515] border border-white/10 text-center space-y-2">
              <Wallet className="w-10 h-10 text-neutral-500 mx-auto" />
              <h4 className="text-sm font-bold text-white">No sales recorded yet</h4>
              <p className="text-xs text-neutral-400">
                When buyers checkout your items, confirmed Solana transfers will appear here with direct transaction explorer signatures.
              </p>
            </div>
          ) : (
            <div className="bg-[#151515] border border-white/10 rounded-3xl divide-y divide-white/5 overflow-hidden">
              {analytics.recentOrders.map((order) => {
                const txLink = order.txSignature
                  ? `https://explorer.solana.com/tx/${order.txSignature}${clusterParam}`
                  : null;

                return (
                  <div key={order.id} className="p-4 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white truncate max-w-[200px]">
                        {order.productTitle}
                      </span>
                      <span className="font-mono text-[#f4bb28] font-bold">
                        +{order.priceSol} SOL
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-neutral-400">
                      <span className="truncate max-w-[150px] font-mono">
                        Buyer: {order.buyerWallet.slice(0, 6)}...{order.buyerWallet.slice(-4)}
                      </span>
                      <span>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {txLink && (
                      <div className="pt-1">
                        <a
                          href={txLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] text-[#d81395] hover:underline font-mono"
                        >
                          <span>Explorer Signature</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
