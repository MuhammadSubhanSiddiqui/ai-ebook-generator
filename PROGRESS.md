# Progress Checklist

Live status of the production-hardening and UI/UX modernization effort. ✅ = done, ⏳ = in progress, ⬜ = pending.

## Two-Step Verification & Auth Hardening (2FA OTP)
- [x] User model schema expansion: `isVerified`, hashed `otp`, `otpExpiresAt`, `otpPurpose`, `otpAttempts`, `lastOtpSentAt`, `loginAttempts`, `lockUntil`, `tokenVersion`
- [x] Zero-leakage serialization: custom `toJSON` transform stripping all OTPs, credentials, and lockout internals
- [x] Cryptographic 6-digit OTP generator (`crypto.randomInt`) with SHA-256 peppered hashing
- [x] Constant-time verification (`crypto.timingSafeEqual`) with synthetic comparison delays against timing side-channels
- [x] Two-Step Registration flow (`POST /api/auth/register` + `POST /api/auth/verify-registration-otp`)
- [x] Two-Step Login flow with short-lived signed pre-auth `pendingSessionToken` (`POST /api/auth/login` + `POST /api/auth/verify-login-otp`)
- [x] Password recovery via OTP (`POST /api/auth/forgot-password` + `POST /api/auth/reset-password`)
- [x] Anti-enumeration defenses on registration, login, and password reset endpoints
- [x] Account lockout defense: 5 failed attempts locks account for 15 minutes (HTTP 423)
- [x] Scoped rate limiting via `express-rate-limit` keyed on IP + normalized email
- [x] Cooldown enforcement on OTP resends (`POST /api/auth/resend-otp`)
- [x] Global session invalidation across devices on password reset via `tokenVersion`
- [x] HTTP-only, SameSite, Secure JWT cookie delivery with fallback Bearer header resolution
- [x] Resilient transactional emailer (`backend/services/mailerService.js`) with exponential retry backoff & hard timeouts
- [x] Automated transactional rollback of OTP fields if email delivery fails
- [x] GDPR Right to Erasure endpoint (`DELETE /api/auth/account`) permanently deleting account and all user eBooks
- [x] 38 automated Jest + Supertest integration tests passing (100% test suite success)

## Legal, Compliance & Privacy
- [x] Tailored Privacy Policy page (`/privacy`) detailing account data, Google Gemini AI processing disclosures, SMTP email delivery, and GDPR rights
- [x] Tailored Terms of Service page (`/terms`) covering user IP ownership, 2FA security obligations, and acceptable AI use
- [x] Cookie Consent banner (`CookieConsent.jsx`) distinguishing strictly necessary JWT cookies from optional preferences
- [x] Legal navigation links integrated into registration agreement, login footer, and global footer
- [x] GDPR account deletion trigger integrated into user dashboard settings modal

## Documentation
- [x] Backend README with full API reference (including all `/api/auth/*` endpoints and status codes)
- [x] Frontend README with setup guide, theme system, & typography reference
- [x] Root README with architecture, security, & testing overview
- [x] ARCHITECTURE.md with component diagrams & data models
- [x] DEPLOYMENT.md production guide
- [x] SECURITY.md with 2FA OTP audit, lockout policies, rate limits, and sequence diagrams
- [x] `.env.example` updated with OTP and email variables
- [x] PROGRESS.md (this file)

## Security
- [x] Rate limiting (express-rate-limit)
- [x] Helmet security headers
- [x] CORS allowlist via `CORS_ORIGIN` with credentials support
- [x] Joi input validation with `.unknown(false)` rejection of unexpected fields
- [x] Password strength enforcement (min 8 chars, Aa1@)
- [x] Ownership checks on ebook get/update/delete (IDOR fix)
- [x] Centralized error handler middleware with custom AppError, OtpError, AccountLockedError
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
- [x] Extract Nodemailer delivery into a `services/` layer (`backend/services/mailerService.js`)
- [x] Retry logic (exponential backoff) & hard timeout around Gemini & Nodemailer calls
- [x] Distinct `'failed'` status in Ebook model enum with `generationError` field
- [x] Implemented missing user profile endpoints (`GET /api/users/profile`, `PUT /api/users/profile`)
- [ ] Background job queue (BullMQ) — optional future scaling

## Frontend & UI/UX Redesign
- [x] Design system foundation with CSS variable tokens & Tailwind 4 `@theme`
- [x] Editorial typography pairing (**Cinzel**, **Lora**, **Plus Jakarta Sans**) via Google Fonts
- [x] Light / Dark mode theme system with persistent toggle & flicker-free head initializer
- [x] Accessible 6-digit `OtpInput` with auto-advance, paste splitting, and arrow navigation
- [x] Two-step OTP verification screens on Login, Register, and Forgot Password
- [x] Visible countdown timers with cooldown lock on OTP resend buttons
- [x] Shimmering skeleton screens matching card & reader layouts (`Skeletons.jsx`)
- [x] Illustrated zero-eBooks and empty search filter states
- [x] Animated multi-step AI generation progress timeline (*Outline* → *Prose* → *Layout* → *Finalize*)
- [x] Realistic 3D eBook cover design with spine crease (`book-spine-crease`) & palette picker
- [x] Micro-interactions: page-turn transitions, staggered grid fade-ins, floating hero preview
- [x] Split hero layout on landing page with 3D live preview
- [x] Centralized API client (`src/api/`) with HTTP-only cookie support
- [x] AuthContext with intermediate pending-login state management
- [x] Form validation UX with password visibility toggles
- [x] High-quality PDF export with cover page, TOC, header/footer pagination (`Page X of Y`)

## Testing
- [x] Jest + Supertest integration tests (38 tests covering 2FA OTP auth, lockout, reset, profile, IDOR ownership isolation, and Joi validation edge cases)
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