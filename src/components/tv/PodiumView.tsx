"use client";

import { motion } from "framer-motion";
import { Flag, RotateCcw, Palette, Sparkles } from "lucide-react";
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
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <Podium players={players} onRestart={onRestart} />
      </motion.div>

      <div className="flex flex-wrap justify-center gap-4">
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
      </div>
    </div>
  );
}
