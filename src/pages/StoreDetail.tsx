import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronRight,
  MapPin,
  CheckCircle2,
  ShoppingBag,
  Film,
  Loader2,
  ExternalLink,
  Wallet,
  Globe,
} from 'lucide-react';
import { mockStudios, mockProducts, mockStories } from '../data/mockData';
import { RatingStars } from '../components/common/RatingStars';
import { ProductCard } from '../components/features/ProductCard';
import { StoryCard } from '../components/features/StoryCard';
import { useCart } from '../context/CartContext';
import {
  getSellerBySlug,
  getSellerProducts,
  mapProfileRecordToStudio,
  mapProductRecordToProduct,
} from '../services/sellerService';
import { Studio, Product } from '../types';

export const StoreDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { showToast } = useCart();
  const [activeTab, setActiveTab] = useState<'catalog' | 'stories'>('catalog');

  const [studio, setStudio] = useState<Studio | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchStudioData = async () => {
      if (!slug) return;
      setIsLoading(true);

      // 1. Check if it matches a preset studio
      const preset = mockStudios.find((s) => s.slug === slug);

      try {
        // 2. Fetch from Supabase profiles
        const dbProfile = await getSellerBySlug(slug);

        if (dbProfile) {
          const prods = await getSellerProducts(dbProfile.id);
          const mappedProds = prods.map((p) => mapProductRecordToProduct(p, dbProfile));
          if (mounted) {
            setStudio(mapProfileRecordToStudio(dbProfile, mappedProds.length));
            setProducts(mappedProds.length > 0 ? mappedProds : mockProducts);
            setIsLoading(false);
          }
          return;
        }

        if (preset && mounted) {
          setStudio(preset);
          setProducts(mockProducts);
          setIsLoading(false);
          return;
        }

        // Fallback to first studio
        if (mounted) {
          setStudio(mockStudios[0]);
          setProducts(mockProducts);
          setIsLoading(false);
        }
      } catch (err) {
        console.warn('Error loading studio detail:', err);
        if (mounted) {
          setStudio(preset || mockStudios[0]);
          setProducts(mockProducts);
          setIsLoading(false);
        }
      }
    };

    fetchStudioData();
    return () => {
      mounted = false;
    };
  }, [slug]);

  const handleFollow = () => {
    showToast(`You are now following ${studio?.name || 'this studio'}!`);
  };

  if (isLoading || !studio) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#d81395] animate-spin" />
        <p className="text-xs text-neutral-400">Loading creator storefront...</p>
      </div>
    );
  }

  return (
    <div className="pt-6 sm:pt-8 pb-20 sm:pb-24 container mx-auto px-4 max-w-[1200px]">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-8">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/sellers" className="hover:text-white transition-colors">Sellers</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-white font-medium">{studio.name}</span>
      </nav>

      {/* Profile Banner & Header Card */}
      <div className="bg-[#151515] border border-white/10 rounded-3xl overflow-hidden mb-12 shadow-2xl">
        <div className="relative h-48 sm:h-64 w-full bg-neutral-900">
          <img
            src={studio.bannerImage}
            alt={studio.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-transparent to-transparent" />
        </div>

        <div className="px-5 sm:px-10 pb-6 sm:pb-8 relative -mt-12 sm:-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-5">
              <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-2xl border-4 border-[#151515] overflow-hidden bg-black shadow-xl shrink-0">
                <img
                  src={studio.avatarImage}
                  alt={studio.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1 sm:mb-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{studio.name}</h1>
                  {studio.verified && (
                    <span title="Verified Studio">
                      <CheckCircle2 className="w-5 h-5 text-[#f4bb28] shrink-0" />
                    </span>
                  )}
                </div>
                <RatingStars rating={5.0} size={14} />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {studio.socials?.website && (
                <a
                  href={studio.socials.website}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition-colors"
                  title="Official Website"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
              {studio.socials?.twitter && (
                <a
                  href={studio.socials.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition-colors"
                  title="Twitter / X"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}
              <button
                onClick={handleFollow}
                className="px-6 py-2.5 rounded-full bg-[#d81395] hover:bg-[#9a106a] text-white text-xs font-semibold shadow-md transition-all active:scale-98 cursor-pointer"
              >
                + Follow Studio
              </button>
            </div>
          </div>

          <div className="mt-6 max-w-3xl space-y-3">
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">{studio.bio}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#d81395]" />
                {studio.location}
              </span>
              <span>•</span>
              <span>Est. {studio.foundedYear}</span>
              {studio.walletAddress && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-mono text-[#f4bb28]">
                    <Wallet className="w-3.5 h-3.5" />
                    {studio.walletAddress.slice(0, 4)}...{studio.walletAddress.slice(-4)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 gap-6 sm:gap-8 mb-8 overflow-x-auto scrollbar-none whitespace-nowrap">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex items-center gap-2 pb-4 text-sm font-semibold transition-colors relative cursor-pointer ${
            activeTab === 'catalog' ? 'text-white' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Studio Catalog ({products.length})</span>
          {activeTab === 'catalog' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d81395]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('stories')}
          className={`flex items-center gap-2 pb-4 text-sm font-semibold transition-colors relative cursor-pointer ${
            activeTab === 'stories' ? 'text-white' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Released Screenplays ({mockStories.length})</span>
          {activeTab === 'stories' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d81395]" />
          )}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'catalog' ? (
        products.length === 0 ? (
          <div className="text-center py-16 bg-[#151515] border border-white/10 rounded-3xl p-8">
            <ShoppingBag className="w-10 h-10 text-neutral-500 mx-auto mb-2" />
            <p className="text-neutral-400 text-sm">This creator has not listed any items yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockStories.map((s) => (
            <StoryCard key={s.id} story={s} />
          ))}
        </div>
      )}
    </div>
  );
};
