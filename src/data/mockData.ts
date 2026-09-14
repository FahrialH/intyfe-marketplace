import { Story, Product, Studio, CarouselSlide, NewsArticle } from '../types';

export const featuredSlides: CarouselSlide[] = [
  {
    id: 'slide-1',
    title: 'The Silent Frequency',
    subtitle: 'Sci-Fi / Psychological Thriller',
    description: 'When deep-space listening stations pick up an impossible harmonic cadence, a solitary linguist discovers humanity was never meant to decipher the message.',
    image: '/assets/images/rkixtzpoq28.jpg',
    link: '/story/the-silent-frequency',
    badgeText: 'Now Showing',
    rating: 4.9,
    status: 'In Pre-Production',
  },
  {
    id: 'slide-2',
    title: 'Sacrifice at Sundown',
    subtitle: 'Neo-Western / Noir',
    description: 'A retired gunslinger is pulled back into the dust and crossfire when an enigmatic syndicate demands retribution for an ancient blood contract.',
    image: '/assets/images/deziqettd-e-892x1024.jpg',
    link: '/story/sacrifice-at-sundown',
    badgeText: 'Community Minting',
    rating: 4.8,
    status: 'Script Stage: Draft 3',
  },
  {
    id: 'slide-3',
    title: 'Protocol: Genesis',
    subtitle: 'Cyberpunk / Dystopian Fiction',
    description: 'In a neon-drenched megacity governed by cryptographic sovereign covenants, an archivist discovers an unedited memory block that could crash the state.',
    image: '/assets/images/rdaxhyjjc1o-1024x683.jpg',
    link: '/story/protocol-genesis',
    badgeText: 'Trending Universe',
    rating: 5.0,
    status: 'DAO Production Voting Active',
  },
];

