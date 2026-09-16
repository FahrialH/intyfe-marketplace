import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Newspaper, Plus, Search, Edit, Trash2, ExternalLink, Calendar, Star, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { getAllNewsRecords, deleteNewsArticle } from '../services/newsService';
import { NewsArticleRecord } from '../lib/supabase';
import { useCart } from '../context/CartContext';

export const AdminNews: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useCart();

  const [articles, setArticles] = useState<NewsArticleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchArticles = React.useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await getAllNewsRecords();
      setArticles(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch articles';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    getAllNewsRecords()
      .then((data) => {
        if (mounted) {
          setArticles(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (mounted) {
          const msg = err instanceof Error ? err.message : 'Failed to fetch articles';
          setErrorMsg(msg);
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      return;
    }
    setDeletingId(id);
    const res = await deleteNewsArticle(id);
    setDeletingId(null);
    if (res.success) {
      setArticles((prev) => prev.filter((a) => a.id !== id));
      showToast('Article deleted successfully.');
    } else {
      showToast(res.error || 'Failed to delete article.');
    }
  };

  const categories = useMemo(() => {
    const set = new Set(articles.map((a) => a.category));
    return ['All', ...Array.from(set)];
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCat = categoryFilter === 'All' || article.category === categoryFilter;
      const matchesSearch =
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.slug.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [articles, searchTerm, categoryFilter]);

  const featuredCount = useMemo(() => articles.filter((a) => a.featured).length, [articles]);

  return (
    <div className="pt-6 sm:pt-8 pb-20 sm:pb-24 container mx-auto px-4 max-w-[1200px]">
      {/* Top Breadcrumb & Back */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <nav className="text-xs text-neutral-400">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/account" className="hover:text-white transition-colors">Account</Link>
          <span className="mx-2">/</span>
          <span className="text-white font-medium">Admin News CMS</span>
        </nav>

        <Link
          to="/news"
          className="flex items-center gap-1.5 text-xs text-[#f4bb28] hover:underline"
        >
          <span>View Public News Feed</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 mb-8 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#f4bb28] uppercase tracking-wider mb-1">
            <Newspaper className="w-4 h-4" /> Content Management System
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            News & Editorial <span className="bg-gradient-to-r from-[#d81395] to-[#fff2c6] bg-clip-text text-transparent">Dispatches</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Create, moderate, edit, and publish blockchain filmmaking updates to Supabase
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => fetchArticles()}
            disabled={loading}
            className="px-4 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
            title="Refresh database feed"
          >
            {loading ? 'Refreshing...' : '↻ Refresh'}
          </button>

          <button
            onClick={() => navigate('/admin/news/new')}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#d81395] hover:bg-[#9a106a] text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(216,19,149,0.4)] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Dispatch</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#151515] border border-white/10 rounded-2xl p-5">
          <span className="text-xs text-neutral-400 block mb-1">Total Dispatches</span>
          <span className="text-2xl font-black text-white">{articles.length}</span>
          <span className="text-[11px] text-neutral-400 block mt-1">Live in Supabase database</span>
        </div>
        <div className="bg-[#151515] border border-white/10 rounded-2xl p-5">
          <span className="text-xs text-neutral-400 block mb-1">Featured Headlines</span>
          <span className="text-2xl font-black text-[#f4bb28]">{featuredCount}</span>
          <span className="text-[11px] text-neutral-400 block mt-1">Highlighted in hero slots</span>
        </div>
        <div className="bg-[#151515] border border-white/10 rounded-2xl p-5">
          <span className="text-xs text-neutral-400 block mb-1">Storage Bucket</span>
          <span className="text-2xl font-black text-[#d81395]">article-images</span>
          <span className="text-[11px] text-emerald-400 block mt-1">Supabase Storage CDN active</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#151515] border border-white/10 rounded-2xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search articles by title or slug..."
            className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#d81395]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? 'bg-[#d81395] text-white'
                  : 'bg-white/5 text-neutral-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Error Notice */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-300 text-xs mb-6">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#d81395] animate-spin mx-auto" />
          <p className="text-xs text-neutral-400">Loading articles from Supabase...</p>
        </div>
      ) : filteredArticles.length > 0 ? (
        /* Articles List Table / Cards */
        <div className="bg-[#151515] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="divide-y divide-white/5">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-20 h-16 sm:w-28 sm:h-20 rounded-xl object-cover border border-white/10 shrink-0 bg-neutral-900"
                  />
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-[#d81395]/20 text-[#d81395] border border-[#d81395]/30">
                        {article.category}
                      </span>
                      {article.featured && (
                        <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f4bb28]/20 text-[#f4bb28] border border-[#f4bb28]/30">
                          <Star className="w-3 h-3 fill-current" /> Featured
                        </span>
                      )}
                      <span className="text-[11px] text-neutral-500 font-mono">
                        /{article.slug}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-xl">
                      {article.title}
                    </h3>

                    <p className="text-xs text-neutral-400 line-clamp-1 max-w-xl">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-neutral-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#f4bb28]" />
                        {new Date(article.published_at).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>{article.reading_time_minutes} min read</span>
                      <span>•</span>
                      <span>By {article.author_name || 'Intyfe Staff'}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <Link
                    to={`/news/${article.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition-colors"
                    title="View live article"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => navigate(`/admin/news/edit/${article.id}`)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-[#d81395]/20 text-neutral-300 hover:text-white border border-white/10 hover:border-[#d81395] text-xs font-semibold transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5 text-[#d81395]" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(article.id, article.title)}
                    disabled={deletingId === article.id}
                    className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-300 border border-white/10 hover:border-rose-500/50 transition-colors disabled:opacity-50"
                    title="Delete article"
                  >
                    {deletingId === article.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-[#151515] border border-white/10 rounded-3xl p-8 space-y-4">
          <Sparkles className="w-8 h-8 text-[#f4bb28] mx-auto" />
          <p className="text-neutral-400 text-sm">No dispatches match your search or category filter.</p>
          <button
            onClick={() => { setSearchTerm(''); setCategoryFilter('All'); }}
            className="px-4 py-2 rounded-full bg-[#d81395] text-white text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
