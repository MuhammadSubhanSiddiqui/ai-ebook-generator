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

## Backend Refactor
- [x] Validator layer (`validators/`)
- [x] `validate` middleware
- [x] `errorHandler` + `asyncHandler` middleware
- [ ] Extract Gemini generation into a `services/` layer
- [ ] Background job queue (BullMQ) — recommended
- [ ] Retry/timeout around Gemini API calls

## Frontend Refactor
- [ ] Centralized API client (`src/api/`)
- [ ] Auth token handling / 401 redirect
- [ ] Loading skeletons
- [ ] Error boundaries
- [ ] Form validation UX
- [ ] Remove dead `PricingPage.jsx`
- [ ] Remove broken hero "Watch How It Works" button
- [ ] Improve EbookViewer polling/cancellation

## Cleanup
- [x] Removed debug scripts (backend)
- [ ] Remove unused `react.svg` / `vite.svg` assets
- [ ] Remove dead `PricingPage.jsx`
- [ ] Verify dependency usage

## Testing
- [ ] Jest + supertest unit/integration tests
- [ ] CI pipeline (GitHub Actions)

## Deployment
- [x] DEPLOYMENT.md guide
- [ ] Dockerfile
- [ ] Environment var wiring for Vercel/Render