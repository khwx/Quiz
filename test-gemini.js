// Script de Diagnóstico para Gemini API
// Corre este ficheiro com: node test-gemini.js

require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Lê a chave do ficheiro .env.local
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "CHAVE_NAO_ENCONTRADA";

async function testGemini() {
    console.log("🔍 A testar a ligação ao Gemini...\n");
    console.log("Chave API (parcial):", API_KEY.substring(0, 6) + "..." + API_KEY.substring(API_KEY.length - 4));

    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        // Using the model we found to be available
        const modelName = "gemini-2.0-flash";
        console.log(`Testando modelo FINAL: ${modelName}...`);

        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Olá! Diz-me 3 cores em JSON.");
        const response = await result.response;

        console.log(`✅ ${modelName} FUNCIONA PERFEITAMENTE!`);
        console.log(`   Resposta: ${response.text()}`);

    } catch (error) {
        console.log(`❌ ERRO FINAL:`);
        console.log(`   Erro: ${error.message}\n`);
    }
}

testGemini().catch(console.error);
