import { GoogleGenAI } from "@google/genai";

export const aiClient = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

// UPDATED: Using 'gemini-3.1-flash-lite' to avoid 503 high demand errors.
// It is fast, highly versatile, and excellent for code generation.
export const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
export const MODEL_NAME = "gemini-3.1-flash-lite";

export const CODE_GEN_CONFIG = {
  responseMimeType: "application/json",
};