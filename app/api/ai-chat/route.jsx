import { NextResponse } from "next/server";
import axios from "axios";
import { GOOGLE_API_KEY, MODEL_NAME } from "@/configs/AiModel";

/**
 * Handles POST requests for the AI chat endpoint.
 * Sends the user prompt to the Gemini API and returns the AI-generated text response.
 * @param {Request} req - The incoming request containing a JSON body with a `prompt` field.
 * @returns {NextResponse} JSON response with `result` (AI text) or `error` message.
 */
export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GOOGLE_API_KEY}`,
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const candidates = response.data?.candidates;
    if (!candidates || candidates.length === 0 || !candidates[0]?.content?.parts?.[0]?.text) {
      console.error("AI Chat: No candidates returned.", JSON.stringify(response.data));
      return NextResponse.json({ error: "AI returned no response. The prompt may have been blocked by safety filters." }, { status: 500 });
    }

    const aiResponse = candidates[0].content.parts[0].text;
    return NextResponse.json({ result: aiResponse });

  } catch (error) {
    // If 1.5-flash still 404s, this logs the exact reason from Google
    console.error("AI Chat Error:", error.response?.data || error.message);
    return NextResponse.json({ error: "Failed to fetch response" }, { status: 500 });
  }
}