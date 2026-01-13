import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function POST(req: NextRequest) {
  try {
    const { prompt, count = 5, ageRating = "adults" } = await req.json();

    if (!apiKey) {
      return NextResponse.json({ error: "API Key not configured on server" }, { status: 500 });
    }

    const fullPrompt = `
      Gera ${count} perguntas de quiz em Português de Portugal para o seguinte tema: "${prompt}".
      O público alvo é: ${ageRating === "children" ? "Crianças entre 6 e 12 anos" : "Adultos"}.
      
      Retorna APENAS um array JSON válido (sem markdown) com este formato exato:
      [
        {
          "text": "Pergunta?",
          "options": ["A", "B", "C", "D"],
          "correct_option": 0,
          "category": "${prompt}",
          "explanation": "Explicação curta"
        }
      ]
    `;

    const result = await model.generateContent(fullPrompt);
    const text = result.response.text();
    console.log("[API] Generated:", text.substring(0, 50) + "...");

    // Cleanup markdown
    const jsonStr = text.replace(/```json|```/g, "").trim();
    const questions = JSON.parse(jsonStr);

    // Normalize category names for consistency
    const normalizedQuestions = questions.map((q: any) => ({
      ...q,
      category: (q.category || prompt).toLowerCase().trim()
    }));

    return NextResponse.json(normalizedQuestions);
  } catch (error: any) {
    console.error("[API] Error:", error);
    return NextResponse.json({ error: "Failed to generate questions", details: error.message }, { status: 500 });
  }
}
