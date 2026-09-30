import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Store,
  Wallet,
  Globe,
  MapPin,
  Calendar,
  Save,
  ChevronRight,
  ExternalLink,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Upload,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import {
  getSellerProfile,
  updateSellerProfile,
  uploadSellerAsset,
} from '../../services/sellerService';
import { ProfileRecord } from '../../lib/supabase';

export const SellerProfileEditor: React.FC = () => {
  const { user, profile: authProfile, refreshProfile } = useAuth();
  const { wallet, showToast } = useCart();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    store_name: '',
    store_slug: '',
    tagline: '',
    bio: '',
    location: '',
    founded_year: 2026,
    banner_url: '/assets/images/default-store-banner.png',
    avatar_url: '/assets/images/cropped-image-180x180.png',
    solana_wallet_address: '',
    twitter: '',
    discord: '',
    website: '',
  });

  useEffect(() => {
    let mounted = true;
    const loadProfile = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      try {
        const prof = await getSellerProfile(user.id);
        const source: ProfileRecord = prof || authProfile || ({} as ProfileRecord);
        if (mounted) {
          const defaultSlug =
            source.store_slug ||
            (source.full_name || user.email?.split('@')[0] || 'studio')
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)+/g, '');

          setFormData({
            store_name: source.store_name || source.full_name || '',
            store_slug: defaultSlug,
            tagline: source.tagline || '',
            bio: source.bio || '',
            location: source.location || 'Decentralized',
            founded_year: source.founded_year || 2026,
            banner_url: source.banner_url || '/assets/images/default-store-banner.png',
            avatar_url: source.avatar_url || '/assets/images/cropped-image-180x180.png',
            solana_wallet_address: source.solana_wallet_address || '',
            twitter: source.socials?.twitter || '',
            discord: source.socials?.discord || '',
            website: source.socials?.website || '',
          });
        }
      } catch (err) {
        console.warn('Failed to load profile:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadProfile();
    return () => {
      mounted = false;
    };
  }, [user?.id, authProfile]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSlugify = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleStoreNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      store_name: val,
      store_slug: prev.store_slug ? prev.store_slug : handleSlugify(val),
    }));
  };

  const handleBindConnectedWallet = () => {
    if (wallet.connected && wallet.address) {
      setFormData((prev) => ({ ...prev, solana_wallet_address: wallet.address || '' }));
      showToast('Bound connected Solana wallet address!');
    } else {
      wallet.connect();
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingBanner(true);
    const { url, error } = await uploadSellerAsset(file, 'store-banners');
    setIsUploadingBanner(false);
    if (url) {
      setFormData((prev) => ({ ...prev, banner_url: url }));
      showToast('Store banner uploaded!');
    } else {
      showToast(error?.message || 'Banner upload failed');
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingAvatar(true);
    const { url, error } = await uploadSellerAsset(file, 'product-images');
    setIsUploadingAvatar(false);
    if (url) {
      setFormData((prev) => ({ ...prev, avatar_url: url }));
      showToast('Creator avatar uploaded!');
    } else {
      showToast(error?.message || 'Avatar upload failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setErrorMsg(null);
    setIsSaving(true);

    try {
      const sanitizedSlug = handleSlugify(formData.store_slug || formData.store_name || 'studio');

      const updates: Partial<ProfileRecord> = {
        store_name: formData.store_name,
        store_slug: sanitizedSlug,
        tagline: formData.tagline,
        bio: formData.bio,
        location: formData.location,
        founded_year: Number(formData.founded_year),
        banner_url: formData.banner_url,
        avatar_url: formData.avatar_url,
        solana_wallet_address: formData.solana_wallet_address || null,
        socials: {
          twitter: formData.twitter,
          discord: formData.discord,
          website: formData.website,
        },
        role: 'seller',
      };

      const { error } = await updateSellerProfile(user.id, updates);
      if (error) {
        setErrorMsg(error.message);
        setIsSaving(false);
        return;
      }

      await refreshProfile();
      showToast('Storefront profile updated successfully!');
      setIsSaving(false);
      navigate(`/store/${sanitizedSlug}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save changes';
      setErrorMsg(msg);
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#d81395] animate-spin" />
        <p className="text-xs text-neutral-400">Loading storefront settings...</p>
      </div>
    );
  }

  return (
    <div className="pt-6 sm:pt-8 pb-20 sm:pb-24 container mx-auto px-4 max-w-[900px]">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-6">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/seller/dashboard" className="hover:text-white transition-colors">Creator Studio</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-white font-medium">Storefront Profile</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Creator <span className="bg-gradient-to-r from-[#d81395] to-[#fff2c6] bg-clip-text text-transparent">Storefront Settings</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Configure your brand identity, studio bio, and Solana Web3 payout destination.
          </p>
        </div>

        {formData.store_slug && (
          <Link
            to={`/store/${formData.store_slug}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-all self-start sm:self-auto"
          >
            <span>Preview Storefront</span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
          </Link>
        )}
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-xs">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Visual Banner & Avatar Preview Card */}
        <div className="bg-[#151515] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="relative h-44 sm:h-56 w-full bg-neutral-900">
            <img
              src={formData.banner_url}
              alt="Banner Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <label className="cursor-pointer px-4 py-2 rounded-full bg-black/70 hover:bg-black text-white text-xs font-semibold border border-white/20 flex items-center gap-2 backdrop-blur-md">
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploadingBanner ? 'Uploading...' : 'Change Banner'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="px-6 pb-6 pt-0 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-4">
              <div className="relative">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-[#151515] overflow-hidden bg-black shadow-xl">
                  <img
                    src={formData.avatar_url}
                    alt="Avatar Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <label className="absolute bottom-1 right-1 cursor-pointer p-1.5 rounded-lg bg-[#d81395] hover:bg-[#9a106a] text-white shadow-md">
                  {isUploadingAvatar ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="text-xs text-neutral-400">
                <span>Public store URL: </span>
                <span className="text-[#f4bb28] font-mono font-semibold">
                  /store/{formData.store_slug || 'your-slug'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Store Details */}
        <div className="bg-[#151515] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
            <Store className="w-4 h-4 text-[#d81395]" />
            <span>Store Brand & Identity</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Studio / Store Name *
              </label>
              <input
                type="text"
                required
                value={formData.store_name}
                onChange={handleStoreNameChange}
                placeholder="e.g. CineNova Studios"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d81395] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Custom Store Slug (URL) *
              </label>
              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-neutral-400 focus-within:border-[#d81395]">
                <span className="text-neutral-500 mr-1 select-none">/store/</span>
                <input
                  type="text"
                  required
                  name="store_slug"
                  value={formData.store_slug}
                  onChange={handleInputChange}
                  placeholder="cinenova-studios"
                  className="w-full bg-transparent text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Tagline (Short One-Liner)
            </label>
            <input
              type="text"
              name="tagline"
              value={formData.tagline}
              onChange={handleInputChange}
              placeholder="e.g. Decentralized narrative design & sci-fi world-building"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d81395] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Detailed Creator Biography
            </label>
            <textarea
              name="bio"
              rows={4}
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Describe your studio, past productions, writing credits, and creative vision..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d81395] transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#d81395]" />
                <span>Location / Studio HQ</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g. Los Angeles / Remote"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d81395] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#f4bb28]" />
                <span>Founded Year</span>
              </label>
              <input
                type="number"
                name="founded_year"
                value={formData.founded_year}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d81395] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Solana Web3 Payout Wallet */}
        <div className="bg-[#151515] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Wallet className="w-4 h-4 text-[#f4bb28]" />
              <span>Solana Payout Wallet Destination</span>
            </h3>
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Direct Payout
            </span>
          </div>

          <p className="text-xs text-neutral-400 leading-relaxed">
            All purchases made by buyers for your screenplay passes and items will transfer SOL directly to this public key on-chain.
          </p>

          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                name="solana_wallet_address"
                value={formData.solana_wallet_address}
                onChange={handleInputChange}
                placeholder="Paste your Solana wallet address (e.g. 7vW...9Xy)"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-[#f4bb28] font-mono focus:outline-none focus:border-[#d81395] transition-colors"
              />
              <button
                type="button"
                onClick={handleBindConnectedWallet}
                className="px-4 py-2.5 rounded-xl bg-[#f4bb28] hover:bg-[#e3ae24] text-black text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>{wallet.connected ? 'Use Connected Wallet' : 'Connect Wallet'}</span>
              </button>
            </div>

            {wallet.connected && wallet.address && (
              <p className="text-[11px] text-neutral-500 font-mono">
                Currently connected in browser: {wallet.address}
              </p>
            )}
          </div>
        </div>

        {/* Section 3: Social Links */}
        <div className="bg-[#151515] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
            <Globe className="w-4 h-4 text-[#d81395]" />
            <span>Social Channels & Official Links</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Twitter / X Handle or URL</label>
              <input
                type="text"
                name="twitter"
                value={formData.twitter}
                onChange={handleInputChange}
                placeholder="https://x.com/yourhandle"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#d81395]"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Discord Community Invite</label>
              <input
                type="text"
                name="discord"
                value={formData.discord}
                onChange={handleInputChange}
                placeholder="https://discord.gg/yourserver"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#d81395]"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Website URL</label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://yourstudio.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#d81395]"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Link
            to="/seller/dashboard"
            className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white text-xs font-semibold transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3.5 rounded-full bg-[#d81395] hover:bg-[#9a106a] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(216,19,149,0.35)] transition-all cursor-pointer flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Storefront Profile</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
