"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Flag, Lightbulb, Image as ImageIcon, Heart, Zap } from "lucide-react";
import StreakBadge from "@/components/mobile/StreakBadge";
import type { Question } from "@/types";

interface QuestionViewProps {
  questionData: Question;
  timeLeft: number;
  timerDuration: number;
  hasAnswered: boolean;
  selectedOption: number | null;
  streak: number;
  lives: number;
  eliminated: boolean;
  onAnswer: (index: number) => void;
  onReport: () => void;
  onFiftyFifty?: () => void;
  fiftyFiftyUsed?: boolean;
  eliminatedOptions?: number[];
  buzzerMode?: boolean;
}

const optionColors = [
  "bg-[#FF6B6B] active:bg-[#FF6B6B]/80 border-b-[#CC4444]",
  "bg-[#4A90D9] active:bg-[#4A90D9]/80 border-b-[#3A70B0]",
  "bg-[#FFB0CD] active:bg-[#FFB0CD]/80 border-b-[#DD8AAA]",
  "bg-[#4CAF50] active:bg-[#4CAF50]/80 border-b-[#3A8A3E]",
];
const optionLetters = ["A", "B", "C", "D"];

export default function QuestionView({
  questionData,
  timeLeft,
  timerDuration,
  hasAnswered,
  selectedOption,
  streak,
  lives = 3,
  eliminated = false,
  onAnswer,
  onReport,
  onFiftyFifty,
  fiftyFiftyUsed = false,
  eliminatedOptions = [],
  buzzerMode = false,
}: QuestionViewProps) {
  const hint = questionData?.metadata?.hint as string | undefined;
  const [showHint, setShowHint] = useState(false);
  const flagCode =
    questionData?.image_url?.match(/\/flags\/([a-z]{2})\.svg/i)?.[1] ||
    questionData?.image_url?.match(/flagcdn\.com\/.*?\/([a-z]{2})\.svg/i)?.[1];
  const isFlagQuestion =
    questionData?.category?.toLowerCase().includes("bandeira") || flagCode;

  return (
    <main className="min-h-screen flex flex-col bg-[#121223]">
      {/* Timer bar */}
      <div className="w-full h-2 bg-[#1e1e30]">
        <motion.div
          animate={{ width: `${(timeLeft / timerDuration) * 100}%` }}
          transition={{ ease: "linear", duration: 1 }}
          className={`h-full ${timeLeft <= 5 ? "bg-[#FF6B6B]" : "bg-[#FFB0CD]"}`}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-[#e3e0f9]/40 uppercase tracking-widest">
            {questionData.category?.replace(/_/g, " ")}
          </span>
          {questionData.difficulty != null && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              questionData.difficulty === 1
                ? "bg-green-500/10 text-green-400"
                : questionData.difficulty === 3
                  ? "bg-red-500/10 text-red-400"
                  : "bg-yellow-500/10 text-yellow-400"
            }`}>
              {questionData.difficulty === 1 ? "Fácil" : questionData.difficulty === 2 ? "Médio" : "Difícil"}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {buzzerMode && (
            <span className="flex items-center gap-1 px-2 py-1 bg-[#FFD700]/20 rounded-full text-[10px] font-bold text-[#FFD700] uppercase tracking-wider">
              <Zap className="w-3 h-3" />
              Buzzer
            </span>
          )}
          <Clock className={`w-4 h-4 ${timeLeft <= 5 ? "text-[#FF6B6B] animate-pulse" : "text-[#e3e0f9]/40"}`} />
          <span className={`text-lg font-black font-mono ${timeLeft <= 5 ? "text-[#FF6B6B]" : "text-[#e3e0f9]"}`}>
            {timeLeft}
          </span>
          <div className="flex items-center gap-1 ml-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart key={i} className={`w-4 h-4 ${i < lives ? "text-[#FF6B6B] fill-[#FF6B6B]" : "text-white/10"}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Image area for flags */}
      {isFlagQuestion && (
        <div className="flex justify-center px-4 mb-2">
          <div className="w-40 h-28 bg-black/30 rounded-xl overflow-hidden border-2 border-white/10 flex items-center justify-center">
            {flagCode ? (
              <img src={`/flags/${flagCode}.svg`} alt="Bandeira" className="max-h-full max-w-full object-contain" />
            ) : questionData.image_url ? (
              <img src={questionData.image_url} alt="Bandeira" className="max-h-full max-w-full object-contain" />
            ) : (
              <ImageIcon className="w-8 h-8 text-white/20" />
            )}
          </div>
        </div>
      )}

      {/* Question text */}
      <div className="px-4 py-3 text-center">
        <h2 className="text-xl font-black text-[#e3e0f9] leading-tight">{questionData.text}</h2>
      </div>

      {/* Hint button */}
      {hint && !hasAnswered && (
        <div className="flex justify-center mb-2">
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-2 px-4 py-2 bg-[#FFD700]/10 hover:bg-[#FFD700]/20 text-[#FFD700] rounded-full text-sm transition-colors border border-[#FFD700]/20"
          >
            <Lightbulb className="w-4 h-4" />
            {showHint ? "Ocultar Dica" : "Ver Dica"}
          </button>
        </div>
      )}
      {showHint && hint && !hasAnswered && (
        <div className="px-4 mb-3 p-3 bg-[#FFD700]/10 rounded-xl border border-[#FFD700]/20">
          <p className="text-[#FFD700] text-sm">{hint}</p>
        </div>
      )}

      {/* 50:50 Power-up */}
      {onFiftyFifty && !fiftyFiftyUsed && !hasAnswered && (
        <div className="flex justify-center mb-3">
          <button
            onClick={onFiftyFifty}
            className="flex items-center gap-2 px-4 py-2 bg-[#d0bcff]/10 hover:bg-[#d0bcff]/20 text-[#d0bcff] rounded-full text-sm transition-colors border border-[#d0bcff]/20"
          >
            <Zap className="w-4 h-4" />
            50:50
          </button>
        </div>
      )}

      {/* Options */}
      <div className="flex-1 px-4 pb-4 grid grid-cols-1 gap-3 content-center">
        {(questionData.options || []).slice(0, 4).map((option: string, idx: number) => {
          const isEliminated = eliminatedOptions.includes(idx);
          return (
            <motion.button
              key={idx}
              onClick={() => onAnswer(idx)}
              disabled={hasAnswered || isEliminated}
              whileTap={!hasAnswered && !isEliminated ? { scale: 0.97 } : {}}
              className={`
                ${optionColors[idx] || "bg-gray-500 border-b-gray-400"}
                ${selectedOption === idx ? "ring-4 ring-[#e3e0f9] scale-[0.97]" : ""}
                ${hasAnswered || isEliminated ? "opacity-30 cursor-not-allowed grayscale" : ""}
                relative overflow-hidden
                p-4 rounded-2xl border-b-4 shadow-lg
                flex items-center gap-4
                transition-all duration-100
              `}
            >
              <div className="bg-black/20 w-10 h-10 rounded-lg flex items-center justify-center text-xl font-black text-white/80 shrink-0">
                {optionLetters[idx]}
              </div>
              <span className="text-lg font-bold text-white/90 text-left flex-1 whitespace-normal break-words">
                {option}
              </span>
              {isEliminated && <span className="text-xs text-white/30 font-bold">ELIMINADA</span>}
            </motion.button>
          );
        })}
      </div>

      {/* Waiting indicator */}
      {hasAnswered && !eliminated && (
        <div className="px-4 pb-4 flex items-center justify-center gap-2 text-[#e3e0f9]/50">
          <div className="w-5 h-5 border-2 border-[#e3e0f9]/30 border-t-[#d0bcff] rounded-full animate-spin" />
          <span className="text-sm">Aguarda...</span>
        </div>
      )}

      {/* Eliminated overlay */}
      {eliminated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center p-8">
            <div className="text-6xl mb-4">💀</div>
            <h2 className="text-3xl font-black text-[#FF6B6B] mb-2">ELIMINADO</h2>
            <p className="text-[#e3e0f9]/60">Ficaste sem vidas!</p>
          </motion.div>
        </div>
      )}

      {/* Report button */}
      <button
        onClick={onReport}
        className="fixed bottom-4 right-4 flex items-center gap-1 px-3 py-2 bg-white/10 hover:bg-white/20 text-[#e3e0f9]/50 rounded-full text-xs transition-colors z-40"
      >
        <Flag className="w-3 h-3" />
        Reportar
      </button>

      <AnimatePresence>
        {streak >= 2 && <StreakBadge streak={streak} />}
      </AnimatePresence>
    </main>
  );
}
