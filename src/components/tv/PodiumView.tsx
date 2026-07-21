"use client";

import { motion } from "framer-motion";
import { Flag, RotateCcw, Palette, Sparkles, Users, Share2, Copy, Check, Trophy } from "lucide-react";
import { useState } from "react";
import Podium from "@/components/tv/Podium";
import type { Player } from "@/types";
import { GAME_CONSTANTS, GameStatus } from "@/lib/constants";

interface TeamResult {
  name: string;
  score: number;
  members: string[];
}

interface PodiumViewProps {
  players: Player[];
  teamResults?: TeamResult[];
  onRestart: () => void;
  onEditTopic: () => void;
  onReport: () => void;
  onAdvanceTournament?: () => void;
  tournamentStatus?: string;
}

export default function PodiumView({ players, teamResults, onRestart, onEditTopic, onReport, onAdvanceTournament, tournamentStatus }: PodiumViewProps) {
  const sortedTeams = teamResults?.sort((a, b) => b.score - a.score) || [];
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const top3 = players.sort((a, b) => b.score - a.score).slice(0, 3);
    let text = "🏆 QuizVerse - Resultados\n\n";
    top3.forEach((p, i) => {
      const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉";
      text += `${medal} ${p.name} — ${p.score} pts\n`;
    });
    if (sortedTeams.length > 0) {
      text += "\n👥 Equipas:\n";
      sortedTeams.forEach((t, i) => {
        text += `#${i + 1} ${t.name} — ${t.score} pts\n`;
      });
    }

    if (navigator.share) {
      try {
        await navigator.share({ title: "QuizVerse Resultados", text });
      } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), GAME_CONSTANTS.FEEDBACK_DISMISS_MS);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <Podium players={players} onRestart={onRestart} />
      </motion.div>

      {sortedTeams.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-[#d0bcff]" />
            <h3 className="text-lg font-bold text-[#d0bcff]">Resultados por Equipa</h3>
          </div>
          <div className="space-y-2">
            {sortedTeams.map((team, i) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${
                i === 0 ? "bg-[#FFD700]/10 border border-[#FFD700]/30" :
                i === 1 ? "bg-[#C0C0C0]/10 border border-[#C0C0C0]/30" :
                "bg-white/5 border border-white/10"
              }`}>
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-bold ${
                    i === 0 ? "text-[#FFD700]" : i === 1 ? "text-[#C0C0C0]" : "text-white/40"
                  }`}>
                    #{i + 1}
                  </span>
                  <div>
                    <div className="text-white font-bold">{team.name}</div>
                    <div className="text-white/40 text-xs">{team.members.join(", ")}</div>
                  </div>
                </div>
                <span className="text-[#FFD700] font-bold">{team.score} pts</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="flex flex-wrap justify-center gap-4">
        {onAdvanceTournament && tournamentStatus && tournamentStatus !== GameStatus.FINAL && tournamentStatus !== "FINISHED" && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAdvanceTournament}
            className="flex items-center gap-2 px-6 py-3 bg-[#FFD700]/20 hover:bg-[#FFD700]/30 text-[#FFD700] rounded-xl border border-[#FFD700]/30 transition-all font-bold"
          >
            <Trophy className="w-5 h-5" />
            Avançar Torneio
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRestart}
          className="flex items-center gap-2 px-6 py-3 bg-[#d0bcff]/10 hover:bg-[#d0bcff]/20 text-[#d0bcff] rounded-xl border border-[#d0bcff]/30 transition-all font-bold"
        >
          <RotateCcw className="w-5 h-5" />
          Jogar Outra Vez
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEditTopic}
          className="flex items-center gap-2 px-6 py-3 bg-[#FFB0CD]/10 hover:bg-[#FFB0CD]/20 text-[#FFB0CD] rounded-xl border border-[#FFB0CD]/30 transition-all font-bold"
        >
          <Palette className="w-5 h-5" />
          Escolher Outro Tema
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReport}
          className="flex items-center gap-2 px-6 py-3 bg-[#FFD700]/10 hover:bg-[#FFD700]/20 text-[#FFD700] rounded-xl border border-[#FFD700]/30 transition-all font-bold"
        >
          <Sparkles className="w-5 h-5" />
          Feedback
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShare}
          className="flex items-center gap-2 px-6 py-3 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-xl border border-green-500/30 transition-all font-bold"
        >
          {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
          {copied ? "Copiado!" : "Partilhar"}
        </motion.button>
      </div>
    </div>
  );
}
