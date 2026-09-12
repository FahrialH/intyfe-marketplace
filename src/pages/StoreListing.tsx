import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, Store } from 'lucide-react';
import { mockStudios } from '../data/mockData';
import { StudioCard } from '../components/features/StudioCard';

export const StoreListing: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('most_recent');

  const filteredStudios = useMemo(() => {
    return mockStudios
      .filter((s) => {
        return (
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.tagline.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
      .sort((a, b) => {
        if (sortBy === 'total_orders') return b.totalVolumeEth - a.totalVolumeEth;
        return 0;
      });
  }, [searchTerm, sortBy]);

  return (
    <div className="pt-32 pb-24 container mx-auto px-4 max-w-[1200px]">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-8">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-white font-medium">Verified Studios & Writers</span>
      </nav>

      {/* Header & Description */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#f4bb28] uppercase tracking-wider mb-1">
            <Store className="w-4 h-4" /> Creator Directory
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Verified <span className="bg-gradient-to-r from-[#d81395] to-[#fff2c6] bg-clip-text text-transparent">Studios & Writers</span>
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm mt-1">
            Total verified creators on Intyfe: {mockStudios.length}
          </p>
        </div>

        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search studios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#151515] border border-white/10 rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#d81395] w-full sm:w-56"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#151515] border border-white/10 rounded-full px-4 py-2 text-xs text-white focus:outline-none cursor-pointer"
          >
            <option value="most_recent">Most Recent</option>
            <option value="total_orders">Highest Volume</option>
          </select>
        </div>
      </div>

      {/* Studios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredStudios.map((studio) => (
          <StudioCard key={studio.id} studio={studio} />
        ))}
      </div>
    </div>
  );
};
