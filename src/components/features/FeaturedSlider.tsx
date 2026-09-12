import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, Star } from 'lucide-react';
import { CarouselSlide } from '../../types';

interface FeaturedSliderProps {
  slides: CarouselSlide[];
}

export const FeaturedSlider: React.FC<FeaturedSliderProps> = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (isPaused) return;
    autoPlayRef.current = setInterval(nextSlide, 5000);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPaused, slides.length]);

  if (!slides || slides.length === 0) return null;

  const activeSlide = slides[currentIndex];
  const progressPercentage = ((currentIndex + 1) / slides.length) * 100;

  return (
    <div
      className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#151515] group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slide Hero Media Container */}
      <div className="relative h-[460px] sm:h-[520px] w-full overflow-hidden">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center"
            />
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/90 via-[#0a0a0a]/30 to-transparent" />
          </div>
        ))}

        {/* Content Box Over Slide */}
        <div className="absolute bottom-8 left-6 sm:left-12 max-w-xl z-20">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-[#d81395] text-white shadow-lg">
              {activeSlide.badgeText}
            </span>
            <span className="flex items-center gap-1 text-xs text-[#f4bb28] bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#f4bb28]/30">
              <Star className="w-3.5 h-3.5 fill-current" />
              {activeSlide.rating}
            </span>
            <span className="text-xs text-neutral-300 font-medium">
              {activeSlide.status}
            </span>
          </div>

          <span className="text-sm font-semibold text-[#f4bb28] tracking-wider uppercase">
            {activeSlide.subtitle}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1 mb-3 leading-tight tracking-tight">
            {activeSlide.title}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 line-clamp-3 mb-6 leading-relaxed">
            {activeSlide.description}
          </p>

          <div className="flex items-center gap-4">
            <Link
              to={activeSlide.link}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#d81395] hover:bg-[#9a106a] text-white text-xs sm:text-sm font-semibold shadow-[0_0_20px_rgba(216,19,149,0.4)] transition-all"
            >
              <Play className="w-4 h-4 fill-current" /> Read Screenplay
            </Link>
            <Link
              to="/shop"
              className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium border border-white/20 backdrop-blur-md transition-all"
            >
              NFT Tiers
            </Link>
          </div>
        </div>

        {/* Slide Controls Top-Right */}
        <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
          <button
            onClick={prevSlide}
            className="w-10 h-10 rounded-full bg-black/60 hover:bg-[#d81395] text-white flex items-center justify-center border border-white/20 backdrop-blur-md transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="w-10 h-10 rounded-full bg-black/60 hover:bg-[#d81395] text-white flex items-center justify-center border border-white/20 backdrop-blur-md transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Slide Indicators & Animated Progress Bar */}
      <div className="px-6 py-4 bg-[#0e0e0e] flex items-center justify-between gap-4 border-t border-white/5">
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <span className="text-white font-bold">0{currentIndex + 1}</span>
          <span>/</span>
          <span>0{slides.length}</span>
        </div>

        <div className="flex-1 max-w-xs h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#d81395] to-[#f4bb28] transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="flex gap-1.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex ? 'w-6 bg-[#d81395]' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
