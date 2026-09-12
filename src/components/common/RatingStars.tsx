import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  maxStars?: number;
  size?: number;
  showScore?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxStars = 5,
  size = 14,
  showScore = true,
}) => {
  return (
    <div className="flex items-center gap-1.5 text-[#f4bb28]">
      <div className="flex items-center">
        {Array.from({ length: maxStars }).map((_, i) => {
          const filled = i < Math.floor(rating);
          const isHalf = !filled && i < rating;
          return (
            <Star
              key={i}
              size={size}
              className={
                filled
                  ? 'fill-[#f4bb28] text-[#f4bb28]'
                  : isHalf
                  ? 'fill-[#f4bb28]/50 text-[#f4bb28]'
                  : 'text-neutral-600'
              }
            />
          );
        })}
      </div>
      {showScore && (
        <span className="text-xs text-neutral-400 font-medium">({rating.toFixed(1)})</span>
      )}
    </div>
  );
};
