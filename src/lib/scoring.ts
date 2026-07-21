/**
 * Enhanced Scoring System for Family Quiz
 * 
 * Provides intelligent scoring based on:
 * - Category-specific difficulty multipliers
 * - Time-based efficiency bonuses
 * - Streak rewards and progression
 * - Category mastery tracking
 * - Adaptive difficulty
 */

// ⭐ CATEGORY DIFFICULTY MULTIPLIERS
// These reward knowledge in more challenging/important domains
export const CATEGORY_MULTIPLIERS: Record<string, number> = {
  'CIENCIA': 1.5,       // Scientific knowledge requires precision and recall
  'HISTÓRIA': 1.3,      // Complex historical facts rewarded
  'GEOGRAFIA': 1.4,     // Physical/political geography valued
  'POLITICA': 1.2,      // High-level political knowledge rewarded
  'TECNOLOGIA': 1.25,   // Fast-evolving tech knowledge needs quick recall
  'MATEMATICA': 1.35,   // Problem-solving math gets higher scores
  'ARTE': 1.1,          // Art facts generally factual
  'CINEMA': 1.15,       // Film knowledge valued
  'DESPORTO': 1.05,     // Sports can be observational
  'CULTURA_GERAL': 1.2, // General cultural facts solid
  'ANIMAIS': 1.1,       // Biology facts factually correct
  'GASTRONOMIA': 1.25,  // Culinary knowledge valued
  'CAPITAIS_DO_MUNDO': 1.4, // World capitals important!
  'BANDEIRAS': 1.3,     // National symbols important
  'MUSICA': 1.15,       // Music knowledge rewarding
};

// ⭐ DIFFICULTY CONFIGURATION
export const DIFFICULTY_CONFIG = {
  easy: { 
    basePoints: 500, 
    timeBonus: 500, 
    multiplier: 1.0,
    timer: 30,
    category: 'LOW', 
    memoryType: 'SHORT_TERM',
    timePressure: 'LOW'
  },
  medium: { 
    basePoints: 700, 
    timeBonus: 700, 
    multiplier: 1.3,
    timer: 25,
    category: 'MEDIUM', 
    memoryType: 'MIXED',
    timePressure: 'MODERATE'
  },
  hard: { 
    basePoints: 900, 
    timeBonus: 900, 
    multiplier: 1.6,
    timer: 20,
    category: 'HIGH', 
    memoryType: 'SHORT_TERM',
    timePressure: 'HIGH'
  },
  expert: { 
    basePoints: 1200, 
    timeBonus: 1200, 
    multiplier: 2.0,
    timer: 15,
    category: 'CRITICAL', 
    memoryType: 'MIXED',
    timePressure: 'EXTREME'
  },
} as const;

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert';

// ⭐ CATEGORY -> DIFFICULTY MAPPING
export function getDifficultyLevel(category: string, ageRating: number): DifficultyLevel {
  const highDifficultyCategories = ['CIENCIA', 'TECNOLOGIA', 'MATEMATICA', 'HISTÓRIA', 'GEOGRAFIA', 'POLITICA'];
  const mediumDifficultyCategories = ['CULTURA_GERAL', 'GASTRONOMIA', 'CAPITAIS_DO_MUNDO', 'BANDEIRAS', 'MUSICA', 'ARTE', 'CINEMA'];
  
  if (highDifficultyCategories.includes(category)) {
    if (ageRating >= 14) return 'expert';
    if (ageRating >= 12) return 'hard';
    return 'medium';
  }
  
  if (mediumDifficultyCategories.includes(category)) {
    if (ageRating >= 14) return 'hard';
    if (ageRating >= 12) return 'medium';
    return 'easy';
  }
  
  // Default mapping based on age rating
  if (ageRating >= 14) return 'hard';
  if (ageRating >= 12) return 'medium';
  if (ageRating >= 10) return 'medium';
  return 'easy';
}

export function getDifficultyConfig(difficulty: DifficultyLevel) {
  return DIFFICULTY_CONFIG[difficulty];
}

// ⭐ TIME EFFICIENCY BONUS CALCULATOR
export interface TimeEfficiencyResult {
  multiplier: number;
  bonusPoints: number;
  efficiency: number;
  timeCategory: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'SLOW';
}

