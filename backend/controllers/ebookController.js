import Ebook from '../models/Ebook.js';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Using gemini-2.5-flash as requested by user
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const generateEbookContent = async (ebookId, title, description) => {
  try {
    const prompt = `Write a short ebook about "${title}". Description: "${description}".
    Return the content strictly as a JSON array of objects.
    Each object should represent a chapter and have the following keys:
    - "title": The title of the chapter.
    - "text": The content of the chapter (at least 3 paragraphs).
    Do not include any markdown formatting like \`\`\`json. Just the raw JSON array.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up potential markdown code blocks
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let chapters;
    try {
        chapters = JSON.parse(jsonString);
    } catch (e) {
        console.error("Failed to parse JSON from Gemini:", jsonString);
        throw new Error("Invalid JSON response from AI");
    }

    const formattedContent = chapters.map((chapter, index) => ({
      page: index + 1,
      title: chapter.title,
      text: chapter.text
    }));

    await Ebook.findByIdAndUpdate(ebookId, {
      content: formattedContent,
      totalPages: formattedContent.length,
      status: 'completed'
    });
    console.log(`Ebook ${ebookId} generated successfully.`);

  } catch (error) {
    console.error("Error generating ebook:", error);
    await Ebook.findByIdAndUpdate(ebookId, {
      status: 'draft',
      description: description + " (Generation failed: " + error.message + ")"
    });
  }
};

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
