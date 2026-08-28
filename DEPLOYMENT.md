# 🚀 Complete Deployment Guide - AI eBook Generator

This guide provides step-by-step instructions for deploying the **AI eBook Generator** into production:
- **Frontend**: Hosted on **Netlify** (Global Edge CDN with SSL & automatic SPA rewrites).
- **Backend**: Hosted on any Node.js cloud platform (**Render**, **Railway**, **Fly.io**, **DigitalOcean App Platform**, or a **Docker VPS**).
- **Database**: **MongoDB Atlas** (Managed Cloud Database).
- **AI Engine**: **Google Gemini AI API**.

---

## 🏛️ Architecture & Backend Server Options

### Can we eliminate the backend server without compromising security?

| Approach | Security Level | Cost / Complexity | Verdict |
|---|---|---|---|
| **A. Netlify Frontend + Cloud Backend (Render/Railway/Fly.io)** | 🔒 **Maximum Security** (Secrets isolated, full IDOR protection, background AI generation) | Free to Low Cost ($0 - $5/mo) | **Recommended for Production** |
| **B. Netlify Serverless Functions (`netlify/functions`)** | 🔒 **Secure** (Secrets remain on serverless functions) | Free Tier (Netlify) | Good for small apps, but subject to 10s–26s execution timeouts on AI generation |
| **C. Direct API calls from Frontend (No backend)** | ❌ **CRITICAL SECURITY RISK** (Exposes `GEMINI_API_KEY` & MongoDB credentials to anyone inspecting browser network requests) | Zero | **UNACCEPTABLE / NEVER DO THIS** |

> [!CAUTION]
> **Why Frontend-Only is Unsafe:**
> Google Gemini API keys, MongoDB connection strings, and JWT signing keys cannot be stored in client-side JavaScript. Anyone opening DevTools could extract your Gemini API key and run up thousands of dollars in AI API billing or tamper with database records. A backend (either cloud service or serverless functions) is required to safeguard credentials.

---

## 📋 Prerequisites Checklist