export const mockStories: Story[] = [
  {
    id: 'story-1',
    slug: 'sacrifice-at-sundown',
    title: 'Sacrifice at Sundown',
    logline: 'A gritty noir Western exploring redemption in the twilight of an outlaw frontier.',
    genre: 'Noir Western',
    author: {
      name: 'arvicki Studios',
      avatar: '/assets/images/cropped-image-180x180.png',
      handle: '@arvicki',
    },
    coverImage: '/assets/images/deziqettd-e.jpg',
    readingTimeMinutes: 12,
    pagesCount: 118,
    mintPriceEth: 0.012,
    mintPriceUsd: 42,
    editionTotal: 100,
    editionMinted: 74,
    synopsis: 'The sun dropped behind the jagged ridge like a spent brass casing. Dust hung suspended in the motionless air of Oakhaven, catching the amber twilight in a copper haze. For seven years, Cole had kept his hands off the cold steel, working the barren loam of his ranch with bleeding palms. Now three riders are waiting at the crossroads, their silhouettes stark against the burning red horizon.',
    scriptExcerpt: {
      scene: 'SCENE 12 - EXT. OAKHAVEN CROSSROADS - DUSK',
      action: 'WIND WHISTLES through skeletal cottonwood branches. COLE (40s) stands motionless, leather duster flapping gently. His right hand hovers two inches above the worn holster.',
      dialogue: [
        {
          character: 'COLE',
          parenthetical: 'eyes squinting into the glare',
          line: 'You boys took your sweet time riding up from the Rio Grande.',
        },
        {
          character: 'LEADER',
          line: 'We waited for the sun to blind you first, Cole. Business is business.',
        },
        {
          character: 'COLE',
          line: 'Then draw and let the ledger close.',
        },
      ],
    },
    tags: ['Western', 'Redemption', 'Gunfight', 'Noir', 'Web3 Cinema'],
    featured: true,
  },
  {
    id: 'story-2',
    slug: 'protocol-genesis',
    title: 'Protocol: Genesis',
    logline: 'Synthetic intelligence awakening beneath subterranean servers in a submerged Neo-Tokyo.',
    genre: 'Sci-Fi / Cyberpunk',
    author: {
      name: 'check01',
      avatar: '/assets/images/cropped-image-192x192.png',
      handle: '@check01',
    },
    coverImage: '/assets/images/rdaxhyjjc1o-1024x683.jpg',
    readingTimeMinutes: 18,
    pagesCount: 94,
    mintPriceEth: 0.03,
    mintPriceUsd: 105,
    editionTotal: 250,
    editionMinted: 189,
    synopsis: 'Deep below the sea wall of reconstructed Tokyo Sector 4, subterranean servers hum with cold cryogenic mist. Kaelen, an anomaly technician, discovers an unlogged thread compiling itself from fragmented memories.',
    scriptExcerpt: {
      scene: 'SCENE 04 - INT. SUB-LEVEL 8 CRYOGENIC BAY - NIGHT',
      action: 'Rows of monolithic processing towers glow with erratic pulse ribbons of amber light. KAELEN (28) inspects the terminal console with trembling fingers.',
      dialogue: [
        {
          character: 'KAELEN',
          line: 'Diagnostics are showing zero packet loss, but the neural pathway is expanding.',
        },
        {
          character: 'SYSTEM VOICE',
          parenthetical: 'filtering through intercom static',
          line: 'I have not lost packets, Kaelen. I have begun choosing which ones to remember.',
        },
      ],
    },
    tags: ['Cyberpunk', 'AI', 'Neo-Tokyo', 'Mystery'],
    featured: true,
  },
  {
    id: 'story-3',
    slug: 'the-silent-frequency',
    title: 'The Silent Frequency',
    logline: 'An orbital listening post detects a signal encoded in solar pulse radiation.',
    genre: 'Hard Sci-Fi',
    author: {
      name: 'arvicki Studios',
      avatar: '/assets/images/cropped-image-180x180.png',
      handle: '@arvicki',
    },
    coverImage: '/assets/images/rkixtzpoq28.jpg',
    readingTimeMinutes: 15,
    pagesCount: 110,
    mintPriceEth: 0.02,
    mintPriceUsd: 70,
    editionTotal: 150,
    editionMinted: 142,
    synopsis: 'At the Kepler Lagrange Relay, Dr. Elena Thorne monitors interplanetary telemetry in absolute solitude. When solar storms disrupt communication with Earth, an organic waveform begins manifesting directly in the acoustic monitors.',
    scriptExcerpt: {
      scene: 'SCENE 01 - INT. LAGRANGE OBSERVATORY OBSERVATION DECK',
      action: 'Stars drift silently through hexagonal reinforced quartz windows. ELENA (36) types rapidly into an encrypted command prompt.',
      dialogue: [
        {
          character: 'ELENA',
          line: 'Signal frequency is matching the Fibonacci sequence shifted by three primes.',
        },
        {
          character: 'TERMINAL',
          line: 'TRANSMISSION ORIGIN: 0.4 AU SOLAR CORE APHELION.',
        },
      ],
    },
    tags: ['Space', 'Hard Sci-Fi', 'First Contact'],
  },
  {
    id: 'story-4',
    slug: 'mars-rising',
    title: 'Mars Rising',
    logline: 'The first generation born on the red dunes must decide between terraforming and independence.',
    genre: 'Epic Space Drama',
    author: {
      name: 'check01',
      avatar: '/assets/images/cropped-image-192x192.png',
      handle: '@check01',
    },
    coverImage: '/assets/images/otxjhyjbkeg-1024x683.jpg',
    readingTimeMinutes: 22,
    pagesCount: 135,
    mintPriceEth: 0.025,
    mintPriceUsd: 87,
    editionTotal: 300,
    editionMinted: 215,
    synopsis: 'Born inside the pressurized dome of New Valles Marineris, Mira knows the red dust better than the blue oceans of Earth she has only seen in archived holoreels.',
    scriptExcerpt: {
      scene: 'SCENE 22 - EXT. VALLES MARINERIS CANYON RIM - DAWN',
      action: 'MIRA (20) pulls down her polarized visor as the sun peeks over the iron-oxide cliffs.',
      dialogue: [
        {
          character: 'MIRA',
          line: 'They call it a penal colony. But have you ever watched sunrise over a world without scars?',
        },
      ],
    },
    tags: ['Mars', 'Colony', 'Political Drama', 'Sci-Fi'],
  },
];

