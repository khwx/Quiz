"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { supabase } from "@/lib/supabase";
import { QRCodeSVG } from "qrcode.react";
import { Users, Play, Loader2, Trophy, ArrowRight } from "lucide-react";
import QuestionDisplay from "@/components/tv/QuestionDisplay";
import { getCountryCode, filterQuestions } from "@/lib/geo-service";
import { generateQuestions } from "@/lib/ai-service";
import Podium from "@/components/tv/Podium";
import { useSound } from "@/hooks/useSound";

export default function TVHost() {
    const { gameId, setGameId, status, updateStatus, players, currentQuestionIndex, nextQuestion } = useGame();
    const [pin, setPin] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [currentQuestions, setCurrentQuestions] = useState<any[]>([]);
    const [timeLeft, setTimeLeft] = useState(20);
    const [currentAnswers, setCurrentAnswers] = useState<any[]>([]);

    // Theme State
    const [topic, setTopic] = useState("Cultura Geral");
    const [customTopic, setCustomTopic] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const { playSound } = useSound();

    // Initial Game Creation
    useEffect(() => {
        const createGame = async () => {
            const newPin = Math.floor(100000 + Math.random() * 900000).toString();
            const { data } = await supabase
                .from("games")
                .insert([{ pin: newPin, status: "LOBBY" }])
                .select()
                .single();

            if (data) {
                setPin(newPin);
                setGameId(data.id);
            }
            setLoading(false);
        };

        if (!gameId) createGame();
        else setLoading(false);
    }, []);

    // Initial Answer Subscription (Already exists, adding answer subscription next)
    useEffect(() => {
        if (!gameId) return;

        const channel = supabase
            .channel(`answers-${gameId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'answers',
                filter: `game_id=eq.${gameId}`
            }, (payload) => {
                const newAnswer = payload.new;
                // Only consider answers for the current question
                const currentQ = currentQuestions[currentQuestionIndex - 1];
                if (newAnswer.question_id === currentQ?.id) {
                    setCurrentAnswers(prev => [...prev, newAnswer]);
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [gameId, currentQuestionIndex, currentQuestions]);

    // Auto-skip logic
    // Auto-skip logic
    useEffect(() => {
        // Validation: Ensure we are only counting answers for the CURRENT question
        // This prevents race conditions where old answers are still in state during transition
        const currentQ = currentQuestions[currentQuestionIndex - 1];
        if (!currentQ) return;

        const validAnswers = currentAnswers.filter(a => a.question_id === currentQ.id);

        if (status === "QUESTION" && players.length > 0 && validAnswers.length >= players.length) {
            console.log("⚡ Everyone answered! Skipping timer...");
            updateStatus("REVEAL");
        }
    }, [currentAnswers, players, status, currentQuestionIndex, currentQuestions]);

    // Fetch/Generate Questions on Start
    useEffect(() => {
        const startRound = async () => {
            if (status === "STARTING") {
                setIsGenerating(true);

                try {
                    // Normalize category name
                    const finalTopic = (customTopic || topic).toLowerCase().trim();
                    console.log(`🎯 Starting game with topic: ${finalTopic}`);

                    // 1. Check if we have enough existing questions
                    const { data: existingQuestions, count } = await supabase
                        .from("questions")
                        .select("*", { count: 'exact' })
                        .ilike("category", finalTopic);

                    let questionsToUse: any[] = [];

                    if (count && count >= 10) {
                        // REUSE: We have enough questions, randomly select 5
                        console.log(`♻️ Reusing ${count} existing questions for "${finalTopic}"`);
                        const shuffled = (existingQuestions || []).sort(() => 0.5 - Math.random()).slice(0, 5);
                        questionsToUse = shuffled;
                    } else {
                        // GENERATE: Not enough questions, call AI
                        console.log(`🤖 Generating new questions for "${finalTopic}" (only ${count || 0} exist)`);

                        const aiQuestions = await generateQuestions(finalTopic, 5);

                        // 2. Insert into Supabase (with duplicate check in API route)
                        const questionsToInsert = aiQuestions.map((q: any) => ({
                            text: q.text,
                            options: q.options,
                            correct_option: q.correct_option,
                            category: finalTopic,
                            age_rating: 18
                        }));

                        const { data: insertedData, error } = await supabase
                            .from("questions")
                            .insert(questionsToInsert)
                            .select();

                        if (error) {
                            console.error("Error saving questions:", error);
                            // Fallback to any existing questions
                            const { data: fallbackData } = await supabase.from("questions").select("*");
                            if (fallbackData) {
                                questionsToUse = fallbackData.sort(() => 0.5 - Math.random()).slice(0, 5);
                            }
                        } else if (insertedData) {
                            questionsToUse = insertedData;
                        }
                    }

                    if (questionsToUse.length > 0) {
                        setCurrentQuestions(questionsToUse);
                        nextQuestion(questionsToUse[0].id);
                    }
                } catch (err) {
                    console.error("Question loading failed:", err);
                } finally {
                    setIsGenerating(false);
                }
            }
        };
        startRound();
    }, [status]);

    // Unified Question Loop (Timer and Reset Logic)
    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (status === "QUESTION") {
            // Reset state for new question
            setTimeLeft(20);
            setCurrentAnswers([]);

            // Start countdown
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    // Critical: if prev is 0 (from previous question), do NOT trigger REVEAL.
                    // This avoids the race condition where the interval fires before the 20 is applied.
                    if (prev <= 0) return 20;

                    if (prev <= 1) {
                        clearInterval(timer);
                        updateStatus("REVEAL");
                        return 0;
                    }

                    // Play tick sound for last 5 seconds
                    if (prev <= 5) {
                        playSound('tick');
                    }

                    return prev - 1;
                });
            }, 1000);
        }

        // Limpeza do timer ao desmontar ou mudar de estado
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [status, currentQuestionIndex]);

    useEffect(() => {
        if (status === "QUESTION") {
            setTimeLeft(20);
        }
    }, [currentQuestionIndex]);

    // Play win sound when podium appears
    useEffect(() => {
        if (status === "PODIUM") {
            playSound('win');
        }
    }, [status, playSound]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="w-12 h-12 text-violet-500 animate-spin" />
            </div>
        );
    }

    const currentQ = currentQuestions[currentQuestionIndex - 1]; // Index starts at 1 in DB logic usually

    return (
        <main className="min-h-screen bg-[#0f172a] p-12 flex flex-col items-center justify-center overflow-hidden">
            {/* LOBBY VIEW */}
            {status === "LOBBY" && (
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col gap-8"
                    >
                        <div>
                            <h1 className="text-5xl font-black text-white mb-4 italic uppercase tracking-tighter">
                                Preparem os <span className="text-pink-500">telemóveis!</span>
                            </h1>
                            <p className="text-2xl text-gray-400">Entrem no jogo em <span className="text-white font-bold">quiz.io/play</span></p>
                        </div>

                        <div className="bg-white p-6 rounded-3xl w-fit shadow-2xl shadow-violet-500/20">
                            <QRCodeSVG value={`https://quizmaster.io/play?pin=${pin}`} size={256} level="H" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <span className="text-gray-500 uppercase font-black tracking-widest text-sm">PIN do Jogo</span>
                            <div className="text-8xl font-black text-white tracking-widest font-mono bg-white/5 py-4 px-8 rounded-2xl border border-white/10">
                                {pin}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card min-h-[500px] flex flex-col"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <Users className="text-pink-500 w-8 h-8" />
                                <h2 className="text-3xl font-bold text-white">Jogadores</h2>
                            </div>
                            <span className="bg-pink-500 text-white px-4 py-1 rounded-full font-bold">
                                {players.length}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-grow overflow-y-auto max-h-[400px]">
                            <AnimatePresence>
                                {players.map((player) => (
                                    <motion.div
                                        key={player.id}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        className="bg-white/10 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 font-bold text-xl text-center"
                                        style={{ borderLeft: `4px solid ${player.color || '#FF6B6B'}` }}
                                    >
                                        <span className="text-4xl">{player.avatar || '🎮'}</span>
                                        <span className="text-white">{player.name}</span>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {players.length === 0 && (
                                <div className="col-span-full flex flex-col items-center justify-center text-gray-500 gap-4 mt-12">
                                    <p className="text-xl italic">Aguardando que as equipas entrem...</p>
                                </div>
                            )}
                        </div>

                        {players.length > 0 && (
                            <div className="mt-8 flex flex-col gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Escolha o Tema</label>
                                    <div className="flex flex-wrap gap-2">
                                        {["Cultura Geral", "Cinema", "Desporto", "Ciência", "Anos 90"].map(t => (
                                            <button
                                                key={t}
                                                onClick={() => { setTopic(t); setCustomTopic(""); }}
                                                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${topic === t && !customTopic
                                                    ? "bg-pink-500 text-white scale-105 shadow-lg shadow-pink-500/30"
                                                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                                                    }`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Ou escreva um tema personalizado..."
                                        value={customTopic}
                                        onChange={(e) => setCustomTopic(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
                                    />
                                </div>

                                <button
                                    onClick={() => updateStatus("STARTING")}
                                    disabled={isGenerating}
                                    className="btn-quiz btn-primary w-full flex items-center justify-center gap-2 group relative overflow-hidden"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="animate-spin" />
                                            <span className="animate-pulse">A Criar Quiz...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Play className="group-hover:translate-x-1 transition-transform" />
                                            COMEÇAR JOGO ({customTopic || topic})
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}

            {/* QUESTION VIEW */}
            {(status === "QUESTION" || status === "REVEAL") && currentQ && (
                <QuestionDisplay
                    question={currentQ}
                    timeLeft={timeLeft}
                    totalTime={20}
                    status={status}
                    players={players}
                    answers={currentAnswers.filter(a => a.question_id === currentQ.id)}
                />
            )}

            {/* REVEAL / LEADERBOARD INFO */}
            {status === "REVEAL" && currentQ && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="absolute bottom-12 right-12 flex gap-4"
                >
                    <button
                        onClick={() => {
                            const nextQ = currentQuestions[currentQuestionIndex];
                            if (nextQ) {
                                nextQuestion(nextQ.id);
                            } else {
                                updateStatus("PODIUM");
                            }
                        }}
                        className="btn-quiz btn-primary flex items-center gap-2"
                    >
                        {currentQuestions[currentQuestionIndex] ? (
                            <>Próxima Pergunta <ArrowRight /></>
                        ) : (
                            <>Ver Vencedores <Trophy /></>
                        )}
                    </button>
                </motion.div>
            )}

            {/* PODIUM VIEW */}
            {status === "PODIUM" && (
                <Podium
                    players={players}
                    onRestart={() => {
                        setGameId(null);
                        window.location.reload();
                    }}
                />
            )}

            {/* FINAL LEADERBOARD could go here */}
        </main>
    );
}
