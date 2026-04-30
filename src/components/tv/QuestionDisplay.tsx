"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Clock, Brain, Database, Volume2, VolumeX } from "lucide-react";
import { speak, stopSpeaking, isSpeaking } from "@/lib/tts";

interface QuestionDisplayProps {
    question: any;
    timeLeft: number;
    totalTime: number;
    status: string;
    players?: any[];
    answers?: any[];
    questionSource?: "DB" | "AI" | null;
    onTimerClick?: () => void;
    localMode?: boolean;
    onLocalAnswer?: (optionIndex: number) => void;
}

const colors = [
    "bg-red-500 border-red-700",    // Opção A
    "bg-blue-500 border-blue-700",  // Opção B
    "bg-yellow-500 border-yellow-700", // Opção C
    "bg-green-500 border-green-700"  // Opção D
];

const icons = ["A", "B", "C", "D"];

export default function QuestionDisplay({ question, timeLeft, totalTime, status, players = [], answers = [], questionSource, onTimerClick, localMode = false, onLocalAnswer }: QuestionDisplayProps) {
    const progress = (timeLeft / totalTime) * 100;
    const [ttsEnabled, setTtsEnabled] = useState(true);
    const [isReading, setIsReading] = useState(false);

    // Stop TTS when question changes
    useEffect(() => {
        stopSpeaking();
        setIsReading(false);
    }, [question.text]);

    // Helper to get player initials
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    return (
        <div className="w-full max-w-7xl mx-auto flex flex-col h-full items-center justify-between py-8">

            {/* Timer Bar & Category */}
            <div className="w-full flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <span className="bg-white/5 backdrop-blur-md px-6 py-2 rounded-full font-black uppercase tracking-tighter text-violet-400 border border-white/10 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                        Arena: {question.category || "Geral"}
                    </span>
                    {questionSource && (
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${
                            questionSource === "AI" 
                                ? "bg-pink-500/20 text-pink-300 border border-pink-500/30" 
                                : "bg-green-500/20 text-green-300 border border-green-500/30"
                        }`}>
                            {questionSource === "AI" ? <Brain size={14} /> : <Database size={14} />}
                            {questionSource === "AI" ? "IA" : "BD"}
                        </div>
                    )}
                </div>
                <button
                    onClick={async () => {
                        if (isReading) {
                            stopSpeaking();
                            setIsReading(false);
                        } else {
                            setIsReading(true);
                            const text = `${question.text}. ${question.options.join('. ')}`;
                            await speak(text, 'pt-PT');
                            setIsReading(false);
                        }
                    }}
                    className={`p-3 rounded-full border transition-all ${
                        ttsEnabled 
                            ? "bg-violet-500/20 border-violet-500/50 text-violet-300 hover:bg-violet-500/30" 
                            : "bg-gray-500/20 border-gray-500/50 text-gray-400"
                    }`}
                    title={ttsEnabled ? "Ler questão em voz alta" : "TTS desativado"}
                >
                    {isReading ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <div className="flex items-center gap-6">
                        {/* Respostas Counter */}
                        <div className="bg-white/5 px-4 py-2 rounded-xl flex items-center gap-2 border border-white/10">
                            <span className="text-gray-400 font-bold uppercase text-xs tracking-widest">Respostas</span>
                            <span className="text-2xl font-black text-white">
                                {Array.from(new Set(answers.map(a => a.player_id))).length} / {players.length}
                            </span>
                        </div>

                        {/* Avatars dos jogadores que responderam */}
                        <div className="flex flex-wrap gap-2 justify-end">
                            {players.map(player => {
                                const hasAnswered = answers.some(a => String(a.player_id) === String(player.id));
                                return hasAnswered ? (
                                    <motion.div
                                        key={player.id}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        className="bg-green-500/20 text-green-300 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-inner"
                                        title={player.name}
                                    >
                                        {player.avatar || '🎮'}
                                    </motion.div>
                                ) : (
                                    <div
                                        key={player.id}
                                        className="bg-gray-700/30 text-gray-500 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-inner"
                                        title={player.name + " (Ainda não respondeu)"}
                                    >
                                        {player.avatar || '...'}
                                    </div>
                                );
                            })}
                        </div>

                    <div
                        className="flex items-center gap-4 bg-black/30 px-6 py-3 rounded-2xl cursor-pointer hover:bg-black/40 transition-colors group"
                        onClick={onTimerClick}
                        title="Clicar para saltar tempo"
                    >
                        <Clock className="text-pink-500 w-8 h-8 animate-pulse group-hover:scale-110 transition-transform" />
                        <span className={`text-4xl font-black font-mono ${timeLeft <= 5 ? 'text-red-500' : 'text-white'}`}>
                            {timeLeft}
                        </span>
                    </div>
                </div>
            </div>

            {/* Media / Image Area */}
            {(question.image_url || question.category?.toLowerCase().includes("bandeira")) ? (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full max-w-lg sm:max-w-2xl md:max-w-4xl h-48 sm:h-64 md:h-80 lg:h-96 bg-black/20 rounded-2xl sm:rounded-3xl overflow-hidden mb-4 sm:mb-8 shadow-2xl border-2 sm:border-4 border-white/10 flex items-center justify-center relative group"
                >
                    {(() => {
                        // 1. Try to extract flag code from existing URL
                        let flagCode = 
                            question.image_url?.match(/\/flags\/([a-z]{2})\.svg/i)?.[1] ||
                            question.image_url?.match(/flagcdn\.com\/.*?\/([a-z]{2})\.svg/i)?.[1];

                        // 2. If no flag code but it's a Flags category, try to guess from the correct answer
                        if (!flagCode && question.category?.toLowerCase().includes("bandeira")) {
                            const correctCountry = question.options[question.correct_option]?.toLowerCase().trim()
                                .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove accents
                            
                            const countryMap: Record<string, string> = {
                                'portugal': 'pt', 'espanha': 'es', 'franca': 'fr', 'italia': 'it', 
                                'alemanha': 'de', 'brasil': 'br', 'angola': 'ao', 'mocambique': 'mz',
                                'reino unido': 'gb', 'estados unidos': 'us', 'china': 'cn', 'japao': 'jp',
                                'india': 'in', 'russia': 'ru', 'canada': 'ca', 'australia': 'au',
                                'mexico': 'mx', 'argentina': 'ar', 'ucrania': 'ua', 'polonia': 'pl'
                            };
                            flagCode = countryMap[correctCountry];
                        }

                        const finalUrl = flagCode 
                            ? `/flags/${flagCode}.svg` 
                            : question.image_url;

                        if (!finalUrl) return (
                            <div className="flex flex-col items-center gap-4">
                                <span className="text-gray-500 italic text-xl">Bandeira não encontrada</span>
                                <span className="text-white font-black text-4xl uppercase opacity-20">{question.options[question.correct_option]}</span>
                            </div>
                        );

                        return (
                            <div className="relative w-full h-full flex items-center justify-center">
                                <img 
                                    src={finalUrl} 
                                    alt="Question Media"
                                    className="max-h-full max-w-full object-contain shadow-2xl"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        const parent = (e.target as HTMLImageElement).parentElement;
                                        if (parent) {
                                            const msg = document.createElement('div');
                                            msg.className = "text-white font-black text-4xl opacity-20 uppercase";
                                            msg.innerText = question.options[question.correct_option];
                                            parent.appendChild(msg);
                                        }
                                    }}
                                />
                            </div>
                        );
                    })()}
                </motion.div>
            ) : (
                <div className="h-12 sm:h-24"></div>
            )}

            {/* Question Text */}
            <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl md:text-6xl font-black text-center text-white mb-12 leading-tight drop-shadow-lg"
            >
                {question.text}
            </motion.h2>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {question.options.map((option: string, idx: number) => {
          const isCorrect = idx === question.correct_option;
          const isReveal = status === "REVEAL";

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              animate={{
                opacity: isReveal && !isCorrect ? 0.3 : 1,
                scale: isReveal && isCorrect ? 1.05 : 1,
                y: 0
              }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => localMode && status === "QUESTION" && onLocalAnswer?.(idx)}
              className={`
                ${colors[idx]} relative overflow-hidden
                p-8 rounded-3xl border-b-8 shadow-2xl transform transition-all
                flex items-center gap-6
                ${isReveal && isCorrect ? 'ring-8 ring-green-400 ring-offset-4 ring-offset-[#0f172a]' : ''}
                ${isReveal && !isCorrect ? 'grayscale' : ''}
                ${localMode && status === "QUESTION" ? 'cursor-pointer hover:scale-105 hover:brightness-110 active:scale-95' : ''}
              `}
            >
              <div className="bg-black/20 w-16 h-16 rounded-xl flex items-center justify-center text-4xl font-black text-white/80 shrink-0">
                {icons[idx]}
              </div>

              <div className="flex flex-col flex-grow">
                <span className="text-2xl md:text-3xl font-bold text-white shadow-black drop-shadow-md">
                  {option}
                </span>

                {/* Jogadores que escolheram esta opção */}
                {isReveal && (
                  <div className="flex flex-wrap gap-4 mt-4 justify-start">
                    {answers
                      .filter(a => Number(a.chosen_option) === idx)
                      .map(a => {
                        const targetPlayerId = String(a.player_id || "").toLowerCase().trim();
                        const player = (players || []).find(p => String(p.id).toLowerCase().trim() === targetPlayerId);

                        if (!player) return null;

                        return (
                          <motion.div
                            key={player.id}
                            initial={{ scale: 0, y: 10 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white/90 px-4 py-2 rounded-2xl flex items-center gap-3 shadow-xl border-2"
                            style={{ borderColor: player.color || '#FF6B6B' }}
                            title={player.name}
                          >
                            <span className="text-3xl filter drop-shadow-sm">{player.avatar || '🎮'}</span>
                            <span className="text-gray-900 font-black text-lg">{getInitials(player.name)}</span>
                          </motion.div>
                        );
                      })}
                  </div>
                )}
              </div>

              {isReveal && isCorrect && (
                <div className="absolute top-4 right-4 bg-white text-green-600 rounded-full p-2 shadow-lg z-10">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Hint on REVEAL */}
      {status === "REVEAL" && question.metadata?.hint && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl max-w-2xl"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-amber-300 text-sm font-bold uppercase tracking-widest">Dica</span>
          </div>
          <p className="text-amber-200/80 text-sm">{question.metadata.hint}</p>
        </motion.div>
      )}

            {/* Time Progress Bar */}
            <div className="fixed bottom-0 left-0 h-4 bg-violet-900 w-full">
                <motion.div
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "linear", duration: 1 }}
                    className="h-full bg-pink-500"
                />
            </div>
        </div>
    );
}
