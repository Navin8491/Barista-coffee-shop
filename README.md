# ☕ Barista Coffee Shop

A modern, fully-featured coffee shop website built with **React + Vite**, converted from a PHP/WordPress theme.

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 8 |
| Routing | React Router DOM v7 |
| Animations | GSAP 3 + ScrollTrigger |
| Styling | Vanilla CSS (CSS Custom Properties) |
| Fonts | Google Fonts — Outfit + Yesteryear |
| Data | Static demo data (no backend required) |

## 📁 Project Structure

```
barista-coffee-shop-react/
├── public/
│   └── assets/img/          # Coffee shop images
├── src/
│   ├── components/
│   │   ├── Navbar.jsx        # Sticky navbar, transparent hero mode, cart
│   │   ├── HeroSlider.jsx    # GSAP text reveal slider
│   │   ├── ProductCard.jsx   # Product card with quick-add hover
│   │   ├── ProductGrid.jsx   # ScrollTrigger stagger grid
│   │   ├── CartSidebar.jsx   # GSAP slide-in cart with qty controls
│   │   ├── Footer.jsx        # 4-column footer with social links
│   │   ├── ScrollToTop.jsx   # Scroll-to-top button
│   │   └── Preloader.jsx     # Animated page preloader
│   ├── pages/
│   │   ├── HomePage.jsx      # Hero, products, about, process, testimonials, CTA
│   │   ├── MenuPage.jsx      # Filterable product grid
│   │   ├── BlogPage.jsx      # Article card grid
│   │   ├── ContactPage.jsx   # Contact form + info cards + map
│   │   └── NotFoundPage.jsx  # 404 page
│   ├── data/
│   │   └── siteData.js       # All static demo data
│   ├── App.jsx               # Root app, router, cart state, toast
│   ├── App.css
│   ├── index.css             # Global design system (tokens, utilities)
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## 🎨 Features

- **Hero Slider** — GSAP text reveal animations per slide, Ken Burns zoom, social links overlay
- **Product Grid** — Category filter tabs (Coffee / Specialty / Food), ScrollTrigger stagger entrance
- **Cart Sidebar** — GSAP slide-in, add/remove items, quantity controls, subtotal
- **Blog** — Article cards with metadata, category badges, image hover zoom
- **Contact** — Form with success state, info cards, Google Map embed
- **Navbar** — Transparent on hero, solid on scroll, mobile hamburger drawer
- **GSAP Animations** — ScrollTrigger on every major section
- **Responsive** — Mobile-first, tested at 375px / 768px / 1280px
- **404 Page** — Animated bouncing coffee cup

## 🏃 Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## 🏗️ Build for Production

```bash
npm run build
npm run preview
```

## 🎨 Design System

| Token | Value |
|---|---|
| `--primary` | `#c1753d` (warm brown) |
| `--secondary` | `#f7ebe5` (cream) |
| `--dark` | `#222222` |
| Font Body | Outfit (Google Fonts) |
| Font Heading | Yesteryear (Google Fonts) |

## 📦 Original PHP Source

The original PHP/WordPress theme backup is stored at:
`../barista-coffee-shop.2.4.6/__php-backup__/`

---

Built with ❤️ and ☕