export function calculateTimeEfficiency(
  timeTaken: number, 
  timerDuration: number, 
  difficulty: DifficultyLevel
): TimeEfficiencyResult {
  const efficiency = Math.max(0, (timerDuration - timeTaken) / timerDuration);
  
  let multiplier: number;
  let timeCategory: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'SLOW';
  
  if (efficiency >= 0.9) {
    multiplier = 2.5;
    timeCategory = 'EXCELLENT';
  } else if (efficiency >= 0.75) {
    multiplier = 2.0;
    timeCategory = 'GOOD';
  } else if (efficiency >= 0.5) {
    multiplier = 1.5;
    timeCategory = 'AVERAGE';
  } else {
    multiplier = 1.0;
    timeCategory = 'SLOW';
  }
  
  // Difficulty-based bonus
  const difficultyBonus = {
    easy: 1.0,
    medium: 1.2,
    hard: 1.5,
    expert: 2.0,
  }[difficulty] || 1.0;
  
  const finalMultiplier = multiplier * difficultyBonus;
  const basePoints = DIFFICULTY_CONFIG[difficulty].basePoints;
  const bonusPoints = Math.round(basePoints * (finalMultiplier - 1) * efficiency);
  
  return {
    multiplier: finalMultiplier,
    bonusPoints,
    efficiency,
    timeCategory,
  };
}

// ⭐ STREAK MANAGEMENT
export interface StreakData {
  currentStreak: number;
  maxStreak: number;
  categoryStreaks: Record<string, number>;
  lastCorrectAt: string | null;
  consecutiveCorrect: number;
}

export interface StreakResult {
  streakBonus: number;
  newStreak: number;
  isNewMax: boolean;
  unlockedBadge?: string;
  multiplier: number;
}

export function calculateStreakBonus(
  currentStreak: number,
  isCorrect: boolean,
  _category: string  // eslint-disable-line @typescript-eslint/no-unused-vars
): StreakResult {
  if (!isCorrect) {
    return {
      streakBonus: 0,
      newStreak: 0,
      isNewMax: false,
      multiplier: 1.0,
    };
  }
  
  const newStreak = currentStreak + 1;
  const isNewMax = newStreak > Math.max(1, currentStreak);
  
  let streakBonus = 0;
  let multiplier = 1.0;
  
  if (newStreak >= 15) {
    streakBonus = 5000;
    multiplier = 3.0;
  } else if (newStreak >= 10) {
    streakBonus = 3000;
    multiplier = 2.5;
  } else if (newStreak >= 7) {
    streakBonus = 2000;
    multiplier = 2.0;
  } else if (newStreak >= 5) {
    streakBonus = 1000;
    multiplier = 1.75;
  } else if (newStreak >= 3) {
    streakBonus = 500;
    multiplier = 1.5;
  }
  
  return {
    streakBonus,
    newStreak,
    isNewMax,
    multiplier,
  };
}

// ⭐ CATEGORY MASTERY SCORING
export interface CategoryMasteryResult {
  masteryBonus: number;
  isNewMastery: boolean;
  masteryLevel: 'NOVICE' | 'APPRENTICE' | 'EXPERT' | 'MASTER' | 'GRANDMASTER';
  nextThreshold: number;
  currentAccuracy: number;
}

export function calculateCategoryMastery(
  categoryStats: Record<string, { correct: number; total: number }>,
  category: string
): CategoryMasteryResult {
  const stats = categoryStats[category] || { correct: 0, total: 0 };
  
  if (stats.total === 0) {
    return {
      masteryBonus: 0,
      isNewMastery: false,
      masteryLevel: 'NOVICE',
      nextThreshold: 5,
      currentAccuracy: 0,
    };
  }
  
  const accuracy = stats.correct / stats.total;
  const multiplier = CATEGORY_MULTIPLIERS[category] || 1.0;
  
  let masteryLevel: 'NOVICE' | 'APPRENTICE' | 'EXPERT' | 'MASTER' | 'GRANDMASTER';
  let masteryBonus = 0;
  let nextThreshold = 0;
  
  if (stats.total >= 20 && accuracy >= 0.9) {
    masteryLevel = 'GRANDMASTER';
    masteryBonus = 5000 * multiplier;
    nextThreshold = 50;
  } else if (stats.total >= 15 && accuracy >= 0.85) {
    masteryLevel = 'MASTER';
    masteryBonus = 3000 * multiplier;
    nextThreshold = 20;
  } else if (stats.total >= 10 && accuracy >= 0.8) {
    masteryLevel = 'EXPERT';
    masteryBonus = 1500 * multiplier;
    nextThreshold = 15;
  } else if (stats.total >= 5 && accuracy >= 0.75) {
    masteryLevel = 'APPRENTICE';
    masteryBonus = 500 * multiplier;
    nextThreshold = 10;
  } else {
    masteryLevel = 'NOVICE';
    masteryBonus = 0;
    nextThreshold = 5;
  }
  
  return {
    masteryBonus,
    isNewMastery: false, // Would need previous state to determine
    masteryLevel,
    nextThreshold,
    currentAccuracy: accuracy,
  };
}

