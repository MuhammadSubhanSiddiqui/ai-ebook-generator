# 🚀 AI eBook Generator

A full-stack web application that lets users create professional eBooks from a simple title and description, powered by **Google Gemini AI**.

## ✨ Features

- 🔐 **User Authentication** – Secure registration/login with JWT & bcrypt-hashed passwords
- 📚 **AI eBook Generation** – Generate multi-chapter eBooks from a title + description
- 📖 **Ebook Reader** – Clean, page-based reading experience
- ✏️ **Content Editor** – Edit chapter titles, text, and reorder chapters with drag & drop
- 📄 **PDF Export** – Download eBooks as styled PDFs using jsPDF
- ⚡ **Responsive UI** – Tailwind CSS, mobile-first design
- 🏠 **Public Landing Page** – Hero, features, and testimonials sections

## 🧱 Tech Stack

| Layer     | Technology |
|-----------|------------|
| **Frontend** | React 19, Vite 7, Tailwind CSS 4, React Router 7, jsPDF, dnd-kit |
| **Backend**  | Node.js, Express 5, Mongoose (MongoDB), JWT, bcryptjs |
| **AI**       | Google Generative AI (Gemini 2.5 Flash) |

## 📁 Project Structure

```
eBookGenerator/
├── backend/          # Express REST API (see backend/README.md)
├── frontend/         # React SPA (see frontend/README.md)
├── ARCHITECTURE.md   # System design & data models
├── DEPLOYMENT.md     # Deployment guide (Render/Vercel/etc.)
└── SECURITY.md       # Security review & hardenings
```

## 🚀 Quick Start

### 1. Backend

```bash
cd backend
cp .env.example .env    # fill in MONGO_URI, JWT_SECRET, GEMINI_API_KEY
npm install
npm run dev             # starts on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev             # starts on http://localhost:5173
```

## 📄 Documentation Index

- [Architecture](ARCHITECTURE.md)
- [Deployment](DEPLOYMENT.md)
- [Security](SECURITY.md)
- [Backend API Reference](backend/README.md)
- [Frontend Guide](frontend/README.md)

## 🛠 Scripts

### Backend
- `npm start` – run in production
- `npm run dev` – run with nodemon (hot reload)

### Frontend
- `npm run dev` – Vite dev server
- `npm run build` – production build → `dist/`
- `npm run preview` – preview production build

## 🔒 Security

- Rate limiting on all `/api` routes
- Helmet security headers
- CORS restricted to whitelisted origins
- Joi input validation on all routes
- Password strength enforcement
- Ownership checks on all protected resources (no IDOR)
- All secrets stored in environment variables

See [SECURITY.md](SECURITY.md) for the full security review.

## 📝 License

ISC