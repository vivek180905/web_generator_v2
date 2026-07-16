import { GoogleGenAI } from "@google/genai";

export const aiClient = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

// UPDATED: Using 'gemini-2.5-flash' for reliable structured JSON code generation.
// configs/AiModel.js
export const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
export const MODEL_NAME = "gemini-2.5-flash";

export const CODE_GEN_CONFIG = {
  responseMimeType: "application/json",
};