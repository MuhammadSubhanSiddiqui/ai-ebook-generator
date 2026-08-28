# Progress Checklist

Live status of the production-hardening and UI/UX modernization effort. ✅ = done, ⏳ = in progress, ⬜ = pending.

## Documentation
- [x] Backend README with full API reference (including `/api/users/profile`)
- [x] Frontend README with setup guide, theme system, & typography reference
- [x] Root README with architecture, security, & testing overview
- [x] ARCHITECTURE.md with component diagrams & data models
- [x] DEPLOYMENT.md production guide
- [x] SECURITY.md with IDOR & prompt injection audits
- [x] `.env.example`
- [x] PROGRESS.md (this file)

## Security
- [x] Rate limiting (express-rate-limit)
- [x] Helmet security headers
- [x] CORS allowlist via `CORS_ORIGIN`
- [x] Joi input validation (register/login/profile/ebook/testimonial)
- [x] Password strength enforcement (min 8 chars, Aa1@)
- [x] Ownership checks on ebook get/update/delete (IDOR fix)
- [x] Centralized error handler middleware
- [x] 404 handler for unknown routes
- [x] Health endpoint `/health`
- [x] Request logging (morgan)
- [x] Removed committed debug scripts
- [x] Removed unused multer dependency
- [x] Prompt input sanitization / injection mitigation

## Backend Refactor
- [x] Validator layer (`validators/`)
- [x] `validate` middleware
- [x] `errorHandler` + `asyncHandler` middleware
- [x] Extract Gemini generation into a `services/` layer (`backend/services/geminiService.js`)
- [x] Retry logic (exponential backoff) & hard timeout around Gemini API calls
- [x] Distinct `'failed'` status in Ebook model enum with `generationError` field
- [x] Implemented missing user profile endpoints (`GET /api/users/profile`, `PUT /api/users/profile`)
- [ ] Background job queue (BullMQ) — optional future scaling

## Frontend & UI/UX Redesign
- [x] Design system foundation with CSS variable tokens & Tailwind 4 `@theme`
- [x] Editorial typography pairing (**Cinzel**, **Lora**, **Plus Jakarta Sans**) via Google Fonts
- [x] Light / Dark mode theme system with persistent toggle & flicker-free head initializer
- [x] Shimmering skeleton screens matching card & reader layouts (`Skeletons.jsx`)
- [x] Illustrated zero-eBooks and empty search filter states
- [x] Animated multi-step AI generation progress timeline (*Outline* → *Prose* → *Layout* → *Finalize*)
- [x] Realistic 3D eBook cover design with spine crease (`book-spine-crease`) & palette picker
- [x] Micro-interactions: page-turn transitions, staggered grid fade-ins, floating hero preview
- [x] Split hero layout on landing page with 3D live preview
- [x] Centralized API client (`src/api/`)
- [x] AuthContext for global auth state management
- [x] Form validation UX with password visibility toggles
- [x] High-quality PDF export with cover page, TOC, header/footer pagination (`Page X of Y`)

## Cleanup
- [x] Removed debug scripts (`check_db.js`, `debug_ebook.js`, `list_models.js`, `test_model.js`)
- [x] Removed unused `multer` dependency
- [x] Removed dead `PricingPage.jsx`
- [x] Preserved active `Features.jsx` on landing page
- [x] Removed unused `react.svg` asset
- [x] Verified dependencies and imports

## Testing
- [x] Jest + Supertest integration tests (26 tests covering auth flow, profile endpoints, IDOR ownership isolation, and Joi validation edge cases)
- [x] CI pipeline via GitHub Actions (`.github/workflows/ci.yml`)
- [ ] E2E tests with Playwright/Cypress

## Deployment
- [x] DEPLOYMENT.md complete guide (Netlify + Render/Railway/Docker)
- [x] Netlify SPA configuration (`_redirects` & `netlify.toml`)
- [x] Dynamic `VITE_API_BASE_URL` environment loading in `vite.config.js`
- [x] Production Dockerfile and `.dockerignore` for backend
- [x] Enhanced CORS origin validator handling multiple domains and trailing slashes
- [x] GitHub Actions CI workflow (`.github/workflows/ci.yml`)
- [x] Health check monitoring endpoint (`/health`)