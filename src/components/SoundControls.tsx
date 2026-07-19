"use client";

import { useState } from "react";
import { useSound } from "@/hooks/useSound";
import { Volume2, VolumeX, Music } from "lucide-react";

export default function SoundControls() {
  const { soundEnabled, setSoundEnabled, masterVolume, setMasterVolume, startBgMusic, stopBgMusic } = useSound();
  const [musicPlaying, setMusicPlaying] = useState(false);

  if (!soundEnabled) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col gap-2">
      <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10">
        <button
          onClick={() => {
            if (masterVolume > 0) {
              setMasterVolume(0);
              stopBgMusic();
            } else {
              setMasterVolume(0.5);
            }
          }}
          className="text-white/80 hover:text-white transition-colors"
        >
          {masterVolume > 0 ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={masterVolume}
          onChange={(e) => setMasterVolume(Number(e.target.value))}
          className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
        />
        <button
          onClick={() => {
            if (musicPlaying) {
              stopBgMusic();
              setMusicPlaying(false);
            } else {
              startBgMusic();
              setMusicPlaying(true);
            }
          }}
          className="text-white/80 hover:text-white transition-colors"
        >
          <Music className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
