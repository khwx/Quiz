import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";

const GEMINI_MODEL = "gemini-1.5-flash";
const GROQ_MODEL = "llama-3.3-70b-versatile";

function buildPrompt(prompt: string, count: number, ageRating: string) {
  return `
    Gera ${count} perguntas de quiz em Português de Portugal para: "${prompt}".

    REGRAS DE QUALIDADE (MUITO IMPORTANTE):
    1. Perguntas CURTAS e DIRETAS (máximo 80 caracteres no texto)
    2. Evitar perguntas óbvias de senso comum
    3. Focar em factos curiosas, surpreendentes ou pouco conhecidos
    4. Variedade na estrutura: usar "Qual...", "O que...", "Quem...", "Em que..."
    5. Opções de resposta devem ser PLURAIS e ESPECÍFICAS (não genéricas)
    6. A resposta correta deve estar sempre nas opções
    7. Para crianças (7-9): divertido e educativo
    8. Para adultos: tipo quiz show,诱惑 mas não impossível

    Exemplos de BOAS perguntas:
    - "Quantos ossos tem o corpo humano?"
    - "Qual o rio mais longo da Europa?"
    - "Em que ano chegou o homem à Lua?"

    Exemplos de PERGUNTAS A EVITAR:
    - "Qual a cor do céu?" (muito óbvio)
    - "O que é a água?" (muito vago)

    Público Alvo:
    ${ageRating === "7-9" ? "- Crianças (7-9 anos): Simples, divertido, educativo." : ""}
    ${ageRating === "10-14" ? "- Jovens (10-14 anos): Curiosidades escolares e do dia-a-dia." : ""}
    ${ageRating === "15-17" ? "- Adolescentes (15-17 anos): Mais desafiante, aplicações reais." : ""}
    ${!["7-9", "10-14", "15-17"].includes(ageRating) ? "- Adultos: Quiz show, conhecimento geral interessante." : ""}

    Retorna APENAS JSON válido (sem markdown):
    [
      {
        "text": "Pergunta curta e direta?",
        "options": ["Opção A específica", "Opção B específica", "Opção C específica", "Opção D específica"],
        "correct_option": 0,
        "category": "${prompt}",
        "explanation": "Curiosidade ou explicação breve"
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
