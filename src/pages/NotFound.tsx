import React from 'react';
import { Link } from 'react-router-dom';
import { Film, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="pt-10 sm:pt-14 pb-20 sm:pb-24 container mx-auto px-4 max-w-[600px] text-center">
      <div className="bg-[#151515] border border-white/10 rounded-3xl p-10 sm:p-14 space-y-6 shadow-2xl">
        <div className="w-20 h-20 rounded-full bg-[#d81395]/10 text-[#d81395] flex items-center justify-center mx-auto">
          <Film className="w-10 h-10" />
        </div>

        <span className="text-xs font-mono text-[#f4bb28] tracking-widest uppercase block">
          404 ERROR — SCENE CUT
        </span>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Screenplay Not Found
        </h1>

        <p className="text-neutral-400 text-sm leading-relaxed max-w-sm mx-auto">
          The page or asset you are looking for has been moved or does not exist in the decentralized ledger.
        </p>

        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#d81395] hover:bg-[#9a106a] text-white text-xs sm:text-sm font-semibold shadow-md transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
