import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Calendar, Clock, Layers, Bolt, UserCheck, Share2 } from 'lucide-react';
import { mockStories, mockProducts } from '../data/mockData';
import { ScriptReader } from '../components/features/ScriptReader';
import { useCart } from '../context/CartContext';

export const StoryDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart, showToast } = useCart();

  const story = mockStories.find((s) => s.slug === slug) || mockStories[0];
  const matchingProduct = mockProducts[0];

  const handleMint = () => {
    addToCart(matchingProduct, 1);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Story link copied to clipboard!');
  };

  return (
    <div className="pt-32 pb-24 container mx-auto px-4 max-w-[900px]">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-8">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/stories" className="hover:text-white transition-colors">Stories</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-white font-medium">{story.title}</span>
      </nav>

      {/* Story Header */}
      <header className="text-center space-y-4 mb-10">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-[#d81395] text-white">
            {story.genre}
          </span>
          <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-[#f4bb28] text-black">
            Active Chapter
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          {story.title}
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-neutral-400 pt-1">
          <Link
            to={`/store/${story.author.name.toLowerCase().includes('check') ? 'check01' : 'arvicki'}`}
            className="flex items-center gap-1.5 text-white hover:text-[#d81395] transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-[#d81395]" />
            <span>{story.author.name}</span>
          </Link>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Dec 2025
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {story.readingTimeMinutes} min read
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> {story.editionMinted} / {story.editionTotal} Passes Minted
          </span>
        </div>
      </header>

      {/* Cover Image */}
      <div className="rounded-3xl overflow-hidden mb-12 shadow-2xl border border-white/10 aspect-video relative">
        <img
          src={story.coverImage}
          alt={story.title}
          className="w-full h-full object-cover"
        />
        <button
          onClick={handleShare}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-[#d81395] text-white backdrop-blur-md transition-colors"
          aria-label="Share story"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Narrative Body */}
      <article className="prose prose-invert max-w-none text-neutral-300 leading-relaxed space-y-6 text-base sm:text-lg">
        <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-[#d81395] first-letter:mr-3 first-letter:float-left">
          {story.synopsis}
        </p>

        <blockquote className="my-8 border-l-4 border-[#d81395] pl-6 py-2 italic text-lg sm:text-xl font-serif text-white bg-white/5 rounded-r-2xl">
          "A contract signed in blood can only ever be voided at high noon." — Cole Vance
        </blockquote>

        <p>
          Every token tier of this story provides executive voting weight on Cole's fate in the upcoming feature adaptation. Community holders will determine whether Scene 13 culminates in an alliance or an explosive standoff.
        </p>

        {/* Script Reader Component */}
        <ScriptReader story={story} />

        {/* Collector Action Card */}
        <div className="bg-[#151515] border border-[#d81395]/40 rounded-3xl p-6 sm:p-8 my-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(216,19,149,0.15)]">
          <div>
            <span className="text-xs uppercase font-mono text-[#f4bb28] tracking-wider block mb-1">
              PRODUCTION TIER #01 PASS
            </span>
            <h3 className="text-xl font-bold text-white mb-1">
              Collect Official Screenplay Pass
            </h3>
            <p className="text-xs text-neutral-400 max-w-md">
              Includes printable HD screenplay PDF, signed concept artwork NFT, and 1 community producer vote.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <span className="block text-xl font-extrabold text-[#f4bb28]">{story.mintPriceEth} ETH</span>
              <span className="text-[11px] text-neutral-400">≈ ${story.mintPriceUsd} USD</span>
            </div>
            <button
              onClick={handleMint}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#d81395] hover:bg-[#9a106a] text-white font-semibold text-xs sm:text-sm shadow-[0_0_15px_rgba(216,19,149,0.4)] transition-all active:scale-98"
            >
              <Bolt className="w-4 h-4" />
              <span>Mint Pass</span>
            </button>
          </div>
        </div>

        {/* Creator card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4">
          <img
            src={story.author.avatar}
            alt={story.author.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-[#d81395]"
          />
          <div>
            <h4 className="text-white font-bold text-base">{story.author.name}</h4>
            <p className="text-xs text-neutral-400 mt-0.5">
              Independent decentralized narrative studio. Verified on Intyfe blockchain ledger.
            </p>
            <Link
              to={`/store/${story.author.name.toLowerCase().includes('check') ? 'check01' : 'arvicki'}`}
              className="text-xs font-semibold text-[#f4bb28] hover:underline inline-block mt-2"
            >
              View Studio Profile & Catalog →
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};
