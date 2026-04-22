"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Loader2, Flag } from "lucide-react";

interface AnswerControllerProps {
    onAnswer: (index: number) => void;
    disabled: boolean;
    questionText?: string;
    questionIndex?: number;
    totalQuestions?: number;
    onReport?: (reason: string) => void;
}

const colors = [
    "bg-red-500 active:bg-red-600 border-red-800",
    "bg-blue-500 active:bg-blue-600 border-blue-800",
    "bg-yellow-500 active:bg-yellow-600 border-yellow-800",
    "bg-green-500 active:bg-green-600 border-green-800"
];

const icons = ["A", "B", "C", "D"];

export default function AnswerController({ onAnswer, disabled, questionText, questionIndex, totalQuestions, onReport }: AnswerControllerProps) {
    const [selected, setSelected] = useState<number | null>(null);

    const handleClick = (idx: number) => {
        if (disabled || selected !== null) return;
        setSelected(idx);
        onAnswer(idx);
    };

    const handleReport = () => {
        const reason = prompt("Qual é o problema desta pergunta? ( Resposta errada, Bandeira Trocada, etc)");
        if (reason && onReport) {
            onReport(reason);
        }
    };

    return (
        <div className="flex flex-col h-full w-full max-w-md mx-auto p-4">
            {/* Header with report button */}
            <div className="flex justify-between items-center mb-4">
                <div className="text-white/60 text-sm">
                    Pergunta {questionIndex ? questionIndex + 1 : "?"} 
                    {totalQuestions ? ` / ${totalQuestions}` : ""}
                </div>
                {onReport && (
                    <button
                        onClick={handleReport}
                        className="flex items-center gap-1 px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-full text-xs transition-colors"
                    >
                        <Flag className="w-3 h-3" />
                        Reportar
                    </button>
                )}
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-2 gap-3 flex-1 content-center">
                {icons.map((icon, idx) => (
                    <motion.button
                        key={idx}
                        onClick={() => handleClick(idx)}
                        disabled={disabled || selected !== null}
                        whileTap={{ scale: 0.95 }}
                        className={`
                            ${colors[idx]} 
                            ${selected === idx ? "ring-4 ring-white scale-95" : ""}
                            ${disabled || selected !== null ? "opacity-50 cursor-not-allowed" : ""}
                            aspect-square rounded-2xl text-4xl font-bold text-white/90
                            shadow-lg border-b-4 active:border-b-0 active:translate-y-1
                            transition-all duration-100
                        `}
                    >
                        {icon}
                    </motion.button>
                ))}
            </div>

            {/* Loading indicator */}
            {disabled && (
                <div className="mt-4 flex items-center justify-center gap-2 text-white/50">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>AguardaNext...</span>
                </div>
            )}
        </div>
    );
}