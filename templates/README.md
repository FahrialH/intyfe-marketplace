# Intyfe Marketplace - UI Templates & Design System

This `templates/` folder contains the extracted, cleaned, and organized HTML, CSS, and JS templates built directly from the scraped **Intyfe Marketplace** website assets.

---

## 📁 Directory Structure

```text
templates/
├── assets/
│   ├── css/
│   │   ├── variables.css      # Design tokens (Colors, gradients, typography, shadows, radii)
│   │   ├── base.css           # CSS reset, typography rules, buttons, utility classes
│   │   ├── components.css     # Modular UI components (Navbar, cards, tabs, sliders, forms, footer)
│   │   └── pages.css          # Page-specific layouts (Hero, product detail, checkout, articles)
│   ├── js/
│   │   ├── main.js            # Mobile drawer, tab switchers, gallery switcher, quantity stepper
│   │   └── slider.js          # Interactive carousel controller with animated progress bar
│   └── images/                # Cleanly indexed media assets (posters, covers, icons, logos)
├── index.html                 # Homepage (Hero video/cover, Now Showing carousel, Value props, Script-to-screen tabs, Merch, CTA)
├── shop.html                  # Marketplace / Catalog (Filter toolbar, sorting, product grid, pricing)
├── product-detail.html        # Single Item Page (Media gallery, token tier stats, quantity, tabs, reviews)
├── stories.html               # Stories / Scripts Archive (Featured hero story, genre filters, story cards)
├── story-detail.html          # Script Reader & Article (Narrative text, Courier script box, mint widget)
├── store-listing.html         # Studio / Vendor Directory (Creator cards, banners, verification badges)
├── store-detail.html          # Studio Profile (Cover banner, bio, stats, studio catalog)
├── cart.html                  # Shopping Cart (Items table, quantity controls, coupon box, totals)
├── checkout.html              # Checkout (Billing details, Web3 address field, payment options, summary)
└── my-account.html            # Authentication (Sign in, Register tabs, Web3 wallet connect)
```

---

## 🎨 Color Palette & Design Tokens

| Variable | Value / Hex | Usage |
| :--- | :--- | :--- |
| `--gl-primary` | `hsl(321, 79%, 46%)` / `#D81395` | Brand Magenta / CTA Buttons |
| `--gl-primary-medium` | `hsl(321, 68%, 36%)` | Hover states |
| `--gl-secondary` | `#F4BB28` | Accent Gold / Prices / Ratings |
| `--gl-secondary-light`| `#FFF2C6` | Gradient Accent Endpoint |
| `--gl-bg-base-dark` | `#0A0A0A` | Main page dark background |
| `--gl-bg-shade-dark` | `#151515` | Card and component surfaces |
| `--gl-bg-subtle-dark` | `rgba(255, 255, 255, 0.1)`| Card borders & dividers |
| `--gl-gradient-brand` | `linear-gradient(45deg, #D81395, #FFF2C6)` | Gradient Headings & Text |

### 🔤 Typography
- **Headings**: `'Instrument Sans', sans-serif` (`font-weight: 600` or `700`, `letter-spacing: -0.03em`)
- **Body Text**: `'Manrope', sans-serif` (`font-weight: 400` / `500`)
- **Screenplay / Script Excerpts**: `'Courier New', monospace`

---

## 🚀 Vite + React Migration Guide

When porting these templates into your Vite + React project:

1. **Global CSS**:
   Import `variables.css`, `base.css`, and `components.css` in your `src/index.css` or `src/App.tsx`.
2. **Components to create**:
   - `Header.tsx` (Floating pill navigation)
   - `Footer.tsx` (Footer with newsletter form)
   - `StoryCard.tsx` (With hover action and ETH metrics)
   - `ProductCard.tsx` (Marketplace item with price and Add to Cart)
   - `FeaturedSlider.tsx` (Using `Swiper` or custom slider hook)
   - `TabSwitcher.tsx` (For Script-to-Screen writer/investor tabs)
   - `ScriptReader.tsx` (Formatted screenplay viewer)
3. **Pages / Routes**:
   - `/` -> `Home.tsx`
   - `/shop` -> `Shop.tsx`
   - `/product/:id` -> `ProductDetail.tsx`
   - `/stories` -> `Stories.tsx`
   - `/story/:slug` -> `StoryDetail.tsx`
   - `/sellers` -> `StoreListing.tsx`
   - `/store/:slug` -> `StoreDetail.tsx`
   - `/cart` -> `Cart.tsx`
   - `/checkout` -> `Checkout.tsx`
   - `/account` -> `MyAccount.tsx`
