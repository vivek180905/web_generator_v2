import { NextResponse } from "next/server";
import axios from "axios";
import { GOOGLE_API_KEY, MODEL_NAME } from "@/configs/AiModel";

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

    const aiResponse = response.data.candidates[0].content.parts[0].text;
    return NextResponse.json({ result: aiResponse });

  } catch (error) {
    // If 1.5-flash still 404s, this logs the exact reason from Google
    console.error("AI Chat Error:", error.response?.data || error.message);
    return NextResponse.json({ error: "Failed to fetch response" }, { status: 500 });
  }
}