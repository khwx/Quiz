export async function generateQuestions(prompt: string, count: number = 5, ageRating: string = "adults") {
  console.log(`[AI-Service-Client] Requesting questions for: ${prompt}`);

  try {
    const response = await fetch("/api/questions/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, count, ageRating }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`[AI-Service-Client] Provider used: ${data.provider || "unknown"}`);
    return data.questions || data;
  } catch (error) {
    console.error("Erro ao gerar perguntas (Client):", error);
    throw error;
  }
}
