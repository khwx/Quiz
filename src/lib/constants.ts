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
} as const;

export const SOUND_TYPES = {
  TICK: 'tick',
  CORRECT: 'correct',
  WRONG: 'wrong',
  WIN: 'win',
} as const;

export const POWERUPS = {
  FIFTY_FIFTY: 'fifty_fifty',
  SKIP: 'skip',
  TIME_FREEZE: 'time_freeze',
} as const;
