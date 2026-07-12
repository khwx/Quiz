"use client";

import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Users, Play, Loader2, ArrowRight, Zap, GraduationCap } from "lucide-react";
import { CATEGORIES } from "@/hooks/useGameSetup";
import type { Player } from "@/types";

interface LobbyViewProps {
  pin: string;
  players: Player[];
  topic: string[];
  customTopic: string;
  ageGroup: string;
  timerDuration: number;
  questionCount: number;
  localMode: boolean;
  availableCount: number | null;
  isGenerating: boolean;
  status: string;
  usedCount: number;
  onTopicToggle: (topicName: string) => void;
  onTopicChange: (topics: string[]) => void;
  onCustomTopicChange: (value: string) => void;
  onAgeGroupChange: (age: string) => void;
  onTimerDurationChange: (seconds: number) => void;
  onQuestionCountChange: (count: number) => void;
  onLocalModeToggle: () => void;
  onStart: () => void;
  onClearMemory: () => void;
}

export default function LobbyView({
  pin,
  players,
  topic,
  customTopic,
  ageGroup,
  timerDuration,
  questionCount,
  localMode,
  availableCount,
  isGenerating,
  status,
  usedCount,
  onTopicToggle,
  onTopicChange,
  onCustomTopicChange,
  onAgeGroupChange,
  onTimerDurationChange,
  onQuestionCountChange,
  onLocalModeToggle,
  onStart,
  onClearMemory,
}: LobbyViewProps) {
  return (
    <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start relative">
      {usedCount > 0 && (
        <div className="absolute -top-10 right-0">
            <button
              onClick={onClearMemory}
              className="px-4 py-2 bg-white/5 hover:bg-[#FF6B6B]/20 text-white/60 hover:text-[#FF6B6B] rounded-lg text-sm transition-all flex items-center gap-2 border border-white/10"
            >
            Limpar Memória ({usedCount})
          </button>
        </div>
      )}

      {!localMode && players.length === 0 && (
        <div className="p-4 sm:p-8 flex flex-col items-center justify-center text-center gap-4 flex-grow">
          <p className="text-white/40 text-sm">Ativa o Modo Local ou espera que os jogadores entrem</p>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col gap-4 lg:gap-8"
      >
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 lg:p-4 bg-gradient-to-r from-[#d0bcff] to-[#FFB0CD] rounded-2xl">
            <Users className="w-8 h-8 lg:w-10 lg:h-10 text-[#3c0091]" />
          </div>
          <span className="text-sm font-bold text-[#d0bcff] uppercase tracking-widest">QuizVerse TV</span>
        </div>

        <div>
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white mb-4 tracking-tight" style={{ fontFamily: "Space Grotesk" }}>
            Preparem os <span className="text-gradient">telemóveis!</span>
          </h1>
          <p className="text-base lg:text-xl text-white/60">
            Entrem em{" "}
            <span className="text-white font-bold">
              {typeof window !== "undefined" ? window.location.host : "quizverse.app"}
            </span>
          </p>
        </div>

        <div className="glass-panel p-4 lg:p-6 w-fit relative">
          <QRCodeSVG
            value={`${typeof window !== "undefined" ? window.location.origin : "https://quizverse.app"}/play?pin=${pin}`}
            size={180}
            level="H"
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-white/40 uppercase font-bold tracking-widest text-sm">Código do Jogo</span>
          <div className="text-5xl sm:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#d0bcff] to-[#FFB0CD] tracking-widest font-mono">
            {pin}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-card min-h-[300px] lg:min-h-[500px] flex flex-col"
      >
        <div className="p-4 sm:p-8 border-b border-white/10">
          <div className="flex items-center justify-between mb-4 lg:mb-8">
            <div className="flex items-center gap-3">
              <Users className="text-[#FFB0CD] w-6 h-6 lg:w-8 lg:h-8" />
              <h2 className="text-xl lg:text-3xl font-bold text-[#e3e0f9]">Jogadores</h2>
            </div>
            <span className="bg-[#FFB0CD] text-[#3c0091] px-4 py-1 rounded-full font-bold">{players.length}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 flex-grow overflow-y-auto max-h-[200px] lg:max-h-[400px]">
            <AnimatePresence>
              {players.map((player) => (
                <motion.div
                  key={player.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="bg-white/10 p-3 sm:p-4 rounded-2xl flex flex-col items-center justify-center gap-2 font-bold text-lg sm:text-xl text-center"
                  style={{ borderLeft: `4px solid ${player.color || "#FF6B6B"}` }}
                >
                  <span className="text-3xl sm:text-4xl">{player.avatar || "🎮"}</span>
                  <span className="text-white text-sm sm:text-base">{player.name}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            {players.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center text-gray-500 gap-4 mt-4 sm:mt-12">
                <p className="text-base sm:text-xl italic">Aguardando que as equipas entrem...</p>
              </div>
            )}
          </div>
        </div>

        {(localMode || players.length > 0) && (
          <div className="p-4 sm:p-8 flex flex-col gap-4 sm:gap-6 bg-black/20 flex-grow">
            {/* AGE GROUP SELECTOR */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#d0bcff]" /> Nível da Arena
              </label>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { id: "7-9", label: "Infantil" },
                  { id: "10-14", label: "Júnior" },
                  { id: "15-17", label: "Adolescente" },
                  { id: "adults", label: "Master" },
                ].map((age) => (
                  <button
                    key={age.id}
                    onClick={() => onAgeGroupChange(age.id)}
                    className={`py-3 rounded-2xl text-xs font-bold transition-all border-2 flex flex-col items-center gap-1 ${
                      ageGroup === age.id
                        ? "bg-[#d0bcff] border-[#d0bcff] text-[#121223] shadow-[0_0_15px_rgba(208,188,255,0.5)] scale-105"
                        : "bg-white/5 border-white/5 text-gray-400 hover:border-white/10"
                    }`}
                  >
                    <span className="opacity-60 uppercase text-[10px]">
                      {age.id === "adults" ? "18+" : age.id}
                    </span>
                    {age.label}
                  </button>
                ))}
              </div>
            </div>

            {/* TOPIC SELECTOR */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-4 h-4 text-pink-500" /> Escolha a(s) Arena(s)
              </label>
              <div className="flex flex-wrap gap-3">
                {CATEGORIES.map((t) => (
                  <button
                    key={t.name}
                    onClick={() => {
                      if (topic.includes(t.name)) {
                        onTopicChange(topic.filter((x) => x !== t.name));
                      } else {
                        onTopicChange([...topic, t.name]);
                      }
                      onCustomTopicChange("");
                    }}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 border-2 ${
                      topic.includes(t.name) && !customTopic
                        ? "bg-pink-500 border-pink-400 text-white scale-105 shadow-[0_0_15px_rgba(236,72,153,0.5)]"
                        : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:border-white/10"
                    }`}
                  >
                    <span className="w-4 h-4">{t.name.charAt(0)}</span>
                    {t.name}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Ou escreva um tema personalizado..."
                value={customTopic}
                onChange={(e) => onCustomTopicChange(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
              />
              {availableCount !== null && topic.length > 0 && (
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold ${
                    availableCount >= questionCount
                      ? "bg-green-500/10 text-green-400"
                      : availableCount > 0
                        ? "bg-amber-500/10 text-amber-400"
                        : "bg-red-500/10 text-red-400"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      availableCount >= questionCount
                        ? "bg-green-400"
                        : availableCount > 0
                          ? "bg-amber-400"
                          : "bg-red-400"
                    }`}
                  />
                  {availableCount} perguntas disponíveis (pediste {questionCount})
                </div>
              )}
            </div>

            {/* TIMER DURATION SELECTOR */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                Tempo por Pergunta
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[10, 15, 20, 30].map((seconds) => (
                  <button
                    key={seconds}
                    onClick={() => onTimerDurationChange(seconds)}
                    className={`py-2 rounded-xl text-sm font-bold transition-all border-2 ${
                      timerDuration === seconds
                        ? "bg-pink-500 border-pink-500 text-white shadow-lg"
                        : "bg-transparent border-white/10 text-gray-400 hover:border-white/30"
                    }`}
                  >
                    {seconds}s
                  </button>
                ))}
              </div>
            </div>

            {/* QUESTION COUNT SELECTOR */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                Número de Perguntas
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[3, 5, 7, 10].map((count) => (
                  <button
                    key={count}
                    onClick={() => onQuestionCountChange(count)}
                    className={`py-2 rounded-xl text-sm font-bold transition-all border-2 ${
                      questionCount === count
                        ? "bg-[#d0bcff] border-[#d0bcff] text-[#121223] shadow-lg"
                        : "bg-transparent border-white/10 text-gray-400 hover:border-white/30"
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            {/* LOCAL MODE TOGGLE */}
            <div className="flex items-center justify-between bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-xl">👆</span>
                </div>
                <div>
                  <div className="font-bold text-white">Modo Local</div>
                  <div className="text-xs text-gray-400">Responde no ecran</div>
                </div>
              </div>
              <button
                onClick={onLocalModeToggle}
                className={`w-14 h-8 rounded-full transition-all ${localMode ? "bg-green-500" : "bg-gray-600"}`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full shadow transform transition-transform ${
                    localMode ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <button
              onClick={onStart}
              disabled={(players.length === 0 && !localMode) || isGenerating || status === "STARTING"}
              className="btn-quiz btn-primary w-full py-6 flex justify-center items-center gap-3 relative overflow-hidden group mt-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-pink-600 opacity-0 group-hover:opacity-20 transition-opacity" />
              <span className="relative z-10 flex items-center gap-3 text-2xl tracking-tighter uppercase font-black">
                {isGenerating || status === "STARTING" ? (
                  <>
                    <Loader2 className="animate-spin" />A Invocar Arena...
                  </>
                ) : (
                  <>
                    {localMode ? "Iniciar Quiz" : "Entrar na Arena"}{" "}
                    <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}