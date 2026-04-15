// Script de Diagnóstico para Gemini API
// Corre este ficheiro com: node test-gemini.js

require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Funções replicadas de ai-service-fallback.ts para teste autónomo
function buildPrompt(prompt, count, ageRating) {
    return `
    Gera ${count} perguntas de quiz em Português de Portugal para o seguinte tema: "${prompt}".

    Regras importantes para evitar repetições e aumentar a qualidade:
    1.  NÃO gere perguntas óbvias ou de conhecimento senso comum (ex: "Qual é a cor do céu?" para o tema "Cores").
    2.  Foque em fatos menos conhecidos, curiosidades, detalhes específicos ou aplicações práticas do tema.
    3.  Varie a estrutura das perguntas: use "Qual é...", "O que acontece se...", "Por que...", "Qual destes...".
    4.  As explicações devem ser breves mas informativas, adicionando valor além da simples resposta correta.
    5.  Se o tema for muito amplo, reduza-o a um sub-tema específico ou um aspecto menos óbvio.
    6.  A resposta correta DEVE estar sempre entre as "options" fornecidas.
    7.  O índice "correct_option" DEVE corresponder à posição da resposta correta nas "options".

    Público Alvo e Nível de Dificuldade:
    ${ageRating === "7-9" ? "- Crianças (7-9 anos): Perguntas muito simples, divertidas e educativas. Vocabulário básico. Evite abstrações." : ""}
    ${ageRating === "10-14" ? "- Jovens (10-14 anos): Nível escolar intermédio. Ligações ao currículo de ciências, história ou geografia." : ""}
    ${ageRating === "15-17" ? "- Adolescentes (15-17 anos): Nível secundário. Conceptos ligeiramente mais complexos, aplicações reais ou históricas." : ""}
    ${!["7-9", "10-14", "15-17"].includes(ageRating) ? "- Adultos: Nível geral de quiz show. Perguntas que exigem algum raciocínio ou conhecimento específico, não apenas sentido comum." : ""}

    Retorna APENAS um array JSON válido (sem markdown) com este formato exato:
    [
      {
        "text": "Pergunta? (deve terminar com interrogação)",
        "options": ["Texto da opção A", "Texto da opção B", "Texto da opção C", "Texto da opção D"],
        "correct_option": 0, // Índice da opção correta (0, 1, 2 ou 3)
        "category": "${prompt}",
        "explanation": "Explicação curta e informativa (1 frase) sobre por que a resposta está correta ou um fato interessante relacionado."
      }
    ]
  `;
}

function cleanJson(text) {
    return text.replace(/```json|```/g, "").trim();
}

// Lê a chave do ficheiro .env.local
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "CHAVE_NAO_ENCONTRADA";

async function testGemini() {
    console.log("🔍 A testar a ligação ao Gemini...\n");
    console.log("Chave API (parcial):", API_KEY.substring(0, 6) + "..." + API_KEY.substring(API_KEY.length - 4));

    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
        console.log(`Testando modelo FINAL: ${modelName}...`);

        const model = genAI.getGenerativeModel({ model: modelName });

        // Parâmetros de teste
        const testPrompt = "Invenções";
        const testCount = 3;
        const testAgeRating = "adults"; // "7-9", "10-14", "15-17", "adults"

        const fullPrompt = buildPrompt(testPrompt, testCount, testAgeRating);
        console.log("Prompt enviado:\n", fullPrompt);

        const result = await model.generateContent(fullPrompt);
        const responseText = result.response.text();
        const jsonResponse = cleanJson(responseText);

        console.log(`✅ ${modelName} FUNCIONA PERFEITAMENTE!`);
        console.log(`   Resposta RAW: ${responseText}`);
        console.log(`   Resposta JSON Limpa: ${jsonResponse}`);

        try {
            const questions = JSON.parse(jsonResponse);
            console.log("   JSON Parsed com sucesso:", questions);
        } catch (parseError) {
            console.error("❌ ERRO ao fazer parse do JSON:", parseError.message);
        }

    } catch (error) {
        console.log(`❌ ERRO FINAL:`);
        console.log(`   Erro: ${error.message}\n`);
    }
}

testGemini().catch(console.error);
