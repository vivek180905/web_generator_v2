import { GoogleGenAI } from "@google/genai";

export const aiClient = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

// UPDATED: 'gemini-1.5-flash' is retired. Use 'gemini-2.5-flash' (Stable).
// configs/AiModel.js
export const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
export const MODEL_NAME = "gemini-2.5-flash-lite";

export const CODE_GEN_CONFIG = {
  responseMimeType: "application/json",
};