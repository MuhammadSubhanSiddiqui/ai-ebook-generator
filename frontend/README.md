# AI eBook Generator - Frontend Documentation

## Overview

The frontend is a **React** single‑page application built with **Vite** and styled using **Tailwind CSS**. It provides a clean, responsive UI for users to register, log in, manage eBooks, and view generated content.

## Prerequisites

- **Node.js** >= 20.x
- **npm** >= 10.x (or **yarn**)
- **Environment**
  - The frontend expects an API base URL at build time. It defaults to `http://localhost:5000`. Adjust the Vite define option if you deploy the backend elsewhere.

## Project Structure

```
frontend/
├─ public/
│  └─ vite.svg
├─ src/
│  ├─ assets/
│  │   └─ react.svg
│  ├─ components/
│  │   ├─ Features.jsx        # Feature list (currently not used on landing)
│  │   ├─ Footer.jsx          # Site footer
│  │   ├─ Hero.jsx            # Landing page hero section
│  │   ├─ Navbar.jsx          # Top navigation bar
│  │   ├─ PricingPage.jsx     # Pricing section (future use)
│  │   ├─ ProtectedRoute.jsx # Route guard for authenticated pages
│  │   └─ Testimonials.jsx    # User testimonials
│  ├─ pages/
│  │   ├─ Dashboard.jsx       # User's eBook library
│  │   ├─ EbookViewer.jsx     # Chapter viewer/editor
│  │   ├─ LandingPage.jsx     # Home page
│  │   ├─ Login.jsx           # Login form
│  │   └─ Register.jsx        # Registration form
│  ├─ App.jsx                  # Main app router
│  ├─ main.jsx                 # React entry point
│  ├─ index.css                # Tailwind base styles
│  └─ api/                     # API service layer (to be added)
├─ .gitignore
├─ eslint.config.js
├─ index.html
├─ package.json
└─ vite.config.js
```

## Development Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```
2. **Run locally**
   ```bash
   npm run dev
   ```
   This will launch Vite dev server at `http://localhost:5173`.
3. **Build for production**
   ```bash
   npm run build
   ```
   The built files will be in the `dist/` folder, ready for static hosting.

## Configuration

- The API URL is injected at build time via Vite's `define` option (`__API_BASE_URL__`). By default:
  ```js
  define: { __API_BASE_URL__: JSON.stringify('http://localhost:5000') }
  ```
- To change the endpoint, edit `vite.config.js`.

## UI Overview

- **LandingPage** – Hero section, features, testimonials, and footer.
- **Auth Flow** – `Login` and `Register` pages handle JWT authentication and store user info in `localStorage`.
- **Dashboard** – Lists all eBooks, allows creation, deletion, and status filtering.
- **EbookViewer** – Shows a single eBook's content, allows chapter re‑ordering via drag‑and‑drop and editing of titles/text.
- **ProtectedRoute** – Wraps routes that require authentication; redirects to `/login` when user is not logged in.

## State Management

- Uses **React hooks** (`useState`, `useEffect`) for local component state.
- **Global auth state** is persisted in `localStorage` as `userInfo`.
- API calls are performed with native **fetch**; will be abstracted into a reusable `api` service soon.

## Key UI Features

- **Responsive design** with Tailwind CSS utilities.
- **Loading spinners** for async operations.
- **Error handling** – simple console logs; will be improved.
- **Drag & Drop** – Chapter reordering using `@dnd-kit`.
- **PDF Export** – Uses `jsPDF` to generate downloadable PDFs.
- **Theme** – Light‑mode only; dark mode can be added.

## Future Enhancements (TODO)

- **API Service Layer** – Centralize HTTP requests; add request/response interceptors.
- **Global Error Boundary** – Display user‑friendly error UI.
- **Form Validation** – Utilize a library (e.g., React Hook Form + Yup).
- **Authentication Refresh** – Implement token refresh flow.
- **Skeleton Loaders** – For smoother UX while data loads.
- **Accessibility** – Ensure ARIA attributes, keyboard navigation, and color contrast.
- **Testing** – Add Jest + React Testing Library unit tests.
- **Performance Optimizations** – Code‑splitting, lazy loading of routes/components.
- **Analytics** – Integrate with Google Analytics or Plausible.
- **Dark Mode** – Add Tailwind dark mode support.

---

*Feel free to extend this documentation as the frontend evolves.*