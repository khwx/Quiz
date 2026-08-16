/**
 * Haptic feedback utility.
 *
 * Respects the user's "haptics" preference stored in localStorage
 * (key: quizverse_settings) and only fires on devices that support
 * the Vibration API (mobile).
 */

const SETTINGS_KEY = "quizverse_settings";

export type HapticPattern = "correct" | "wrong" | "streak" | "tick";

const PATTERNS: Record<HapticPattern, number | number[]> = {
  correct: 35,
  wrong: [60, 40, 60],
  streak: [25, 30, 25, 30, 60],
  tick: 10,
};

function isHapticsEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return true; // default on
    const parsed = JSON.parse(raw) as { haptics?: boolean };
    return parsed.haptics !== false;
  } catch {
    return true;
  }
}

export function triggerHaptic(pattern: HapticPattern): void {
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;
  if (!isHapticsEnabled()) return;
  try {
    navigator.vibrate(PATTERNS[pattern]);
  } catch {
    // ignore unsupported
  }
}