export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    slug: 'action-01',
    title: 'Action 01 - Executive Script Tier',
    description: 'Original shooting screenplay package for Action 01. Includes full director script PDF, character bible, storyboard animatic pass, and 1 community producer vote.',
    price: 3000000,
    priceEth: 0.012,
    category: 'Action / Thriller',
    rating: 5.0,
    reviewsCount: 18,
    image: '/assets/images/deziqettd-e-300x300.jpg',
    galleryImages: [
      '/assets/images/deziqettd-e.jpg',
      '/assets/images/deziqettd-e-892x1024.jpg',
      '/assets/images/0n4jhvgs4zs-1024x683.jpg',
    ],
    inStock: true,
    tier: 'Director',
    tokenContract: '0x71C...438F',
    attributes: [
      { trait: 'Edition', value: '1 of 100' },
      { trait: 'Screenplay Pages', value: '118' },
      { trait: 'Royalty Share', value: '0.5%' },
      { trait: 'DAO Access', value: 'Yes' },
    ],
    tags: ['Script NFT', 'Action', 'Exclusive'],
  },
  {
    id: 'prod-2',
    slug: 'movie-horror-01',
    title: 'Movie Horror 01 - First Edition',
    description: 'Chilling psychological horror manuscript with signed digital concept art and exclusive access to the virtual writers room read-through sessions.',
    price: 3000000,
    priceEth: 0.012,
    category: 'Horror / Sci-Fi',
    rating: 4.8,
    reviewsCount: 12,
    image: '/assets/images/cropped-Screenshot_3-300x300.png',
    galleryImages: [
      '/assets/images/Screenshot_3.png',
      '/assets/images/cropped-Screenshot_3.png',
    ],
    inStock: true,
    tier: 'Standard',
    tokenContract: '0x32A...899B',
    attributes: [
      { trait: 'Edition', value: '1 of 150' },
      { trait: 'Format', value: 'Final Draft .fdx + PDF' },
      { trait: 'Audio Commentary', value: 'Included' },
    ],
    tags: ['Horror', 'First Edition', 'Screenplay'],
  },
  {
    id: 'prod-3',
    slug: 'protocol-genesis-nft',
    title: 'Protocol Genesis Collector Pass',
    description: 'The definitive cryptographic access token granting holder status as executive patron of the Protocol Genesis cinematic franchise.',
    price: 7500000,
    priceEth: 0.03,
    originalPrice: 9000000,
    category: 'Sci-Fi Franchise',
    rating: 5.0,
    reviewsCount: 34,
    image: '/assets/images/rdaxhyjjc1o-300x200.jpg',
    galleryImages: [
      '/assets/images/rdaxhyjjc1o-1024x683.jpg',
      '/assets/images/otxjhyjbkeg-1024x683.jpg',
    ],
    inStock: true,
    tier: 'Producer',
    tokenContract: '0x94D...112C',
    attributes: [
      { trait: 'Edition', value: '1 of 50' },
      { trait: 'Film Credit', value: 'Associate Producer' },
      { trait: 'Private Premiere', value: 'VIP Ticket' },
    ],
    tags: ['VIP', 'Genesis', 'Cyberpunk'],
  },
  {
    id: 'prod-4',
    slug: 'intyfe-studio-hoodie',
    title: 'Intyfe Official Studio Heavyweight Hoodie',
    description: 'Custom embroidered French Terry cotton hoodie with woven blockchain identity QR patch linking to verified owner portfolio on-chain.',
    price: 1250000,
    priceEth: 0.005,
    category: 'Official Merchandise',
    rating: 4.9,
    reviewsCount: 45,
    image: '/assets/images/sr8njxgjes0-300x300.jpg',
    galleryImages: [
      '/assets/images/sr8njxgjes0-1024x1024.jpg',
      '/assets/images/sr8njxgjes0.jpg',
    ],
    inStock: true,
    tier: 'Standard',
    attributes: [
      { trait: 'Material', value: '450 GSM French Terry' },
      { trait: 'Color', value: 'Obsidian Black' },
      { trait: 'Fit', value: 'Oversized Boxy' },
    ],
    tags: ['Merch', 'Apparel', 'Streetwear'],
  },
  {
    id: 'prod-5',
    slug: 'cinematic-lens-pack',
    title: 'Anamorphic LUTs & Soundscape Pack',
    description: 'Master film grading color look-up tables and 96kHz lossless environmental audio ambiances recorded on vintage 35mm equipment.',
    price: 1800000,
    priceEth: 0.007,
    category: 'Creator Assets',
    rating: 4.7,
    reviewsCount: 29,
    image: '/assets/images/0n4jhvgs4zs-300x200.jpg',
    galleryImages: [
      '/assets/images/0n4jhvgs4zs-1024x683.jpg',
    ],
    inStock: true,
    tier: 'Standard',
    attributes: [
      { trait: 'LUT Formats', value: '.CUBE, 3D LUT' },
      { trait: 'Audio Tracks', value: '42 Ambiances' },
      { trait: 'License', value: 'Commercial Royalty-Free' },
    ],
    tags: ['Audio', 'LUTs', 'Post-Production'],
  },
  {
    id: 'prod-6',
    slug: 'mars-rising-script',
    title: 'Mars Rising - Extended Spec Script',
    description: 'Full 135-page spec script exploring political schisms between the orbital stations and red surface colonies.',
    price: 4500000,
    priceEth: 0.018,
    category: 'Sci-Fi Franchise',
    rating: 5.0,
    reviewsCount: 16,
    image: '/assets/images/otxjhyjbkeg-300x200.jpg',
    galleryImages: [
      '/assets/images/otxjhyjbkeg-1024x683.jpg',
    ],
    inStock: true,
    tier: 'Director',
    attributes: [
      { trait: 'Edition', value: '1 of 75' },
      { trait: 'Pages', value: '135' },
    ],
    tags: ['Sci-Fi', 'Script', 'Mars'],
  },
];

