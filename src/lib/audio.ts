declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

export function createAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  return new AudioCtx();
}

export async function unlockAudio(): Promise<AudioContext | null> {
  try {
    const ctx = createAudioContext();
    if (!ctx) return null;
    if (ctx.state === "suspended") await ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    gain.gain.value = 0;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
    return ctx;
  } catch {
    return null;
  }
}
