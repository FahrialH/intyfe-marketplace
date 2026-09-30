import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, Store, Loader2, PlusCircle } from 'lucide-react';
import { StudioCard } from '../components/features/StudioCard';
import { getAllSellers } from '../services/sellerService';
import { Studio } from '../types';
import { useAuth } from '../context/AuthContext';

export const StoreListing: React.FC = () => {
  const { isSeller } = useAuth();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('most_recent');

  useEffect(() => {
    let mounted = true;
    getAllSellers()
      .then((data) => {
        if (mounted) setStudios(data);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const filteredStudios = useMemo(() => {
    return studios
      .filter((s) => {
        return (
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.tagline.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
      .sort((a, b) => {
        if (sortBy === 'total_orders') return b.totalVolumeSol - a.totalVolumeSol;
        return 0;
      });
  }, [studios, searchTerm, sortBy]);

  return (
    <div className="pt-6 sm:pt-8 pb-20 sm:pb-24 container mx-auto px-4 max-w-[1200px]">
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
            Browse verified filmmakers, screenwriters, and production houses on Intyfe ({studios.length} studios)
          </p>
        </div>

        {/* Search, Sort & Creator CTA */}
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

          {isSeller && (
            <Link
              to="/seller/profile"
              className="px-4 py-2 rounded-full bg-[#d81395] hover:bg-[#9a106a] text-white text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>My Store</span>
            </Link>
          )}
        </div>
      </div>

      {/* Studios Grid */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-[#d81395] animate-spin" />
          <p className="text-xs text-neutral-400">Loading creator directory...</p>
        </div>
      ) : filteredStudios.length === 0 ? (
        <div className="text-center py-16 bg-[#151515] border border-white/10 rounded-3xl p-8">
          <Store className="w-10 h-10 text-neutral-500 mx-auto mb-2" />
          <p className="text-neutral-400 text-sm">No creators found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStudios.map((studio) => (
            <StudioCard key={studio.id} studio={studio} />
          ))}
        </div>
      )}
    </div>
  );
};
