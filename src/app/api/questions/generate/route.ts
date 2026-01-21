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
      
      Público Alvo e Nível de Dificuldade:
      ${ageRating === "7-9" ? "- Crianças (7-9 anos): Perguntas muito simples, divertidas e educativas. Vocabulário básico." : ""}
      ${ageRating === "10-14" ? "- Jovens (10-14 anos): Nível escolar intermédio. Curiosidades interessantes." : ""}
      ${ageRating === "15-17" ? "- Adolescentes (15-17 anos): Nível secundário. Desafiante mas acessível." : ""}
      ${!["7-9", "10-14", "15-17"].includes(ageRating) ? "- Adultos: Nível geral de quiz show." : ""}

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

    // Normalize question text and category names for consistency
    const normalizedQuestions = questions.map((q: any) => {
      let text = (q.text || "").trim();
      if (text) {
        // Sentence case: Capitalize first letter, keep the rest
        text = text.charAt(0).toUpperCase() + text.slice(1);
        // Ensure it ends with ?
        if (!text.endsWith("?")) text += "?";
      }

      const rawCategory = (q.category || prompt).trim();
      const category = rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1).toLowerCase();

      return {
        ...q,
        text,
        category
      };
    });

    return NextResponse.json(normalizedQuestions);
  } catch (error: any) {
    console.error("[API] Error:", error);
    return NextResponse.json({ error: "Failed to generate questions", details: error.message }, { status: 500 });
  }
}
