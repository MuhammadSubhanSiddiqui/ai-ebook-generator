# AI eBook Generator - Backend Documentation

## Overview

The backend is built with **Node.js**, **Express**, and **MongoDB** (via Mongoose). It provides a set of RESTful APIs for authentication, eBook management, and testimonials. All routes follow a consistent structure with request validation, authentication (where required), and standardized response formats.

## Prerequisites

- **Node.js** >= 20.x
- **npm** >= 10.x (or **yarn**) 
- **MongoDB** cluster (Atlas or self‑hosted)
- **Google Gemini API key** (for AI content generation)
- **Environment variables** defined in `.env` (see `.env.example` for reference)

## Project Structure

```
backend/
├─ config/
│  └─ db.js               # MongoDB connection helper
├─ controllers/
│  ├─ ebookController.js # eBook CRUD + generation logic
│  ├─ userController.js  # Registration & login
│  └─ testimonialController.js
├─ middleware/
│  └─ authMiddleware.js # JWT authentication guard
├─ models/
│  ├─ Ebook.js           # eBook schema
│  ├─ User.js            # User schema
│  └─ Testimonial.js     # Testimonial schema
├─ routes/
│  ├─ ebookRoutes.js     # /api/ebooks routes
│  ├─ userRoutes.js      # /api/users routes
│  └─ testimonialRoutes.js
├─ services/              # Business logic (to be implemented)
├─ validators/            # Request validation schemas (to be implemented)
├─ utils/                # Common utilities (to be implemented)
├─ index.js               # Application entry point
├─ .env.example           # Environment variables template
└─ package.json
```

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| **PORT** | Port the server will listen on | `5000` |
| **MONGO_URI** | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db?retryWrites=true&w=majority` |
| **JWT_SECRET** | Secret used to sign JWT tokens – at least 32 characters | `mycomplexsecret1234567890` |
| **GEMINI_API_KEY** | API key for Google Gemini (AI generation) | `AIzaSy...` |
| **CORS_ORIGIN** | Comma‑separated list of allowed origins for CORS | `https://mydomain.com,http://localhost:5173` |
| **RATE_LIMIT_WINDOW_MS** | Time window for rate limiting (ms) | `900000` (15 min) |
| **RATE_LIMIT_MAX_REQUESTS** | Max requests per window per IP | `100` |
| **EMAIL_...** | Email service configuration (future use) |
| **FEATURE_FLAGS** | Enable/disable optional features |

## API Reference

### Authentication

#### Register a New User
```http
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "StrongP@ssw0rd!"
}
```
- **Response** (201):
```json
{
  "_id": "60f73e1234567890abcdef12",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "<jwt-token>"
}
```
- **Validations**:
  - **Email** must be a valid email address and unique.
  - **Password** must meet strength requirements (min 8 characters, include uppercase, number, special char).
  - **Name** cannot be empty.

#### Login
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "StrongP@ssw0rd!"
}
```
- **Response** (200): Same as registration.

### eBooks

> All eBook routes are **protected** – the request must include an `Authorization: Bearer <token>` header.

#### Get All eBooks (User's Library)
```http
GET /api/ebooks
Authorization: Bearer <jwt-token>
```
- **Response** (200): Array of eBook objects for the authenticated user.

#### Get eBook By ID
```http
GET /api/ebooks/:id
Authorization: Bearer <jwt-token>
```
- **Response** (200): Single eBook document.

#### Create a New eBook
```http
POST /api/ebooks
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Future of AI",
  "description": "An in‑depth look at AI trends",
  "coverColor": "bg-gradient-to-br from-blue-500 to-indigo-600"
}
```
- Immediately triggers background generation via Google Gemini.
- **Status** initially `generating`.

#### Update an eBook
```http
PUT /api/ebooks/:id
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "New description",
  "status": "draft",
  "content": [...],
  "totalPages": 12
}
```
- Allows editing title, description, content order, etc.

#### Delete an eBook
```http
DELETE /api/ebooks/:id
Authorization: Bearer <jwt-token>
```
- Permanently removes eBook.

### Testimonials

#### Get All Testimonials (Public)
```http
GET /api/testimonials
```
- Returns list of public testimonials.

#### Create Testimonial (Authenticated)
```http
POST /api/testimonials
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "text": "Loved the AI eBook creator!",
  "role": "Writer"
}
```
- `authorName` is automatically derived from the logged‑in user.

#### Delete Testimonial (Authenticated, Owner Only)
```http
DELETE /api/testimonials/:id
Authorization: Bearer <jwt-token>
```
- Only the user who created the testimonial can delete it.

## Response Format

Every endpoint returns JSON with either the resource data or an error message. Errors follow this shape:
```json
{
  "message": "Error description"
}
```
- **HTTP status codes** are used appropriately (200, 201, 400, 401, 404, 500).

## Middleware

- **authMiddleware** – Verifies JWT and attaches `req.user`.
- **errorHandler** – (Future) Centralized error handling returning consistent JSON.
- **rateLimiter** – (Future) Rate limiting to mitigate abuse.
- **cors** – Configured to allow only whitelisted origins.

## Business Logic

The current code embeds AI generation directly in the controller. In the upcoming refactor we will extract this into a **service** (`EbookService`) which will:
- Validate input
- Trigger AI generation via a background job queue (e.g., BullMQ)
- Store generated content safely
- Update eBook status

## Security Considerations

- All JWT secrets and API keys are stored in environment variables only.
- Passwords are hashed with **bcryptjs** before storage.
- Input validation (Joi/Zod) will be added to all routes.
- CORS will be restricted to trusted origins.
- Rate limiting will protect against brute‑force attacks.

## Development Workflow

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```
2. **Create `.env` file** based on `.env.example`.
3. **Run development server**
   ```bash
   npm run dev   # uses nodemon for hot reload
   ```
4. **Run tests** (future – Jest will be set up)
   ```bash
   npm test
   ```

## Production Checklist

- [ ] Use a process manager (PM2, Docker, or similar) to keep the server alive.
- [ ] Enable **HTTPS** (TLS termination at load balancer or reverse proxy).
- [ ] Set `NODE_ENV=production`.
- [ ] Enable **rate limiting** and **CORS** restrictions.
- [ ] Use a robust **logging** solution (Winston/Morgan) and forward logs to a centralized system.
- [ ] Configure **monitoring** and health checks (`/health`).
- [ ] Ensure **backup** and **restore** procedures for MongoDB.
- [ ] Rotate and revoke JWT secrets periodically.
- [ ] Harden container security (if Dockerized).

---

*Feel free to extend or customize this documentation as the project evolves.*