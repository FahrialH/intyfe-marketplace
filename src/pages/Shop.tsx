import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { mockProducts } from '../data/mockData';
import { ProductCard } from '../components/features/ProductCard';

export const Shop: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('menu_order');

  const categories = useMemo(() => {
    const cats = new Set(mockProducts.map((p) => p.category));
    return ['All', ...Array.from(cats)];
  }, []);

  const filteredProducts = useMemo(() => {
    return mockProducts
      .filter((p) => {
        const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesSearch =
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCat && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'popularity') return b.reviewsCount - a.reviewsCount;
        return 0;
      });
  }, [searchTerm, selectedCategory, sortBy]);

  return (
    <div className="pt-32 pb-24 container mx-auto px-4 max-w-[1200px]">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-8">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-white font-medium">Marketplace Catalog</span>
      </nav>

      {/* Header & Description */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Marketplace <span className="bg-gradient-to-r from-[#d81395] to-[#fff2c6] bg-clip-text text-transparent">Catalog</span>
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            Showing active film scripts, collectibles, and production passes
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#151515] border border-white/10 rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#d81395] w-full sm:w-56"
            />
          </div>

          <div className="flex items-center gap-2 bg-[#151515] border border-white/10 rounded-full px-4 py-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-xs text-neutral-400 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer pr-2"
            >
              <option value="menu_order" className="bg-[#151515] text-white">Default</option>
              <option value="popularity" className="bg-[#151515] text-white">Popularity</option>
              <option value="rating" className="bg-[#151515] text-white">Average Rating</option>
              <option value="price-asc" className="bg-[#151515] text-white">Price: Low to High</option>
              <option value="price-desc" className="bg-[#151515] text-white">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-[#d81395] text-white shadow-[0_0_15px_rgba(216,19,149,0.3)]'
                : 'bg-[#151515] text-neutral-400 hover:text-white border border-white/10 hover:border-white/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-[#151515] border border-white/10 rounded-3xl p-8">
          <p className="text-neutral-400 text-sm">No items found matching your filters.</p>
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
    </div>
  );
};
