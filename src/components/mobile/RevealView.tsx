"use client";

import { motion } from "framer-motion";
import { Trophy, Flag, Lightbulb } from "lucide-react";
import type { Question } from "@/types";

interface RevealViewProps {
  selectedOption: number | null;
  correctOption: number | null;
  questionData: Question;
  earnedPoints: number | null;
  onReport: () => void;
}

const optionColors = [
  "bg-[#FF6B6B] border-b-[#CC4444]",
  "bg-[#4A90D9] border-b-[#3A70B0]",
  "bg-[#FFB0CD] border-b-[#DD8AAA]",
  "bg-[#4CAF50] border-b-[#3A8A3E]",
];
const optionLetters = ["A", "B", "C", "D"];

export default function RevealView({
  selectedOption,
  correctOption,
  questionData,
  earnedPoints,
  onReport,
}: RevealViewProps) {
  const isCorrect = selectedOption === correctOption;
  const hasNoSelection = selectedOption === null;
  const correctText = questionData?.options?.[correctOption ?? -1];
  const hint = questionData?.metadata?.hint as string | undefined;

  return (
    <main
      className={`min-h-screen flex flex-col items-center justify-center p-6 text-center transition-colors duration-500 ${
        hasNoSelection ? "bg-[#121223]" : isCorrect ? "bg-[#4CAF50]" : "bg-[#FF6B6B]"
      }`}
    >
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-4">
        {hasNoSelection ? (
          <>
            <div className="text-[#e3e0f9] opacity-50">
              <div className="w-20 h-20 border-4 border-[#e3e0f9]/30 border-t-[#d0bcff] rounded-full animate-spin" />
            </div>
            <h2 className="text-4xl font-black text-[#e3e0f9] italic">DEMASIADO LENTO!</h2>
            <p className="text-[#e3e0f9]/60 text-lg font-bold uppercase tracking-widest">Não chegaste a responder...</p>
          </>
        ) : isCorrect ? (
          <>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="bg-[#FFD700]/20 p-6 rounded-full"
            >
              <Trophy className="w-16 h-16 text-[#FFD700]" />
            </motion.div>
            <h2 className="text-5xl font-black text-[#e3e0f9] italic tracking-tighter">BOA!!!</h2>
            {earnedPoints !== null && earnedPoints > 0 && (
              <motion.div initial={{ scale: 0, y: 20 }} animate={{ scale: 1, y: 0 }} className="text-3xl font-black text-[#FFD700]">
                +{earnedPoints} pts
              </motion.div>
            )}
            <p className="text-[#e3e0f9]/80 text-lg font-bold uppercase tracking-widest">Acertaste em cheio!</p>
          </>
        ) : (
          <>
            <div className={`p-6 rounded-3xl border-b-8 shadow-xl ${optionColors[selectedOption || 0]}`}>
              <span className="text-5xl font-black text-white/90">{optionLetters[selectedOption || 0]}</span>
            </div>
            <h2 className="text-5xl font-black text-[#e3e0f9] italic tracking-tighter">ERRADO...</h2>
            {earnedPoints !== null && earnedPoints === 0 && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-2xl font-bold text-[#e3e0f9]/60">
                +0 pts
              </motion.div>
            )}
            {correctText && <p className="text-[#e3e0f9]/80 text-lg font-bold">Resposta certa: {correctText}</p>}
          </>
        )}

        {/* Show hint on reveal */}
        {hint && (
          <div className="mt-4 p-3 bg-[#FFD700]/10 rounded-xl border border-[#FFD700]/20 max-w-sm">
            <div className="flex items-center gap-2 mb-1">
              <Lightbulb className="w-4 h-4 text-[#FFD700]" />
              <span className="text-[#FFD700] text-xs font-bold uppercase">Dica</span>
            </div>
            <p className="text-[#e3e0f9]/70 text-sm">{hint}</p>
          </div>
        )}

        <p className="text-[#e3e0f9]/40 text-sm mt-4 animate-pulse">Aguarda pela próxima pergunta</p>
      </motion.div>

      <button
        onClick={onReport}
        className="fixed bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-[#e3e0f9]/60 rounded-full text-sm transition-colors"
      >
        <Flag className="w-4 h-4" /> Reportar
      </button>
    </main>
  );
}
