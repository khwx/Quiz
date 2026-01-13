"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

interface Player {
    id: string;
    name: string;
    score: number;
    avatar?: string;
    color?: string;
}

interface LiveLeaderboardProps {
    players: Player[];
}

export default function LiveLeaderboard({ players }: LiveLeaderboardProps) {
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

    return (
        <div className="fixed top-8 right-8 w-72 glass-card z-10">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                <Trophy className="text-yellow-400" size={20} />
                <h3 className="text-lg font-bold text-white">Classificação</h3>
            </div>

            <div className="space-y-2">
                {sortedPlayers.map((player, index) => (
                    <motion.div
                        key={player.id}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        style={{ borderLeft: `3px solid ${player.color || '#FF6B6B'}` }}
                    >
                        <span className="text-2xl font-black text-gray-500 w-6">
                            {index + 1}
                        </span>
                        <span className="text-2xl">{player.avatar || '🎮'}</span>
                        <div className="flex-1 min-w-0">
                            <div className="text-white font-bold truncate">{player.name}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-yellow-400 font-black text-lg">{player.score}</div>
                            <div className="text-gray-500 text-xs">pts</div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