// ⭐ BUZZER PERFORMANCE ANALYSIS
export interface BuzzAnalysis {
  score: number;
  recommendation: 'USE_BUZZER_MORE' | 'USE_BUZZER_LESS' | 'ADAPTIVE';
  efficiency: number;
  winRate: number;
  currentStreak: number;
  recommendationReason: string;
}

export function analyzeBuzzerPerformance(
  buzzerWins: number,
  buzzerAttempts: number,
  buzzerLosses: number,
  _totalQuestions: number  // eslint-disable-line @typescript-eslint/no-unused-vars
): BuzzAnalysis {
  if (buzzerAttempts === 0) {
    return {
      score: 0,
      recommendation: 'ADAPTIVE',
      efficiency: 0,
      winRate: 0,
      currentStreak: 0,
      recommendationReason: 'No buzzer data yet',
    };
  }
  
  const winRate = buzzerWins / buzzerAttempts;
  const efficiency = (buzzerWins - buzzerLosses) / buzzerAttempts;
  
  let recommendation: 'USE_BUZZER_MORE' | 'USE_BUZZER_LESS' | 'ADAPTIVE' = 'ADAPTIVE';
  let reason = 'Balanced buzzer usage';
  
  if (winRate >= 0.8 && buzzerAttempts >= 3) {
    recommendation = 'USE_BUZZER_MORE';
    reason = 'Excellent buzzer accuracy! Use it more for bonus points.';
  } else if (winRate <= 0.3 && buzzerAttempts >= 3) {
    recommendation = 'USE_BUZZER_LESS';
    reason = 'Buzzer accuracy is low. Be more selective.';
  } else if (efficiency < 0 && buzzerAttempts >= 5) {
    recommendation = 'USE_BUZZER_LESS';
    reason = 'Losing more than winning on buzzer. Be careful.';
  }
  
  return {
    score: Math.round(efficiency * 1000),
    recommendation,
    efficiency,
    winRate,
    currentStreak: buzzerWins,
    recommendationReason: reason,
  };
}

// ⭐ MAIN SCORING FUNCTION
export interface ScoringInput {
  isCorrect: boolean;
  timeTaken: number;
  timerDuration: number;
  category: string;
  ageRating: number;
  currentStreak: number;
  categoryStreak: number;
  categoryCorrect: number;
  categoryTotal: number;
  difficultyOverride?: 'easy' | 'medium' | 'hard' | 'expert';
  isBuzzerMode: boolean;
  isBuzzerWinner: boolean;
  buzzerWins: number;
  buzzerAttempts: number;
  buzzerLosses: number;
  totalQuestions: number;
}

export interface ScoringResult {
  points: number;
  basePoints: number;
  timeBonus: number;
  categoryBonus: number;
  streakBonus: number;
  masteryBonus: number;
  difficulty: DifficultyLevel;
  categoryMultiplier: number;
  timeEfficiency: TimeEfficiencyResult;
  streakResult: StreakResult;
  masteryResult: CategoryMasteryResult;
  buzzerAnalysis?: BuzzAnalysis;
  finalMultiplier: number;
  breakdown: {
    base: number;
    time: number;
    category: number;
    streak: number;
    mastery: number;
    buzzer: number;
    total: number;
  };
}

