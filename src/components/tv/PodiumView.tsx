"use client";

import { Flag } from "lucide-react";
import Podium from "@/components/tv/Podium";

interface PodiumViewProps {
  players: any[];
  onRestart: () => void;
  onEditTopic: () => void;
  onReport: () => void;
}

export default function PodiumView({ players, onRestart, onEditTopic, onReport }: PodiumViewProps) {
  return (
    <div className="flex flex-col items-center gap-8">
      <Podium players={players} onRestart={onRestart} />
      <button onClick={onEditTopic} className="btn-quiz btn-secondary flex items-center gap-2">
        Escolher Outro Tema
      </button>
      <button
        onClick={onReport}
        className="flex items-center gap-2 px-4 py-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-xl border border-amber-500/30 transition-all"
      >
        <Flag className="w-5 h-5" />
        Reportar
      </button>
    </div>
  );
}