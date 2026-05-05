import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Ebook from './models/Ebook.js';

dotenv.config();

const checkLatestEbook = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const latestEbook = await Ebook.findOne().sort({ createdAt: -1 });
    
    if (!latestEbook) {
      console.log('No ebooks found.');
    } else {
      console.log('Latest Ebook Status:', latestEbook.status);
      console.log('Latest Ebook Title:', latestEbook.title);
      console.log('Latest Ebook Content Length:', latestEbook.content ? latestEbook.content.length : 0);
      console.log('Latest Ebook Description:', latestEbook.description);
      if (latestEbook.content && latestEbook.content.length > 0) {
          console.log('First Chapter Title:', latestEbook.content[0].title);
      }
    }
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkLatestEbook();
