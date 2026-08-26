# Progress Checklist

Live status of the production-hardening effort. ✅ = done, ⏳ = in progress, ⬜ = pending.

## Documentation
- [x] Backend README with full API reference (including `/api/users/profile`)
- [x] Frontend README with setup guide
- [x] Root README
- [x] ARCHITECTURE.md
- [x] DEPLOYMENT.md
- [x] SECURITY.md
- [x] `.env.example`
- [x] PROGRESS.md (this file)

## Security
- [x] Rate limiting (express-rate-limit)
- [x] Helmet security headers
- [x] CORS allowlist via `CORS_ORIGIN`
- [x] Joi input validation (register/login/profile/ebook/testimonial)
- [x] Password strength enforcement
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
- [ ] Background job queue (BullMQ) — optional future optimization

## Frontend Refactor
- [x] Centralized API client (`src/api/`)
- [x] AuthContext for auth state management
- [x] Auth token handling / 401 redirect
- [x] Loading states throughout
- [x] Error handling in all pages
- [x] Form validation UX
- [x] Visibility-aware polling with exponential backoff and timeout caps in EbookViewer
- [x] High-quality PDF export with cover page, TOC, header/footer pagination, and consistent typography
- [x] Password visibility toggle in auth forms
- [x] Animated interactive features & testimonials cards

## Cleanup
- [x] Removed debug scripts (`check_db.js`, `debug_ebook.js`, `list_models.js`, `test_model.js`)
- [x] Removed unused `multer` dependency
- [x] Removed dead `PricingPage.jsx`
- [x] Preserved active `Features.jsx` on landing page
- [x] Removed unused `react.svg` asset
- [x] Verified dependencies and imports

## Testing
- [x] Jest + supertest integration tests (26 tests covering auth flow, profile endpoints, IDOR ownership isolation, and Joi validation edge cases)
- [x] CI pipeline via GitHub Actions (`.github/workflows/ci.yml`)
- [ ] E2E tests with Playwright/Cypress

## Deployment
- [x] DEPLOYMENT.md guide
- [x] GitHub Actions CI workflow
- [ ] Dockerfile
- [ ] Environment var wiring for Vercel/Render
- [ ] Health check monitoring
- [ ] Database backup setup