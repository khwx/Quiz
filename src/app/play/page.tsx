"use client";

import { use, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { Gamepad2, Send, CheckCircle2, Loader2, Trophy } from "lucide-react";
import AnswerController from "@/components/mobile/AnswerController";
import { supabase } from "@/lib/supabase";
import { useSound } from "@/hooks/useSound";

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
    const [startTime, setStartTime] = useState<number>(Date.now());

    const { playSound } = useSound();

    // Reset answer state when question index changes
    useEffect(() => {
        setHasAnswered(false);
        setSelectedOption(null);
        setCorrectOption(null);
        setStartTime(Date.now());
    }, [currentQuestionIndex]);

    // Fetch correct answer when status is REVEAL
    useEffect(() => {
        if (status === "REVEAL" && currentQuestionId) {
            const getResult = async () => {
                if (!gameId) return;
                const { data } = await supabase
                    .from("games")
                    .select("settings")
                    .eq("id", gameId)
                    .single();
                if (data && data.settings?.current_correct_option !== undefined) {
                    setCorrectOption(data.settings.current_correct_option);
                }
            };
            getResult();
        }
    }, [status, currentQuestionId]);

    // Play sound when result is revealed
    useEffect(() => {
        if (correctOption !== null && selectedOption !== null) {
            if (selectedOption === correctOption) {
                playSound('correct');
            } else {
                playSound('wrong');
            }
        }
    }, [correctOption, selectedOption, playSound]);

    const handleJoin = async () => {
        if (!pin || !name) return;
        setIsJoining(true);
        try {
            // In real app, fetch gameId from pin first
            const { data, error: pinError } = await supabase.from('games').select('id').eq('pin', pin).single();

            if (pinError || !data) {
                alert("Pin inválido ou jogo não encontrado!");
                return;
            }

            await joinGame(data.id, name);
            setHasJoined(true);
        } catch (err: any) {
            console.error("Erro ao entrar:", err);
            alert("Erro ao entrar no jogo: " + (err.message || "Tenta novamente"));
        } finally {
            setIsJoining(false);
        }
    };

    const handleAnswer = async (index: number) => {
        if (hasAnswered) return;
        
        if (!currentQuestionId) {
            console.warn("⚠️ Cannot answer: no question ID");
            alert("Aguarde um segundo, a sincronizar com a TV...");
            return;
        }

        setHasAnswered(true);
        setSelectedOption(index);
        playSound('tick');

        const player = players.find(p => p.name === name);
        if (!player) {
            console.error("❌ Player not found:", name, players);
            alert("Erro: Jogador não encontrado. Atualiza a página do telemóvel.");
            setHasAnswered(false);
            setSelectedOption(null);
            return;
        }

        const timeTaken = Math.max(0, Math.floor((Date.now() - startTime) / 1000));
        console.log("📱 Sending answer:", { gameId, playerId: player.id, questionId: currentQuestionId, option: index, timeTaken });

        try {
            const res = await fetch("/api/answer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    gameId,
                    playerId: player.id,
                    questionId: currentQuestionId,
                    chosenOption: index,
                    timeTaken: timeTaken
                })
            });

            const data = await res.json();
            console.log("📱 API Response:", data);

            if (!res.ok) {
                throw new Error(data.error || "Falha ao enviar resposta");
            }
        } catch (err: any) {
            console.error("❌ Failed to submit answer:", err);
            alert("Erro ao enviar resposta: " + err.message);
            setHasAnswered(false);
            setSelectedOption(null);
        }
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
                        questionText={undefined}
                        questionIndex={currentQuestionIndex}
                        totalQuestions={undefined}
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
                                <div className={`p-6 rounded-3xl mb-4 border-b-8 shadow-xl ${["bg-red-500 border-red-800", "bg-blue-500 border-blue-800", "bg-yellow-500 border-yellow-800", "bg-green-500 border-green-800"][selectedOption || 0]}`}>
                                    <span className="text-6xl font-black text-white/90 drop-shadow-lg">
                                        {["A", "B", "C", "D"][selectedOption || 0]}
                                    </span>
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
                                type="tel"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                placeholder="Exemplo: 123456"
                                value={pin}
                                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
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
