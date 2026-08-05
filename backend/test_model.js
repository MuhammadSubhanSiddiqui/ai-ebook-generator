import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // There isn't a direct listModels on the instance in the simple SDK usage usually, 
    // but let's try to just run a simple generation with a known model like 'gemini-pro' to see if that works.
    // Or we can use the model manager if available.
    
    console.log("Trying gemini-flash-latest...");
    const modelPro = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await modelPro.generateContent("Hello");
    console.log("gemini-flash-latest worked:", result.response.text());

  } catch (error) {
    console.error("Error:", error.message);
  }
}

listModels();
