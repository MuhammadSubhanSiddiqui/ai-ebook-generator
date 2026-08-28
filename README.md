# 🚀 AI eBook Generator

A full-stack application that empowers authors and creators to generate professional, multi-chapter eBooks from a title and prompt description in minutes, powered by **Google Gemini AI**.

---

## ✨ Key Features

- 🔐 **User Authentication & Profiles** – Secure registration, login, and profile management with JWT and bcrypt password hashing.
- 📚 **Reliable AI Generation** – Resilient generation service with prompt sanitization, automatic retries with exponential backoff, and hard timeouts.
- ⏳ **Visual Generation Progress** – Interactive multi-step animated milestone tracker showing outline creation, chapter drafting, and layout finalization.
- 🎨 **Publishing Design System & Dark Mode** – Custom typography pairing (**Cinzel**, **Lora**, **Plus Jakarta Sans**), design tokens, and persistent light/dark mode theme support.
- 📖 **eBook Reader & Editor** – Page-turn transitions, inline chapter editing, and smooth drag-and-drop chapter reordering via `@dnd-kit`.
- 🖼️ **Realistic 3D Book Covers** – Embossed title typography, spine creases, and customizable theme palettes (Sapphire Indigo, Royal Amethyst, Emerald Forest, Crimson Rose, Amber Sun).
- 📄 **Publishing-Quality PDF Export** – Download eBooks with styled cover pages, auto-generated table of contents with dot leaders, and running headers/footers with `Page X of Y`.
- 🧪 **Automated Testing & CI Pipeline** – Comprehensive Jest + Supertest integration tests (26 test cases) and automated GitHub Actions CI workflow.

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 7, Tailwind CSS 4, React Router 7, jsPDF, @dnd-kit, Lucide Icons |
| **Backend** | Node.js, Express 5, Mongoose (MongoDB), JWT, bcryptjs, Helmet, Express Rate Limit, Joi |
| **AI Integration** | Google Generative AI (Gemini 2.5 Flash) via resilient `geminiService` |
| **Testing & CI** | Jest, Supertest, MongoMemoryServer, GitHub Actions |

---

## 📁 Project Structure

```
eBookGenerator/
├── .github/workflows/ci.yml # Automated CI pipeline (Backend Tests + Frontend Build)
├── backend/                 # Express 5 REST API
│   ├── config/              # MongoDB connection
│   ├── controllers/         # Route controller logic (auth, ebooks, testimonials, profile)
│   ├── middleware/          # JWT protect, Joi validate, error handler
│   ├── models/              # Mongoose schemas (User, Ebook, Testimonial)
│   ├── routes/              # Express route definitions
│   ├── services/            # Gemini AI generation service with retry & timeouts
│   ├── tests/               # Jest & Supertest integration test suites
│   └── validators/          # Joi input validation schemas
├── frontend/                # React 19 SPA
│   ├── src/
│   │   ├── api/             # Centralized API client
│   │   ├── components/      # Navbar, Hero, Features, Testimonials, Footer, Skeletons
│   │   ├── context/         # AuthContext and ThemeContext (Light/Dark mode)
│   │   └── pages/           # LandingPage, Dashboard, EbookViewer, Login, Register
│   └── index.html           # Root HTML with instant theme initialization
├── ARCHITECTURE.md          # Comprehensive architectural & data flow documentation
├── DEPLOYMENT.md            # Production deployment guide (Render/Vercel/Atlas)
├── PROGRESS.md              # Live status and completed hardening checklists
└── SECURITY.md              # Security hardening & IDOR protection audit
```

---

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
cp .env.example .env    # Fill in MONGO_URI, JWT_SECRET, GEMINI_API_KEY
npm install
npm run dev             # Starts server on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev             # Starts Vite dev server on http://localhost:5173
```

### 3. Running Tests

```bash
cd backend
npm test                # Executes 26 Jest + Supertest integration tests
```

---

## 📄 Documentation Index

- [Architecture](ARCHITECTURE.md) – Component architecture, data flows, and state diagrams.
- [Deployment](DEPLOYMENT.md) – Vercel, Render, and MongoDB Atlas deployment guide.
- [Security](SECURITY.md) – Security review, rate limiting, and IDOR protection.
- [Progress Checklist](PROGRESS.md) – Detailed tracker of completed enhancements.
- [Backend API Reference](backend/README.md) – Full endpoint documentation and payloads.
- [Frontend Guide](frontend/README.md) – Client-side architecture, theme system, and component guides.

---

## 🛠 Available Scripts

### Backend (`/backend`)
- `npm start` – Run server in production mode
- `npm run dev` – Run server in development mode with nodemon hot reloading
- `npm test` – Run test suite with Jest & Supertest

### Frontend (`/frontend`)
- `npm run dev` – Launch Vite development server
- `npm run build` – Compile optimized production bundle to `dist/`
- `npm run preview` – Locally preview production build

---

## 🔒 Security & Reliability

- **Rate Limiting**: Configured via `express-rate-limit` on all `/api` endpoints.
- **Helmet Headers**: Enhanced HTTP security headers enabled.
- **CORS Protection**: Origin restricted to authorized frontend domains.
- **Strict Input Validation**: Joi schemas enforce strong passwords, email formats, and string limits.
- **Prompt Injection Defense**: Sanitization and delimiter isolation on prompt inputs.
- **Ownership Isolation**: Guaranteed IDOR protection on all eBook CRUD operations.
- **Resilient AI Calling**: 3-attempt exponential backoff with a 35s hard timeout.

---

## 📝 License

ISC