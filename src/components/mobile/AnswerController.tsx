"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface AnswerControllerProps {
    onAnswer: (index: number) => void;
    disabled: boolean;
}

const colors = [
    "bg-red-500 active:bg-red-600 border-red-800",
    "bg-blue-500 active:bg-blue-600 border-blue-800",
    "bg-yellow-500 active:bg-yellow-600 border-yellow-800",
    "bg-green-500 active:bg-green-600 border-green-800"
];

const icons = ["A", "B", "C", "D"];

export default function AnswerController({ onAnswer, disabled }: AnswerControllerProps) {
    const [selected, setSelected] = useState<number | null>(null);

    const handleClick = (idx: number) => {
        if (disabled || selected !== null) return;
        setSelected(idx);
        onAnswer(idx);
    };

    if (selected !== null) {
        return (
            <div className="flex flex-col items-center justify-center p-8 h-full">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`p-12 rounded-3xl mb-8 border-b-8 shadow-2xl ${colors[selected]}`}
                >
                    <span className="text-6xl font-black text-white/90 drop-shadow-lg">
                        {icons[selected]}
                    </span>
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-2">Resposta Enviada!</h2>
                <p className="text-gray-400">Aguarda pelos outros...</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-4 bg-[#0f172a] p-4 h-full">
            {colors.map((color, idx) => (
                <button
                    key={idx}
                    onClick={() => handleClick(idx)}
                    disabled={disabled}
                    className={`
            ${color} border-b-8 rounded-3xl
            flex flex-col items-center justify-center gap-2
            active:border-b-0 active:translate-y-2 transition-all
            h-full
          `}
                >
                    <span className="text-6xl font-black text-white/90 drop-shadow-lg">
                        {icons[idx]}
                    </span>
                </button>
            ))}
        </div>
    );
}
