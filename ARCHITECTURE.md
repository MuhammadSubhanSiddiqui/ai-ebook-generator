# AI eBook Generator - Architecture Documentation

## System Overview

AI eBook Generator is a full-stack web application that allows users to create, customize, and export professional multi-chapter eBooks using Google Gemini AI. The system comprises a React 19 Single Page Application and a secure Node.js/Express REST API backed by MongoDB Atlas.

---

## Tech Stack

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.2
- **Styling & Design System**: Tailwind CSS 4.1.17 with CSS variable tokens & custom variant dark mode
- **Typography**: Google Fonts (**Cinzel**, **Lora**, **Plus Jakarta Sans**)
- **Routing**: React Router DOM 7.10.0
- **Drag & Drop**: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- **PDF Generation**: `jspdf` (formatted covers, table of contents, pagination)
- **Icons**: Lucide React
- **State & Theme**: React Context (`AuthContext`, `ThemeContext`)

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express 5.2.1
- **Database**: MongoDB with Mongoose 9.0.2
- **Authentication**: JWT (`jsonwebtoken` 9.0.3)
- **Password Encryption**: `bcryptjs` 3.0.3
- **AI Integration**: Google Generative AI (`@google/generative-ai` 0.24.1) via resilient service layer
- **Security & Validation**: `helmet`, `express-rate-limit`, `joi`, `cors`
- **Testing**: Jest 30, Supertest 7, MongoMemoryServer 11, Cross-Env 10

---

## Project Structure

```
eBookGenerator/
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI Workflow (Tests + Build)
├── backend/
│   ├── config/
│   │   └── db.js                # MongoDB connection handler
│   ├── controllers/
│   │   ├── ebookController.js   # eBook CRUD operations & generation dispatch
│   │   ├── userController.js    # Auth & user profile management
│   │   └── testimonialController.js # Testimonial CRUD
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT verification & req.user injection
│   │   ├── errorHandler.js      # Centralized error handler & asyncHandler
│   │   └── validate.js          # Joi schema validation middleware
│   ├── models/
│   │   ├── Ebook.js             # eBook schema (with 'failed' state & generationError)
│   │   ├── User.js              # User schema with bcrypt pre-save hook
│   │   └── Testimonial.js       # Testimonial data model
│   ├── routes/
│   │   ├── ebookRoutes.js       # Protected eBook endpoints
│   │   ├── userRoutes.js        # Auth and /profile endpoints
│   │   └── testimonialRoutes.js # Testimonial endpoints
│   ├── services/
│   │   └── geminiService.js     # AI generation with retries, timeouts, & sanitization
│   ├── tests/
│   │   ├── setup.js             # Test database setup (Atlas/MongoMemoryServer)
│   │   ├── auth.test.js         # User registration, login, and profile tests
│   │   ├── ebook.test.js        # eBook CRUD & IDOR ownership tests
│   │   └── validators.test.js   # Joi schema and prompt sanitizer unit tests
│   ├── validators/
│   │   ├── ebookValidator.js    # eBook Joi validation schemas
│   │   ├── userValidator.js     # Registration, login, & profile update schemas
│   │   └── testimonialValidator.js # Testimonial validation schemas
│   ├── index.js                 # App config & server entry point
│   ├── .env.example             # Template environment configuration
│   └── package.json             # Backend dependencies & test scripts
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── index.js         # Centralized Fetch API client with 401 handling
    │   ├── components/
    │   │   ├── Features.jsx     # Landing page feature showcase
    │   │   ├── Footer.jsx       # Global footer with social links
    │   │   ├── Hero.jsx         # Modern split hero with 3D live preview
    │   │   ├── Navbar.jsx       # Navigation with responsive theme toggle
    │   │   ├── ProtectedRoute.jsx # Client-side route authentication guard
    │   │   ├── Skeletons.jsx    # Shimmering card & reader skeleton loaders
    │   │   └── Testimonials.jsx # User reviews with form submission
    │   ├── context/
    │   │   ├── AuthContext.jsx  # Authentication state & persistent login
    │   │   └── ThemeContext.jsx # Light/dark mode state & local persistence
    │   ├── pages/
    │   │   ├── Dashboard.jsx    # Library grid, search, status filter, cover picker
    │   │   ├── EbookViewer.jsx  # Multi-step generation tracker, reader, PDF export
    │   │   ├── LandingPage.jsx  # Main landing page
    │   │   ├── Login.jsx        # Login page with password toggle
    │   │   └── Register.jsx     # Registration page with password toggle
    │   ├── App.jsx              # App root wrapped in ThemeProvider & Router
    │   ├── main.jsx             # React DOM root wrapped in AuthProvider
    │   └── index.css            # Design tokens, typography, keyframe animations
    ├── index.html               # Head theme initializer script & HTML template
    └── package.json             # Frontend dependencies
```

