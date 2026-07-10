"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Trophy, Crown, Medal, RotateCcw } from "lucide-react";

interface Player {
    id: string;
    name: string;
    score: number;
    avatar?: string;
    color?: string;
}

interface PodiumProps {
    players: Player[];
    onRestart: () => void;
}

const PODIUM_CONFIGS = {
    gold: {
        gradient: "from-[#FFD700] via-[#FFA500] to-[#FF8C00]",
        shadow: "shadow-[0_0_60px_rgba(255,215,0,0.4)]",
        border: "border-[#FFD700]",
        text: "text-[#FFD700]",
        icon: <Crown className="w-14 h-14 text-[#FFD700] drop-shadow-lg" />,
    },
    silver: {
        gradient: "from-[#C0C0C0] via-[#A8A8A8] to-[#909090]",
        shadow: "shadow-[0_0_40px_rgba(192,192,192,0.3)]",
        border: "border-[#C0C0C0]",
        text: "text-[#C0C0C0]",
        icon: <Medal className="w-12 h-12 text-[#C0C0C0] drop-shadow-lg" />,
    },
    bronze: {
        gradient: "from-[#CD7F32] via-[#B87333] to-[#A0522D]",
        shadow: "shadow-[0_0_30px_rgba(205,127,50,0.3)]",
        border: "border-[#CD7F32]",
        text: "text-[#CD7F32]",
        icon: <Medal className="w-10 h-10 text-[#CD7F32] drop-shadow-lg" />,
    },
};

const PODIUM_HEIGHTS = {
    gold: "h-80",
    silver: "h-56",
    bronze: "h-40",
};

export default function Podium({ players, onRestart }: PodiumProps) {
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score).slice(0, 3);
    const [winner, second, third] = sortedPlayers;

    useEffect(() => {
        const duration = 6 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    const renderPodiumSlot = (player: Player | undefined, config: typeof PODIUM_CONFIGS.gold, height: string, delay: number, position: number) => {
        if (!player) return null;

        return (
            <motion.div
                key={player.id}
                initial={{ height: 0, opacity: 0, scale: 0.8 }}
                animate={{ height: "auto", opacity: 1, scale: 1 }}
                transition={{ delay, duration: 0.8, type: "spring", bounce: 0.4 }}
                className="flex flex-col items-center flex-1 max-w-[200px]"
            >
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: delay + 0.3, duration: 0.5 }}
                    className="mb-4 text-center"
                >
                    <div className="text-4xl mb-2">{player.avatar || "🎮"}</div>
                    <span className={`block text-lg font-bold ${config.text}`}>{player.name}</span>
                    <span className="text-sm text-[#e3e0f9]/70">{player.score} pontos</span>
                </motion.div>

                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    transition={{ delay: delay + 0.1, duration: 1, type: "spring" }}
                    className={`w-full ${height} bg-gradient-to-t ${config.gradient} rounded-t-3xl ${config.shadow} flex items-start justify-center pt-6 relative border-t-4 ${config.border} overflow-hidden`}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                    <div className="relative z-10">{config.icon}</div>
                    <span className="absolute bottom-4 text-7xl font-black text-white/10">{position}</span>
                </motion.div>
            </motion.div>
        );
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full relative px-4">
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="mb-12 text-center"
            >
                <h1 className="text-5xl md:text-7xl font-bold text-[#e3e0f9] mb-3 tracking-tight">
                    Fim do Jogo!
                </h1>
                <p className="text-xl text-[#e3e0f9]/60">Parabéns aos vencedores</p>
            </motion.div>

            <div className="flex items-end justify-center gap-4 md:gap-8 w-full max-w-3xl px-4 mb-16">
                {renderPodiumSlot(second, PODIUM_CONFIGS.silver, PODIUM_HEIGHTS.silver, 0.5, 2)}
                {renderPodiumSlot(winner, PODIUM_CONFIGS.gold, PODIUM_HEIGHTS.gold, 0.2, 1)}
                {renderPodiumSlot(third, PODIUM_CONFIGS.bronze, PODIUM_HEIGHTS.bronze, 0.8, 3)}
            </div>

            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onRestart}
                className="flex items-center gap-3 px-8 py-4 bg-[#d0bcff] text-[#3c0091] rounded-2xl font-bold text-lg shadow-lg hover:shadow-[0_0_30px_rgba(208,188,255,0.3)] transition-all duration-300"
            >
                <RotateCcw className="w-5 h-5" />
                Jogar Outra Vez
            </motion.button>
        </div>
    );
}
