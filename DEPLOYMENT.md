# Deployment Guide for AI eBook Generator

## Overview

This guide walks you through deploying the **AI eBook Generator** to a production environment. The application consists of two parts:

1. **Backend** – Node.js/Express API (runs on port 5000 by default)
2. **Frontend** – React/Vite SPA (served as static assets)

You can host the backend on any Node.js‑compatible platform (Render, Railway, Fly.io, AWS EC2, Heroku, etc.) and the frontend on a static hosting service (Vercel, Netlify, Cloudflare Pages, S3 + CloudFront, etc.).

---

## Prerequisites

- **Git** installed locally
- **Node.js** >= 20.x on the deployment server
- **Docker** (optional, recommended for reproducibility)
- **MongoDB** hosted (Atlas, self‑hosted, or a managed service)
- **Domain name** (optional but recommended for HTTPS)
- **Environment variables** – see `.env.example`

---

## 1. Prepare the Repository

```bash
# Clone the repo
git clone https://github.com/MuhammadSubhanSiddiqui/ai-ebook-generator.git
cd ai-ebook-generator
```

### 1.1. Verify the Code

Run the linter and tests locally before deploying:

```bash
# Backend
cd backend
npm install
npm run lint   # add lint script if not present
npm test        # will be added later

# Frontend
cd ../frontend
npm install
npm run lint   # add lint script if needed
npm test        # add after test setup
```

---

## 2. Configure Environment Variables

Create a `.env` file in both `backend/` and `frontend/` (frontend only needs a minimal one for the API URL). Use the `.env.example` as a template:

```bash
# backend/.env
PORT=5000
MONGO_URI=your-mongodb-uri
JWT_SECRET=super‑strong‑secret‑32‑chars
GEMINI_API_KEY=your‑gemini‑api‑key
CORS_ORIGIN=https://yourdomain.com,http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Important:** Never commit `.env` files to the repository.

---

## 3. Deploy Backend

### 3.1. Deploy to Render (example)

1. Create a new **Web Service** on Render.
2. Connect your GitHub repository.
3. Set **Build Command**:
   ```bash
   cd backend && npm install && npm run build   # if you have a build step, otherwise just npm install
   ```
4. Set **Start Command**:
   ```bash
   npm start
   ```
5. Add the environment variables from step 2.
6. Choose **Node** runtime (latest LTS).
7. Click **Create Web Service**.

Render will automatically set up HTTPS, a health check endpoint, and scaling.

### 3.2. Deploy with Docker (generic)

Create a `Dockerfile` in `backend/`:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --production
COPY backend/ .
RUN npm run build   # optional if you have a build step

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app .
EXPOSE 5000
CMD ["node", "index.js"]
```

Build and push image:

```bash
docker build -t your-docker-repo/ai-ebook-backend:latest ./backend
docker push your-docker-repo/ai-ebook-backend:latest
```

Run on a server (Docker Swarm, Kubernetes, Fly.io, etc.)

---

## 4. Deploy Frontend

### 4.1. Deploy to Vercel (quick)

1. Install Vercel CLI (optional): `npm i -g vercel`
2. From the `frontend/` directory, run:
   ```bash
   vercel
   ```
3. When prompted, set **Project Settings** → **Environment Variables** → `VITE_API_BASE_URL` (or edit `vite.config.js` to use `__API_BASE_URL__`).
4. Vercel will automatically build (`npm run build`) and deploy.

### 4.2. Deploy to Netlify (static hosting)

1. Push the `frontend/` folder to a separate repo or configure Netlify to use the `frontend/` subdirectory.
2. In **Build Settings**, set:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Add a **Build environment variable**:
   - `VITE_API_BASE_URL` = `https://your-backend-domain.com`
4. Deploy.

---

## 5. Configure DNS & HTTPS

