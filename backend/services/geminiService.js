import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import Ebook from '../models/Ebook.js';

dotenv.config();

/**
 * Sanitizes input strings before interpolation into LLM prompts.
 * Strips dangerous formatting control characters and prompt delimiter escapes.
 */
export const sanitizePromptInput = (str) => {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[\r\n\t]/g, ' ')
    .replace(/[\\"']/g, '\\$&')
    .replace(/---+/g, '-')
    .trim()
    .slice(0, 1000);
};

/**
 * Executes an async function with a timeout.
 */
const withTimeout = (promise, ms = 35000) => {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Operation timed out after ${ms}ms`));
    }, ms);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId);
  });
};

/**
 * Executes an async operation with exponential backoff retries.
 */
const retryWithBackoff = async (fn, maxRetries = 3, initialDelayMs = 1000) => {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await fn(attempt);
    } catch (error) {
      attempt++;
      if (attempt >= maxRetries) {
        throw error;
      }
      const delay = initialDelayMs * Math.pow(2, attempt - 1);
      console.warn(`[GeminiService] Attempt ${attempt} failed: ${error.message}. Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

/**
 * Generates structured ebook content via Google Gemini API.
 * @param {string} ebookId - MongoDB ObjectId of the ebook
 * @param {string} rawTitle - Ebook title
 * @param {string} rawDescription - Ebook prompt/description
 */
export const generateEbookContent = async (ebookId, rawTitle, rawDescription) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || process.env.NODE_ENV === 'test') {
      return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    const safeTitle = sanitizePromptInput(rawTitle);
    const safeDescription = sanitizePromptInput(rawDescription);

    const prompt = `You are a professional author and editor. Write a well-structured, multi-chapter ebook based on the following specifications:
Topic Title: "${safeTitle}"
Topic Description: "${safeDescription}"

Requirements:
1. Return the content STRICTLY as a JSON array of objects.
2. Each object represents a single chapter and MUST have the following structure:
   - "title": The title of the chapter (string).
   - "text": The complete content of the chapter containing at least 3 comprehensive paragraphs (string).
3. Generate between 3 to 6 chapters.
4. Do NOT wrap output in markdown code blocks like \`\`\`json or \`\`\`. Output raw JSON text only.`;

    const generatedText = await retryWithBackoff(async () => {
      return await withTimeout(
        (async () => {
          const result = await model.generateContent(prompt);
          const response = await result.response;
          return response.text();
        })(),
        35000
      );
    }, 3, 1000);

    // Extract and parse JSON
    const jsonString = generatedText
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    let chapters;
    try {
      chapters = JSON.parse(jsonString);
    } catch (parseErr) {
      console.error("[GeminiService] Failed to parse JSON response:", jsonString);
      throw new Error("Invalid JSON response received from AI service");
    }

    if (!Array.isArray(chapters) || chapters.length === 0) {
      throw new Error("AI response did not contain a valid array of chapters");
    }

    const cleanTitle = (raw) => {
      if (typeof raw !== 'string') return '';
      return raw
        .replace(/^(Chapter|Ch\.?)\s*\d+[\s:.-]*/i, '')
        .replace(/^\d+[\s:.-]+\s*/, '')
        .trim() || raw;
    };

    const formattedContent = chapters.map((chapter, index) => {
      const parsedTitle = cleanTitle(chapter.title);
      return {
        page: index + 1,
        title: parsedTitle || `Chapter ${index + 1}`,
        text: chapter.text || ''
      };
    });

    await Ebook.findByIdAndUpdate(ebookId, {
      content: formattedContent,
      totalPages: formattedContent.length,
      status: 'completed',
      generationError: null
    });

    console.log(`[GeminiService] Ebook ${ebookId} generated successfully with ${formattedContent.length} chapters.`);
  } catch (error) {
    console.error(`[GeminiService] Error generating ebook ${ebookId}:`, error.message);
    await Ebook.findByIdAndUpdate(ebookId, {
      status: 'failed',
      generationError: error.message || 'Unknown generation error'
    });
  }
};
