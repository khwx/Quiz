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
      <button
        onClick={onReport}
        className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-xl border border-amber-500/30 transition-all text-sm"
      >
        <Flag className="w-4 h-4" /> Reportar
      </button>

      <div className="flex flex-col items-center gap-2">
        <button
          onClick={hasNextQuestion ? onNextQuestion : onNewRound}
          className="btn-quiz btn-primary flex items-center justify-center gap-2 flex-1 sm:flex-none py-3"
        >
          {hasNextQuestion ? (
            <>
              Próxima Pergunta <ArrowRight />
            </>
          ) : (
            <>
              Nova Volta <ArrowRight />
            </>
          )}
        </button>
        <div className="flex flex-col items-center gap-2">
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${(timeUntilNext / 20) * 100}%` }}
            />
          </div>
          <div className="flex items-center gap-2 text-white/50 text-sm">
            <Timer className="w-4 h-4" />
            <span className="font-mono font-bold text-white">{timeUntilNext}s</span>
          </div>
        </div>
      </div>

      <button
        onClick={onEditTopic}
        className="btn-quiz btn-secondary flex items-center justify-center gap-2 py-3"
      >
        Escolher Outro Tema
      </button>

      <div className="flex justify-center w-full mt-2">
        <span className="text-white/20 text-xs font-mono">[ESPAÇO] avançar  [R] reportar</span>
      </div>
    </motion.div>
  );
}