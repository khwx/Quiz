import { NextRequest, NextResponse } from "next/server";
import { generateQuestionsWithFallback } from "@/lib/ai-service-fallback";

export async function POST(req: NextRequest) {
  try {
    const { prompt, count = 5, ageRating = "adults" } = await req.json();

    const { questions, provider } = await generateQuestionsWithFallback(prompt, count, ageRating);

    return NextResponse.json({ questions, provider });
  } catch (error: any) {
    console.error("[API] Error:", error);
    return NextResponse.json({ error: "Failed to generate questions", details: error.message }, { status: 500 });
  }
}
