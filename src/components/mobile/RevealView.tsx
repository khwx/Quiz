"use client";

import { motion } from "framer-motion";
import { Trophy, Loader2, Flag, Lightbulb } from "lucide-react";

interface RevealViewProps {
  selectedOption: number | null;
  correctOption: number | null;
  questionData: any;
  earnedPoints: number | null;
  onReport: () => void;
}

const optionColors = [
  "bg-red-500 active:bg-red-600 border-red-700",
  "bg-blue-500 active:bg-blue-600 border-blue-700",
  "bg-yellow-500 active:bg-yellow-600 border-yellow-700",
  "bg-green-500 active:bg-green-600 border-green-700",
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
  const hint = questionData?.metadata?.hint;

  return (
    <main
      className={`min-h-screen flex flex-col items-center justify-center p-6 text-center transition-colors duration-500 ${
        hasNoSelection ? "bg-gray-900" : isCorrect ? "bg-green-600" : "bg-red-600"
      }`}
    >
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-4">
        {hasNoSelection ? (
          <>
            <div className="text-white opacity-50">
              <Loader2 className="w-20 h-20 animate-spin" />
            </div>
            <h2 className="text-4xl font-black text-white italic">DEMASIADO LENTO!</h2>
            <p className="text-white/60 text-lg font-bold uppercase tracking-widest">Não chegaste a responder...</p>
          </>
        ) : isCorrect ? (
          <>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="bg-white/20 p-6 rounded-full"
            >
              <Trophy className="w-16 h-16 text-yellow-300" />
            </motion.div>
            <h2 className="text-5xl font-black text-white italic tracking-tighter">BOA!!!</h2>
            {earnedPoints !== null && earnedPoints > 0 && (
              <motion.div initial={{ scale: 0, y: 20 }} animate={{ scale: 1, y: 0 }} className="text-3xl font-black text-yellow-300">
                +{earnedPoints} pts
              </motion.div>
            )}
            <p className="text-white/80 text-lg font-bold uppercase tracking-widest">Acertaste em cheio!</p>
          </>
        ) : (
          <>
            <div className={`p-6 rounded-3xl border-b-8 shadow-xl ${optionColors[selectedOption || 0]}`}>
              <span className="text-5xl font-black text-white/90">{optionLetters[selectedOption || 0]}</span>
            </div>
            <h2 className="text-5xl font-black text-white italic tracking-tighter">ERRADO...</h2>
            {earnedPoints !== null && earnedPoints === 0 && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-2xl font-bold text-white/60">
                +0 pts
              </motion.div>
            )}
            {correctText && <p className="text-white/80 text-lg font-bold">Resposta certa: {correctText}</p>}
          </>
        )}

        {/* Show hint on reveal */}
        {hint && (
          <div className="mt-4 p-3 bg-white/10 rounded-xl border border-white/20 max-w-sm">
            <div className="flex items-center gap-2 mb-1">
              <Lightbulb className="w-4 h-4 text-amber-300" />
              <span className="text-amber-300 text-xs font-bold uppercase">Dica</span>
            </div>
            <p className="text-white/70 text-sm">{hint}</p>
          </div>
        )}

        <p className="text-white/40 text-sm mt-4 animate-pulse">Aguarda pela próxima pergunta</p>
      </motion.div>

      <button
        onClick={onReport}
        className="fixed bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white/60 rounded-full text-sm transition-colors"
      >
        <Flag className="w-4 h-4" /> Reportar
      </button>
    </main>
  );
}