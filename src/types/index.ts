// ============================================================
// Database Types — QuizVerse
// ============================================================

// --- Auth / Profiles ---

export type UserRole = "admin" | "moderator" | "host" | "user";

export interface Profile {
  id: string;
  username: string;
  avatar: string;
  role: UserRole;
  email?: string;
  bio?: string;
  xp: number;
  level: number;
  total_games: number;
  total_wins: number;
  total_points: number;
  created_at: string;
  updated_at: string;
}

// --- Games ---

export type GameStatus = "LOBBY" | "STARTING" | "QUESTION" | "REVEAL" | "LEADERBOARD" | "FINAL" | "PODIUM";

export interface GameSettings {
  language?: string;
  mode?: string;
  timer?: number;
  timer_duration?: number;
  topic?: string;
  question_count?: number;
  round?: number;
  age_group?: string;
  question_ids?: string[];
  current_question_id?: string;
  current_correct_option?: number;
  buzzer_mode?: boolean;
  hotseat_mode?: boolean;
  hotseat_players?: string[];
}

export interface Game {
  id: string;
  pin: string;
  status: GameStatus;
  current_question_index: number;
  settings: GameSettings;
  tournament_id?: string;
  team_id?: string;
  created_at: string;
}

// --- Players ---

export interface Player {
  id: string;
  game_id: string;
  name: string;
  score: number;
  avatar: string;
  color: string;
  is_host: boolean;
  user_id?: string;
  joined_at: string;
  lives?: number;
  eliminated?: boolean;
  current_streak?: number;
  max_streak?: number;
  category_stats?: Record<string, { correct: number; total: number }>;
  buzzer_wins?: number;
  buzzer_attempts?: number;
  buzzer_losses?: number;
  total_questions?: number;
  team_members?: Array<{
    team_id: string;
    user_id?: string;
    role?: string;
    profiles?: { username?: string; avatar?: string };
  }>;
}

// --- Questions ---

export interface Question {
  id: string;
  text: string;
  image_url?: string | null;
  options: string[];
  correct_option?: number;
  category?: string;
  difficulty?: number;
  age_rating?: number;
  country_code?: string;
  metadata?: Record<string, unknown>;
  hint?: string;
  explanation?: string;
  created_at?: string;
}

// --- Answers ---

export interface Answer {
  id: string;
  game_id: string;
  player_id: string;
  question_id: string;
  chosen_option: number;
  time_taken: number;
  is_correct: boolean;
  points: number;
  streak_at_answer?: number;
  category_bonus?: number;
  time_bonus?: number;
  streak_bonus?: number;
  difficulty_multiplier?: number;
  buzzer_bonus?: number;
  created_at: string;
}

// --- Teams ---

export interface Team {
  id: string;
  name: string;
  pin: string;
  created_by?: string;
  max_members: number;
  is_active: boolean;
  total_score: number;
  created_at: string;
}

export type TeamMemberRole = "host" | "member";

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: TeamMemberRole;
  joined_at: string;
}

// Joined type: team with its members + profile data
export interface TeamWithMembers extends Team {
  team_members: (TeamMember & {
    profiles?: Pick<Profile, "id" | "username" | "avatar">;
  })[];
}

// --- Tournaments ---

export type TournamentStatus = "LOBBY" | "QUALIFYING" | "FINAL" | "FINISHED";

export interface TournamentSettings {
  timer?: number;
  questions?: number;
  blind_mode?: boolean;
}

export interface Tournament {
  id: string;
  name: string;
  description?: string;
  pin: string;
  status: TournamentStatus;
  max_teams: number;
  current_round: number;
  settings: TournamentSettings;
  created_by?: string;
  starts_at?: string;
  created_at: string;
}

export interface TournamentTeam {
  id: string;
  tournament_id: string;
  team_id: string;
  score: number;
  rank?: number;
  eliminated?: boolean;
  qualified?: boolean;
  joined_at: string;
}

// Joined type: tournament with its teams + team data
export interface TournamentWithTeams extends Tournament {
  tournament_teams: (TournamentTeam & {
    teams?: Pick<Team, "id" | "name" | "pin">;
  })[];
}

export interface TournamentRound {
  id: string;
  tournament_id: string;
  round_number: number;
  question_index: number;
  scores: Record<string, number>;
  created_at: string;
}

// --- Game History ---

export interface GameHistoryEntry {
  id: string;
  game_id: string;
  player_id: string;
  user_id?: string;
  team_id?: string;
  tournament_id?: string;
  score: number;
  correct_answers: number;
  total_questions: number;
  duration_seconds?: number;
  finished_at: string;
}

// --- Enhanced Scoring & Analytics ---

export interface CategoryMultipliers {
  [category: string]: number;
}

export interface DifficultyConfig {
  easy: { basePoints: number; timeBonus: number; multiplier: number };
  medium: { basePoints: number; timeBonus: number; multiplier: number };
  hard: { basePoints: number; timeBonus: number; multiplier: number };
  expert: { basePoints: number; timeBonus: number; multiplier: number };
}

export interface StreakData {
  currentStreak: number;
  maxStreak: number;
  lastCorrectAt?: string;
  categoryStreaks: Record<string, number>;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  requirement: {
    type: 'streak' | 'category_mastery' | 'speed_demon' | 'accuracy' | 'buzzer_master' | 'perfect_game' | 'comeback_king';
    value: number;
    category?: string;
  };
  reward: {
    type: 'badge' | 'xp_bonus' | 'title' | 'avatar_frame';
    value: string | number;
  };
  unlockedAt?: string;
  progress?: number;
}

export interface PlayerPerformanceMetrics {
  byCategory: Record<string, {
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
    averageTime: number;
    bestStreak: number;
    difficultyBreakdown: Record<string, { correct: number; total: number }>;
  }>;
  byDifficulty: Record<string, {
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
    averageTime: number;
  }>;
  overall: {
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
    averageTime: number;
    currentStreak: number;
    maxStreak: number;
    perfectGames: number;
    comebackWins: number;
  };
  recentTrend: 'improving' | 'stable' | 'declining';
  strongCategories: string[];
  weakCategories: string[];
}

export interface BuzzPerformance {
  wins: number;
  losses: number;
  skips: number;
  winRate: number;
  efficiency: number;
  skew: 'strong' | 'weak' | 'neutral';
  streakBonus: number;
  recommended: 'USE_BUZZER_MORE' | 'USE_BUZZER_LESS' | 'ADAPTIVE';
}

export interface GameAnalytics {
  playerId: string;
  gameId: string;
  performanceMetrics: PlayerPerformanceMetrics;
  buzzPerformance: BuzzPerformance;
  achievements: Achievement[];
  streakData: StreakData;
  categoryMultipliers: CategoryMultipliers;
  difficultyConfig: DifficultyConfig;
}

// --- Derived / UI Types ---

export interface AnswerSummary {
  game_id: string;
  is_correct: boolean;
  points: number;
  created_at: string;
}

export interface LeaderboardEntry {
  player: Player;
  score: number;
  rank: number;
}

export interface GameResults {
  game: Game;
  players: Player[];
  answers: Answer[];
  leaderboard: LeaderboardEntry[];
}

export interface PlayerStats {
  totalGames: number;
  correctAnswers: number;
  totalPoints: number;
  accuracy: number;
  wins: number;
}
