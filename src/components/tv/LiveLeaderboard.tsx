"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trophy, TrendingUp, Star, Zap } from "lucide-react";

interface Player {
    id: string;
    name: string;
    score: number;
    avatar?: string;
    color?: string;
    streak?: number;
    lastGain?: number;
}

interface LiveLeaderboardProps {
    players: Player[];
    compact?: boolean;
}

const RANK_STYLES = {
    0: { bg: "bg-gradient-to-r from-[#FFD700]/20 to-[#FFA500]/10", border: "border-l-[#FFD700]", text: "text-[#FFD700]", badge: "🏆" },
    1: { bg: "bg-gradient-to-r from-[#C0C0C0]/15 to-[#A8A8A8]/5", border: "border-l-[#C0C0C0]", text: "text-[#C0C0C0]", badge: "🥈" },
    2: { bg: "bg-gradient-to-r from-[#CD7F32]/15 to-[#B87333]/5", border: "border-l-[#CD7F32]", text: "text-[#CD7F32]", badge: "🥉" },
};

export default function LiveLeaderboard({ players, compact = false }: LiveLeaderboardProps) {
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

    return (
        <div className={`${compact ? "w-full" : "fixed top-8 right-8 w-80"} z-10`}>
            <div className="bg-[#1e1e30]/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-white/10 bg-gradient-to-r from-[#d0bcff]/10 to-transparent">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[#d0bcff]/20 flex items-center justify-center">
                                <Trophy className="text-[#d0bcff]" size={18} />
                            </div>
                            <h3 className="text-lg font-bold text-[#e3e0f9]">Classificação</h3>
                        </div>
                        <span className="text-xs text-[#e3e0f9]/50 bg-white/5 px-2 py-1 rounded-full">
                            {players.length} jogadores
                        </span>
                    </div>
                </div>

                <div className="p-2 max-h-[400px] overflow-y-auto scrollbar-thin">
                    <AnimatePresence mode="popLayout">
                        {sortedPlayers.map((player, index) => {
                            const rankStyle = RANK_STYLES[index as keyof typeof RANK_STYLES];
                            const isTop = index < 3;

                            return (
                                <motion.div
                                    key={player.id}
                                    layout
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className={`flex items-center gap-3 p-3 rounded-xl mb-1 transition-all duration-300 ${
                                        isTop
                                            ? `${rankStyle?.bg} border-l-4 ${rankStyle?.border}`
                                            : "bg-white/5 hover:bg-white/10 border-l-4 border-l-transparent"
                                    }`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                        isTop ? "bg-white/20" : "bg-white/10"
                                    }`}>
                                        {isTop ? (
                                            <span className="text-lg">{rankStyle?.badge}</span>
                                        ) : (
                                            <span className="text-[#e3e0f9]/60">{index + 1}</span>
                                        )}
                                    </div>

                                    <div className="text-2xl">{player.avatar || "🎮"}</div>

                                    <div className="flex-1 min-w-0">
                                        <div className={`font-bold truncate ${isTop ? rankStyle?.text : "text-[#e3e0f9]"}`}>
                                            {player.name}
                                        </div>
                                        {player.streak && player.streak > 1 && (
                                            <div className="flex items-center gap-1 text-xs text-[#FFB0CD]">
                                                <Zap className="w-3 h-3" />
                                                <span>{player.streak}x combo</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-right">
                                        <div className={`font-bold ${isTop ? rankStyle?.text : "text-[#d0bcff]"}`}>
                                            {player.score}
                                        </div>
                                        <div className="text-[10px] text-[#e3e0f9]/40">pontos</div>
                                    </div>

                                    {player.lastGain && player.lastGain > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-xs font-bold text-[#4CAF50]"
                                        >
                                            +{player.lastGain}
                                        </motion.div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {sortedPlayers.length > 0 && (
                    <div className="p-3 border-t border-white/10 bg-white/5">
                        <div className="flex items-center justify-between text-xs text-[#e3e0f9]/50">
                            <div className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                <span>Líder: {sortedPlayers[0]?.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-[#FFD700]" />
                                <span>{sortedPlayers[0]?.score} pts</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
