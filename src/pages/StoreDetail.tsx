import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, MapPin, CheckCircle2, ShoppingBag, Film } from 'lucide-react';
import { mockStudios, mockProducts, mockStories } from '../data/mockData';
import { RatingStars } from '../components/common/RatingStars';
import { ProductCard } from '../components/features/ProductCard';
import { StoryCard } from '../components/features/StoryCard';
import { useCart } from '../context/CartContext';

export const StoreDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { showToast } = useCart();
  const [activeTab, setActiveTab] = useState<'catalog' | 'stories'>('catalog');

  const studio = mockStudios.find((s) => s.slug === slug) || mockStudios[0];

  const handleFollow = () => {
    showToast(`You are now following ${studio.name}!`);
  };

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
              <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full border-4 border-[#151515] overflow-hidden bg-black shadow-xl shrink-0">
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
              <button
                onClick={handleFollow}
                className="px-6 py-2.5 rounded-full bg-[#d81395] hover:bg-[#9a106a] text-white text-xs font-semibold shadow-md transition-all active:scale-98"
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
              <span>•</span>
              <span className="text-[#f4bb28] font-semibold">{studio.totalVolumeSol ?? studio.totalVolumeEth} SOL Total Volume</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 gap-6 sm:gap-8 mb-8 overflow-x-auto scrollbar-none whitespace-nowrap">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex items-center gap-2 pb-4 text-sm font-semibold transition-colors relative ${
            activeTab === 'catalog' ? 'text-white' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Studio Catalog ({mockProducts.length})</span>
          {activeTab === 'catalog' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d81395]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('stories')}
          className={`flex items-center gap-2 pb-4 text-sm font-semibold transition-colors relative ${
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
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