Before deploying, make sure you have:
1. A **GitHub account** with this repository pushed.
2. A **MongoDB Atlas** free cluster (connection string: `mongodb+srv://...`).
3. A **Google Gemini API Key** from [Google AI Studio](https://aistudio.google.com/).
4. A **Netlify account** ([netlify.com](https://www.netlify.com/)).
5. A **Render** ([render.com](https://render.com/)) or **Railway** ([railway.app](https://railway.app/)) account.

---

## 1️⃣ Deploy Backend (Render / Railway / Fly.io)

### Method A: Render (Free & Fast)

1. Log in to [Render Dashboard](https://dashboard.render.com/) and click **New +** → **Web Service**.
2. Connect your GitHub repository: `https://github.com/MuhammadSubhanSiddiqui/ai-ebook-generator`.
3. Configure the Web Service settings:
   - **Name**: `ai-ebook-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
4. Add **Environment Variables** under the **Environment** tab:

| Key | Example Value | Description |
|---|---|---|
| `NODE_ENV` | `production` | Enables production optimizations |
| `PORT` | `5000` | Port for Express listener |
| `MONGO_URI` | `mongodb+srv://user:password@cluster.mongodb.net/ai-ebook?retryWrites=true&w=majority` | MongoDB connection string |
| `JWT_SECRET` | `super_strong_random_secret_at_least_32_chars` | Secret key for signing auth tokens |
| `JWT_EXPIRE` | `30d` | Token expiry duration |
| `GEMINI_API_KEY` | `AIzaSy...` | Google Gemini API key |
| `CORS_ORIGIN` | `https://your-app.netlify.app,http://localhost:5173` | Allowed frontend domains (comma-separated) |
| `RATE_LIMIT_WINDOW_MS` | `900000` | 15 minutes window |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | Max requests per window per IP |

5. Click **Create Web Service**.
6. Once deployed, copy your backend URL (e.g. `https://ai-ebook-backend.onrender.com`).
7. Test the health endpoint in your browser: `https://ai-ebook-backend.onrender.com/health` → should return `{"status":"ok"}`.

---

### Method B: Containerized Docker Deployment (Railway / Fly.io / VPS)

The repository includes a production-ready [`backend/Dockerfile`](file:///E:/Portfolio%20Projects/Full%20Stack/eBookGenerator/backend/Dockerfile):

```bash
# Build and run locally with Docker
cd backend
docker build -t ebook-backend .
docker run -p 5000:5000 --env-file .env ebook-backend
```

On Railway or Fly.io:
1. Connect your repo and set the root to `backend/`.
2. The platform will automatically detect `backend/Dockerfile`.
3. Input the environment variables listed above and deploy.

---

## 2️⃣ Deploy Frontend to Netlify

### Step-by-Step Netlify Setup

1. Log in to [Netlify](https://app.netlify.com/) and click **Add new site** → **Import an existing project**.
2. Authorize and select your GitHub repository.
3. Configure the **Build Settings**:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist` (or `dist` if base is `frontend`)
4. Add **Environment Variables** under **Site configuration** → **Environment variables**:

| Key | Value | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `https://ai-ebook-backend.onrender.com` | Your live backend API URL (NO trailing slash) |

5. Click **Deploy Site**.

### Automatic SPA Rewrites & Security Headers

The repository includes:
- [`frontend/public/_redirects`](file:///E:/Portfolio%20Projects/Full%20Stack/eBookGenerator/frontend/public/_redirects):
  ```
  /*    /index.html   200
  ```
- [`frontend/netlify.toml`](file:///E:/Portfolio%20Projects/Full%20Stack/eBookGenerator/frontend/netlify.toml):
  Configures automatic SPA redirects and production security headers (`X-Frame-Options`, `X-Content-Type-Options`).

When users refresh on `/dashboard`, `/login`, or `/ebook/:id`, Netlify will seamlessly route requests to `index.html` without returning 404s.

---

## 3️⃣ Connect Frontend and Backend (CORS Alignment)

1. Once Netlify gives you your live site URL (e.g. `https://ai-ebook-creator.netlify.app`), go back to your **Backend Render/Railway Dashboard**.
2. Update the `CORS_ORIGIN` environment variable on the backend to include your Netlify domain:
   ```env
   CORS_ORIGIN=https://ai-ebook-creator.netlify.app,http://localhost:5173
   ```
3. Save and trigger a redeploy of the backend.

---

## 4️⃣ Production Verification Checklist

- [ ] **Health Check**: Open `https://your-backend.onrender.com/health` → returns `{ "status": "ok" }`.
- [ ] **Frontend Load**: Open `https://your-app.netlify.app` → Landing page renders with typography, 3D Hero book, and centered Navbar.
- [ ] **Dark Mode**: Toggle Sun/Moon switch → Themes switch smoothly and persist upon browser refresh.
- [ ] **Registration & Login**: Register a new account → JWT generated and stored in localStorage.
- [ ] **AI eBook Generation**: Click **"Create New eBook"**, enter title/prompt → generation tracker animates and successfully creates chapters via Gemini.
- [ ] **eBook Reader & Editor**: Chapters display with no title repetition, drag-and-drop works, and inline editing saves.
- [ ] **PDF Export**: Click **"Export PDF"** → downloads styled PDF with cover page, Table of Contents, and pagination.
- [ ] **SPA Direct Link Test**: Refresh directly on `https://your-app.netlify.app/dashboard` → loads dashboard without 404 error.

---

## 5️⃣ Common Troubleshooting

| Symptom | Cause | Solution |
|---|---|---|
| **CORS error in browser console** | Backend `CORS_ORIGIN` missing Netlify URL | Add your exact Netlify domain to backend `CORS_ORIGIN` (no trailing slash). |
| **API calls fail with 404 or `localhost`** | `VITE_API_BASE_URL` was not set before building on Netlify | Set `VITE_API_BASE_URL=https://your-backend.onrender.com` in Netlify and **Trigger Deploy** with Clear Cache. |
| **404 on page refresh on Netlify** | Missing SPA rewrite rule | Ensure `frontend/public/_redirects` or `frontend/netlify.toml` is in repo. |
| **Backend sleeps after inactivity on Render free tier** | Render free tier spins down after 15m idle | First request takes ~30s to wake up. Use a free uptime monitor (e.g. [UptimeRobot](https://uptimerobot.com/)) hitting `GET /health` every 10m to keep it awake. |
| **Gemini AI generation fails** | Invalid or quota-limited `GEMINI_API_KEY` | Check Google AI Studio for quota and ensure `GEMINI_API_KEY` is set on backend. |