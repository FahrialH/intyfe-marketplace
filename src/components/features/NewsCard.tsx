import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { NewsArticle } from '../../types';

interface NewsCardProps {
  article: NewsArticle;
  featured?: boolean;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article, featured = false }) => {
  return (
    <article
      className={`group relative flex flex-col justify-between bg-[#151515] border border-white/10 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-[#d81395]/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6),0_0_25px_rgba(216,19,149,0.15)] min-w-0 ${
        featured ? 'lg:col-span-2' : ''
      }`}
    >
      <div>
        {/* News Picture Container */}
        <Link
          to={`/news/${article.slug}`}
          className={`block relative overflow-hidden bg-neutral-900 ${
            featured ? 'aspect-video lg:aspect-[21/9]' : 'aspect-video'
          }`}
        >
          <img
            src={article.image}
            alt={article.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {/* Subtle cinematic gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-transparent to-black/20" />

          {/* Category & Featured Badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-[#f4bb28] border border-[#f4bb28]/40 shadow-lg">
              {article.category}
            </span>
            {article.featured && (
              <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#d81395] text-white shadow-lg">
                <Sparkles className="w-3 h-3" /> Featured
              </span>
            )}
          </div>
        </Link>

        {/* Content Box */}
        <div className="p-6 sm:p-8 flex flex-col gap-3">
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#f4bb28]" />
              <span>{article.publishedAt}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              <span>{article.readingTimeMinutes} min read</span>
            </div>
          </div>

          {/* Headline */}
          <h2
            className={`font-extrabold text-white leading-snug tracking-tight transition-colors group-hover:text-[#d81395] ${
              featured ? 'text-xl sm:text-3xl' : 'text-lg sm:text-2xl'
            }`}
          >
            <Link to={`/news/${article.slug}`}>{article.title}</Link>
          </h2>

          {/* Excerpt */}
          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed line-clamp-3">
            {article.excerpt}
          </p>
        </div>
      </div>

      {/* Footer / Author & CTA */}
      <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-2 flex items-center justify-between border-t border-white/5 mt-2">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={article.author.avatar}
            alt={article.author.name}
            className="w-8 h-8 rounded-full object-cover border border-white/20 shrink-0"
          />
          <div className="min-w-0">
            <span className="block text-xs font-semibold text-white truncate">
              {article.author.name}
            </span>
            <span className="block text-[11px] text-neutral-500 truncate">
              {article.author.role}
            </span>
          </div>
        </div>

        <Link
          to={`/news/${article.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#f4bb28] hover:text-white transition-colors shrink-0 ml-4 group/link"
        >
          <span>Read Dispatch</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
        </Link>
      </div>
    </article>
  );
};