export function calculateEnhancedScore(input: ScoringInput): ScoringResult {
  if (!input.isCorrect) {
    return {
      points: 0,
      basePoints: 0,
      timeBonus: 0,
      categoryBonus: 0,
      streakBonus: 0,
      masteryBonus: 0,
      difficulty: getDifficultyLevel(input.category, input.ageRating),
      categoryMultiplier: CATEGORY_MULTIPLIERS[input.category] || 1.0,
      timeEfficiency: { multiplier: 1, bonusPoints: 0, efficiency: 0, timeCategory: 'SLOW' },
      streakResult: { streakBonus: 0, newStreak: 0, isNewMax: false, multiplier: 1.0 },
      masteryResult: { masteryBonus: 0, isNewMastery: false, masteryLevel: 'NOVICE', nextThreshold: 0, currentAccuracy: 0 },
      buzzerAnalysis: undefined,
      finalMultiplier: 1.0,
      breakdown: { base: 0, time: 0, category: 0, streak: 0, mastery: 0, buzzer: 0, total: 0 },
    };
  }
  
  const difficulty = input.difficultyOverride || getDifficultyLevel(input.category, input.ageRating);
  const difficultyConfig = DIFFICULTY_CONFIG[difficulty];
  const categoryMultiplier = CATEGORY_MULTIPLIERS[input.category] || 1.0;
  const timerDuration = input.timerDuration;
  
  // 1. BASE POINTS
  const basePoints = difficultyConfig.basePoints;
  
  // 2. TIME EFFICIENCY BONUS
  const timeEfficiency = calculateTimeEfficiency(input.timeTaken, timerDuration, difficulty);
  const timeBonus = Math.round(difficultyConfig.timeBonus * timeEfficiency.efficiency * categoryMultiplier);
  
  // 3. CATEGORY BONUS
  const categoryBonus = Math.round(basePoints * (categoryMultiplier - 1) * 0.5);
  
  // 4. STREAK BONUS
  const streakResult = calculateStreakBonus(input.currentStreak, true, input.category);
  const streakBonus = Math.round(streakResult.streakBonus * categoryMultiplier);
  
  // 5. CATEGORY MASTERY BONUS
  const masteryResult = calculateCategoryMastery(
    { [input.category]: { correct: input.categoryCorrect, total: input.categoryTotal } },
    input.category
  );
  const masteryBonus = Math.round(masteryResult.masteryBonus);
  
  // 6. BUZZER ANALYSIS
  let buzzerBonus = 0;
  let buzzerAnalysis: BuzzAnalysis | undefined;
  
  if (input.isBuzzerMode) {
    buzzerAnalysis = analyzeBuzzerPerformance(
      input.buzzerWins,
      input.buzzerAttempts,
      input.buzzerLosses,
      input.totalQuestions
    );
    
    if (input.isBuzzerWinner) {
      buzzerBonus = 200; // Base buzzer bonus
      // Extra for high accuracy
      if (buzzerAnalysis.winRate >= 0.8) {
        buzzerBonus += 300;
      }
    }
  }
  
  // FINAL CALCULATION
  const finalMultiplier = 
    streakResult.multiplier * 
    categoryMultiplier * 
    timeEfficiency.multiplier;
  
  const subtotal = basePoints + timeBonus + categoryBonus + streakBonus + masteryBonus + buzzerBonus;
  const points = Math.round(subtotal * finalMultiplier);
  
  return {
    points,
    basePoints,
    timeBonus,
    categoryBonus,
    streakBonus,
    masteryBonus,
    difficulty,
    categoryMultiplier,
    timeEfficiency,
    streakResult,
    masteryResult,
    buzzerAnalysis,
    finalMultiplier,
    breakdown: {
      base: basePoints,
      time: timeBonus,
      category: categoryBonus,
      streak: streakBonus,
      mastery: masteryBonus,
      buzzer: buzzerBonus,
      total: points,
    },
  };
}

