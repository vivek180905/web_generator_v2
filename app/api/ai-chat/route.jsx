import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { MODEL_NAME } from "@/configs/AiModel";

/**
 * Handles POST requests for the AI chat endpoint.
 * Uses the @google/genai SDK which properly handles thinking-model responses.
 * @param {Request} req - The incoming request containing a JSON body with a `prompt` field.
 * @returns {NextResponse} JSON response with `result` (AI text) or `error` message.
 */
export async function POST(req) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    console.error("AI Chat: NEXT_PUBLIC_GEMINI_API_KEY is not set.");
    return NextResponse.json(
      { error: "Server misconfiguration: API key is not set. Please add NEXT_PUBLIC_GEMINI_API_KEY to your environment variables." },
      { status: 500 }
    );
  }

  try {
    const { prompt } = await req.json();
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    const text = response.text;
    if (!text) {
      console.error("AI Chat: Empty response from model.");
      return NextResponse.json(
        { error: "AI returned no response. The prompt may have been blocked by safety filters." },
        { status: 500 }
      );
    }

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error("AI Chat Error:", error.message || error);
    return NextResponse.json(
      { error: "Failed to fetch AI response: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}