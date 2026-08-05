import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import ebookRoutes from './routes/ebookRoutes.js';
import userRoutes from './routes/userRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';

dotenv.config();

connectDB();

const app = express();

app.use(helmet());
app.use(express.json());
app.use(morgan('combined'));

app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',').map(origin => origin.trim()) || '*',
  credentials: true,
}));

const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', apiLimiter);

app.use('/api/ebooks', ebookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/testimonials', testimonialRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// Centralized error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
