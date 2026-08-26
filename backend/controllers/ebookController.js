import Ebook from '../models/Ebook.js';
import { generateEbookContent } from '../services/geminiService.js';

// @desc    Get all ebooks
// @route   GET /api/ebooks
// @access  Private
export const getEbooks = async (req, res) => {
  try {
    const ebooks = await Ebook.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(ebooks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get ebook by ID
// @route   GET /api/ebooks/:id
// @access  Private (owner only)
export const getEbookById = async (req, res) => {
  try {
    const ebook = await Ebook.findOne({ _id: req.params.id, user: req.user._id });
    if (ebook) {
      res.json(ebook);
    } else {
      res.status(404).json({ message: 'Ebook not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new ebook
// @route   POST /api/ebooks
// @access  Private
export const createEbook = async (req, res) => {
  const { title, description, coverColor } = req.body;

  try {
    const ebook = new Ebook({
      user: req.user._id,
      title,
      description,
      coverColor,
      status: 'generating',
      content: [],
      totalPages: 0
    });

    const createdEbook = await ebook.save();

    // Trigger generation in background
    generateEbookContent(createdEbook._id, title, description);

    res.status(201).json(createdEbook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update ebook (e.g. add content)
// @route   PUT /api/ebooks/:id
// @access  Private (owner only)
export const updateEbook = async (req, res) => {
  const { title, description, status, content, totalPages, coverColor } = req.body;

  try {
    const ebook = await Ebook.findOne({ _id: req.params.id, user: req.user._id });

    if (ebook) {
      if (title !== undefined) ebook.title = title;
      if (description !== undefined) ebook.description = description;
      if (status !== undefined) ebook.status = status;
      if (content !== undefined) {
        ebook.content = content;
        ebook.totalPages = content.length;
      }
      if (totalPages !== undefined) ebook.totalPages = totalPages;
      if (coverColor !== undefined) ebook.coverColor = coverColor;

      const updatedEbook = await ebook.save();
      res.json(updatedEbook);
    } else {
      res.status(404).json({ message: 'Ebook not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete ebook
// @route   DELETE /api/ebooks/:id
// @access  Private (owner only)
export const deleteEbook = async (req, res) => {
  try {
    const ebook = await Ebook.findOne({ _id: req.params.id, user: req.user._id });

    if (ebook) {
      await ebook.deleteOne();
      res.json({ message: 'Ebook removed' });
    } else {
      res.status(404).json({ message: 'Ebook not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
