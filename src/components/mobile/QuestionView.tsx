"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Clock, Flag, Lightbulb, Image as ImageIcon } from "lucide-react";
import StreakBadge from "@/components/mobile/StreakBadge";

interface QuestionViewProps {
  questionData: any;
  timeLeft: number;
  timerDuration: number;
  hasAnswered: boolean;
  selectedOption: number | null;
  streak: number;
  onAnswer: (index: number) => void;
  onReport: () => void;
}

const optionColors = [
  "bg-red-500 active:bg-red-600 border-red-700",
  "bg-blue-500 active:bg-blue-600 border-blue-700",
  "bg-yellow-500 active:bg-yellow-600 border-yellow-700",
  "bg-green-500 active:bg-green-600 border-green-700",
];
const optionLetters = ["A", "B", "C", "D"];

export default function QuestionView({
  questionData,
  timeLeft,
  timerDuration,
  hasAnswered,
  selectedOption,
  streak,
  onAnswer,
  onReport,
}: QuestionViewProps) {
  const hint = questionData?.metadata?.hint;
  const flagCode =
    questionData?.image_url?.match(/\/flags\/([a-z]{2})\.svg/i)?.[1] ||
    questionData?.image_url?.match(/flagcdn\.com\/.*?\/([a-z]{2})\.svg/i)?.[1];
  const isFlagQuestion =
    questionData?.category?.toLowerCase().includes("bandeira") || flagCode;

  return (
    <main className="min-h-screen flex flex-col bg-slate-950">
      {/* Timer bar */}
      <div className="w-full h-2 bg-slate-800">
        <motion.div
          animate={{ width: `${(timeLeft / timerDuration) * 100}%` }}
          transition={{ ease: "linear", duration: 1 }}
          className={`h-full ${timeLeft <= 5 ? "bg-red-500" : "bg-pink-500"}`}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-xs font-bold text-white/40 uppercase tracking-widest">
          {questionData.category?.replace(/_/g, " ")}
        </span>
        <div className="flex items-center gap-2">
          <Clock className={`w-4 h-4 ${timeLeft <= 5 ? "text-red-400 animate-pulse" : "text-white/40"}`} />
          <span className={`text-lg font-black font-mono ${timeLeft <= 5 ? "text-red-400" : "text-white"}`}>
            {timeLeft}
          </span>
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
        <h2 className="text-xl font-black text-white leading-tight">{questionData.text}</h2>
      </div>

      {/* Hint button */}
      {hint && !hasAnswered && (
        <div className="flex justify-center mb-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-full text-sm transition-colors border border-amber-500/20">
            <Lightbulb className="w-4 h-4" />
            Ver Dica
          </button>
        </div>
      )}

      {/* Options */}
      <div className="flex-1 px-4 pb-4 grid grid-cols-1 gap-3 content-center">
        {questionData.options?.map((option: string, idx: number) => (
          <motion.button
            key={idx}
            onClick={() => onAnswer(idx)}
            disabled={hasAnswered}
            whileTap={!hasAnswered ? { scale: 0.97 } : {}}
            className={`
              ${optionColors[idx]}
              ${selectedOption === idx ? "ring-4 ring-white scale-[0.97]" : ""}
              ${hasAnswered ? "opacity-50 cursor-not-allowed" : ""}
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
          </motion.button>
        ))}
      </div>

      {/* Waiting indicator */}
      {hasAnswered && (
        <div className="px-4 pb-4 flex items-center justify-center gap-2 text-white/50">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Aguarda...</span>
        </div>
      )}

      {/* Report button */}
      <button
        onClick={onReport}
        className="fixed bottom-4 right-4 flex items-center gap-1 px-3 py-2 bg-white/10 hover:bg-white/20 text-white/50 rounded-full text-xs transition-colors z-40"
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