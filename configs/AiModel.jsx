import { GoogleGenAI } from "@google/genai";

export const aiClient = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

// UPDATED: Using 'gemini-2.0-flash' — stable GA model available to all API keys.
// configs/AiModel.js
export const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
export const MODEL_NAME = "gemini-2.0-flash";

export const CODE_GEN_CONFIG = {
  responseMimeType: "application/json",
};