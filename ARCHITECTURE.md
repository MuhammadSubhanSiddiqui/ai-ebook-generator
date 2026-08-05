# AI eBook Generator - Architecture Documentation

## System Overview

AI eBook Generator is a full-stack web application that allows users to create professional eBooks with the help of Google Gemini AI. The application consists of a React-based frontend and a Node.js/Express backend.

## Tech Stack

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.2
- **UI Library**: Tailwind CSS 4.1.17
- **Routing**: React Router DOM 7.10.0
- **Drag & Drop**: @dnd-kit/sortable
- **PDF Generation**: jsPDF
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect)

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5.2.1
- **Database**: MongoDB with Mongoose 9.0.2
- **Authentication**: JWT (jsonwebtoken 9.0.3)
- **Password Encryption**: bcryptjs 3.0.3
- **AI Integration**: Google Generative AI (@google/generative-ai 0.24.1)
- **Environment Management**: dotenv

## Architecture

### Project Structure

```
eBookGenerator/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection configuration
│   ├── controllers/
│   │   ├── ebookController.js # eBook CRUD operations
│   │   ├── userController.js  # User authentication
│   │   └── testimonialController.js # Testimonial management
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT authentication middleware
│   ├── models/
│   │   ├── Ebook.js           # eBook data model
│   │   ├── User.js            # User data model
│   │   └── Testimonial.js     # Testimonial data model
│   ├── routes/
│   │   ├── ebookRoutes.js     # eBook API routes
│   │   ├── userRoutes.js      # User API routes
│   │   └── testimonialRoutes.js # Testimonial API routes
│   ├── services/              # Business logic layer (to be added)
│   ├── utils/                 # Utility functions (to be added)
│   ├── validators/            # Request validation (to be added)
│   ├── index.js               # Main application entry point
│   ├── .env.example           # Environment variables template
│   └── package.json           # Dependencies
│
└── frontend/
    ├── public/
    │   └── vite.svg
    ├── src/
    │   ├── assets/
    │   │   └── react.svg
    │   ├── components/
    │   │   ├── Features.jsx    # Features section (unused)
    │   │   ├── Footer.jsx      # Site footer
    │   │   ├── Hero.jsx        # landing page hero
    │   │   ├── Navbar.jsx      # Main navigation
    │   │   ├── PricingPage.jsx # Pricing page section
    │   │   ├── ProtectedRoute.jsx # Route protection
    │   │   └── Testimonials.jsx # User testimonials
    │   ├── pages/
    │   │   ├── Dashboard.jsx       # User dashboard
    │   │   ├── EbookViewer.jsx     # eBook content viewer
    │   │   ├── LandingPage.jsx     # Main landing page
    │   │   ├── Login.jsx           # Login page
│   │   │   └── Register.jsx       # Registration page
    │   ├── App.jsx               # Main application component
    │   ├── main.jsx              # React entry point
    │   ├── index.css             # Global styles
    │   └── api/                  # API service layer (to be added)
    ├── .env.example             # Environment variables template
    ├── .gitignore
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Data Models

### User Schema

```javascript
{
  name: String,               // Required
  email: String,              // Required, unique
  password: String,           // Required (hashed)
  createdAt: Date,            // Auto-generated
  updatedAt: Date             // Auto-generated
}
```

### eBook Schema

```javascript
{
  user: ObjectId,             // Reference to User
  title: String,              // Required
  description: String,        // Required
  coverColor: String,         // Default: 'bg-gradient-to-br from-blue-500 to-indigo-600'
  status: String,             // Enum: ['draft', 'generating', 'completed']
  totalPages: Number,         // Default: 0
  content: Array[              // Array of pages
    {
      page: Number,           // Required
      title: String,          // Required
      text: String            // Required
    }
  ],
  author: String,             // Default: 'AI Generator'
  createdAt: Date,            // Auto-generated
  updatedAt: Date             // Auto-generated
}
```

### Testimonial Schema

```javascript
{
  user: ObjectId,             // Reference to User (required)
  text: String,               // Required
  authorName: String,         // Required
  role: String,               // Default: 'User'
  createdAt: Date             // Auto-generated
}
```

## API Endpoints

### Authentication

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Authenticate a user

### eBooks

- `GET /api/ebooks` - Get all user's ebooks (Protected)
- `POST /api/ebooks` - Create a new ebook (Protected)
- `GET /api/ebooks/:id` - Get ebook by ID (Protected)
- `PUT /api/ebooks/:id` - Update ebook (Protected)
- `DELETE /api/ebooks/:id` - Delete ebook (Protected)

### Testimonials

- `GET /api/testimonials` - Get all testimonials (Public)
- `POST /api/testimonials` - Create testimonial (Protected)
- `DELETE /api/testimonials/:id` - Delete testimonial (Protected)

## Authentication Flow

1. **Register**: User creates account → hashed password stored → JWT token returned
2. **Login**: User provides credentials → password verified → JWT token returned
3. **Token Storage**: JWT stored in localStorage as 'userInfo'
4. **Validation**: Each protected route checks for 'Bearer' token → verifies JWT → attaches user to req

## AI Generation Flow

1. User creates ebook with title and description
2. eBook marked as 'generating' status
3. Background process calls Gemini AI with structured prompt
4. AI returns JSON array with chapters
5. Content stored as formatted pages
6. Status updated to 'completed'
7. User receives notification and can view ebook

## Key Challenges & Issues

### Current Issues

1. **Security Vulnerabilities**
   - No rate limiting
   - Unvalidated inputs
   - No CORS restrictions
   - Exposed API keys in production scenarios

2. **Code Quality**
   - Mix of concerns in controllers
   - Limited error handling
   - No validation layer
   - Direct database/external API calls mixed with business logic

3. **Performance**
   - No caching strategy
   - Unlimited polling interval
   - No query optimization
   - Missing connection pooling

4. **Maintainability**
   - Missing documentation
   - No type definitions
   - Scattered configuration
   - No middleware for common operations

5. **Missing Features**
   - Email notifications
   - Password reset
   - User profile management
   - Search functionality
   - Analytics tracking

### Future Enhancements

1. Architecture improvements
2. Service layer implementation
3. Redis caching
4. Background job queue (Bull or BullMQ)
5. WebSockets for real-time updates
6. Multiple export formats
7. API key management
8. Audit logging
9. Health monitoring
10. Comprehensive tests

## Security Considerations

- Store all sensitive data (API keys, passwords) in environment variables
- Use HTTPS in production
- Implement proper authentication and authorization
- Validate and sanitize all inputs
- Use prepared statements for database queries
- Implement rate limiting to prevent abuse
- Use strong JWT secrets
- Educate users about password security

## Deployment Recommendations

1. Use environment-specific configurations
2. Set up proper logging and monitoring
3. Configure backup strategies for MongoDB
4. Enable HTTPS with proper certificates
5. Set up CI/CD pipeline
6. Use deployment services like Vercel, Render, or AWS
7. Set up domain and SSL
8. Configure load balancing for production scale
9. Implement database connection pooling
10. Set up monitoring and alerts