# AI eBook Generator - Frontend Documentation

## Overview

The frontend is a **React 19** Single Page Application built with **Vite 7** and styled using **Tailwind CSS 4**. It delivers an editorial, publishing-grade interface with custom typography, dark mode theme persistence, skeleton loaders, realistic 3D book covers, an animated AI generation progress tracker, and client-side PDF compilation.

---

## Prerequisites

- **Node.js** >= 20.x
- **npm** >= 10.x

---

## Project Structure

```
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── api/
│   │   └── index.js           # Centralized API service with auth token injection & 401 handling
│   ├── components/
│   │   ├── Features.jsx       # Platform capability showcase cards
│   │   ├── Footer.jsx         # Footer with developer links & social tags
│   │   ├── Hero.jsx           # Split hero layout with 3D live preview card
│   │   ├── Navbar.jsx         # Responsive top navigation with theme toggle switch
│   │   ├── ProtectedRoute.jsx # Client-side route authentication guard
│   │   ├── Skeletons.jsx      # Shimmering card and reader skeleton loaders
│   │   └── Testimonials.jsx   # User reviews with interactive post form
│   ├── context/
│   │   ├── AuthContext.jsx    # User authentication state & localStorage sync
│   │   └── ThemeContext.jsx   # Light/dark mode state & DOM class toggle
│   ├── pages/
│   │   ├── Dashboard.jsx      # Library grid, search, status filter, & cover picker
│   │   ├── EbookViewer.jsx    # Multi-step generation timeline, reader, & PDF export
│   │   ├── LandingPage.jsx    # Marketing landing page
│   │   ├── Login.jsx          # Login form with password visibility toggle
│   │   └── Register.jsx       # Registration form with password visibility toggle
│   ├── App.jsx                # Main application component wrapped in ThemeProvider
│   ├── main.jsx               # React entry point wrapped in AuthProvider
│   └── index.css              # Design tokens, typography pairing, and animations
├── index.html                 # Head script for flicker-free theme initialization
├── package.json               # Dependencies & build scripts
└── vite.config.js             # Vite configuration & API base proxying
```

---

## Development Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```
   Launches the Vite dev server at `http://localhost:5173`.

3. **Build for production**
   ```bash
   npm run build
   ```
   Compiles optimized production bundles into `dist/`.

4. **Preview production build**
   ```bash
   npm run preview
   ```

---

## Key Architecture & Features

### 1. Design System & Typography
- **Google Fonts Typography**:
  - **Cinzel**: Editorial serif for display headlines and book covers.
  - **Lora**: High-readability serif for book chapters and testimonial quotes.
  - **Plus Jakarta Sans**: Crisp sans-serif for UI labels, forms, and navigation.
- **Design Tokens**: Standardized CSS variables defined in `src/index.css` for background surfaces, text hierarchies, and brand accent colors.

### 2. Dark Mode Theme System
- **Context & Storage**: `ThemeContext.jsx` manages `'light' | 'dark'` modes, synchronized with `localStorage` and `document.documentElement.classList`.
- **Tailwind CSS 4 Integration**: Enabled class-based dark mode via `@custom-variant dark (&:where(.dark, .dark *));`.
- **Flicker-Free Initialization**: `index.html` executes an inline head script to apply `.dark` before first paint.

### 3. Loading & Empty States
- **Skeleton Screens**: `Skeletons.jsx` provides gradient shimmering placeholders for the Dashboard library grid and eBook reader.
- **Empty States**: Illustrated zero-eBooks view with direct creation CTA and zero-search-results view with filter reset.

### 4. Generation Progress Experience
- **Milestone Timeline**: `EbookViewer.jsx` tracks generation through 4 animated phases (*Analyzing Topic*, *Drafting Chapters with Gemini*, *Structuring Layout*, *Finalizing Reader*) with a live gradient progress bar.
- **Resilient Polling**: Automatically pauses polling when the tab is inactive and resumes on focus.

### 5. Realistic 3D Book Covers
- **Spine & Emboss Effects**: `book-spine-crease` CSS utility renders realistic leather/spine creases.
- **Theme Palettes**: Dynamic cover presets (Sapphire Indigo, Royal Amethyst, Emerald Forest, Crimson Rose, Amber Sun).

### 6. Chapter Editing & PDF Export
- **Drag & Drop Reordering**: `@dnd-kit/sortable` allows intuitive chapter re-ordering.
- **Publishing PDF Export**: `handleDownloadPDF` generates styled PDFs with colored cover pages, auto-generated table of contents with dot leaders, and running headers/footers with `Page X of Y`.

---

## State Management

- **Auth State**: Provided by `AuthContext.jsx`, exposing `user`, `login`, `register`, `logout`, and auto-refresh on stored token.
- **Theme State**: Provided by `ThemeContext.jsx`, exposing `theme`, `toggleTheme`, and `isDark`.
- **API Client**: `src/api/index.js` wraps `fetch` requests with automatic `Authorization: Bearer <token>` injection and 401 redirection.