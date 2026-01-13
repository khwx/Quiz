"use client";

import { motion } from "framer-motion";

interface StreakBadgeProps {
    streak: number;
}

export default function StreakBadge({ streak }: StreakBadgeProps) {
    if (streak < 2) return null;

    return (
        <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            className="fixed top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 z-50"
        >
            <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 0.6 }}
                className="text-3xl"
            >
                🔥
            </motion.span>
            <div>
                <div className="text-xs font-bold uppercase tracking-wider">Streak</div>
                <div className="text-2xl font-black">{streak}x</div>
            </div>
        </motion.div>
    );
}
