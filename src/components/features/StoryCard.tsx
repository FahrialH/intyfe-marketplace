import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, BookOpen } from 'lucide-react';
import { Story } from '../../types';
import { useCart } from '../../context/CartContext';

interface StoryCardProps {
  story: Story;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story }) => {
  const [liked, setLiked] = useState(false);
  const { showToast } = useCart();

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    setLiked(!liked);
    showToast(liked ? `Removed ${story.title} from favorites` : `Added ${story.title} to favorites!`);
  };

  return (
    <div className="relative flex flex-col justify-between bg-[#151515] border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-[#d81395]/40 hover:shadow-[0_15px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(216,19,149,0.15)] group min-w-0">
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-neutral-900">
        <img
          src={story.coverImage}
          alt={story.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 z-20 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          <button
            onClick={handleLike}
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-md ${
              liked
                ? 'bg-[#d81395] text-white'
                : 'bg-black/60 text-white/80 hover:bg-[#d81395] hover:text-white'
            }`}
            aria-label="Favorite story"
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
          </button>
        </div>
        <div className="absolute bottom-2.5 left-2.5 z-10">
          <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[#f4bb28] border border-[#f4bb28]/30">
            {story.genre}
          </span>
        </div>
      </div>

      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-3.5 bg-[#151515]">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white line-clamp-2 mb-1 group-hover:text-[#d81395] transition-colors">
            <Link to={`/story/${story.slug}`}>{story.title}</Link>
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 line-clamp-2 leading-relaxed">{story.logline}</p>
        </div>

        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <img
            src={story.author.avatar}
            alt={story.author.name}
            className="w-5 h-5 rounded-full object-cover"
          />
          <span className="truncate">{story.author.name}</span>
          <span className="text-neutral-600">•</span>
          <span>{story.readingTimeMinutes} min read</span>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-white/10 mt-2">
          <div className="flex flex-col">
            <span className="text-sm font-bold bg-gradient-to-r from-[#d81395] to-[#fff2c6] bg-clip-text text-transparent">
              {story.mintPriceEth} ETH
            </span>
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider">
              Mint Price
            </span>
          </div>

          <Link
            to={`/story/${story.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#f4bb28] hover:text-[#fff2c6] transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" /> Read Script
          </Link>
        </div>
      </div>
    </div>
  );
};
