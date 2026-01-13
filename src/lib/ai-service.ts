import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function generateQuestions(prompt: string, count: number = 5, ageRating: string = "adults") {
  // Diagnostic log (masked)
  const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
  console.log(`[AI-Service] Chave: ${key.substring(0, 4)}...${key.substring(key.length - 4)} (Len: ${key.length})`);
  console.log(`[AI-Service] Prompt: ${prompt} | Count: ${count}`);

  const fullPrompt = `
    Gera ${count} perguntas de quiz em Português de Portugal para o seguinte tema: "${prompt}".
    O público alvo é: ${ageRating === "children" ? "Crianças entre 6 e 12 anos" : "Adultos"}.
    
    Retorna APENAS um array JSON válido com o seguinte formato:
    [
      {
        "text": "Pergunta aqui?",
        "options": ["Opção 1", "Opção 2", "Opção 3", "Opção 4"],
        "correct_option": 0,
        "category": "Tema solicitado",
        "explanation": "Breve explicação da resposta certa"
      }
    ]
  `;

  try {
    const result = await model.generateContent(fullPrompt);
    const text = result.response.text();
    console.log("[AI-Service] Raw response:", text);

    // Limpar markdown se a IA retornar blocks de código
    const jsonStr = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Erro ao gerar perguntas:", error);
    throw error;
  }
}
