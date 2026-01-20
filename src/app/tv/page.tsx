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
import LiveLeaderboard from "@/components/tv/LiveLeaderboard";
import { useSound } from "@/hooks/useSound";
import CastButton from "@/components/CastButton";

export default function TVHost() {
    const { gameId, setGameId, status, updateStatus, players, currentQuestionIndex, nextQuestion, gameSettings } = useGame();
    const [pin, setPin] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [currentQuestions, setCurrentQuestions] = useState<any[]>([]);
    const [timeLeft, setTimeLeft] = useState(20);
    const [currentAnswers, setCurrentAnswers] = useState<any[]>([]);

    // Theme State
    const [topic, setTopic] = useState("Cultura Geral");
    const [customTopic, setCustomTopic] = useState("");
    const [ageGroup, setAgeGroup] = useState("adults"); // "7-9", "10-14", "15-17", "adults"
    const [isGenerating, setIsGenerating] = useState(false);
    const [timerDuration, setTimerDuration] = useState(20);

    const { playSound } = useSound();

    // ... (keep Initial Game Creation effect)

    // ... (keep Initial Answer Subscription effect)

    // ... (keep Auto-skip logic effect)

    // Fetch/Generate Questions on Start
    useEffect(() => {
        const startRound = async () => {
            if (status === "STARTING") {
                setIsGenerating(true);

                try {
                    // Normalize category name
                    const finalTopic = (customTopic || topic).toLowerCase().trim();
                    console.log(`🎯 Starting game with topic: ${finalTopic} | Age: ${ageGroup}`);

                    // 1. Check if we have enough existing questions (Filtered by approximate age rating if possible, or just topic for now)
                    // For now, we trust the prompt generation for "freshness", but we can reuse if needed.
                    // If ageGroup is defined, we might want to prioritize generating new ones or filtering by age_rating column.

                    let questionsToUse: any[] = [];
                    let count = 0;

                    // OPTIONAL: If we want strict age filtering on REUSE, we would add .eq('age_rating', mapAgeToInteger(ageGroup))
                    // But for now, let's prioritize generating NEW ones for kids to ensure quality.

                    if (ageGroup === 'adults') {
                        const { data, count: c } = await supabase
                            .from("questions")
                            .select("*", { count: 'exact' })
                            .ilike("category", finalTopic)
                            .gte('age_rating', 18); // Only adult/general questions
                        count = c || 0;
                        if (count >= 50) {
                            questionsToUse = (data || []).sort(() => 0.5 - Math.random()).slice(0, 5);
                        }
                    }

                    if (questionsToUse.length === 0) {
                        // GENERATE: Pool is small or we want specific kid questions
                        console.log(`🤖 Generating new questions for "${finalTopic}" (Age: ${ageGroup})`);

                        const aiQuestions = await generateQuestions(finalTopic, 5, ageGroup);

                        // Map ageGroup string to integer for DB
                        const ageMap: Record<string, number> = { "7-9": 8, "10-14": 12, "15-17": 16, "adults": 18 };
                        const dbAgeRating = ageMap[ageGroup] || 18;

                        // 2. Insert into Supabase
                        const questionsToInsert = aiQuestions.map((q: any) => ({
                            text: q.text,
                            options: q.options,
                            correct_option: q.correct_option,
                            category: finalTopic,
                            age_rating: dbAgeRating
                        }));

                        const { data: insertedData, error } = await supabase
                            .from("questions")
                            .insert(questionsToInsert)
                            .select();

                        if (error) {
                            console.error("Error saving questions:", error);
                            // Fallback only if really needed (omitted for brevity/safety on kids mode)
                        } else if (insertedData) {
                            questionsToUse = insertedData;
                        }
                    }

                    if (questionsToUse.length > 0) {
                        setCurrentQuestions(questionsToUse);

                        // SYNC using existing logic
                        const questionIds = questionsToUse.map(q => q.id);
                        await supabase.from("games").update({
                            settings: { ...gameSettings, question_ids: questionIds, current_question_id: questionsToUse[0].id },
                            current_question_index: 1,
                            status: "QUESTION"
                        }).eq('id', gameId);
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

    // ... (keep Unified Question Loop and other effects)


    // ... (keep Loading check)

    const currentQ = currentQuestions[currentQuestionIndex - 1];

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
                        {/* ... (keep Title and QR Code sections) */}
                        <div>
                            <h1 className="text-5xl font-black text-white mb-4 italic uppercase tracking-tighter">
                                Preparem os <span className="text-pink-500">telemóveis!</span>
                            </h1>
                            <p className="text-2xl text-gray-400">Entrem em <span className="text-white font-bold">quiz-two-zeta-67.vercel.app</span></p>
                        </div>

                        <div className="bg-white p-6 rounded-3xl w-fit shadow-2xl shadow-violet-500/20 relative">
                            <QRCodeSVG value={`https://quiz-two-zeta-67.vercel.app/play?pin=${pin}`} size={256} level="H" />
                            <div className="absolute -top-12 right-0 bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                                <CastButton />
                            </div>
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
                        {/* ... (keep Players Header) */}
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
                            <div className="mt-8 flex flex-col gap-6">
                                {/* AGE GROUP SELECTOR */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Idade dos Jogadores</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {[
                                            { id: "7-9", label: "7-9" },
                                            { id: "10-14", label: "10-14" },
                                            { id: "15-17", label: "15-17" },
                                            { id: "adults", label: "18+" }
                                        ].map((age) => (
                                            <button
                                                key={age.id}
                                                onClick={() => setAgeGroup(age.id)}
                                                className={`py-2 rounded-xl text-sm font-bold transition-all border-2 ${ageGroup === age.id
                                                        ? "bg-violet-500 border-violet-500 text-white shadow-lg scale-105"
                                                        : "bg-transparent border-white/10 text-gray-400 hover:border-white/30"
                                                    }`}
                                            >
                                                {age.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* TOPIC SELECTOR */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Escolha o Tema</label>
                                    <div className="flex flex-wrap gap-2">
                                        {["Cultura Geral", "Cinema", "Desporto", "Ciência", "Animais"].map(t => (
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
