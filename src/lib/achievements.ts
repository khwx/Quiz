export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "legendary" | "epic" | "rare" | "common";
  category: "Vitórias" | "Sequências" | "Precisão" | "Social";
}

// Catalog of all achievement ids that can be unlocked at runtime.
// Must stay in sync with checkNewAchievements() in src/app/api/answer/route.ts.
export const ACHIEVEMENT_CATALOG: AchievementDef[] = [
  { id: "STREAK_3", name: "Sequência de Fogo", description: "Acierta 3 perguntas seguidas.", icon: "🔥", rarity: "common", category: "Sequências" },
  { id: "STREAK_5", name: "Imparável", description: "Acierta 5 perguntas seguidas.", icon: "⚡", rarity: "rare", category: "Sequências" },
  { id: "STREAK_7", name: "Na Mira", description: "Acierta 7 perguntas seguidas.", icon: "🎯", rarity: "epic", category: "Sequências" },
  { id: "STREAK_10", name: "Lenda Viva", description: "Acierta 10 perguntas seguidas.", icon: "👑", rarity: "legendary", category: "Sequências" },
  { id: "STREAK_15", name: "Perfeição Absoluta", description: "Acierta 15 perguntas seguidas.", icon: "🌟", rarity: "legendary", category: "Sequências" },
  { id: "SCIENCE_MASTER", name: "Mestre da Ciência", description: "90% de precisão em 20 perguntas de Ciência.", icon: "🔬", rarity: "epic", category: "Precisão" },
  { id: "HISTORY_MASTER", name: "Mestre da História", description: "90% de precisão em 20 perguntas de História.", icon: "📜", rarity: "epic", category: "Precisão" },
  { id: "GEOGRAPHY_MASTER", name: "Mestre da Geografia", description: "90% de precisão em 20 perguntas de Geografia.", icon: "🌍", rarity: "epic", category: "Precisão" },
  { id: "CAPITALS_MASTER", name: "Mestre de Capitais", description: "90% de precisão em 20 perguntas de Capitais.", icon: "🏛️", rarity: "epic", category: "Precisão" },
  { id: "FLAGS_MASTER", name: "Mestre de Bandeiras", description: "90% de precisão em 20 perguntas de Bandeiras.", icon: "🚩", rarity: "epic", category: "Precisão" },
];

const BY_ID = new Map(ACHIEVEMENT_CATALOG.map((a) => [a.id, a]));

export function getAchievementDef(id: string): AchievementDef | undefined {
  return BY_ID.get(id);
}

// Points awarded per rarity, used for the "Pontos Astro" total.
export const RARITY_POINTS: Record<AchievementDef["rarity"], number> = {
  common: 50,
  rare: 100,
  epic: 200,
  legendary: 500,
};
