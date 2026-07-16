import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { MODEL_NAME } from "@/configs/AiModel";

/**
 * Extracts a JSON object from a string that may contain markdown fences,
 * thinking blocks, or other surrounding text.
 * @param {string} text - The raw AI response text potentially wrapped in markdown.
 * @returns {string} The extracted JSON string.
 * @throws {Error} If no valid JSON object boundaries are found.
 */
function extractJSON(text) {
  // 1. Strip markdown code fences (```json ... ``` or ``` ... ```)
  let cleaned = text.replace(/```(?:json)?\s*/gi, "").replace(/```\s*/g, "").trim();

  // 2. Find the first '{' and last '}' to extract the JSON object
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("No JSON object found in AI response");
  }

  return cleaned.substring(firstBrace, lastBrace + 1);
}

/**
 * Handles POST requests for the AI code generation endpoint.
 * Uses the @google/genai SDK with JSON response mode and system instructions.
 * @param {Request} req - The incoming request containing a JSON body with a `prompt` field.
 * @returns {NextResponse} JSON response with the parsed project structure or an `error` message.
 */
export async function POST(req) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    console.error("Code Gen: NEXT_PUBLIC_GEMINI_API_KEY is not set.");
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
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 65536,
        temperature: 0.4,
        systemInstruction: `You are an expert React developer. 
CRITICAL RULES:
1. You must generate a FULL, WORKING project.
2. App.js must IMPORT and USE the components you generate (Header, Footer, etc).
3. NEVER return a simple "Hello World" in App.js.
4. Return valid JSON only.`,
      },
    });

    let aiResponseText = response.text;
    if (!aiResponseText) {
      console.error("Code Gen: Empty response from model.");
      return NextResponse.json(
        { error: "AI returned no response. The prompt may have been blocked." },
        { status: 500 }
      );
    }

    let parsedResponse;
    try {
      // First try direct parse (when responseMimeType works correctly)
      parsedResponse = JSON.parse(aiResponseText.trim());
    } catch (directParseError) {
      // Fallback: extract JSON from surrounding text/fences
      try {
        const extracted = extractJSON(aiResponseText);
        parsedResponse = JSON.parse(extracted);
      } catch (extractError) {
        console.error("Code Gen: Failed to parse AI response as JSON.");
        console.error("Raw response (first 500 chars):", aiResponseText.substring(0, 500));
        return NextResponse.json(
          { error: "AI returned invalid JSON. Please try again." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error("Code Gen Error:", error.message || error);
    return NextResponse.json(
      { error: "Failed to generate code: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}