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

    // Initial Game Creation or Connection
    useEffect(() => {
        const connectToGame = async () => {
            // Check URL params for gameId (for Chromecast/Host opened view)
            const urlParams = new URLSearchParams(window.location.search);
            const queryGameId = urlParams.get('gameId');

            if (queryGameId) {
                console.log("🔗 Connecting to existing game:", queryGameId);
                setGameId(queryGameId);
                // Fetch game details to get PIN
                const { data } = await supabase.from("games").select("pin").eq("id", queryGameId).single();
                if (data) setPin(data.pin);
                setLoading(false);
                return;
            }

            // Only create new game if NO gameId is provided (Standalone mode)
            if (!gameId) {
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
            }
            setLoading(false);
        };

        connectToGame();
    }, []);

    // Answer Subscription & Polling Fallback (Hybrid Strategy)
    useEffect(() => {
        if (!gameId) return;

        console.log(`🔧 Setting up Answer Subscription for gameId: ${gameId}`);

        // 1. Setup Realtime Subscription
        const channel = supabase
            .channel(`answers-${gameId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'answers',
                // Nuclear Option: No server-side filter to avoid UUID casing issues
                // filter: `game_id=eq.${gameId}` 
            }, (payload) => {
                const newAnswer = payload.new;

                console.log(`🔔 RAW Event Received:`, {
                    answerGameId: newAnswer.game_id,
                    expectedGameId: gameId,
                    match: String(newAnswer.game_id).toLowerCase() === String(gameId).toLowerCase(),
                    newAnswer
                });

                // Nuclear Client-Side Filter: Check ID manually and robustly
                if (String(newAnswer.game_id).toLowerCase() !== String(gameId).toLowerCase()) {
                    console.log(`❌ Filtered out (wrong game)`);
                    return; // Ignore answers from other games
                }

                console.log("📥 Received Answer (Realtime):", newAnswer);

                // Accumulate ALL answers for this game.
                setCurrentAnswers(prev => {
                    // Avoid duplicates in state
                    if (prev.some(a => a.id === newAnswer.id)) return prev;
                    return [...prev, newAnswer];
                });
            })
            .subscribe((status) => {
                console.log(`📡 Realtime Status: ${status}`);
            });

        // 2. Setup Polling Fallback (Backup for when Realtime fails)
        const pollInterval = setInterval(async () => {
            if (status === "QUESTION") {
                const { data: polledAnswers } = await supabase
                    .from('answers')
                    .select('*')
                    .eq('game_id', gameId);

                if (polledAnswers && polledAnswers.length > 0) {
                    setCurrentAnswers(prev => {
                        const newAnswers = polledAnswers.filter(pa => !prev.some(existing => existing.id === pa.id));
                        if (newAnswers.length > 0) {
                            console.log(`🔄 Polled ${newAnswers.length} new answers`);
                            return [...prev, ...newAnswers];
                        }
                        return prev;
                    });
                }
            }
        }, 2000); // Check every 2 seconds

        return () => {
            console.log("🔌 Unsubscribing & Stopping Poller...");
            supabase.removeChannel(channel);
            clearInterval(pollInterval);
        };
    }, [gameId]); // Only recreate if gameId changes (shouldn't happen). Status changes should NOT destroy subscription!

    // Auto-skip logic
    useEffect(() => {
        const currentQ = currentQuestions[currentQuestionIndex - 1];
        if (!currentQ || status !== "QUESTION") return;

        // 1. Get unique player IDs who have answered THIS question
        const validAnswersForQ = currentAnswers.filter(a => String(a.question_id) === String(currentQ.id));
        const uniqueAnswerPlayerIds = new Set(validAnswersForQ.map(a => String(a.player_id)));

        // 2. Compare with UNIQUE valid players currently in the lobby
        // Deduplicate players by ID just in case of multiple join events
        const uniquePlayers = Array.from(new Set(players.map(p => String(p.id))));

        if (uniquePlayers.length > 0 && uniqueAnswerPlayerIds.size >= uniquePlayers.length) {
            console.log(`⚡ Everyone answered (${uniqueAnswerPlayerIds.size}/${uniquePlayers.length})! Skipping timer...`);
            const timer = setTimeout(() => {
                setTimeLeft(0);
                updateStatus("REVEAL");
            }, 800); // Slightly longer delay for visual feedback
            return () => clearTimeout(timer);
        }
    }, [currentAnswers, players.length, status, currentQuestionIndex, currentQuestions]);

    // Fetch/Generate Questions on Start
    useEffect(() => {
        const startRound = async () => {
            if (status === "STARTING") {
                setIsGenerating(true);

                try {
                    // Normalize category name
                    const finalTopic = (customTopic || topic).toLowerCase().trim();
                    const ageMap: Record<string, number> = { "7-9": 8, "10-14": 12, "15-17": 16, "adults": 18 };
                    const targetAge = ageMap[ageGroup] || 18;

                    console.log(`🎯 Starting game with topic: ${finalTopic} | Age: ${ageGroup} (DB: ${targetAge})`);

                    let questionsToUse: any[] = [];
                    let count = 0;

                    // 1. Try to fetch EXISTING questions first (for ALL age groups)
                    // We look for questions with the exact age rating (or 18+ for adults)
                    let query = supabase
                        .from("questions")
                        .select("*", { count: 'exact' })
                        .ilike("category", finalTopic);

                    if (targetAge === 18) {
                        query = query.gte('age_rating', 18);
                    } else {
                        // For kids, we want specific content. 
                        // We could use .eq or allow a small range. For now, strict .eq matches our seed data.
                        query = query.eq('age_rating', targetAge);
                    }

                    const { data, count: c } = await query;
                    count = c || 0;

                    if (count >= 150) {
                        // We have enough questions! Shuffle and use them.
                        questionsToUse = (data || []).sort(() => 0.5 - Math.random()).slice(0, 5);
                        console.log(`✅ Found ${count} existing questions. Using 5.`);
                    }

                    // 2. If not enough, GENERATE new ones
                    if (questionsToUse.length === 0) {
                        console.log(`🤖 Generating new questions for "${finalTopic}" (Age: ${ageGroup})`);

                        const aiQuestions = await generateQuestions(finalTopic, 5, ageGroup);
                        const dbAgeRating = targetAge;

                        // Insert into Supabase
                        const questionsToInsert = aiQuestions.map((q: any) => ({
                            text: q.text.trim().charAt(0).toUpperCase() + q.text.trim().slice(1),
                            options: q.options,
                            correct_option: q.correct_option,
                            category: finalTopic.charAt(0).toUpperCase() + finalTopic.slice(1).toLowerCase(),
                            age_rating: dbAgeRating
                        }));

                        // Insert into Supabase using upsert to ignore duplicates
                        // This allows the game to proceed even if some AI questions already exist
                        const { data: insertedData, error } = await supabase
                            .from("questions")
                            .upsert(questionsToInsert, {
                                onConflict: 'text,category',
                                ignoreDuplicates: true
                            })
                            .select();

                        // Fetch the full set of questions for this category/age to ensure we have enough
                        // regardless of whether they were just inserted or already existed
                        let finalQuery = supabase
                            .from("questions")
                            .select("*")
                            .ilike("category", finalTopic);

                        if (targetAge === 18) {
                            finalQuery = finalQuery.gte('age_rating', 18);
                        } else {
                            finalQuery = finalQuery.eq('age_rating', targetAge);
                        }

                        const { data: allAvailableQuestions } = await finalQuery;

                        if (allAvailableQuestions && allAvailableQuestions.length >= 5) {
                            // Shuffle and take 5
                            questionsToUse = allAvailableQuestions.sort(() => 0.5 - Math.random()).slice(0, 5);
                            console.log(`✅ Using ${questionsToUse.length} questions (mixed new/existing).`);
                        } else if (insertedData && insertedData.length > 0) {
                            // Fallback to just what we inserted if total pool is still small
                            questionsToUse = insertedData;
                        }
                    }

                    // 3. Start the Game
                    if (questionsToUse.length > 0) {
                        setCurrentQuestions(questionsToUse);

                        // SYNC state to DB
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

    // State Recovery: Fetch questions if we join a game in progress
    useEffect(() => {
        const recoverState = async () => {
            // Only recover if we have IDs but no Questions loaded (and not generating)
            if (gameId && gameSettings?.question_ids && currentQuestions.length === 0 && !isGenerating) {
                console.log("🔄 Recovering Game State: Fetching Questions...", gameSettings.question_ids);
                const { data } = await supabase
                    .from("questions")
                    .select("*")
                    .in("id", gameSettings.question_ids);

                if (data) {
                    const sortedQuestions = gameSettings.question_ids.map((id: string) =>
                        data.find(q => q.id === id)
                    ).filter(Boolean);
                    setCurrentQuestions(sortedQuestions);
                }
            }
        };
        recoverState();
    }, [gameId, gameSettings, currentQuestions.length]);

    // Unified Timer & Question Loop
    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (status === "QUESTION") {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    const newValue = prev - 1;
                    if (newValue <= 5 && newValue > 0) playSound('tick');

                    if (newValue <= 0) {
                        clearInterval(timer);
                        updateStatus("REVEAL");
                        return 0;
                    }
                    return newValue;
                });
            }, 1000);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [status]);

    // Reset Timer & Refresh Players ONLY when Question Index Changes
    useEffect(() => {
        if (status === "QUESTION") {
            console.log("🔄 New Question Loaded: Resetting Timer & Answers");
            setTimeLeft(20);
            setCurrentAnswers([]);

            // Refresh players list to ensure we don't count "ghost" players who joined but left
            const syncPlayers = async () => {
                if (gameId) {
                    const { data } = await supabase.from('players').select('*').eq('game_id', gameId);
                    if (data) {
                        // We could filter here for active players, but simple refresh is a start
                        console.log(`👥 Refreshed players: ${data.length}`);
                    }
                }
            };
            syncPlayers();
        }
    }, [currentQuestionIndex]);


    // Loading Check
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0f172a] text-white">
                <Loader2 className="w-12 h-12 animate-spin text-pink-500" />
            </div>
        );
    }

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
                        <div>
                            <span className="bg-white/10 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider mb-4 inline-block">
                                QuizMaster TV
                            </span>
                            <div className="flex items-center gap-4 mb-2">
                                <Users className="text-pink-500 w-12 h-12" />
                            </div>
                        </div>

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
                        <div className="p-8 border-b border-white/10">
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
                        </div>

                        {players.length > 0 && (
                            <div className="p-8 flex flex-col gap-6 bg-black/20 flex-grow">
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
                                    className="btn-quiz btn-primary w-full flex items-center justify-center gap-2 group relative overflow-hidden mt-auto"
                                >
                                    {isGenerating ? (
                                        <div className="flex flex-col items-center gap-2 w-full">
                                            <div className="flex items-center gap-3">
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                                <span className="animate-pulse text-lg">A Criar Quiz com IA...</span>
                                            </div>
                                            <span className="text-xs text-white/50 font-normal normal-case">Isto pode demorar uns segundos (estamos a inventar perguntas!)</span>
                                        </div>
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
                    answers={currentAnswers.filter(a => String(a.question_id) === String(currentQ.id))}
                    onTimerClick={() => setTimeLeft(0)}
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
        </main>
    );
}
