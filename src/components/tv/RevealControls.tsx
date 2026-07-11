"use client";

import { motion } from "framer-motion";
import { ArrowRight, Flag, Timer } from "lucide-react";

interface RevealControlsProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  timeUntilNext: number;
  round: number;
  onNextQuestion: () => void;
  onNewRound: () => void;
  onEditTopic: () => void;
  onReport: () => void;
}

export default function RevealControls({
  currentQuestionIndex,
  totalQuestions,
  timeUntilNext,
  round,
  onNextQuestion,
  onNewRound,
  onEditTopic,
  onReport,
}: RevealControlsProps) {
  const hasNextQuestion = currentQuestionIndex < totalQuestions;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="w-full max-w-4xl flex flex-col sm:flex-row gap-3 sm:justify-center sm:items-center mt-6 px-4"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onReport}
        className="flex items-center justify-center gap-2 px-4 py-3 bg-[#FFD700]/10 hover:bg-[#FFD700]/20 text-[#FFD700] rounded-xl border border-[#FFD700]/30 transition-all text-sm font-bold"
      >
        <Flag className="w-4 h-4" /> Reportar
      </motion.button>

      <div className="flex flex-col items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={hasNextQuestion ? onNextQuestion : onNewRound}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-[#d0bcff] to-[#FFB0CD] text-[#3c0091] font-bold rounded-xl shadow-[0_0_20px_rgba(208,188,255,0.3)] transition-all"
        >
          {hasNextQuestion ? (
            <>
              Próxima Pergunta <ArrowRight className="w-5 h-5" />
            </>
          ) : (
            <>
              Nova Volta <ArrowRight className="w-5 h-5" />
            </>
          )}
        </motion.button>
        <div className="flex flex-col items-center gap-2">
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#d0bcff] to-[#FFB0CD] rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${(timeUntilNext / 20) * 100}%` }}
            />
          </div>
          <div className="flex items-center gap-2 text-[#e3e0f9]/50 text-sm">
            <Timer className="w-4 h-4" />
            <span className="font-mono font-bold text-[#e3e0f9]">{timeUntilNext}s</span>
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onEditTopic}
        className="flex items-center justify-center gap-2 px-6 py-3 bg-[#FFB0CD]/10 hover:bg-[#FFB0CD]/20 text-[#FFB0CD] rounded-xl border border-[#FFB0CD]/30 transition-all font-bold"
      >
        Escolher Outro Tema
      </motion.button>

      <div className="flex justify-center w-full mt-2">
        <span className="text-[#e3e0f9]/20 text-xs font-mono">[ESPAÇO] avançar  [R] reportar</span>
      </div>
    </motion.div>
  );
}
