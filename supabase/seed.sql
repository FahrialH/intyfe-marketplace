-- ==============================================================================
-- INTYFE MARKETPLACE - SEED DATA & ROLE CONFIGURATION
-- Run this script in the Supabase SQL Editor if you want to preload articles
-- or promote a specific user to Admin.
-- ==============================================================================

-- 1. PROMOTE A USER TO ADMIN:
-- Replace with the email address you used to register or created in Dashboard:
-- UPDATE public.profiles
-- SET role = 'admin'
-- WHERE email = 'admin@intyfe.io';

-- 2. SEED INITIAL NEWS ARTICLES:
INSERT INTO public.news_articles (
  slug,
  title,
  excerpt,
  content,
  image_url,
  category,
  author_name,
  author_avatar,
  author_role,
  published_at,
  featured,
  reading_time_minutes,
  tags
) VALUES
(
  'intyfe-protocol-v2-live-on-solana',
  'Intyfe Protocol V2 Architecture Deployed on Solana Devnet',
  'Next-generation screenplay tokenization engine achieves sub-second settlement and near-zero gas for indie film producers.',
  'Today marks a pivotal leap for the Intyfe ecosystem. We are thrilled to introduce Protocol V2, fully compiled and active across the Solana Devnet cluster.

### What is New in V2?
* **Sub-second Pass Registration**: Script minting passes now settle on Solana in under 400ms.
* **Granular Rights Royalty Splitting**: Automatic smart contracts route producer shares directly to creator wallet addresses.
* **Permissionless Greenlight Protocol**: Community members holding Executive Passes can now vote directly on screenplay funding proposals.

We invite all screenwriters, directors, and collectors to link their Phantom or Solflare wallets to begin exploring the future of decentralized cinema.',
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1200',
  'Protocol',
  'Intyfe Core Engineering',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  'Lead Architecture',
  NOW() - INTERVAL '2 days',
  true,
  4,
  ARRAY['Solana', 'Protocol', 'Web3', 'Architecture']
),
(
  'decentralized-cinema-governance-round-3',
  'Community Governance Round 3: Five Screenplays Greenlit for Production',
  'Over 14,000 producer vote tokens participated in greenlighting upcoming sci-fi and noir indie productions.',
  'Decentralized cinema democracy in action! The tally for Community Governance Round 3 concluded at 00:00 UTC with unprecedented participation across the Intyfe network.

### Top Selected Projects:
1. **The Neon Horizon (Neo-Tokyo Sci-Fi)** - 4,820 Votes
2. **Shadows in the Mist (Nordic Noir Thriller)** - 3,910 Votes
3. **Echoes of Eternity (Philosophical Speculative)** - 2,750 Votes

Production escrow vaults on Solana will unlock the initial pre-production milestones over the coming weeks as screenwriters deliver polished shooting drafts.',
  'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=1200',
  'Governance',
  'CineNova Governance DAO',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
  'Governance Steward',
  NOW() - INTERVAL '5 days',
  false,
  6,
  ARRAY['Governance', 'DAO', 'Greenlight', 'Cinema']
),
(
  'creator-spotlight-maya-lin',
  'Creator Spotlight: Director Maya Lin on Open Screenplay Registries',
  'Award-winning independent director discusses how immutable on-chain script timestamps protected her award-winning debut.',
  'We sat down with visionary director Maya Lin to discuss the creative and financial realities of independent filmmaking in an era of algorithmic disruption.

"Traditional Hollywood development hell locks original ideas into five-year option contracts that often lead to nothing," notes Maya. "On Intyfe, publishing the script with cryptographic provenance allowed our collective to find our actual audience, secure pre-sales, and retain 100% of our creative control."

Read the full excerpt and examine the original on-chain registered screenplay in our Stories archive.',
  'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=1200',
  'Production',
  'Editorial Dispatch',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
  'Feature Editor',
  NOW() - INTERVAL '8 days',
  false,
  5,
  ARRAY['Spotlight', 'Filmmaker', 'IndieCinema']
)
ON CONFLICT (slug) DO NOTHING;
