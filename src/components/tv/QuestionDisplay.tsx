"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Clock, Brain, Database } from "lucide-react";

interface QuestionDisplayProps {
    question: any;
    timeLeft: number;
    totalTime: number;
    status: string;
    players?: any[];
    answers?: any[];
    questionSource?: "DB" | "AI" | null;
    onTimerClick?: () => void;
}

const colors = [
    "bg-red-500 border-red-700",    // Opção A
    "bg-blue-500 border-blue-700",  // Opção B
    "bg-yellow-500 border-yellow-700", // Opção C
    "bg-green-500 border-green-700"  // Opção D
];

const icons = ["A", "B", "C", "D"];

export default function QuestionDisplay({ question, timeLeft, totalTime, status, players = [], answers = [], questionSource, onTimerClick }: QuestionDisplayProps) {
    const progress = (timeLeft / totalTime) * 100;

    // Helper to get player initials
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    return (
        <div className="w-full max-w-7xl mx-auto flex flex-col h-full items-center justify-between py-8">

            {/* Timer Bar & Category */}
            <div className="w-full flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <span className="bg-white/10 px-6 py-2 rounded-full font-bold uppercase tracking-widest text-violet-300">
                        {question.category || "Geral"}
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
            {question.image_url ? (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full max-w-lg sm:max-w-2xl md:max-w-4xl h-48 sm:h-64 md:h-80 lg:h-96 bg-black/20 rounded-2xl sm:rounded-3xl overflow-hidden mb-4 sm:mb-8 shadow-2xl border-2 sm:border-4 border-white/10"
                >
                    <div className="w-full h-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${question.image_url})` }} />
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
                            className={`
                ${colors[idx]} relative overflow-hidden
                p-8 rounded-3xl border-b-8 shadow-2xl transform transition-all
                flex items-center gap-6
                ${isReveal && isCorrect ? 'ring-8 ring-green-400 ring-offset-4 ring-offset-[#0f172a]' : ''}
                ${isReveal && !isCorrect ? 'grayscale' : ''}
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
                                                // Extremely robust matching
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
