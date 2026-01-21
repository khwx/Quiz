"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface QuestionDisplayProps {
    question: any;
    timeLeft: number;
    totalTime: number;
    status: string;
    players?: any[];
    answers?: any[];
    onTimerClick?: () => void;
}

const colors = [
    "bg-red-500 border-red-700",    // Opção A
    "bg-blue-500 border-blue-700",  // Opção B
    "bg-yellow-500 border-yellow-700", // Opção C
    "bg-green-500 border-green-700"  // Opção D
];

const icons = ["A", "B", "C", "D"];

export default function QuestionDisplay({ question, timeLeft, totalTime, status, players = [], answers = [], onTimerClick }: QuestionDisplayProps) {
    const progress = (timeLeft / totalTime) * 100;

    // Helper to get player initials
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    return (
        <div className="w-full max-w-7xl mx-auto flex flex-col h-full items-center justify-between py-8">

            {/* Timer Bar & Category */}
            <div className="w-full flex items-center justify-between mb-8">
                <span className="bg-white/10 px-6 py-2 rounded-full font-bold uppercase tracking-widest text-violet-300">
                    {question.category || "Geral"}
                </span>
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

            {/* Media / Image Area */}
            {question.image_url ? (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full max-w-4xl h-64 md:h-96 bg-black/20 rounded-3xl overflow-hidden mb-8 shadow-2xl border-4 border-white/10"
                >
                    {/* Fallback image logic would go here */}
                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${question.image_url})` }} />
                </motion.div>
            ) : (
                <div className="h-24"></div> // Spacer if no image
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
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {answers
                                            .filter(a => a.chosen_option === idx)
                                            .map(a => {
                                                // Robust ID matching: String conversion, trimming, and case-insensitive check
                                                const playerId = String(a.player_id).trim().toLowerCase();
                                                const player = players.find(p => String(p.id).trim().toLowerCase() === playerId);

                                                if (!player) {
                                                    console.warn(`⚠️ Player not found for answer ID: ${playerId}. Available:`, players.map(p => p.id));
                                                    return null;
                                                }
                                                return (
                                                    <motion.div
                                                        key={player.id}
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="bg-white/20 px-3 py-1 rounded-full text-sm font-black text-white border border-white/20 backdrop-blur-sm flex items-center gap-2"
                                                        title={player.name}
                                                    >
                                                        <span className="text-lg">{player.avatar || '🎮'}</span>
                                                        <span>{getInitials(player.name)}</span>
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
