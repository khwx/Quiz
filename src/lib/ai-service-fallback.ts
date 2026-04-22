import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import { getCachedQuestions, setCachedQuestions } from "./cache";

const GEMINI_MODEL = "gemini-1.5-flash";
const GROQ_MODEL = "llama-3.3-70b-versatile";

const TIMEOUT_MS = 30000;
const MAX_RETRIES = 2;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms);
    promise.then((res) => { clearTimeout(timer); resolve(res); }).catch((err) => { clearTimeout(timer); reject(err); });
  });
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getRetryDelay(attempt: number): number {
  return Math.min(1000 * Math.pow(2, attempt), 5000);
}

function buildPrompt(prompt: string, count: number, ageRating: string) {
  const promptLower = prompt.toLowerCase();
  const isCapitals = promptLower.includes("capitais");
  const isFlags = promptLower.includes("bandeir");
  
  const specificRules = isCapitals ? `
    TEMA ESPECIAL: CAPITAIS DO MUNDO
    - Perguntas sobre capitais de países (ex: "Qual é a capital de Portugal?")
    - CADA pergunta deve ser sobre um PAÍS DIFERENTE
    - A resposta correta DEVE SER A CIDADE CAPITAL (ex: Lisboa, Madrid, Ottawa, etc.)
    - NÃO colocar o nome do país como resposta correta!
    - Usar países de todos os continentes: Portugal, Brasil, Espanha, França, Alemanha, Itália, Reino Unido, Japão, China, Índia, Rússia, México, Argentina, Chile, Canadá, Austrália, etc.
  ` : isFlags ? `
    TEMA ESPECIAL: BANDEIRAS
    - Perguntas sobre bandeiras de países
    - CADA pergunta deve ter uma image_url com a bandeira
    - CADA pergunta deve ser sobre um PAÍS DIFERENTE
    - NÃO repetires o mesmo país em perguntas diferentes
    - Formato: https://flagcdn.com/w320/{codigo}.png
    - Códigos válidos: pt, br, es, fr, de, it, uk, us, jp, cn, in, ru, mx, ca, au, ar, kr, nl, be, ch
    - O image_url deve corresponder ao país CORRETO na resposta
  ` : "";

  return `
    Gera ${count} perguntas de quiz em Português de Portugal para: "${prompt}".

    ${specificRules}

    REGRAS DE QUALIDADE (MUITO IMPORTANTE):
    1. Perguntas CURTAS e DIRETAS (máximo 80 caracteres no texto)
    2. Evitar perguntas óbvias de senso comum
    3. Focar em factos curiosas, surpreendentes ou pouco conhecidos
    4. NÃO GERAR PERGUNTAS SIMILARES - cada pergunta deve ser sobre um assunto DIFERENTE
    5. NÃO REPETIR o mesmo país/cidade/tema em perguntas consecutivas
    6. Variedade na estrutura: usar "Qual...", "O que...", "Quem...", "Em que..."
    7. Opções de resposta devem ser PLURAIS e ESPECÍFICAS (não genéricas)
    8. A resposta correta deve estar sempre nas opções
    9. Para crianças (7-9): divertido e educativo
    10. Para adultos: tipo quiz show, desafiante mas não impossível



    Exemplos de BOAS perguntas:
    - "Quantos ossos tem o corpo humano?"
    - "Qual o rio mais longo da Europa?"
    - "Em que ano chegou o homem à Lua?"
    ${isCapitals ? '- "Qual é a capital de Portugal?"' : ''}
    ${isFlags ? '- "De que país é esta bandeira?" (com image_url)' : ''}

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
        "explanation": "Curiosidade ou explicação breve"${isFlags ? ',\n        "image_url": "https://flagcdn.com/w320/pt.png" (OBRIGATÓRIO para bandeiras!)' : ''}
      }
    ]
    ${isFlags ? '\nIMPORTANTE: Para perguntas de bandeiras, TODAS as perguntas devem ter image_url!' : ''}
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

    // Shuffle options so the correct answer is NOT always option A
    const options: string[] = q.options || [];
    const correctText = options[q.correct_option ?? 0];
    const shuffled = [...options].sort(() => Math.random() - 0.5);
    const newCorrectIndex = shuffled.indexOf(correctText);

    return { ...q, text, category, options: shuffled, correct_option: newCorrectIndex };
  });
}

function cleanJson(text: string) {
  return text.replace(/```json|```/g, "").trim();
}

async function tryGemini(fullPrompt: string, attempt: number = 0): Promise<string> {
  // Security: Only use server-side env var. NEXT_PUBLIC_ would expose the key in the client bundle.
  const apiKey = process.env.GEMINI_API_KEY || "";
  if (!apiKey) throw new Error("Gemini API key not configured");

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    const result = await withTimeout(model.generateContent(fullPrompt), TIMEOUT_MS);
    return cleanJson(result.response.text());
  } catch (error: any) {
    if (attempt < MAX_RETRIES) {
      const delay = getRetryDelay(attempt);
      console.warn(`[AI] Gemini attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
      await sleep(delay);
      return tryGemini(fullPrompt, attempt + 1);
    }
    throw error;
  }
}

async function tryGroq(fullPrompt: string, attempt: number = 0): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY || "";
  if (!apiKey) throw new Error("Groq API key not configured");

  try {
    const groq = new Groq({ apiKey });
    const response = await withTimeout(
      groq.chat.completions.create({
        model: GROQ_MODEL,
        messages: [{ role: "user", content: fullPrompt }],
        temperature: 0.7,
        max_tokens: 2048,
      }),
      TIMEOUT_MS
    );

    const text = response.choices[0]?.message?.content || "";
    return cleanJson(text);
  } catch (error: any) {
    if (attempt < MAX_RETRIES) {
      const delay = getRetryDelay(attempt);
      console.warn(`[AI] Groq attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
      await sleep(delay);
      return tryGroq(fullPrompt, attempt + 1);
    }
    throw error;
  }
}

export async function generateQuestionsWithFallback(prompt: string, count: number = 5, ageRating: string = "adults", round: number = 1) {
  // Cache disabled to prevent repeated questions across different game sessions
  // Performance is still good with retry + timeout
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