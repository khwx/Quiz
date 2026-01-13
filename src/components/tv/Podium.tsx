"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Trophy, Crown, Medal } from "lucide-react";

interface Player {
    id: string;
    name: string;
    score: number;
}

interface PodiumProps {
    players: Player[];
    onRestart: () => void;
}

export default function Podium({ players, onRestart }: PodiumProps) {
    // Sort players by score descending
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score).slice(0, 3);
    const [winner, second, third] = sortedPlayers;

    useEffect(() => {
        // Trigger confetti explosion on mount
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full relative">
            <h1 className="text-6xl font-black text-white mb-20 uppercase tracking-widest drop-shadow-2xl">
                Vencedores
            </h1>

            <div className="flex items-end justify-center gap-4 md:gap-12 w-full max-w-4xl px-4 mb-20">
                {/* 2nd Place */}
                {second && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="flex flex-col items-center w-1/3"
                    >
                        <div className="mb-4 text-center">
                            <span className="block text-2xl font-bold text-gray-300">{second.name}</span>
                            <span className="text-xl text-gray-400">{second.score} pts</span>
                        </div>
                        <div className="w-full h-48 bg-gradient-to-t from-gray-500 to-gray-300 rounded-t-3xl shadow-2xl flex items-start justify-center pt-6 relative border-t-4 border-gray-200">
                            <Medal className="w-16 h-16 text-white drop-shadow-lg" />
                            <span className="absolute bottom-4 text-6xl font-black text-black/20">2</span>
                        </div>
                    </motion.div>
                )}

                {/* 1st Place */}
                {winner && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="flex flex-col items-center w-1/3 -mt-12 z-10"
                    >
                        <div className="mb-4 text-center">
                            <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-2 animate-bounce" />
                            <span className="block text-4xl font-black text-yellow-400">{winner.name}</span>
                            <span className="text-2xl text-yellow-200">{winner.score} pts</span>
                        </div>
                        <div className="w-full h-72 bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-t-3xl shadow-[0_0_50px_rgba(250,204,21,0.5)] flex items-start justify-center pt-8 relative border-t-4 border-yellow-200">
                            <Trophy className="w-24 h-24 text-white drop-shadow-lg" />
                            <span className="absolute bottom-4 text-8xl font-black text-black/20">1</span>
                        </div>
                    </motion.div>
                )}

                {/* 3rd Place */}
                {third && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="flex flex-col items-center w-1/3"
                    >
                        <div className="mb-4 text-center">
                            <span className="block text-2xl font-bold text-orange-200">{third.name}</span>
                            <span className="text-xl text-orange-400">{third.score} pts</span>
                        </div>
                        <div className="w-full h-32 bg-gradient-to-t from-orange-700 to-orange-500 rounded-t-3xl shadow-2xl flex items-start justify-center pt-6 relative border-t-4 border-orange-300">
                            <Medal className="w-12 h-12 text-white drop-shadow-lg" />
                            <span className="absolute bottom-4 text-5xl font-black text-black/20">3</span>
                        </div>
                    </motion.div>
                )}
            </div>

            <button
                onClick={onRestart}
                className="btn-quiz btn-primary px-12 py-4 text-xl flex items-center gap-3 shadow-xl hover:scale-105 transition-transform"
            >
                Jogar Outra Vez 🔄
            </button>
        </div>
    );
}
