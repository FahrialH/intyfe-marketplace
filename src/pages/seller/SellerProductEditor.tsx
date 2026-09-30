import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Package,
  Upload,
  Plus,
  Trash2,
  Save,
  ChevronRight,
  Loader2,
  AlertCircle,
  Tag,
  Layers,
  Sparkles,
  Coins,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import {
  createProduct,
  updateProduct,
  getSellerProducts,
  uploadSellerAsset,
} from '../../services/sellerService';
import { ProductRecord } from '../../lib/supabase';

export const SellerProductEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const { user } = useAuth();
  const { showToast } = useCart();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    price_sol: 0.15,
    category: 'Screenplay Pass',
    tier: 'Standard',
    image_url: '/assets/images/default-store-banner.png',
    in_stock: true,
    tagsString: 'Script, NFT, Web3 Cinema',
  });

  const [attributes, setAttributes] = useState<{ trait: string; value: string }[]>([
    { trait: 'Edition', value: '1 of 100' },
    { trait: 'Access', value: 'Full Script PDF + DAO Voting' },
  ]);

  const categories = [
    'Screenplay Pass',
    'Action / Thriller',
    'Sci-Fi Franchise',
    'Horror / Mystery',
    'Creator Assets',
    'Official Merchandise',
  ];

  const tiers = ['Standard', 'Director', 'Producer', 'Legendary'];

  useEffect(() => {
    let mounted = true;
    if (isEditing && id && user?.id) {
      setIsLoading(true);
      getSellerProducts(user.id)
        .then((items) => {
          if (!mounted) return;
          const found = items.find((it) => it.id === id);
          if (found) {
            setFormData({
              title: found.title,
              slug: found.slug,
              description: found.description,
              price_sol: Number(found.price_sol),
              category: found.category || 'Screenplay Pass',
              tier: found.tier || 'Standard',
              image_url: found.image_url || '/assets/images/default-store-banner.png',
              in_stock: found.in_stock,
              tagsString: (found.tags || []).join(', '),
            });
            if (found.attributes && Array.isArray(found.attributes)) {
              setAttributes(found.attributes);
            }
          }
        })
        .finally(() => {
          if (mounted) setIsLoading(false);
        });
    }

    return () => {
      mounted = false;
    };
  }, [id, isEditing, user?.id]);

  const handleSlugify = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: isEditing ? prev.slug : handleSlugify(val),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingImage(true);
    const { url, error } = await uploadSellerAsset(file, 'product-images');
    setIsUploadingImage(false);
    if (url) {
      setFormData((prev) => ({ ...prev, image_url: url }));
      showToast('Product cover image uploaded!');
    } else {
      showToast(error?.message || 'Image upload failed');
    }
  };

  const handleAddAttribute = () => {
    setAttributes((prev) => [...prev, { trait: '', value: '' }]);
  };

  const handleRemoveAttribute = (idx: number) => {
    setAttributes((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAttributeChange = (idx: number, field: 'trait' | 'value', val: string) => {
    setAttributes((prev) => {
      const copy = [...prev];
      copy[idx][field] = val;
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const tags = formData.tagsString
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const validAttributes = attributes.filter((a) => a.trait.trim() && a.value.trim());

      const payload: Partial<ProductRecord> = {
        title: formData.title,
        slug: handleSlugify(formData.slug || formData.title),
        description: formData.description,
        price_sol: Number(formData.price_sol),
        category: formData.category,
        tier: formData.tier,
        image_url: formData.image_url,
        in_stock: formData.in_stock,
        tags,
        attributes: validAttributes,
        seller_id: user.id,
      };

      if (isEditing && id) {
        const { error } = await updateProduct(id, payload);
        if (error) {
          setErrorMsg(error.message);
          setIsSubmitting(false);
          return;
        }
        showToast('Product updated successfully!');
      } else {
        const { error } = await createProduct(payload);
        if (error) {
          setErrorMsg(error.message);
          setIsSubmitting(false);
          return;
        }
        showToast('New item published to marketplace!');
      }

      setIsSubmitting(false);
      navigate('/seller/products');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save product';
      setErrorMsg(msg);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#d81395] animate-spin" />
        <p className="text-xs text-neutral-400">Loading item data...</p>
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
        <Link to="/seller/products" className="hover:text-white transition-colors">Products</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-white font-medium">{isEditing ? 'Edit Item' : 'New Item'}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          {isEditing ? 'Edit' : 'Publish New'}{' '}
          <span className="bg-gradient-to-r from-[#d81395] to-[#fff2c6] bg-clip-text text-transparent">
            Marketplace Asset
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Set up pricing in SOL, edition tiers, rights attributes, and media for your collectible script pass.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-xs">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Product Information */}
        <div className="bg-[#151515] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
            <Package className="w-4 h-4 text-[#d81395]" />
            <span>Asset Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Item Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. Protocol: Genesis - Collector Pass"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d81395] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Product Slug (URL) *
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="protocol-genesis-pass"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d81395] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Description & Collectible Rights *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detail what the collector receives (PDF manuscript, DAO voting rights, executive credits)..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d81395] transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d81395] cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-[#151515] text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Edition Tier *
              </label>
              <select
                value={formData.tier}
                onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d81395] cursor-pointer"
              >
                {tiers.map((t) => (
                  <option key={t} value={t} className="bg-[#151515] text-white">
                    {t} Tier
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="bg-[#151515] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
            <Coins className="w-4 h-4 text-[#f4bb28]" />
            <span>Solana Pricing & Inventory</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Price in SOL *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.001"
                  min="0.001"
                  required
                  value={formData.price_sol}
                  onChange={(e) =>
                    setFormData({ ...formData, price_sol: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-16 py-3 text-sm text-[#f4bb28] font-mono font-bold focus:outline-none focus:border-[#d81395]"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400 font-mono">
                  SOL
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">
                Estimated: ~Rp {(formData.price_sol * 2500000).toLocaleString('id-ID')}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-2">
                Marketplace Stock Availability
              </label>
              <label className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.in_stock}
                  onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                  className="rounded border-white/20 text-[#d81395] focus:ring-[#d81395] cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-white block">Active / Available for Purchase</span>
                  <span className="text-[11px] text-neutral-400">Buyers can add this item to their cart</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Media & Artwork */}
        <div className="bg-[#151515] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
            <Sparkles className="w-4 h-4 text-[#d81395]" />
            <span>Artwork & Cover Image</span>
          </h3>

          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-36 h-36 rounded-2xl overflow-hidden border-2 border-white/15 bg-neutral-900 shadow-xl shrink-0">
              <img
                src={formData.image_url}
                alt="Product preview"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 space-y-3 w-full">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Image URL or Upload *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://... or /assets/images/..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d81395]"
                  />
                  <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 flex items-center gap-1.5 shrink-0 transition-colors">
                    {isUploadingImage ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              <p className="text-[11px] text-neutral-400">
                Supports JPG, PNG, WEBP. Uploads directly to Supabase storage bucket `product-images`.
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Attributes / Traits */}
        <div className="bg-[#151515] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#f4bb28]" />
              <span>Token Traits & Rights Attributes</span>
            </h3>
            <button
              type="button"
              onClick={handleAddAttribute}
              className="text-xs text-[#d81395] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Trait</span>
            </button>
          </div>

          <p className="text-xs text-neutral-400">
            Traits will be displayed on the product page and minted into the buyer&apos;s collectible pass token metadata.
          </p>

          <div className="space-y-3">
            {attributes.map((attr, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Trait (e.g. Edition, Pages)"
                  value={attr.trait}
                  onChange={(e) => handleAttributeChange(idx, 'trait', e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#d81395]"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. 1 of 100, 118 Pages)"
                  value={attr.value}
                  onChange={(e) => handleAttributeChange(idx, 'value', e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#d81395]"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveAttribute(idx)}
                  className="p-2 text-neutral-500 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Remove trait"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-[#d81395]" />
              <span>Tags (comma-separated)</span>
            </label>
            <input
              type="text"
              value={formData.tagsString}
              onChange={(e) => setFormData({ ...formData, tagsString: e.target.value })}
              placeholder="Script, NFT, Cyberpunk, Limited"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#d81395]"
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Link
            to="/seller/products"
            className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white text-xs font-semibold transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3.5 rounded-full bg-[#d81395] hover:bg-[#9a106a] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(216,19,149,0.35)] transition-all cursor-pointer flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publishing Item...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEditing ? 'Save Changes' : 'Publish Item to Marketplace'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
