type CachedQuestions = {
  questions: any[];
  provider: string;
  createdAt: number;
};

type CacheStore = {
  [hash: string]: CachedQuestions;
};

const store: CacheStore = {};
const CACHE_TTL_MS = 60 * 60 * 1000;

function hashPrompt(prompt: string, count: number, ageRating: string): string {
  const input = `${prompt}:${count}:${ageRating}`;
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

export function getCachedQuestions(prompt: string, count: number, ageRating: string): { questions: any[]; provider: string } | null {
  const key = hashPrompt(prompt, count, ageRating);
  const cached = store[key];

  if (!cached) return null;

  if (Date.now() - cached.createdAt > CACHE_TTL_MS) {
    delete store[key];
    return null;
  }

  return { questions: cached.questions, provider: cached.provider };
}

export function setCachedQuestions(prompt: string, count: number, ageRating: string, questions: any[], provider: string): void {
  const key = hashPrompt(prompt, count, ageRating);
  store[key] = { questions, provider, createdAt: Date.now() };
}

export function clearCache(): void {
  Object.keys(store).forEach(key => delete store[key]);
}