import { NextResponse } from "next/server";
import axios from "axios";
import { GOOGLE_API_KEY, MODEL_NAME } from "@/configs/AiModel";

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
 * Sends the user prompt to the Gemini API with JSON response mode and system instructions,
 * then parses the AI response into a structured project object with files.
 * @param {Request} req - The incoming request containing a JSON body with a `prompt` field.
 * @returns {NextResponse} JSON response with the parsed project structure or an `error` message.
 */
export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GOOGLE_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
            responseMimeType: "application/json",
            maxOutputTokens: 65536, // Lite model supports high output
            temperature: 0.4 // Keep it low for precise code
        },
        // THIS FIXES THE HELLO WORLD ISSUE
        systemInstruction: {
          parts: [{ 
            text: `You are an expert React developer. 
            CRITICAL RULES:
            1. You must generate a FULL, WORKING project.
            2. App.js must IMPORT and USE the components you generate (Header, Footer, etc).
            3. NEVER return a simple "Hello World" in App.js.
            4. Return valid JSON only.` 
          }]
        }
      },
      {
        headers: { "Content-Type": "application/json" }
      }
    );

    const candidates = response.data?.candidates;
    if (!candidates || candidates.length === 0 || !candidates[0]?.content?.parts?.[0]?.text) {
      console.error("Code Gen: No candidates returned.", JSON.stringify(response.data));
      return NextResponse.json({ error: "AI returned no response. The prompt may have been blocked." }, { status: 500 });
    }

    let aiResponseText = candidates[0].content.parts[0].text;
    
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
        return NextResponse.json({ error: "AI returned invalid JSON. Please try again." }, { status: 500 });
      }
    }

    return NextResponse.json(parsedResponse);

  } catch (error) {
    console.error("Code Gen Error:", error.response?.data || error.message);
    return NextResponse.json({ error: "Failed to generate code" }, { status: 500 });
  }
}