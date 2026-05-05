import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import ebookRoutes from './routes/ebookRoutes.js';
import userRoutes from './routes/userRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/ebooks', ebookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/testimonials', testimonialRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
