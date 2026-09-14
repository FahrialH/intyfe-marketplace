import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Flame, Compass, ShoppingBag } from 'lucide-react';
import { featuredSlides, mockStories, mockProducts } from '../data/mockData';
import { FeaturedSlider } from '../components/features/FeaturedSlider';
import { TabSwitcher } from '../components/features/TabSwitcher';
import { StoryCard } from '../components/features/StoryCard';
import { ProductCard } from '../components/features/ProductCard';

export const Home: React.FC = () => {
  return (
    <div className="space-y-16 sm:space-y-20 pb-16">
      {/* ==========================================================================
          Hero Section
          ========================================================================== */}
      <section className="relative pt-6 sm:pt-10 pb-8 sm:pb-12 overflow-hidden">
        {/* Background glow circle */}
        <div className="absolute top-6 right-1/4 w-96 h-96 bg-[#d81395]/15 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-24 left-10 w-72 h-72 bg-[#f4bb28]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="container mx-auto px-4 max-w-[1200px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-5 sm:space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#f4bb28]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>All about your vision</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                Stop pitching to gatekeepers.{' '}
                <span className="bg-gradient-to-r from-[#d81395] to-[#fff2c6] bg-clip-text text-transparent">
                  Start publishing to your audience.
                </span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-neutral-300 max-w-xl leading-relaxed">
                The first decentralized studio for scripts, characters, and the stories that define us. Fund, greenlight, and co-own cinema on the blockchain.
              </p>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-[#d81395] hover:bg-[#9a106a] text-white font-semibold text-xs sm:text-sm shadow-[0_0_25px_rgba(216,19,149,0.4)] transition-all hover:scale-105"
                >
                  <span>Start Chapter</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/stories"
                  className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-white font-semibold text-xs sm:text-sm border border-white/15 backdrop-blur-md transition-all"
                >
                  Explore Archive
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
                <img
                  src="/assets/images/website-main-cover-1024x538.jpg"
                  alt="Cinematic Film Production"
                  className="w-full h-72 sm:h-96 object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1.5 sm:gap-2 bg-black/70 backdrop-blur-md px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-emerald-500/30 text-[11px] sm:text-xs font-semibold text-white">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Decentralized Studio Live</span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-black/60 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-white/10">
                  <span className="text-[11px] sm:text-xs text-[#f4bb28] font-mono">FEATURE PRODUCTION #89</span>
                  <h4 className="text-white font-bold text-sm mt-0.5">The Silent Frequency</h4>
                  <p className="text-neutral-400 text-xs mt-1">Written by Dr. Thorne • 74 Holders Funded</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          Now Showing Carousel Section
          ========================================================================== */}
      <section className="container mx-auto px-4 max-w-[1200px]">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#d81395] mb-2">
            <Flame className="w-4 h-4" /> Live Feature Reels
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Now <span className="bg-gradient-to-r from-[#d81395] to-[#fff2c6] bg-clip-text text-transparent">Showing</span>
          </h2>
          <p className="text-neutral-400 text-sm mt-2">
            Explore active productions, screenplays with ongoing community funding, and studio slate milestones.
          </p>
        </div>

        <FeaturedSlider slides={featuredSlides} />
      </section>

      {/* ==========================================================================
          Script-to-Screen Workflow (TabSwitcher)
          ========================================================================== */}
      <section className="container mx-auto px-4 max-w-[1200px]">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Script-to-Screen <span className="bg-gradient-to-r from-[#d81395] to-[#fff2c6] bg-clip-text text-transparent">Architecture</span>
          </h2>
          <p className="text-neutral-400 text-sm mt-2">
            How writers, production studios, and film enthusiasts collaborate to produce cinema without Hollywood intermediaries.
          </p>
        </div>

        <TabSwitcher />
      </section>

      {/* ==========================================================================
          Latest Screenplays & Stories Showcase
          ========================================================================== */}
      <section className="container mx-auto px-4 max-w-[1200px]">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#f4bb28] uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4" /> Literary Archive
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Trending <span className="bg-gradient-to-r from-[#d81395] to-[#fff2c6] bg-clip-text text-transparent">Stories & Scripts</span>
            </h2>
          </div>
          <Link
            to="/stories"
            className="text-xs font-semibold text-[#f4bb28] hover:text-[#fff2c6] flex items-center gap-1.5 transition-colors"
          >
            <span>View All Stories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockStories.slice(0, 3).map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </section>

      {/* ==========================================================================
          Featured Marketplace Passes & Assets
          ========================================================================== */}
      <section className="container mx-auto px-4 max-w-[1200px]">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#d81395] uppercase tracking-wider mb-1">
              <ShoppingBag className="w-4 h-4" /> Official Marketplace
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Screenplay Tiers & <span className="bg-gradient-to-r from-[#d81395] to-[#fff2c6] bg-clip-text text-transparent">Collectibles</span>
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-semibold text-[#f4bb28] hover:text-[#fff2c6] flex items-center gap-1.5 transition-colors"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ==========================================================================
          CTA Banner
          ========================================================================== */}
      <section className="container mx-auto px-4 max-w-[1200px]">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 bg-gradient-to-r from-[#180a15] via-[#151515] to-[#0a0a0a] border border-[#d81395]/30 text-center shadow-[0_0_50px_rgba(216,19,149,0.15)]">
          <div className="max-w-2xl mx-auto space-y-5">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Ready to mint your next screenplay or invest in cinema history?
            </h2>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              Join thousands of creators, filmmakers, and collectors building the decentralized future of film entertainment.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link
                to="/account"
                className="px-8 py-3.5 rounded-full bg-[#d81395] hover:bg-[#9a106a] text-white font-semibold text-sm shadow-[0_0_25px_rgba(216,19,149,0.5)] transition-all hover:scale-105"
              >
                Join As Creator
              </Link>
              <Link
                to="/shop"
                className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all"
              >
                Start Collecting
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
