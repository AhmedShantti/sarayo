# Sarayo Alwadiya — Next.js

Marketing site for Sarayo Alwadiya (Cornice corn snacks). Converted from a static
HTML/CSS/JS site to a Next.js 14 App Router project.

## Stack

- **Next.js 14** — App Router, JavaScript (.jsx)
- **React 18**
- Plain CSS (the original `style.css`, used as `app/globals.css`)
- Google Fonts loaded via `<link>` (Bowlby One, Cairo, Fredoka, Poppins)

## Run it

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open http://localhost:3000.

To build for production:

```bash
npm run build
npm run start
```

## Project structure

```
sarayo-alwadiya/
├── app/
│   ├── layout.jsx          # Root layout — fonts, providers, header & footer
│   ├── page.jsx            # Home page (composes all home sections)
│   ├── globals.css         # The original 1686-line stylesheet, untouched
│   └── cart/
│       └── page.jsx        # /cart route
│
├── components/
│   ├── Header.jsx          # Sticky header with mobile menu, scroll-active nav, cart badge
│   ├── Footer.jsx
│   ├── BrandLogo.jsx       # Reusable inline SVG logo
│   ├── Hero.jsx            # Animated hero with auto-rotating slides + parallax
│   ├── FlavorCategories.jsx
│   ├── BestSellers.jsx     # Product carousel + add-to-cart + reveal-on-scroll
│   ├── OurStory.jsx
│   ├── Features.jsx        # Reveal-on-scroll feature cards
│   ├── Newsletter.jsx
│   ├── BackToTop.jsx
│   ├── SmoothScroll.jsx    # Global anchor smooth-scroll handler
│   └── CartView.jsx        # Cart page items + summary
│
├── lib/
│   ├── CartContext.jsx     # Cart state, localStorage-synced, multi-tab aware
│   └── ToastContext.jsx    # Global toast notifications
│
├── public/
│   ├── cornice-spicy.png   # Hero product image
│   ├── images.jpeg
│   └── images.png
│
├── package.json
├── next.config.mjs
└── jsconfig.json           # @/* path alias
```

## What changed from the static version

The visual output is identical — same CSS, same SVGs, same fonts. The structural changes:

- **Two pages → two routes.** `index.html` → `/`, `cart.html` → `/cart`.
- **Cart state lives in React Context** (`lib/CartContext.jsx`) instead of being read from
  `localStorage` on every script run. It still persists to `localStorage` and syncs across
  tabs via the `storage` event.
- **Toast notifications use Context** (`lib/ToastContext.jsx`) instead of a global function.
- **Imperative DOM manipulation** (cart rendering, badge updates, mobile menu toggle, hero
  slide swaps, scroll-position-based active nav) becomes React state.
- **IntersectionObserver-based reveal animations** are still used, scoped to the relevant
  components (`BestSellers`, `Features`).
- **Smooth scroll for in-page anchors** is centralized in `components/SmoothScroll.jsx`.

## Things still on the brand-config to-do list

(Same ones the static version had.)

1. Founding date — currently shown as "since 2002" in copy. Confirm and update in
   `OurStory.jsx` and `Footer.jsx`.
2. Flavor lineup — flavor names in `FlavorCategories.jsx` and `BestSellers.jsx` are demo
   content. Replace with the real Cornice lineup.
3. Per-flavor product photos — currently the single `cornice-spicy.png` is used in the hero
   and CSS-painted "bag" graphics stand in for product photos. Drop real per-flavor photos
   into `public/` and swap them in `BestSellers.jsx`.

## Cart checkout flow

The Checkout button on `/cart` opens the brand's Facebook page in a new tab — this matches
the original site's flow, where commercial conversations happen via Messenger. Update the
URL in `components/CartView.jsx` if the brand moves to a different commercial endpoint.
