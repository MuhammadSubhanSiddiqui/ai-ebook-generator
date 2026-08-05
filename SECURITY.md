# 🔒 Security Review & Hardening

This document summarizes the security analysis of the **AI eBook Generator** and the mitigations that have been applied on top of the original codebase.

## Original Vulnerabilities Found

### 1. Critical: Missing Authorization (IDOR) on eBook routes
- `getEbookById`, `updateEbook`, and `deleteEbook` fetched ebooks by `_id` only, **without** checking `user`. Any authenticated user could read, modify, or delete any other user's ebooks by guessing/iterating IDs.
- **Fix:** All three endpoints now scope queries with `{ _id, user: req.user._id }`.

### 2. High: No Input Validation
- Registration and ebook endpoints accepted arbitrary/unvalidated payloads (unsanitized HTML, oversized fields, malformed email).
- **Fix:** Added Joi validation middleware for registration, login, ebook create/update, and testimonials.

### 3. High: Weak Password Policy
- Passwords could be as short or trivial as the user chose.
- **Fix:** Enforce min 8 chars with uppercase, lowercase, number, and special character on registration.

### 4. High: No Rate Limiting
- Login/register and all endpoints were open to brute-force and abuse.
- **Fix:** Added `express-rate-limit` (default 100 req / 15 min per IP, configurable via env).

### 5. Medium: CORS Wide Open
- `app.use(cors())` allowed any origin.
- **Fix:** CORS now reads an allowlist from `CORS_ORIGIN` env var (comma-separated). Falls back to `*` if unset (dev only).

### 6. Medium: Missing Security Headers
- No `X-Content-Type-Options`, CSP, `Strict-Transport-Security`, frame-ancestors, etc.
- **Fix:** Added the `helmet` middleware.

### 7. Medium: Verbose Error Messages
- Controllers returned raw `error.message` to the client, leaking internals (DB paths, stack details).
- **Fix:** Standardized error responses; raw errors logged server-side only.

### 8. Medium: JWT Handling
- Token expiry produced a generic error; no ended-token response distinction.
- **Fix:** authMiddleware now distinguishes expired vs invalid tokens and handles missing users.

### 9. Low: Debug Scripts Committed
- `debug_ebook.js`, `check_db.js`, `list_models.js`, `test_model.js` were committed to the repo.
- **Fix:** Removed all four debug scripts.

## Applied Production Hardening

| Control | Implementation |
|---|---|
| **Rate limiting** | `express-rate-limit` on `/api/*` |
| **Security headers** | `helmet` |
| **CORS allowlist** | `CORS_ORIGIN` env var |
| **Input validation** | Joi validator layer (`middleware/validate.js`) |
| **Password policy** | Upper/lower/digit/special + min length |
| **Ownership checks** | Scoped queries on protected resources |
| **Request logging** | `morgan` |
| **Centralized errors** | `middleware/errorHandler.js` |
| **Health endpoint** | `GET /health` |
| **Secrets in env** | `.env.example` documents all variables; `.env` is git-ignored |

## Recommended Priorities (Production Go-Live)

1. **Enable HTTPS** at the reverse proxy / load balancer (TLS termination).
2. **Set a strong `JWT_SECRET`** (≥ 32 random chars) in production.
3. **Enable email verification / password reset** before public launch.
4. **Add a background job queue** (BullMQ) so Gemini generation is retryable and doesn't run inside the request path.
5. **Pin AI output size / length** and add a retry + timeout around Gemini calls.
6. **Run `npm audit`** in CI and gate on high/critical severity.
7. **Add Content Security Policy** via helmet config tailored to Vite dev/build.
8. **Set up database backups** and monitoring for the MongoDB cluster.

## Auth Flow

- Passwords hashed with `bcryptjs` (10 salt rounds) via `UserSchema.pre('save')`.
- JWT signed with `JWT_SECRET`, expiry from `JWT_EXPIRE` (default 30d).
- `protect` middleware verifies `Authorization: Bearer <token>` and loads the user.
- Ownership is enforced per-resource by scoping queries to `req.user._id`.

## Sensitive Data

- `MONGO_URI`, `GEMINI_API_KEY`, `JWT_SECRET` are only read from the environment.
- Never commit `.env` files (see `.gitignore`).
- `PricingPage.jsx` includes hard-coded pricing; if real billing is added, use a server-side pricing source.

---

*Review completed as part of making the repository production-ready.*