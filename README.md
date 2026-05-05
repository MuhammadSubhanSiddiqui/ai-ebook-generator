# AI eBook Creator

A full-stack web application for creating, viewing, and sharing eBooks with AI-powered content generation using Google's Generative AI.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication with bcryptjs password hashing
- **AI-Powered Content Generation**: Leverage Google Generative AI to create eBook content
- **eBook Management**: Create, read, and manage eBooks
- **Testimonials**: Collect and display user testimonials
- **Responsive UI**: Built with React and Tailwind CSS
- **Real-time Updates**: Hot-reloading during development

## 📋 Project Structure

```
FSWD-Project/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection configuration
│   ├── controllers/
│   │   ├── ebookController.js    # eBook CRUD operations
│   │   ├── userController.js     # User authentication & management
│   │   └── testimonialController.js
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT authentication middleware
│   ├── models/
│   │   ├── Ebook.js              # eBook database model
│   │   ├── User.js               # User database model
│   │   └── Testimonial.js        # Testimonial database model
│   ├── routes/
│   │   ├── ebookRoutes.js        # eBook API endpoints
│   │   ├── userRoutes.js         # User API endpoints
│   │   └── testimonialRoutes.js  # Testimonial API endpoints
│   ├── index.js                  # Express server setup
│   ├── package.json
│   └── .env                      # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Features.jsx      # Features section
│   │   │   ├── Footer.jsx        # Footer component
│   │   │   ├── Hero.jsx          # Hero section
│   │   │   ├── Navbar.jsx        # Navigation bar
│   │   │   ├── PricingPage.jsx   # Pricing section
│   │   │   ├── ProtectedRoute.jsx# Route protection
│   │   │   └── Testimonials.jsx  # Testimonials section
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx   # Home page
│   │   │   ├── Dashboard.jsx     # User dashboard
│   │   │   ├── EbookViewer.jsx   # eBook viewing page
│   │   │   ├── Login.jsx         # Login page
│   │   │   └── Register.jsx      # Registration page
│   │   ├── App.jsx               # Main app component
│   │   ├── main.jsx              # Entry point
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js            # Vite configuration
│   └── eslint.config.js
│
└── README.md                     # This file
```

## 🛠️ Tech Stack

### Backend
- **Framework**: Express.js 5.x
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcryptjs
- **AI Integration**: Google Generative AI
- **Development**: Nodemon for hot-reloading
- **CORS**: Enabled for frontend communication

### Frontend
- **Library**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **Routing**: React Router v7
- **UI Icons**: Lucide React
- **PDF Export**: jsPDF
- **Drag & Drop**: dnd-kit

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Google API Key for Generative AI

### Backend Setup

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/fswd-project?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
GOOGLE_API_KEY=your_google_generative_ai_api_key
```

4. Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will run on `http://localhost:5173` (default Vite port)

## 🔌 API Endpoints

### User Routes (`/api/users`)
- `POST /register` - Register a new user
- `POST /login` - Login user
- `GET /profile` - Get user profile (protected)
- `PUT /profile` - Update user profile (protected)

### eBook Routes (`/api/ebooks`)
- `GET /` - Get all eBooks
- `GET /:id` - Get specific eBook
- `POST /` - Create new eBook (protected)
- `PUT /:id` - Update eBook (protected)
- `DELETE /:id` - Delete eBook (protected)

### Testimonial Routes (`/api/testimonials`)
- `GET /` - Get all testimonials
- `POST /` - Create testimonial
- `DELETE /:id` - Delete testimonial (protected)

## 🎨 Screenshots

### Landing Page
![Landing Page](./Screenshot%20(3).png)

### Dashboard
![Dashboard](./Screenshot%20(4).png)

### eBook Viewer
![eBook Viewer](./Screenshot%20(5).png)

### eBook editor Page
![ebook editor Page](./Screenshot%20(6).png)

### pdf review Section
![pdf review](./Screenshot%20(8).png)

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for secure authentication:
- Passwords are hashed using bcryptjs before storage
- JWT tokens are issued upon successful login
- Protected routes require a valid JWT token in the Authorization header
- Token verification is handled by `authMiddleware`

## 🤖 AI Integration

The application integrates Google's Generative AI to:
- Generate eBook content based on user prompts
- Create structured and coherent text
- Provide intelligent content suggestions

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000                                          # Server port
MONGO_URI=mongodb://...                           # MongoDB connection string
JWT_SECRET=your_secret_key                        # Secret for JWT signing
GOOGLE_API_KEY=your_google_api_key               # Google Generative AI key
```

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)
1. Ensure all dependencies are in `package.json`
2. Push to a git repository
3. Connect to deployment platform and configure environment variables
4. Deploy main branch

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Push to repository
3. Connect to Vercel/Netlify and deploy
4. Update API endpoint in frontend to production backend URL

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify `MONGO_URI` is correct
- Check MongoDB credentials
- Ensure IP is whitelisted in MongoDB Atlas (if using cloud)
- Check internet connection

### Authentication Errors
- Ensure `JWT_SECRET` is set in `.env`
- Clear browser cookies and try logging in again
- Check token expiration settings

### Frontend not connecting to Backend
- Ensure backend is running on correct port
- Check CORS settings in backend
- Verify API endpoint URLs in frontend
- Check browser console for error messages

## 📄 License

ISC License

## 👨‍💻 Development Commands

### Backend
- `npm run dev` - Start with hot-reload (development)
- `npm start` - Start production server

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements.

## 📞 Support

For issues, questions, or suggestions, please create an issue in the repository.

---

**Created for**: Full Stack Web Development Lab
**Last Updated**: May 2026