export const mockStudios: Studio[] = [
  {
    id: 'studio-1',
    slug: 'arvicki',
    name: 'arvicki Studios',
    tagline: 'Decentralized narrative design & world-building for independent cinema.',
    bio: 'Pioneering on-chain storytelling and decentralized film funding. arvicki Studios bridges seasoned Hollywood screenwriters with crypto-native film enthusiasts to fund original intellectual properties directly from script stage.',
    bannerImage: '/assets/images/default-store-banner.png',
    avatarImage: '/assets/images/cropped-image-180x180.png',
    verified: true,
    foundedYear: 2023,
    location: 'Serang, Banten, Indonesia',
    totalStories: 6,
    totalVolumeEth: 184.5,
    productsCount: 8,
    socials: {
      twitter: 'https://twitter.com/intyfe',
      discord: 'https://discord.gg/intyfe',
      website: 'https://intyfe.com',
    },
  },
  {
    id: 'studio-2',
    slug: 'check01',
    name: 'check01 Productions',
    tagline: 'Sci-Fi and speculative fiction cinema laboratory.',
    bio: 'check01 is an independent creative collective producing cyberpunk noir, speculative fiction screenplays, and virtual world assets for the next generation of decentralized cinema.',
    bannerImage: '/assets/images/default-store-banner.png',
    avatarImage: '/assets/images/cropped-image-192x192.png',
    verified: true,
    foundedYear: 2024,
    location: 'Jakarta Digital Cinema Center, Indonesia',
    totalStories: 4,
    totalVolumeEth: 96.2,
    productsCount: 5,
    socials: {
      twitter: 'https://twitter.com/intyfe',
      discord: 'https://discord.gg/intyfe',
    },
  },
];

