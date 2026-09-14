import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Newspaper, ChevronRight, Bell } from 'lucide-react';
import { mockNews } from '../data/mockData';
import { NewsCard } from '../components/features/NewsCard';
import { useCart } from '../context/CartContext';

export const News: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const { showToast } = useCart();

  const categories = useMemo(() => {
    const cats = new Set(mockNews.map((n) => n.category));
    return ['All', ...Array.from(cats)];
  }, []);

  const filteredNews = useMemo(() => {
    return mockNews.filter((article) => {
      const matchesCat = selectedCategory === 'All' || article.category === selectedCategory;
      const matchesSearch =
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.author.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscriberEmail) return;
    showToast('Subscribed to Intyfe Dispatch! Check your inbox for updates.');
    setSubscriberEmail('');
  };

  return (
    <div className="pt-6 sm:pt-8 pb-20 sm:pb-24 container mx-auto px-4 max-w-[1200px]">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-8">
        <Link to="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-white font-medium">News & Dispatch</span>
      </nav>

      {/* Header & Description */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#f4bb28] uppercase tracking-wider mb-1">
            <Newspaper className="w-4 h-4" /> Editorial Dispatch
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Latest News &{' '}
            <span className="bg-gradient-to-r from-[#d81395] to-[#fff2c6] bg-clip-text text-transparent">
              Updates
            </span>
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
            The official chronicle of Intyfe protocol developments, community governance votes, and decentralized cinema milestones.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search dispatches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#151515] border border-white/10 rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#d81395] w-full sm:w-64"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-[#d81395] text-white shadow-[0_0_15px_rgba(216,19,149,0.35)]'
                : 'bg-[#151515] text-neutral-400 hover:text-white border border-white/10 hover:border-white/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* News Grid */}
      {filteredNews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {filteredNews.map((article, idx) => (
            <NewsCard
              key={article.id}
              article={article}
              featured={idx === 0 && selectedCategory === 'All' && !searchTerm}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#151515] border border-white/10 rounded-3xl p-8 mb-16">
          <p className="text-neutral-400 text-sm">
            No updates found matching your search.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}
            className="mt-4 px-5 py-2 rounded-full bg-[#d81395] text-white text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Dispatch Newsletter Subscription Card */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#180a15] via-[#151515] to-[#0a0a0a] border border-[#d81395]/30 p-8 sm:p-12 shadow-[0_0_40px_rgba(216,19,149,0.15)]">
        <div className="max-w-xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#d81395]/10 text-[#d81395] mx-auto border border-[#d81395]/30">
            <Bell className="w-6 h-6" />
          </div>

          <span className="text-xs uppercase font-mono font-bold tracking-widest text-[#f4bb28] block">
            INTYFE DISPATCH NEWSLETTER
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Never miss an on-chain script drop or governance vote
          </h2>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Get our weekly digest covering new screenplay registries, greenlight milestones, and community screening invitations.
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 pt-2 max-w-md mx-auto">
            <input
              type="email"
              required
              value={subscriberEmail}
              onChange={(e) => setSubscriberEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 bg-white/5 border border-white/15 rounded-full px-5 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#d81395]"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-[#d81395] hover:bg-[#9a106a] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(216,19,149,0.4)] active:scale-98 shrink-0"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