---

## Data Models

### User Schema (`backend/models/User.js`)

```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Encrypted via bcrypt
  createdAt: Date,
  updatedAt: Date
}
```

### eBook Schema (`backend/models/Ebook.js`)

```javascript
{
  user: { type: ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  coverColor: { type: String, default: 'bg-gradient-to-br from-blue-600 via-indigo-700 to-indigo-900' },
  status: {
    type: String,
    enum: ['draft', 'generating', 'completed', 'failed'],
    default: 'generating'
  },
  generationError: { type: String, default: null },
  totalPages: { type: Number, default: 0 },
  content: [
    {
      page: { type: Number, required: true },
      title: { type: String, required: true },
      text: { type: String, required: true }
    }
  ],
  author: { type: String, default: 'AI Author' },
  createdAt: Date,
  updatedAt: Date
}
```

### Testimonial Schema (`backend/models/Testimonial.js`)

```javascript
{
  user: { type: ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  authorName: { type: String, required: true },
  role: { type: String, default: 'Author & Creator' },
  createdAt: Date
}
```

---

## API Endpoints

### Authentication & Profile (`/api/users`)
- `POST /api/users` - Register a new account (Returns JWT)
- `POST /api/users/login` - Authenticate existing user (Returns JWT)
- `GET /api/users/profile` - Fetch authenticated user profile (Protected)
- `PUT /api/users/profile` - Update name, email, or password (Protected)

### eBooks (`/api/ebooks`)
- `GET /api/ebooks` - Fetch all eBooks owned by authenticated user (Protected)
- `POST /api/ebooks` - Create a new eBook & trigger asynchronous Gemini generation (Protected)
- `GET /api/ebooks/:id` - Fetch single eBook by ID (Protected, IDOR validated)
- `PUT /api/ebooks/:id` - Update eBook title/content (Protected, IDOR validated)
- `DELETE /api/ebooks/:id` - Delete eBook (Protected, IDOR validated)

### Testimonials (`/api/testimonials`)
- `GET /api/testimonials` - Fetch all public testimonials (Public)
- `POST /api/testimonials` - Submit a testimonial (Protected)
- `DELETE /api/testimonials/:id` - Delete owned testimonial (Protected)

---

## Security Architecture

1. **Input Validation**: Joi validator middleware sanitizes every incoming request payload before reaching controllers.
2. **IDOR Ownership Enforcement**: Every eBook query enforces `{ _id: req.params.id, user: req.user._id }`. Users attempting to access other users' eBooks receive a 404 response.
3. **Prompt Injection Defense**: `geminiService.sanitizePromptInput` strips prompt escape sequences and enforces delimiter boundaries.
4. **Rate Limiting**: `express-rate-limit` prevents brute-force and DDoS on API routes.
5. **Security Headers**: `helmet` sets secure HTTP headers.
6. **CORS Allowlist**: Cross-origin requests restricted via `CORS_ORIGIN`.

---

## AI Generation Architecture

```
User Form Submit (Title + Description)
             │
             ▼
POST /api/ebooks (Saves record with status='generating')
             │
             ├──────────────────────────┐
             ▼                          ▼
Returns 201 Created immediately    Calls geminiService.generateEbookContent() in background
(User redirected to viewer)             │
                                        ▼
                           Prompt Sanitization & Delimiters
                                        │
                                        ▼
                           Gemini 2.5 Flash API Call
                           (3 Retries + 35s Timeout)
                                        │
                                ┌───────┴───────┐
                                ▼               ▼
                            [Success]        [Failure]
                                │               │
                      Status: 'completed'  Status: 'failed'
                      Saves parsed pages   Saves generationError
                                │               │
                                └───────┬───────┘
                                        ▼
                             Frontend Viewer Polling
                             (Exponential Backoff + Visibility Pausing)
```

---

## Automated Testing & CI Workflow

- **Unit & Integration Tests**: 26 test cases in `backend/tests/` covering:
  - User registration, duplicate email handling, login validation, and profile CRUD.
  - eBook creation, reading, updating, deleting, and IDOR protection.
  - Joi schema validations and prompt sanitizers.
- **GitHub Actions CI** (`.github/workflows/ci.yml`):
  - Runs on every push and pull request.
  - Executes full backend test suite (`npm test`).
  - Verifies frontend build compilation (`npm run build`).