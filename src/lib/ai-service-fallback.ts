import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";

const GEMINI_MODEL = "gemini-2.0-flash";
const GROQ_MODEL = "llama-3.3-70b-versatile";

function buildPrompt(prompt: string, count: number, ageRating: string) {
  return `
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
}

function normalizeQuestions(questions: any[], defaultCategory: string) {
  return questions.map((q) => {
    let text = (q.text || "").trim();
    if (text) {
      text = text.charAt(0).toUpperCase() + text.slice(1);
      if (!text.endsWith("?")) text += "?";
    }

    const rawCategory = (q.category || defaultCategory).trim();
    const category = rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1).toLowerCase();

    return { ...q, text, category };
  });
}

function cleanJson(text: string) {
  return text.replace(/```json|```/g, "").trim();
}

async function tryGemini(fullPrompt: string) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
  if (!apiKey) throw new Error("Gemini API key not configured");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
  const result = await model.generateContent(fullPrompt);
  const text = result.response.text();
  return cleanJson(text);
}

async function tryGroq(fullPrompt: string) {
  const apiKey = process.env.GROQ_API_KEY || "";
  if (!apiKey) throw new Error("Groq API key not configured");

  const groq = new Groq({ apiKey });
  const response = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: [{ role: "user", content: fullPrompt }],
    temperature: 0.7,
    max_tokens: 2048,
  });

  const text = response.choices[0]?.message?.content || "";
  return cleanJson(text);
}

export async function generateQuestionsWithFallback(prompt: string, count: number = 5, ageRating: string = "adults") {
  const fullPrompt = buildPrompt(prompt, count, ageRating);
  const providers = [
    { name: "Gemini", fn: () => tryGemini(fullPrompt) },
    { name: "Groq", fn: () => tryGroq(fullPrompt) },
  ];

  let lastError: Error | null = null;

  for (const provider of providers) {
    try {
      console.log(`[AI] Trying ${provider.name}...`);
      const jsonStr = await provider.fn();
      const questions = JSON.parse(jsonStr);
      const normalized = normalizeQuestions(questions, prompt);
      console.log(`[AI] ${provider.name} succeeded!`);
      return { questions: normalized, provider: provider.name };
    } catch (error: any) {
      console.warn(`[AI] ${provider.name} failed: ${error.message}`);
      lastError = error;
    }
  }

  throw new Error(`All AI providers failed. Last error: ${lastError?.message}`);
}
