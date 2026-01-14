import { NextResponse } from "next/server";
import axios from "axios";
import { GOOGLE_API_KEY, MODEL_NAME } from "@/configs/AiModel";

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

    let aiResponseText = response.data.candidates[0].content.parts[0].text;
    aiResponseText = aiResponseText.replace(/^```json\s*/, "").replace(/\s*```$/, "").trim();
    const parsedResponse = JSON.parse(aiResponseText);

    return NextResponse.json(parsedResponse);

  } catch (error) {
    console.error("Code Gen Error:", error.response?.data || error.message);
    return NextResponse.json({ error: "Failed to generate code" }, { status: 500 });
  }
}