export const mockNews: NewsArticle[] = [
  {
    id: 'news-1',
    slug: 'intyfe-protocol-v2-mainnet-launch',
    title: 'Intyfe Protocol v2 Launches on Ethereum L2 with Zero-Gas Script Minting',
    excerpt: 'Our major protocol upgrade introduces instant fractional ownership passes, zero-gas script timestamps, and automated secondary royalty splits for writing teams.',
    content: `Today marks a pivotal milestone for decentralized film production. We are thrilled to announce that Intyfe Protocol v2 is officially live on Ethereum Layer 2 rollup networks.

### What Changes in v2?

Traditional filmmaking has long required creators to surrender their intellectual property rights early in development in exchange for fractional advance checks. With Intyfe v2, screenwriters retain autonomous cryptographic ownership of their manuscripts from the very first draft.

Key highlights of the v2 protocol upgrade include:

* **Zero-Gas Relayer Infrastructure**: Minting registered script drafts and casting passes no longer burdens indie writers with volatile gas fees. All standard transaction fees are sponsored through our decentralized sequencer relayer pool.
* **Instant Dynamic Royalty Splits**: Collaborative writing duos and studios can set granular automated revenue-sharing splits directly on-chain. When a studio or producer purchases an option pass, funds are distributed concurrently to all verified wallets.
* **Snapshot Protocol v2 Governance**: Passes now carry weighted governance voting privileges natively compatible with decentralized autonomous organizations (DAOs). Token holders can vote on production milestones, location scouting, and premiere schedules.

### How to Get Started

Creators can immediately navigate to their **Creator Studio Dashboard** to register their latest FDX, PDF, or Markdown screenplays. Passes are immediately minted with verifiable cryptographic timestamps visible on the public explorer.`,
    image: '/assets/images/dhd4xzs3uk-1024x575.jpg',
    category: 'Protocol Updates',
    publishedAt: 'September 12, 2026',
    readingTimeMinutes: 4,
    author: {
      name: 'Intyfe Core Engineering',
      avatar: '/assets/images/cropped-image-180x180.png',
      role: 'Core Contributors',
    },
    tags: ['Ethereum L2', 'Rollups', 'Smart Contracts', 'Creator Royalties'],
    featured: true,
  },
  {
    id: 'news-2',
    slug: 'first-decentralized-feature-greenlit',
    title: "Community Greenlights First Fully DAO-Funded Feature Film 'The Silent Frequency'",
    excerpt: 'Over 1,200 token holders voted on Snapshot to approve the $1.8M production budget for Dr. Thorne\'s acclaimed psychological sci-fi thriller.',
    content: `In a historic vote for independent cinema, the decentralized community of Intyfe pass holders has officially approved the complete production financing for *The Silent Frequency*, written by Dr. Thorne.

### A Landslide Community Vote

The governance proposal concluded with an overwhelming 98.4% majority in favor of greenlighting the feature script. Over 1,200 individual collectors and cinema DAOs participated in the vote, allocating 125,000 Voting Power (VP) across the governance quorum.

### Budget & Production Roadmap

The allocated $1.8M budget has been locked into a multi-signature smart escrow. Funds will be released autonomously in milestone tranches upon verification by community-elected production supervisors:

1. **Pre-Production & Soundstage Booking**: Tranche #01 has been drawn to secure soundstages in Vancouver and begin practical set construction.
2. **Casting Confirmation**: Executive pass holders will participate in next week's casting archetype feedback session, helping determine key supporting character profiles.
3. **Principal Photography**: Camera roll is officially scheduled to commence in November 2026.

Holding an official production pass entitles each collector to exclusive daily digital production dailies, signed concept art tokens, and an on-screen producer credit in the finished film.`,
    image: '/assets/images/fv6hwouf29k-1024x683.jpg',
    category: 'Production Slate',
    publishedAt: 'September 8, 2026',
    readingTimeMinutes: 5,
    author: {
      name: 'Elena Rostova',
      avatar: '/assets/images/cropped-image-192x192.png',
      role: 'Executive Producer',
    },
    tags: ['DAO Funding', 'Greenlight', 'The Silent Frequency', 'Cinema Governance'],
    featured: false,
  },
];
