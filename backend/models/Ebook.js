import mongoose from 'mongoose';

const pageSchema = new mongoose.Schema({
  page: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
});

const ebookSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  coverColor: {
    type: String,
    default: 'bg-blue-500'
  },
  status: {
    type: String,
    enum: ['draft', 'generating', 'completed'],
    default: 'draft'
  },
  totalPages: {
    type: Number,
    default: 0
  },
  content: [pageSchema],
  author: {
    type: String,
    default: 'AI Generator'
  }
}, {
  timestamps: true
});

const Ebook = mongoose.model('Ebook', ebookSchema);

export default Ebook;
