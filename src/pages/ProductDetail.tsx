import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ShoppingCart, ShieldCheck, Sparkles, Share2, Layers } from 'lucide-react';
import { mockProducts } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { RatingStars } from '../components/common/RatingStars';
import { QuantityStepper } from '../components/common/QuantityStepper';
import { ProductCard } from '../components/features/ProductCard';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart, showToast } = useCart();

  const product = mockProducts.find((p) => p.slug === slug) || mockProducts[0];
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'attributes' | 'reviews'>('description');

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(product.price);

  const relatedProducts = mockProducts.filter((p) => p.id !== product.id).slice(0, 3);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Product link copied to clipboard!');
  };

  return (
    <div className="pt-32 pb-24 container mx-auto px-4 max-w-[1200px]">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-8">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/shop" className="hover:text-white transition-colors">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-white font-medium">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
        {/* Media Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-[#151515] border border-white/10 relative shadow-2xl">
            <img
              src={selectedImage}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {product.tier && (
              <span className="absolute top-4 left-4 text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[#f4bb28] border border-[#f4bb28]/30">
                {product.tier} Tier
              </span>
            )}
          </div>

          {product.galleryImages && product.galleryImages.length > 0 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedImage(product.image)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                  selectedImage === product.image ? 'border-[#d81395] scale-95' : 'border-white/10 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={product.image} alt="" className="w-full h-full object-cover" />
              </button>
              {product.galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === img ? 'border-[#d81395] scale-95' : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4 mb-2">
              <span className="text-xs font-semibold text-[#f4bb28] uppercase tracking-wider">
                {product.category}
              </span>
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                aria-label="Share product"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white mb-3 leading-tight">
              {product.title}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <RatingStars rating={product.rating} size={15} />
              <span className="text-xs text-neutral-500">•</span>
              <span className="text-xs text-neutral-400">{product.reviewsCount} verified reviews</span>
              <span className="text-xs text-neutral-500">•</span>
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> On-Chain Verified
              </span>
            </div>

            <div className="bg-[#151515] border border-white/10 rounded-2xl p-5 mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-white">{formattedPrice}</span>
                <span className="text-sm font-semibold text-[#f4bb28]">({product.priceEth} ETH)</span>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Gas fees included via Ethereum L2 rollup. Token mints directly to connected wallet upon purchase.
              </p>
            </div>

            <p className="text-sm text-neutral-300 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Smart contract & Tier badge */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <span className="text-[10px] uppercase text-neutral-400 font-bold block">Token Tier</span>
                <span className="text-sm font-semibold text-white flex items-center gap-1.5 mt-0.5">
                  <Layers className="w-3.5 h-3.5 text-[#d81395]" />
                  {product.tier} Edition
                </span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <span className="text-[10px] uppercase text-neutral-400 font-bold block">Contract</span>
                <span className="text-xs font-mono text-[#f4bb28] truncate block mt-1">
                  {product.tokenContract || '0x438...991A'}
                </span>
              </div>
            </div>
          </div>

          {/* Stepper + CTA */}
          <div className="pt-6 border-t border-white/10 space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-neutral-300">Quantity:</span>
              <QuantityStepper quantity={quantity} onQuantityChange={setQuantity} />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={() => addToCart(product, quantity)}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#d81395] hover:bg-[#9a106a] text-white font-semibold text-sm shadow-[0_0_20px_rgba(216,19,149,0.3)] transition-all active:scale-98"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={() => {
                  addToCart(product, quantity);
                  navigate('/checkout');
                }}
                className="py-3.5 px-6 rounded-full bg-[#f4bb28] hover:bg-[#e3ae24] text-black font-semibold text-sm shadow-md transition-all active:scale-98"
              >
                Instant Checkout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-[#151515] border border-white/10 rounded-3xl p-6 sm:p-10 mb-16">
        <div className="flex border-b border-white/10 gap-6 mb-6">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-3 text-sm font-semibold transition-colors relative ${
              activeTab === 'description' ? 'text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Overview
            {activeTab === 'description' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d81395]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('attributes')}
            className={`pb-3 text-sm font-semibold transition-colors relative ${
              activeTab === 'attributes' ? 'text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Token Traits & Specs
            {activeTab === 'attributes' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d81395]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 text-sm font-semibold transition-colors relative ${
              activeTab === 'reviews' ? 'text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Reviews ({product.reviewsCount})
            {activeTab === 'reviews' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d81395]" />
            )}
          </button>
        </div>

        {activeTab === 'description' && (
          <div className="space-y-4 text-sm text-neutral-300 leading-relaxed max-w-3xl">
            <p>{product.description}</p>
            <p>
              Holding this production pass entitles the collector to on-chain governance access via Intyfe Snapshot voting, allowing input into casting archetypes, premiere locations, and feature screenplay iterations.
            </p>
          </div>
        )}

        {activeTab === 'attributes' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {product.attributes?.map((attr, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block">
                  {attr.trait}
                </span>
                <span className="text-sm font-bold text-[#f4bb28] block mt-1">
                  {attr.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6 max-w-2xl">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white text-xs">FilmCollector.eth</span>
                <RatingStars rating={5} size={12} showScore={false} />
              </div>
              <p className="text-xs text-neutral-300">
                "The screenplay draft included scene notes I hadn't seen in any public release. The on-chain verification was instant."
              </p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white text-xs">CinephileDAO</span>
                <RatingStars rating={5} size={12} showScore={false} />
              </div>
              <p className="text-xs text-neutral-300">
                "High quality artwork and clear rights documentation. Proud to hold this pass in our treasury."
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Related Products */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-6">Related Marketplace Passes</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};
