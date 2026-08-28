# AI eBook Generator - Backend Documentation

## Overview

The backend is built with **Node.js**, **Express 5**, and **MongoDB** (via Mongoose). It provides a secure, hardened RESTful API for user authentication, profile management, AI eBook generation, and community testimonials. All routes implement centralized input validation via Joi, JWT authentication guards, rate limiting, and structured error responses.

---

## Prerequisites

- **Node.js** >= 20.x
- **npm** >= 10.x
- **MongoDB** database (MongoDB Atlas or local)
- **Google Gemini API Key** (for AI content generation)
- **Environment variables** defined in `.env` (see `.env.example`)

---

## Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection handler
├── controllers/
│   ├── ebookController.js    # eBook CRUD operations & generation triggering
│   ├── userController.js     # User registration, login, and profile management
│   └── testimonialController.js # Testimonial CRUD
├── middleware/
│   ├── authMiddleware.js     # JWT authentication guard & req.user injection
│   ├── errorHandler.js       # Centralized error handler & asyncHandler wrapper
│   └── validate.js           # Joi request body validation middleware
├── models/
│   ├── Ebook.js              # eBook schema (draft, generating, completed, failed)
│   ├── User.js               # User schema with bcrypt pre-save hashing
│   └── Testimonial.js        # Testimonial schema
├── routes/
│   ├── ebookRoutes.js        # Protected eBook endpoints
│   ├── userRoutes.js         # User auth and /profile routes
│   └── testimonialRoutes.js  # Testimonial endpoints
├── services/
│   └── geminiService.js      # Gemini AI content generator with retries & timeouts
├── tests/
│   ├── setup.js              # In-memory / Atlas test database configuration
│   ├── auth.test.js          # Authentication and user profile test suite
│   ├── ebook.test.js         # eBook CRUD & IDOR ownership isolation test suite
│   └── validators.test.js    # Joi schema validation and sanitizer test suite
├── validators/
│   ├── ebookValidator.js     # eBook validation schemas
│   ├── userValidator.js      # User registration, login, & profile schemas
│   └── testimonialValidator.js # Testimonial validation schemas
├── index.js                  # Application configuration & server entry point
├── .env.example              # Environment variables template
└── package.json              # Backend dependencies & test scripts
```

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the server listens on | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/ai-ebook-generator?retryWrites=true&w=majority` |
| `JWT_SECRET` | Secret key used to sign JWT tokens (min 32 chars) | `mycomplexsecret1234567890` |
| `JWT_EXPIRE` | Expiry duration for JWT tokens | `30d` |
| `GEMINI_API_KEY` | Google Gemini AI API key | `AIzaSy...` |
| `CORS_ORIGIN` | Comma-separated list of allowed frontend origins | `http://localhost:5173,https://yourdomain.com` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in milliseconds | `900000` (15 minutes) |
| `RATE_LIMIT_MAX_REQUESTS`| Max requests per IP per window | `100` |

---

## API Reference

### Health Check

#### Check Server Status
```http
GET /health
```
- **Response** (200):
```json
{
  "status": "ok",
  "timestamp": "2026-08-26T20:00:00.000Z"
}
```

---

### Authentication & Profile

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
  - `email`: Valid email format, unique in database.
  - `password`: Min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special character.
  - `name`: Min 2 chars, required.

#### Login
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "StrongP@ssw0rd!"
}
```
- **Response** (200): Same format as registration with refreshed JWT token.

#### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <jwt-token>
```
- **Response** (200):
```json
{
  "_id": "60f73e1234567890abcdef12",
  "name": "John Doe",
  "email": "john@example.com"
}
```

#### Update User Profile
```http
PUT /api/users/profile
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "John Doe Updated",
  "email": "john_new@example.com",
  "password": "NewStrongP@ssw0rd!"
}
```
- **Response** (200): Updated user object with new JWT token.

---

### eBooks

> All eBook endpoints require an `Authorization: Bearer <jwt-token>` header and enforce **strict user ownership** (IDOR prevention).

#### Get All User eBooks
```http
GET /api/ebooks
Authorization: Bearer <jwt-token>
```
- **Response** (200): Array of eBook documents owned by the authenticated user.

#### Create eBook
```http
POST /api/ebooks
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Artificial Intelligence in 2026",
  "description": "A comprehensive guide on generative models and autonomous agents.",
  "coverColor": "bg-gradient-to-br from-blue-600 via-indigo-700 to-indigo-900"
}
```
- **Response** (201): Newly created eBook document with status `'generating'`. Gemini AI content generation executes asynchronously in the background.

#### Get Single eBook
```http
GET /api/ebooks/:id
Authorization: Bearer <jwt-token>
```
- **Response** (200): eBook document with all chapter content.
- Returns `404` if the eBook does not exist or belongs to another user.

#### Update eBook
```http
PUT /api/ebooks/:id
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": [
    {
      "page": 1,
      "title": "Chapter 1: Overview",
      "text": "Updated chapter body content..."
    }
  ]
}
```
- **Response** (200): Updated eBook document.

#### Delete eBook
```http
DELETE /api/ebooks/:id
Authorization: Bearer <jwt-token>
```
- **Response** (200):
```json
{
  "message": "eBook removed"
}
```

---

### Testimonials

#### Get All Testimonials (Public)
```http
GET /api/testimonials
```
- **Response** (200): Array of testimonial documents.

#### Create Testimonial (Protected)
```http
POST /api/testimonials
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "text": "This AI tool helped me publish my first technical eBook!",
  "role": "Author & Engineer"
}
```
- **Response** (201): Created testimonial.

#### Delete Testimonial (Protected, Owner Only)
```http
DELETE /api/testimonials/:id
Authorization: Bearer <jwt-token>
```
- **Response** (200):
```json
{
  "message": "Testimonial removed"
}
```

---

## Testing

The backend includes 26 unit and integration tests using **Jest**, **Supertest**, and **MongoMemoryServer**:

```bash
npm test
```

### Test Suites:
1. `tests/auth.test.js`: Registration validation, duplicate rejection, login, and `/profile` endpoints.
2. `tests/ebook.test.js`: eBook creation, retrieval, updates, deletion, and cross-user IDOR isolation.
3. `tests/validators.test.js`: Joi schema edge cases and prompt input sanitizers.