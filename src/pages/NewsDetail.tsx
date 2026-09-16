import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Calendar, Clock, Share2, ArrowLeft, Tag, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { NewsCard } from '../components/features/NewsCard';
import { getNewsArticleBySlug, getNewsArticles } from '../services/newsService';
import { NewsArticle } from '../types';

export const NewsDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { showToast } = useCart();

  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchArticle = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const found = await getNewsArticleBySlug(slug);
        const all = await getNewsArticles();
        if (active) {
          setArticle(found);
          setRelatedArticles(all.filter((a) => a.slug !== slug).slice(0, 2));
        }
      } catch (err) {
        console.error('Failed to load article detail:', err);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchArticle();
    return () => {
      active = false;
    };
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Dispatch link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#d81395] animate-spin mx-auto" />
        <p className="text-xs text-neutral-400">Loading dispatch...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="pt-12 pb-24 container mx-auto px-4 max-w-lg text-center">
        <div className="bg-[#151515] border border-white/10 rounded-3xl p-8 space-y-4">
          <h2 className="text-2xl font-bold text-white">Article Not Found</h2>
          <p className="text-xs text-neutral-400">
            The requested dispatch could not be located on the Intyfe network.
          </p>
          <button
            onClick={() => navigate('/news')}
            className="px-5 py-2.5 rounded-full bg-[#d81395] text-white text-xs font-semibold"
          >
            Back to All Dispatches
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-6 sm:pt-8 pb-20 sm:pb-24 container mx-auto px-4 max-w-[900px]">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-8 overflow-x-auto scrollbar-none whitespace-nowrap">
        <Link to="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <Link to="/news" className="hover:text-white transition-colors">
          News
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="text-white font-medium truncate">{article.title}</span>
      </nav>

      {/* Back button */}
      <button
        onClick={() => navigate('/news')}
        className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-white mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to all updates</span>
      </button>

      {/* Article Header */}
      <header className="space-y-4 mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-[#d81395] text-white">
            {article.category}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <Calendar className="w-3.5 h-3.5 text-[#f4bb28]" />
            <span>{article.publishedAt}</span>
          </div>
          <span className="text-neutral-600">•</span>
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{article.readingTimeMinutes} min read</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
          {article.title}
        </h1>

        <p className="text-neutral-300 text-base sm:text-lg leading-relaxed pt-1">
          {article.excerpt}
        </p>

        {/* Author Byline Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-[#d81395]"
            />
            <div>
              <span className="block text-sm font-bold text-white">
                {article.author.name}
              </span>
              <span className="block text-xs text-neutral-400">
                {article.author.role}
              </span>
            </div>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-neutral-300 hover:text-white transition-colors cursor-pointer"
            title="Share article"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </header>

      {/* Featured Picture */}
      <div className="rounded-3xl overflow-hidden mb-10 shadow-2xl border border-white/10 aspect-video relative bg-neutral-900">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 via-transparent to-transparent" />
      </div>

      {/* Article Body */}
      <article className="prose prose-invert max-w-none text-neutral-300 leading-relaxed space-y-6 text-base sm:text-lg border-b border-white/10 pb-12">
        {article.content.split('\n\n').map((block, idx) => {
          if (block.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-xl sm:text-2xl font-bold text-white pt-4">
                {block.replace('### ', '')}
              </h3>
            );
          }
          if (block.startsWith('* ')) {
            const items = block.split('\n* ');
            return (
              <ul key={idx} className="space-y-2 pl-4 list-disc marker:text-[#d81395] text-sm sm:text-base">
                {items.map((item, itemIdx) => {
                  const cleaned = item.replace(/^\*\s*/, '');
                  return <li key={itemIdx}>{cleaned}</li>;
                })}
              </ul>
            );
          }
          if (block.match(/^\d\.\s/)) {
            const items = block.split('\n');
            return (
              <ol key={idx} className="space-y-2 pl-5 list-decimal marker:text-[#f4bb28] text-sm sm:text-base">
                {items.map((item, itemIdx) => (
                  <li key={itemIdx}>{item.replace(/^\d\.\s*/, '')}</li>
                ))}
              </ol>
            );
          }
          return (
            <p key={idx} className="leading-relaxed">
              {block}
            </p>
          );
        })}

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="pt-6 flex flex-wrap items-center gap-2">
            <span className="text-xs text-neutral-500 font-semibold flex items-center gap-1 mr-2">
              <Tag className="w-3.5 h-3.5 text-[#f4bb28]" /> Tags:
            </span>
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>

      {/* Author Bio Box */}
      <div className="my-10 p-6 sm:p-8 rounded-3xl bg-[#151515] border border-white/10 flex items-center gap-5">
        <img
          src={article.author.avatar}
          alt={article.author.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-[#d81395] shrink-0"
        />
        <div>
          <h4 className="text-base font-bold text-white">{article.author.name}</h4>
          <span className="text-xs text-[#f4bb28] font-mono">{article.author.role}</span>
          <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
            Contributing to the decentralized future of independent filmmaking, open script registries, and web3 cinema collectives.
          </p>
        </div>
      </div>

      {/* Related News / More Dispatches */}
      {relatedArticles.length > 0 && (
        <div className="mt-14">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">More Dispatches & Stories</h3>
            <Link
              to="/news"
              className="text-xs font-semibold text-[#f4bb28] hover:text-white transition-colors"
            >
              View all &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedArticles.map((rel) => (
              <NewsCard key={rel.id} article={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
