export interface Story {
  id: string;
  slug: string;
  title: string;
  logline: string;
  genre: string;
  author: {
    name: string;
    avatar: string;
    handle: string;
  };
  coverImage: string;
  readingTimeMinutes: number;
  pagesCount: number;
  mintPriceEth: number;
  mintPriceUsd: number;
  editionTotal: number;
  editionMinted: number;
  scriptExcerpt: {
    scene: string;
    action: string;
    dialogue: {
      character: string;
      parenthetical?: string;
      line: string;
    }[];
  };
  synopsis: string;
  tags: string[];
  featured?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  priceEth: number;
  originalPrice?: number;
  category: string;
  rating: number;
  reviewsCount: number;
  image: string;
  galleryImages: string[];
  inStock: boolean;
  tier: 'Standard' | 'Director' | 'Producer' | 'Legendary';
  tokenContract?: string;
  attributes: {
    trait: string;
    value: string;
  }[];
  tags: string[];
}

export interface Studio {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  bio: string;
  bannerImage: string;
  avatarImage: string;
  verified: boolean;
  foundedYear: number;
  location: string;
  totalStories: number;
  totalVolumeEth: number;
  productsCount: number;
  socials: {
    twitter?: string;
    discord?: string;
    website?: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedTier?: string;
}

export interface CarouselSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  link: string;
  badgeText: string;
  rating: number;
  status: string;
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  publishedAt: string;
  readingTimeMinutes: number;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  tags?: string[];
  featured?: boolean;
}
