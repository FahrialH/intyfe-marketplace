import React, { useState } from 'react';
import { Copy, Check, FileText } from 'lucide-react';
import { Story } from '../../types';

interface ScriptReaderProps {
  story: Story;
}

export const ScriptReader: React.FC<ScriptReaderProps> = ({ story }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `
${story.scriptExcerpt.scene}

${story.scriptExcerpt.action}

${story.scriptExcerpt.dialogue
  .map(
    (d) => `${d.character}${d.parenthetical ? `\n(${d.parenthetical})` : ''}\n"${d.line}"`
  )
  .join('\n\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full my-8 bg-[#111111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
      {/* Script header toolbar */}
      <div className="bg-[#181818] px-6 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <FileText className="w-4 h-4 text-[#f4bb28]" />
          <span>OFFICIAL SCREENPLAY EXCERPT</span>
          <span className="text-neutral-600">•</span>
          <span className="text-[#d81395] font-semibold">{story.title.toUpperCase()}.FDX</span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy excerpt</span>
            </>
          )}
        </button>
      </div>

      {/* Screenplay Content Body */}
      <div className="p-6 sm:p-10 font-mono text-sm sm:text-base leading-relaxed text-neutral-200 selection:bg-[#f4bb28] selection:text-black">
        {/* Scene Heading */}
        <div className="text-[#f4bb28] font-bold tracking-wider mb-4 pb-1 border-b border-white/5">
          {story.scriptExcerpt.scene}
        </div>

        {/* Action description */}
        <p className="mb-6 text-neutral-300 max-w-2xl leading-relaxed">
          {story.scriptExcerpt.action}
        </p>

        {/* Dialogue Blocks */}
        <div className="flex flex-col gap-5 my-6 max-w-xl mx-auto pl-4 sm:pl-10">
          {story.scriptExcerpt.dialogue.map((dialogue, idx) => (
            <div key={idx} className="flex flex-col">
              <span className="font-bold tracking-widest text-[#d81395] text-xs sm:text-sm uppercase text-center sm:text-left">
                {dialogue.character}
              </span>
              {dialogue.parenthetical && (
                <span className="text-neutral-400 text-xs italic text-center sm:text-left">
                  ({dialogue.parenthetical})
                </span>
              )}
              <p className="mt-1 text-white sm:pl-4 text-center sm:text-left leading-relaxed">
                "{dialogue.line}"
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-4 border-t border-dashed border-white/10 text-center text-xs text-neutral-500">
          [END OF EXCERPT — FULL {story.pagesCount}-PAGE SCRIPT AVAILABLE WITH TIER NFT]
        </div>
      </div>
    </div>
  );
};