- Point your domain's **A** record to the IP of your backend server (or CNAME to Render/Heroku endpoint).
- Ensure the frontend CDN (Vercel/Netlify) uses the same domain or a sub‑domain (e.g., `app.yourdomain.com`).
- Both services provide free SSL certificates.

---

## 6. Production Optimizations

1. **Enable Rate Limiting** – The backend now includes `express-rate-limit`. Configure the variables in `.env`.
2. **CORS Whitelisting** – Set `CORS_ORIGIN` to the exact domain(s) your frontend is served from.
3. **Security Headers** – Add `helmet` middleware for common security headers.
4. **Logging** – Use `winston` or `pino` for structured logs; pipe to your log aggregation service.
5. **Health Checks** – Add a simple `/health` endpoint returning `{ status: "ok" }`.
6. **Graceful Shutdown** – Capture `SIGTERM`/`SIGINT` to close DB connections before exiting.
7. **Process Manager** – Run the backend with **PM2** or **Docker** to ensure it restarts on failure.
8. **Database Backup** – Enable automated backups on your MongoDB provider.
9. **Monitoring** – Use services like **New Relic**, **Datadog**, or **Prometheus** to monitor request latency, error rates, and resource usage.
10. **Environment** – Set `NODE_ENV=production` on both backend and frontend.

---

## 7. Post‑Deployment Checklist

- [ ] Verify environment variables are correctly set on both services.
- [ ] Confirm API endpoints are reachable from the frontend (CORS headers present).
- [ ] Test user registration, login, eBook creation, and PDF download.
- [ ] Check the health endpoint (`/health`) returns a 200.
- [ ] Verify rate limiting works (e.g., exceed configured requests and receive 429).
- [ ] Ensure logs are being collected and monitored.
- [ ] Run a security scan (OWASP ZAP, npm audit) and remediate any high‑severity findings.
- [ ] Create a backup of `.env.example` and store it securely.
- [ ] Enable automatic deployments (CI/CD) for future updates.

---

## 8. Scaling Considerations

- **Horizontal scaling** – Deploy multiple backend instances behind a load balancer.
- **Cache AI responses** – Use Redis to cache generated eBooks for a short period to reduce API calls.
- **Background job queue** – Offload AI generation to a queue (BullMQ) for better resiliency and retry logic.
- **Static assets CDN** – Serve the frontend assets via a CDN for global low‑latency access.

---

## 9. Maintenance

- **Dependency updates** – Run `npm audit fix` regularly; set up Dependabot.
- **Database migrations** – If schema changes, write migration scripts and run during a maintenance window.
- **Secrets rotation** – Rotate JWT secret and API keys at least annually.
- **Uptime monitoring** – Use pingdom/healthchecks.io for endpoint uptime.

---

## 10. Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| **CORS error** in browser console | Backend `CORS_ORIGIN` does not include frontend domain | Update `.env` → `CORS_ORIGIN=https://your-frontend.com` and redeploy backend |
| **401 Unauthorized** on protected routes | JWT token missing/expired | Ensure login stores token in `localStorage`; implement token refresh flow |
| **500 Internal Server Error** on AI generation | Gemini API key invalid or quota exceeded | Verify `GEMINI_API_KEY` is correct; check Google Cloud console for quota |
| **PDF download corrupted** | `jsPDF` version mismatch or content size too large | Update `jsPDF` to latest; split PDF into multiple files if necessary |
| **Rate limit 429** after normal usage | Rate limit values too low for production traffic | Increase `RATE_LIMIT_MAX_REQUESTS` in `.env` |

---

## 11. Additional Resources

- **Node.js Best Practices** – https://nodejs.org/en/learn/best-practices/
- **Express Security** – https://expressjs.com/en/advanced/best-practice-security.html
- **MongoDB Atlas Documentation** – https://www.mongodb.com/docs/atlas/
- **Vite Deployment Docs** – https://vitejs.dev/guide/static-deploy.html
- **Google Gemini API** – https://ai.google.dev/gemini-api

---

*Happy deploying!*