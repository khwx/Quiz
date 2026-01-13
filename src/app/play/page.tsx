"use client";

import { use, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { Gamepad2, Send, CheckCircle2, Loader2, Trophy } from "lucide-react";
import AnswerController from "@/components/mobile/AnswerController";
import { supabase } from "@/lib/supabase";

export default function MobilePlay({ searchParams }: { searchParams: Promise<{ pin?: string }> }) {
    const resolvedParams = use(searchParams);
    const { gameId, joinGame, status, currentQuestionIndex, currentQuestionId, players } = useGame();
    const [pin, setPin] = useState(resolvedParams.pin || "");
    const [name, setName] = useState("");
    const [isJoining, setIsJoining] = useState(false);
    const [hasJoined, setHasJoined] = useState(false);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [correctOption, setCorrectOption] = useState<number | null>(null);

    // Reset answer state when question index changes
    useEffect(() => {
        setHasAnswered(false);
        setSelectedOption(null);
        setCorrectOption(null);
    }, [currentQuestionIndex]);

    // Fetch correct answer when status is REVEAL
    useEffect(() => {
        if (status === "REVEAL" && currentQuestionId) {
            const getResult = async () => {
                const { data } = await supabase
                    .from("questions")
                    .select("correct_option")
                    .eq("id", currentQuestionId)
                    .single();
                if (data) setCorrectOption(data.correct_option);
            };
            getResult();
        }
    }, [status, currentQuestionId]);

    const handleJoin = async () => {
        if (!pin || !name) return;
        setIsJoining(true);
        try {
            // In real app, fetch gameId from pin first
            const { data } = await supabase.from('games').select('id').eq('pin', pin).single();
            if (data) {
                await joinGame(data.id, name);
                setHasJoined(true);
            } else {
                alert("Pin inválido!");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsJoining(false);
        }
    };

    const handleAnswer = async (index: number) => {
        setHasAnswered(true);
        setSelectedOption(index);

        const player = players.find(p => p.name === name);
        if (!player) return;

        await supabase.from("answers").insert({
            game_id: gameId,
            player_id: player.id,
            question_id: currentQuestionId, // Added this field in planning
            chosen_option: index,
            time_taken: 5.5
        });
    };


    if (hasJoined) {
        if (status === "LOBBY" || status === "STARTING") {
            return (
                <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="glass-card w-full max-w-sm flex flex-col items-center gap-6"
                    >
                        <div className="bg-green-500/20 p-4 rounded-full">
                            <CheckCircle2 className="w-16 h-16 text-green-500" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold mb-2">Estás dentro!</h2>
                            <p className="text-gray-400">Olha para a TV, {name}. O jogo vai começar em breve!</p>
                        </div>
                    </motion.div>
                </main>
            );
        }

        if (status === "QUESTION") {
            return (
                <main className="min-h-screen flex flex-col h-screen">
                    <AnswerController
                        key={currentQuestionIndex}
                        onAnswer={handleAnswer}
                        disabled={hasAnswered}
                    />
                </main>
            );
        }

        if (status === "REVEAL") {
            const isCorrect = selectedOption === correctOption;
            const hasNoSelection = selectedOption === null;

            return (
                <main className={`min-h-screen flex flex-col items-center justify-center p-6 text-center transition-colors duration-500 ${hasNoSelection ? "bg-gray-900" : isCorrect ? "bg-green-600" : "bg-red-600"
                    }`}>
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center gap-6"
                    >
                        {hasNoSelection ? (
                            <>
                                <div className="text-white opacity-50"><Loader2 className="w-24 h-24 animate-spin" /></div>
                                <h2 className="text-4xl font-black text-white italic">DEMASIADO LENTO!</h2>
                                <p className="text-white/60 text-xl font-bold">Não chegaste a responder a tempo...</p>
                            </>
                        ) : isCorrect ? (
                            <>
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="bg-white/20 p-6 rounded-full"
                                >
                                    <Trophy className="w-24 h-24 text-yellow-300" />
                                </motion.div>
                                <h2 className="text-5xl font-black text-white italic tracking-tighter shadow-2xl">BOA!!!</h2>
                                <p className="text-white/80 text-xl font-bold uppercase tracking-widest">Acertaste em cheio!</p>
                            </>
                        ) : (
                            <>
                                <div className="bg-black/20 p-6 rounded-full">
                                    <Send className="w-24 h-24 text-white rotate-180" />
                                </div>
                                <h2 className="text-5xl font-black text-white italic tracking-tighter">ERRADO...</h2>
                                <p className="text-white/80 text-xl font-bold uppercase tracking-widest">Tenta na próxima!</p>
                            </>
                        )}
                        <p className="mt-8 text-white/40 font-mono text-sm animate-pulse">Aguarda pela próxima pergunta na TV</p>
                    </motion.div>
                </main>
            );
        }

        return (
            <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <Trophy className="w-24 h-24 text-yellow-500 mb-6 animate-bounce" />
                <h2 className="text-3xl font-bold text-white">Fim do Tempo!</h2>
                <p className="text-gray-400">Vê a resposta na TV...</p>
            </main>
        )
    }

    return (
        <main className="min-h-screen flex flex-col p-6 items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm"
            >
                <div className="flex items-center gap-4 mb-8 justify-center">
                    <div className="p-3 bg-pink-500 rounded-2xl shadow-lg shadow-pink-500/20">
                        <Gamepad2 className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-black italic">JOGAR</h1>
                </div>

                <div className="space-y-4">
                    <div className="glass-card flex flex-col gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">
                                PIN do Jogo
                            </label>
                            <input
                                type="text"
                                placeholder="Exemplo: 123456"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-2xl font-mono text-center tracking-[0.2em] focus:outline-none focus:border-pink-500 transition-colors"
                                maxLength={6}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">
                                O Teu Nome / Equipa
                            </label>
                            <input
                                type="text"
                                placeholder="Como te queres chamar?"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xl focus:outline-none focus:border-pink-500 transition-colors"
                            />
                        </div>

                        <button
                            onClick={handleJoin}
                            disabled={isJoining || !pin || !name}
                            className="btn-quiz btn-secondary w-full flex items-center justify-center gap-2"
                        >
                            {isJoining ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    ENTRAR AGORA
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
