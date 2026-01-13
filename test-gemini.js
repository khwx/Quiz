// Script de Diagnóstico para Gemini API
// Corre este ficheiro com: node test-gemini.js

require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Lê a chave do ficheiro .env.local
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "CHAVE_NAO_ENCONTRADA";

async function testGemini() {
    console.log("🔍 A testar a ligação ao Gemini...\n");

    const genAI = new GoogleGenerativeAI(API_KEY);

    // Lista de modelos para testar
    const modelsToTest = [
        "gemini-pro",
        "gemini-1.5-pro",
        "gemini-1.5-flash",
        "gemini-1.5-flash-latest"
    ];

    console.log("Chave API (parcial):", API_KEY.substring(0, 6) + "..." + API_KEY.substring(API_KEY.length - 4));
    console.log("Tamanho da chave:", API_KEY.length, "\n");

    for (const modelName of modelsToTest) {
        try {
            console.log(`Testando modelo: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Olá!");
            const response = await result.response;
            console.log(`✅ ${modelName} FUNCIONA!`);
            console.log(`   Resposta: ${response.text().substring(0, 50)}...\n`);
        } catch (error) {
            console.log(`❌ ${modelName} FALHOU:`);
            console.log(`   Erro: ${error.message}\n`);
        }
    }
}

testGemini().catch(console.error);
