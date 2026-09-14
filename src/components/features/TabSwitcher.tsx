import React, { useState } from 'react';
import { PenTool, Film, Coins, ShieldCheck, Sparkles } from 'lucide-react';

interface TabContent {
  id: string;
  label: string;
  icon: React.ReactNode;
  heading: string;
  description: string;
  bulletPoints: string[];
  ctaText: string;
  ctaLink: string;
  image: string;
}

const tabs: TabContent[] = [
  {
    id: 'writers',
    label: 'For Screenwriters',
    icon: <PenTool className="w-4 h-4" />,
    heading: 'Publish your scripts directly to verified film audiences',
    description: 'Bypass traditional agency gatekeepers. Mint timestamped screenplay drafts to the blockchain to prove prior art and retain irrevocable writer royalties.',
    bulletPoints: [
      'Proof of origin with cryptographic IP timestamps',
      'Direct reader crowdfund & micro-advances',
      'Automated secondary royalty distribution on every trade',
    ],
    ctaText: 'Submit Your Script',
    ctaLink: '/account',
    image: '/assets/images/2s2f2exmbhw-1024x681.jpg',
  },
  {
    id: 'filmmakers',
    label: 'For Independent Studios',
    icon: <Film className="w-4 h-4" />,
    heading: 'Greenlight projects powered by fan-funded capital',
    description: 'Launch your production slate with a pre-built community of stakeholders. Issue collector passes that grant fans governance rights and premiere tickets.',
    bulletPoints: [
      'Fractionalized budget pooling via smart escrows',
      'Instant access to peer-reviewed spec scripts',
      'Build long-term franchise value with engaged fans',
    ],
    ctaText: 'Register Studio',
    ctaLink: '/sellers',
    image: '/assets/images/h73jxsqwecc-1024x683.jpg',
  },
  {
    id: 'collectors',
    label: 'For Film Collectors',
    icon: <Coins className="w-4 h-4" />,
    heading: 'Own rare screenplay passes & movie milestones',
    description: 'Collect first edition scripts, storyboard artwork, and producer credits that evolve as the film enters principal photography and cinematic distribution.',
    bulletPoints: [
      'Exclusive read-through access and executive voting',
      'Trade verified film collectibles on the decentralized marketplace',
      'VIP passes to film premieres and virtual festivals',
    ],
    ctaText: 'Explore Marketplace',
    ctaLink: '/shop',
    image: '/assets/images/rdaxhyjjc1o-1024x683.jpg',
  },
];

export const TabSwitcher: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState('writers');
  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  return (
    <div className="w-full">
      {/* Tab Buttons Pill */}
      <div className="flex justify-center mb-8 sm:mb-10 w-full overflow-hidden">
        <div className="inline-flex max-w-full overflow-x-auto scrollbar-none p-1.5 rounded-full bg-[#151515] border border-white/10 shadow-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-all ${
                activeTabId === tab.id
                  ? 'bg-[#d81395] text-white shadow-[0_0_15px_rgba(216,19,149,0.4)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content Panel */}
      <div className="bg-[#151515] border border-white/10 rounded-3xl p-6 sm:p-10 lg:p-12 transition-all">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-[#f4bb28] mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Script-to-Screen Protocol
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-snug">
              {activeTab.heading}
            </h3>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-6">
              {activeTab.description}
            </p>

            <ul className="flex flex-col gap-3 mb-8">
              {activeTab.bulletPoints.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-neutral-300">
                  <ShieldCheck className="w-4 h-4 text-[#d81395] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <a
              href={activeTab.ctaLink}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#d81395] hover:bg-[#9a106a] text-white text-sm font-semibold transition-all shadow-[0_0_20px_rgba(216,19,149,0.3)]"
            >
              {activeTab.ctaText}
            </a>
          </div>

          <div className="relative rounded-2xl overflow-hidden aspect-video lg:aspect-4/3 bg-black shadow-2xl border border-white/10">
            <img
              src={activeTab.image}
              alt={activeTab.label}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-3.5 rounded-xl border border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono text-[#f4bb28]">INTYFE_SMART_CONTRACT://VERIFIED</span>
              <span className="text-[11px] text-neutral-400">ERC-721 / ERC-1155</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
