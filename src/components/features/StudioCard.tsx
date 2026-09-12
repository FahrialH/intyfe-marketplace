import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, CheckCircle2, Film } from 'lucide-react';
import { Studio } from '../../types';
import { RatingStars } from '../common/RatingStars';

interface StudioCardProps {
  studio: Studio;
}

export const StudioCard: React.FC<StudioCardProps> = ({ studio }) => {
  return (
    <div className="vendor-card bg-[#151515] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-[#d81395]/40 hover:shadow-xl">
      <div>
        {/* Banner with avatar */}
        <div className="relative h-28 w-full bg-neutral-800">
          <img
            src={studio.bannerImage}
            alt={`${studio.name} banner`}
            className="w-full h-full object-cover"
          />
          <div className="absolute -bottom-6 left-5 w-14 h-14 rounded-full border-2 border-[#151515] overflow-hidden bg-black shadow-lg">
            <img
              src={studio.avatarImage}
              alt={studio.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div className="pt-8 px-5 pb-4">
          <div className="flex items-center gap-1.5 mb-1">
            <h2 className="text-lg font-bold text-white hover:text-[#d81395] transition-colors">
              <Link to={`/store/${studio.slug}`}>{studio.name}</Link>
            </h2>
            {studio.verified && (
              <span title="Verified Creator">
                <CheckCircle2 className="w-4 h-4 text-[#f4bb28] shrink-0" />
              </span>
            )}
          </div>

          <div className="mb-2">
            <RatingStars rating={5.0} size={12} showScore={true} />
          </div>

          <p className="text-xs text-neutral-400 line-clamp-2 mb-3">
            {studio.tagline}
          </p>

          <div className="flex items-start gap-1.5 text-xs text-neutral-400">
            <MapPin className="w-3.5 h-3.5 text-[#d81395] shrink-0 mt-0.5" />
            <span className="line-clamp-1">{studio.location}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/10 text-center">
            <div className="bg-white/5 rounded-lg py-1.5 px-2">
              <span className="block text-xs font-bold text-white">{studio.totalStories}</span>
              <span className="text-[10px] text-neutral-400 uppercase">Stories</span>
            </div>
            <div className="bg-white/5 rounded-lg py-1.5 px-2">
              <span className="block text-xs font-bold text-[#f4bb28]">{studio.totalVolumeEth} ETH</span>
              <span className="text-[10px] text-neutral-400 uppercase">Volume</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 pt-2">
        <Link
          to={`/store/${studio.slug}`}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-[#d81395] hover:bg-[#9a106a] text-white text-xs font-semibold transition-colors"
        >
          <Film className="w-3.5 h-3.5" />
          <span>Visit Studio</span>
        </Link>
      </div>
    </div>
  );
};
