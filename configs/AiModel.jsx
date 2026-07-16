import { GoogleGenAI } from "@google/genai";

export const aiClient = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

// UPDATED: Using 'gemini-3.5-flash' — current stable flagship (July 2026).
// All Gemini 2.x models are deprecated for new API keys.
export const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
export const MODEL_NAME = "gemini-3.5-flash";

export const CODE_GEN_CONFIG = {
  responseMimeType: "application/json",
};