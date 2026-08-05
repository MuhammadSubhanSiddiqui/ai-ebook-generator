# Progress Checklist

Live status of the production-hardening effort. ✅ = done, ⏳ = in progress, ⬜ = pending.

## Documentation
- [x] Backend README with full API reference
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
- [x] Joi input validation (register/login/ebook/testimonial)
- [x] Password strength enforcement
- [x] Ownership checks on ebook get/update/delete (IDOR fix)
- [x] Centralized error handler middleware
- [x] 404 handler for unknown routes
- [x] Health endpoint `/health`
- [x] Request logging (morgan)
- [x] Removed committed debug scripts
- [x] Removed unused multer dependency

## Backend Refactor
- [x] Validator layer (`validators/`)
- [x] `validate` middleware
- [x] `errorHandler` + `asyncHandler` middleware
- [ ] Extract Gemini generation into a `services/` layer
- [ ] Background job queue (BullMQ) — recommended
- [ ] Retry/timeout around Gemini API calls

## Frontend Refactor
- [x] Centralized API client (`src/api/`)
- [x] AuthContext for auth state management
- [x] Auth token handling / 401 redirect
- [x] Loading states throughout
- [x] Error handling in all pages
- [x] Form validation UX
- [x] Remove dead `PricingPage.jsx`
- [ ] Remove broken hero "Watch How It Works" button
- [ ] Improve EbookViewer polling/cancellation

## Cleanup
- [x] Removed debug scripts (backend)
- [x] Removed unused multer dependency
- [x] Removed dead PricingPage.jsx
- [x] Removed unused Features.jsx
- [ ] Remove unused SVG assets (react.svg, vite.svg)
- [ ] Verify all dependencies are used

## Testing
- [ ] Jest + supertest unit/integration tests
- [ ] E2E tests with Playwright/Cypress
- [ ] CI pipeline (GitHub Actions)

## Deployment
- [x] DEPLOYMENT.md guide
- [ ] Dockerfile
- [ ] Environment var wiring for Vercel/Render
- [ ] Health check monitoring
- [ ] Database backup setup