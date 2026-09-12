import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, Compass, ChevronRight } from 'lucide-react';
import { mockStories } from '../data/mockData';
import { StoryCard } from '../components/features/StoryCard';

export const Stories: React.FC = () => {
  const [selectedGenre, setSelectedGenre] = useState<string>('All Genres');
  const [searchTerm, setSearchTerm] = useState('');

  const featuredStory = mockStories[0];

  const genres = ['All Genres', 'Noir Western', 'Sci-Fi / Cyberpunk', 'Hard Sci-Fi', 'Epic Space Drama'];

  const filteredStories = useMemo(() => {
    return mockStories.filter((s) => {
      const matchesGenre = selectedGenre === 'All Genres' || s.genre === selectedGenre;
      const matchesSearch =
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.logline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.synopsis.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesGenre && matchesSearch;
    });
  }, [selectedGenre, searchTerm]);

  return (
    <div className="pt-32 pb-24 container mx-auto px-4 max-w-[1200px]">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-8">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-white font-medium">Stories & Screenplays Archive</span>
      </nav>

      {/* Featured Hero Story Banner */}
      {featuredStory && (
        <div className="relative rounded-3xl overflow-hidden bg-[#151515] border border-white/10 mb-16 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 p-6 sm:p-12 space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-[#d81395] text-white text-xs font-semibold uppercase tracking-wider">
                  Featured Story
                </span>
                <span className="text-xs font-mono text-[#f4bb28] bg-black/50 px-2.5 py-1 rounded-full border border-[#f4bb28]/30">
                  {featuredStory.genre}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
                {featuredStory.title}
              </h1>

              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed max-w-xl">
                {featuredStory.logline}
              </p>

              <div className="flex items-center gap-4 text-xs text-neutral-400 pt-1">
                <span>By <strong className="text-white">{featuredStory.author.name}</strong></span>
                <span>•</span>
                <span>{featuredStory.readingTimeMinutes} min reading time</span>
                <span>•</span>
                <span>{featuredStory.pagesCount} Screenplay Pages</span>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  to={`/story/${featuredStory.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#d81395] hover:bg-[#9a106a] text-white text-sm font-semibold shadow-[0_0_20px_rgba(216,19,149,0.3)] transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Read Script Excerpt</span>
                </Link>
                <Link
                  to="/shop"
                  className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium border border-white/15 transition-colors"
                >
                  View NFT Tiers
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 h-72 sm:h-96 lg:h-full relative overflow-hidden">
              <img
                src={featuredStory.coverImage}
                alt={featuredStory.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#151515] via-transparent to-transparent" />
            </div>
          </div>
        </div>
      )}

      {/* Archive Header & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#f4bb28] uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" /> Screenplay Registry
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Production <span className="bg-gradient-to-r from-[#d81395] to-[#fff2c6] bg-clip-text text-transparent">Archive</span>
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm mt-0.5">
            Browse active story universes, community-funded scripts, and minted chapters
          </p>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search scripts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#151515] border border-white/10 rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#d81395] w-full sm:w-60"
          />
        </div>
      </div>

      {/* Genre Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {genres.map((g) => (
          <button
            key={g}
            onClick={() => setSelectedGenre(g)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedGenre === g
                ? 'bg-[#d81395] text-white shadow-[0_0_15px_rgba(216,19,149,0.3)]'
                : 'bg-[#151515] text-neutral-400 hover:text-white border border-white/10 hover:border-white/20'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Stories Grid */}
      {filteredStories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#151515] border border-white/10 rounded-3xl p-8">
          <p className="text-neutral-400 text-sm">No stories found matching your filter.</p>
        </div>
      )}
    </div>
  );
};
