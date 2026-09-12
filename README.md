# Intyfe Marketplace - React + Vite + TypeScript

The decentralized cinema marketplace for film scripts, director passes, and screenplays on the blockchain. Scaffolded and ported directly from the HTML design system in `templates/`.

---

## ⚡ Quick Start

```bash
# Install dependencies (already completed)
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🏗️ Tech Stack & Architecture

- **Framework**: [React 19](https://react.dev/) + [Vite 8](https://vite.dev/)
- **Language**: TypeScript with path aliases (`@/*` -> `./src/*`)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + Intyfe Design System Tokens (`variables.css`, `base.css`, `components.css`, `pages.css`)
- **Routing**: [React Router 7](https://reactrouter.com/) with automatic Scroll-to-Top
- **Icons**: [Lucide React](https://lucide.dev/) + FontAwesome 6 icons
- **State**: React Context API (`CartContext`) with `localStorage` persistence and simulated Web3 Wallet authentication

---

## 🧭 Page Routes & Mappings

| Route | Page Component | Original Template | Description |
| :--- | :--- | :--- | :--- |
| `/` | `Home.tsx` | `templates/index.html` | Hero, Now Showing carousel, Script-to-screen tabs, Value props, Merch |
| `/shop` | `Shop.tsx` | `templates/shop.html` | Marketplace catalog with search, category pills, price/rating sorting |
| `/product/:slug` | `ProductDetail.tsx` | `templates/product-detail.html` | Interactive gallery switcher, token tiers, quantity stepper, specs |
| `/stories` | `Stories.tsx` | `templates/stories.html` | Screenplay archive, hero story, genre filters, and story cards |
| `/story/:slug` | `StoryDetail.tsx` | `templates/story-detail.html` | Narrative reading, Courier screenplay viewer, token minting card |
| `/sellers` | `StoreListing.tsx` | `templates/store-listing.html` | Verified studio and screenwriter directory |
| `/store/:slug` | `StoreDetail.tsx` | `templates/store-detail.html` | Studio profile banner, bio, stats, catalog & screenplay tabs |
| `/cart` | `Cart.tsx` | `templates/cart.html` | Shopping cart table, quantity stepper, coupon box, subtotal in IDR/ETH |
| `/checkout` | `Checkout.tsx` | `templates/checkout.html` | Web3 token destination address, billing details, payment methods |
| `/account` | `MyAccount.tsx` | `templates/my-account.html` | Web3 wallet connect, Sign in / Register tabs, user dashboard |
| `*` | `NotFound.tsx` | — | 404 "Screenplay Not Found" fallback page |

---

## 🧩 Key Components

- **Layout**:
  - `Header.tsx`: Sticky pill navigation, active routes, dynamic cart counter badge, wallet connect trigger, mobile menu toggle.
  - `MobileDrawer.tsx`: Slide-over responsive navigation with wallet connection status.
  - `Footer.tsx`: Brand overview, navigation links, newsletter signup with toast notification, social links.
  - `Layout.tsx`: Shared shell with Header, Outlet, and Footer.
- **Features**:
  - `FeaturedSlider.tsx`: Interactive carousel controller with auto-play, pause on hover, next/prev, and animated progress bar.
  - `TabSwitcher.tsx`: Script-to-Screen ecosystem tab switcher (Screenwriters, Studios, Collectors).
  - `ScriptReader.tsx`: Courier New screenplay viewer with scene headings, action descriptions, and dialogue blocks.
  - `StoryCard.tsx`: Story card with hover action, favorite toggling, genre badge, and floor price in ETH.
  - `ProductCard.tsx`: Marketplace pass item with price in IDR and ETH, rating, and Add to Cart action.
  - `StudioCard.tsx`: Studio profile card with verified badge, avatar, rating, location, and stats.
- **Common**:
  - `QuantityStepper.tsx`: Stepper component for cart and product detail.
  - `RatingStars.tsx`: Visual star ratings with fractional scores.
  - `ScrollToTop.tsx`: Automatically scrolls viewport to top on route change.

---

## 🎨 Design Tokens & Palette

| Variable | Value / Hex | Usage |
| :--- | :--- | :--- |
| `--gl-primary` / `primary` | `#d81395` | Brand Magenta / CTA Buttons |
| `--gl-secondary` / `secondary` | `#f4bb28` | Accent Gold / Prices / Ratings |
| `--gl-secondary-light` | `#fff2c6` | Gradient Accent Endpoint |
| `--gl-bg-base-dark` | `#0a0a0a` | Dark canvas background |
| `--gl-bg-shade-dark` | `#151515` | Component and card surface |
| `--gl-gradient-brand` | `linear-gradient(45deg, #d81395, #fff2c6)` | Gradient Headings |

Fonts loaded:
- **Headings**: `'Instrument Sans', sans-serif`
- **Body**: `'Manrope', sans-serif`
- **Scripts**: `'Courier New', monospace`