// ⭐ ACHIEVEMENT SYSTEM
export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'streak' | 'category_mastery' | 'speed_demon' | 'accuracy' | 'buzzer_master' | 'perfect_game' | 'comeback_king' | 'explorer';
  requirement: {
    type: string;
    value: number;
    category?: string;
  };
  reward: {
    type: 'badge' | 'xp_bonus' | 'title' | 'avatar_frame' | 'special_ability';
    value: string | number;
  };
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  // Streak Achievements
  {
    id: 'STREAK_3',
    name: 'Em Maré de Sorte',
    description: 'Acertou 3 perguntas seguidas',
    icon: '🔥',
    category: 'streak',
    requirement: { type: 'streak', value: 3 },
    reward: { type: 'badge', value: 'STREAK_3' },
    rarity: 'common',
  },
  {
    id: 'STREAK_5',
    name: 'Quente!',
    description: 'Acertou 5 perguntas seguidas',
    icon: '🔥🔥',
    category: 'streak',
    requirement: { type: 'streak', value: 5 },
    reward: { type: 'badge', value: 'STREAK_5' },
    rarity: 'common',
  },
  {
    id: 'STREAK_7',
    name: 'Em Chamas',
    description: 'Acertou 7 perguntas seguidas',
    icon: '🔥🔥🔥',
    category: 'streak',
    requirement: { type: 'streak', value: 7 },
    reward: { type: 'badge', value: 'STREAK_7' },
    rarity: 'uncommon',
  },
  {
    id: 'STREAK_10',
    name: 'Imbatível',
    description: 'Acertou 10 perguntas seguidas',
    icon: '💎',
    category: 'streak',
    requirement: { type: 'streak', value: 10 },
    reward: { type: 'badge', value: 'STREAK_10' },
    rarity: 'rare',
  },
  {
    id: 'STREAK_15',
    name: 'Lendário',
    description: 'Acertou 15 perguntas seguidas',
    icon: '👑',
    category: 'streak',
    requirement: { type: 'streak', value: 15 },
    reward: { type: 'badge', value: 'STREAK_15' },
    rarity: 'legendary',
  },
  
  // Category Mastery
  {
    id: 'SCIENCE_MASTER',
    name: 'Mestre da Ciência',
    description: 'Acurácia de 90%+ em 20+ perguntas de Ciência',
    icon: '🔬',
    category: 'category_mastery',
    requirement: { type: 'category_mastery', value: 20, category: 'CIENCIA' },
    reward: { type: 'title', value: 'Mestre da Ciência' },
    rarity: 'rare',
  },
  {
    id: 'HISTORY_MASTER',
    name: 'Historiador',
    description: 'Acurácia de 90%+ em 20+ perguntas de História',
    icon: '📜',
    category: 'category_mastery',
    requirement: { type: 'category_mastery', value: 20, category: 'HISTÓRIA' },
    reward: { type: 'title', value: 'Historiador' },
    rarity: 'rare',
  },
  {
    id: 'GEOGRAPHY_MASTER',
    name: 'Explorador Global',
    description: 'Acurácia de 90%+ em 20+ perguntas de Geografia',
    icon: '🌍',
    category: 'category_mastery',
    requirement: { type: 'category_mastery', value: 20, category: 'GEOGRAFIA' },
    reward: { type: 'title', value: 'Explorador Global' },
    rarity: 'rare',
  },
  {
    id: 'CAPITALS_MASTER',
    name: 'Conhece Todas as Capitais',
    description: 'Acurácia de 90%+ em 20+ perguntas de Capitais',
    icon: '🏛️',
    category: 'category_mastery',
    requirement: { type: 'category_mastery', value: 20, category: 'CAPITAIS_DO_MUNDO' },
    reward: { type: 'title', value: 'Conhece Todas as Capitais' },
    rarity: 'epic',
  },
  {
    id: 'FLAGS_MASTER',
    name: 'Vexilologista',
    description: 'Acurácia de 90%+ em 20+ perguntas de Bandeiras',
    icon: '🚩',
    category: 'category_mastery',
    requirement: { type: 'category_mastery', value: 20, category: 'BANDEIRAS' },
    reward: { type: 'title', value: 'Vexilologista' },
    rarity: 'epic',
  },
  
  // Speed Demon
  {
    id: 'SPEED_DEMON_10',
    name: 'Relâmpago',
    description: 'Respondeu 10 perguntas em menos de 5 segundos cada',
    icon: '⚡',
    category: 'speed_demon',
    requirement: { type: 'speed', value: 10 },
    reward: { type: 'badge', value: 'SPEED_DEMON' },
    rarity: 'uncommon',
  },
  
  // Buzzer Master
  {
    id: 'BUZZER_MASTER',
    name: 'Rei do Buzzer',
    description: 'Venceu 10 buzzes com 80%+ de acurácia',
    icon: '🔔',
    category: 'buzzer_master',
    requirement: { type: 'buzzer_wins', value: 10 },
    reward: { type: 'title', value: 'Rei do Buzzer' },
    rarity: 'rare',
  },
  
  // Perfect Game
  {
    id: 'PERFECT_GAME',
    name: 'Jogo Perfeito',
    description: 'Acertou todas as perguntas de um jogo',
    icon: '💯',
    category: 'perfect_game',
    requirement: { type: 'perfect_game', value: 1 },
    reward: { type: 'title', value: 'Perfeccionista' },
    rarity: 'legendary',
  },
];

export const ACHIEVEMENT_MAP = new Map(ACHIEVEMENTS.map(a => [a.id, a]));