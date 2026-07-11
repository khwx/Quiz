export async function generateQuestions(prompt: string, count: number = 5, ageRating: string = "adults") {
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
    return data.questions || data;
  } catch (error) {
    throw error;
  }
}
