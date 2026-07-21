export const GAME_CONSTANTS = {
  LIVES_DEFAULT: 3,
  SCORE_MIN: 600,
  SCORE_MAX: 1000,
  QUESTION_LOAD_TIMEOUT: 8000,
  AUTO_SKIP_DELAY: 3000,
  MAX_RETRIES: 3,
  TIMEOUT_MS: 30000,
  PIN_LENGTH: 6,
  DEFAULT_TIMER: 20,
  DEFAULT_QUESTION_COUNT: 5,
  FEEDBACK_DISMISS_MS: 2000,
  REVEAL_DELAY_MS: 1500,
  SOUND_PROMPT_AUTOHIDE_MS: 8000,
  PLAYER_SYNC_DELAY_MS: 1500,
  ANSWER_CLEAR_DELAY_MS: 500,
  BUZZER_LOCK_DELAY_MS: 1500,
} as const;

export const GameStatus = {
  LOBBY: "LOBBY" as const,
  STARTING: "STARTING" as const,
  QUESTION: "QUESTION" as const,
  REVEAL: "REVEAL" as const,
  PODIUM: "PODIUM" as const,
  FINAL: "FINAL" as const,
  QUALIFYING: "QUALIFYING" as const,
  LEADERBOARD: "LEADERBOARD" as const,
} as const;

export type GameStatus = (typeof GameStatus)[keyof typeof GameStatus];

export const UserRole = {
  ADMIN: "admin" as const,
  MODERATOR: "moderator" as const,
  HOST: "host" as const,
  MEMBER: "member" as const,
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const TournamentStatus = {
  LOBBY: "LOBBY" as const,
  QUALIFYING: "QUALIFYING" as const,
  FINAL: "FINAL" as const,
  FINISHED: "FINISHED" as const,
} as const;

export type TournamentStatus = (typeof TournamentStatus)[keyof typeof TournamentStatus];

export const SOUND_TYPES = {
  TICK: "tick" as const,
  CORRECT: "correct" as const,
  WRONG: "wrong" as const,
  WIN: "win" as const,
  STREAK: "streak" as const,
  LOSE_LIFE: "lose_life" as const,
} as const;

export type SoundType = (typeof SOUND_TYPES)[keyof typeof SOUND_TYPES];

export const POWERUPS = {
  FIFTY_FIFTY: "fifty_fifty" as const,
  SKIP: "skip" as const,
  TIME_FREEZE: "time_freeze" as const,
} as const;

export type PowerUpType = (typeof POWERUPS)[keyof typeof POWERUPS];

export const SOUND_CONFIG = {
  tick: { freq: 880, duration: 0.08, type: "sine" as OscillatorType, volume: 0.15 },
  correct: [
    { freq: 523, duration: 0.1, type: "sine" as OscillatorType, volume: 0.25 },
    { freq: 659, duration: 0.1, type: "sine" as OscillatorType, volume: 0.25, delay: 80 },
    { freq: 784, duration: 0.2, type: "sine" as OscillatorType, volume: 0.3, delay: 160 },
  ],
  wrong: [
    { freq: 300, duration: 0.15, type: "sawtooth" as OscillatorType, volume: 0.2 },
    { freq: 250, duration: 0.2, type: "sawtooth" as OscillatorType, volume: 0.15, delay: 120 },
  ],
  win: [
    { freq: 523, duration: 0.25, type: "sine" as OscillatorType, volume: 0.3, delay: 0 },
    { freq: 659, duration: 0.25, type: "sine" as OscillatorType, volume: 0.3, delay: 120 },
    { freq: 784, duration: 0.25, type: "sine" as OscillatorType, volume: 0.3, delay: 240 },
    { freq: 1047, duration: 0.25, type: "sine" as OscillatorType, volume: 0.3, delay: 360 },
  ],
  streak: [
    { freq: 1200, duration: 0.1, type: "sine" as OscillatorType, volume: 0.2 },
    { freq: 1400, duration: 0.15, type: "sine" as OscillatorType, volume: 0.25, delay: 80 },
  ],
  lose_life: [
    { freq: 400, duration: 0.1, type: "triangle" as OscillatorType, volume: 0.2 },
    { freq: 300, duration: 0.2, type: "triangle" as OscillatorType, volume: 0.15, delay: 100 },
  ],
  bgMusic: { freq: 220, volume: 0.05 },
} as const;

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://quizverse.app";

export const GEO_SERVICE_URL = "https://ipapi.co/json/";

export const FLAG_CDN_BASE = "https://flagcdn.com/w320";
