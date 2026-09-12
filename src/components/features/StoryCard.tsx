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
    <div className="card-story group">
      <div className="card-story-image-wrap relative">
        <img
          src={story.coverImage}
          alt={story.title}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="card-hover-action">
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

      <div className="card-story-body">
        <div>
          <h3 className="card-story-title">
            <Link to={`/story/${story.slug}`}>{story.title}</Link>
          </h3>
          <p className="card-story-desc line-clamp-2">{story.logline}</p>
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

        <div className="card-metrics">
          <div className="metric-item flex flex-col">
            <span className="metric-value font-bold text-white text-sm">
              {story.mintPriceEth} ETH
            </span>
            <span className="metric-label text-[11px] text-neutral-500 uppercase tracking-wider">
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
