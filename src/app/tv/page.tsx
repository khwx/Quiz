"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { supabase } from "@/lib/supabase";
import { QRCodeSVG } from "qrcode.react";
import { Users, Play, Loader2, Trophy, ArrowRight, Globe, Flag, Film, Atom, PawPrint, GraduationCap, Zap, Trash2 } from "lucide-react";
import QuestionDisplay from "@/components/tv/QuestionDisplay";
import { getCountryCode, filterQuestions } from "@/lib/geo-service";
import { generateQuestions } from "@/lib/ai-service";
import Podium from "@/components/tv/Podium";
import LiveLeaderboard from "@/components/tv/LiveLeaderboard";
import { useSound } from "@/hooks/useSound";
import CastButton from "@/components/CastButton";

export default function TVHost() {
    const { gameId, setGameId, setPlayers, status, updateStatus, players, currentQuestionIndex, nextQuestion, gameSettings } = useGame();
    const [pin, setPin] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [currentQuestions, setCurrentQuestions] = useState<any[]>([]);
    const [timeLeft, setTimeLeft] = useState(20);
    const [currentAnswers, setCurrentAnswers] = useState<any[]>([]);
    const [round, setRound] = useState(1);
    const usedQuestionIdsRef = useRef<string[]>([]);
    const shouldRevealRef = useRef(false); // Shared signal between auto-skip and timer
    const questionStartTimeRef = useRef<number>(0); // Track when the question started

    // Load used questions from local storage on mount
    useEffect(() => {
        try {
            const savedIds = localStorage.getItem('usedQuestionIds');
            if (savedIds) {
                usedQuestionIdsRef.current = JSON.parse(savedIds);
                console.log(`🧠 Loaded ${usedQuestionIdsRef.current.length} used questions from memory.`);
            }
        } catch (e) {
            console.error("Failed to parse used questions from memory", e);
        }
    }, []);

    // Theme State
    const [topic, setTopic] = useState("Cultura Geral");
    const [customTopic, setCustomTopic] = useState("");
    const [ageGroup, setAgeGroup] = useState("adults"); // "7-9", "10-14", "15-17", "adults"
    const [isGenerating, setIsGenerating] = useState(false);
    const [timerDuration, setTimerDuration] = useState(20);
    const [questionCount, setQuestionCount] = useState(5);
    const [questionSource, setQuestionSource] = useState<"DB" | "AI" | null>(null);
    const [localMode, setLocalMode] = useState(false);
    const [localScore, setLocalScore] = useState(0);

    const arenaIcons: Record<string, any> = {
        "Cultura Geral": <Globe className="w-4 h-4" />,
        "Capitais do Mundo": <Zap className="w-4 h-4" />,
        "Bandeiras": <Flag className="w-4 h-4" />,
        "Cinema": <Film className="w-4 h-4" />,
        "Desporto": <Trophy className="w-4 h-4" />,
        "Ciência": <Atom className="w-4 h-4" />,
        "Animais": <PawPrint className="w-4 h-4" />
    };

    const { playSound } = useSound();

    // Handle local mode answer
    const handleLocalAnswer = (optionIndex: number) => {
        if (status !== "QUESTION" || !currentQ || localScore >= questionCount) return;
        
        const isCorrect = optionIndex === currentQ.correct_option;
        if (isCorrect) {
            const points = Math.max(10, Math.floor((timeLeft / timerDuration) * 100));
            setLocalScore(prev => prev + points);
            playSound?.('correct');
        } else {
            playSound?.('wrong');
        }
        updateStatus("REVEAL");
    };

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

                // Auto-cleanup: Delete ghost rooms older than 24h
                // Helps keep the database clean automatically without Cron jobs
                try {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    await supabase
                        .from('games')
                        .delete()
                        .lt('created_at', yesterday.toISOString());
                    console.log("🧹 Limpeza de salas fantasma concluída.");
                } catch (e) {
                    console.error("Failed to clean up old rooms:", e);
                }
            }
            setLoading(false);
        };

        connectToGame();
    }, []);

    // Clear answers when status changes to STARTING (new round)
    useEffect(() => {
        if (status === "STARTING") {
            console.log("🧹 Clearing old answers for new round", { currentQuestionIndex, currentQuestionsLength: currentQuestions.length });
            setCurrentAnswers([]);
        }
    }, [status]);

    // Also clear answers when question index changes
    useEffect(() => {
        if (status === "QUESTION" && currentQuestionIndex > 0) {
            const currentQ = currentQuestions[currentQuestionIndex - 1];
            console.log("🧹 Question index changed, filtering answers", { 
                questionIndex: currentQuestionIndex, 
                questionId: currentQ?.id,
                totalAnswersBefore: currentAnswers.length 
            });
        }
    }, [currentQuestionIndex]);

    // Answer Subscription & Polling Fallback (Hybrid Strategy)
    // BUG FIX #3: Track current question IDs to filter polling results
    const currentQuestionIdsRef = useRef<string[]>([]);
    useEffect(() => {
        currentQuestionIdsRef.current = currentQuestions.map(q => String(q.id));
    }, [currentQuestions]);

    useEffect(() => {
        if (!gameId) return;

        console.log(`🔧 Setting up Answer Subscription for gameId: ${gameId}`);

        // 1. Setup Realtime Subscription
        const channel = supabase
            .channel(`game-answers-${gameId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'answers',
                filter: `game_id=eq.${gameId}`
            }, (payload) => {
                const newAnswer = payload.new;
                // BUG FIX #3: Only accept answers for questions in the current round
                if (!currentQuestionIdsRef.current.includes(String(newAnswer.question_id))) {
                    console.log("🚫 Ignoring answer for old question:", newAnswer.question_id);
                    return;
                }
                console.log("📥 Received Answer (Realtime):", newAnswer);

                setCurrentAnswers(prev => {
                    if (prev.some(a => a.id === newAnswer.id)) return prev;
                    console.log("📥 ANSWER DETECTED (Realtime):", newAnswer);
                    return [...prev, newAnswer];
                });
            })
            .subscribe((status) => {
                console.log(`📡 Answer Subscription Status: ${status}`);
            });

        // 2. Setup Polling Fallback (Backup for when Realtime fails)
        // BUG FIX #3: Only poll answers for current round's questions
        const pollInterval = setInterval(async () => {
            const questionIds = currentQuestionIdsRef.current;
            if (questionIds.length === 0) return;

            const { data: polledAnswers, error } = await supabase
                .from('answers')
                .select('*')
                .eq('game_id', gameId)
                .in('question_id', questionIds);

            if (error) {
                console.error("❌ Polling Error:", error);
                return;
            }

            if (polledAnswers && polledAnswers.length > 0) {
                setCurrentAnswers(prev => {
                    const newAnswers = polledAnswers.filter(pa => !prev.some(existing => existing.id === pa.id));
                    if (newAnswers.length > 0) {
                        console.log(`🔄 Polled ${newAnswers.length} new answers. Total answers in DB: ${polledAnswers.length}`);
                        return [...prev, ...newAnswers];
                    }
                    return prev;
                });
            }
        }, 1500);

        return () => {
            console.log("🔌 Unsubscribing & Stopping Poller...");
            supabase.removeChannel(channel);
            clearInterval(pollInterval);
        };
    }, [gameId]); // Only recreate if gameId changes (shouldn't happen). Status changes should NOT destroy subscription!

    // Auto-skip logic - advance to REVEAL when all players answered
    useEffect(() => {
        if (status !== "QUESTION") return;

        const currentQ = currentQuestions[currentQuestionIndex - 1];
        if (!currentQ?.id) return;

        // Safety: never auto-skip within the first 2 seconds of a question
        const elapsedMs = Date.now() - questionStartTimeRef.current;
        if (elapsedMs < 2000) return;

        const currentQuestionId = String(currentQ.id);
        const validAnswersForQ = currentAnswers.filter(a => String(a.question_id) === currentQuestionId);
        const uniqueAnswerPlayerIds = new Set(validAnswersForQ.map(a => String(a.player_id)));
        const uniquePlayers = Array.from(new Set(players.map(p => String(p.id))));

        if (uniquePlayers.length > 0 && uniqueAnswerPlayerIds.size >= uniquePlayers.length) {
            console.log("🎯 Todos os jogadores responderam! Avançando para REVEAL...");
            shouldRevealRef.current = true;
            updateStatus("REVEAL");
        }
    }, [currentAnswers, players, status, currentQuestionIndex, currentQuestions, updateStatus]);

    // Fetch/Generate Questions on Start
    // BUG FIX #1: Use ref + guard to prevent double execution
    const isStartingRef = useRef(false);
    useEffect(() => {
        const startRound = async () => {
            if (status !== "STARTING") return;
            // Guard: prevent double execution from rapid state changes
            if (isStartingRef.current) {
                console.log("⚠️ startRound already running, skipping...");
                return;
            }
            isStartingRef.current = true;
            setIsGenerating(true);

            try {
                // Normalize category name
                const finalTopic = (customTopic || topic).toLowerCase().trim();
                const ageMap: Record<string, number> = { "7-9": 8, "10-14": 12, "15-17": 16, "adults": 18 };
                const targetAge = ageMap[ageGroup] || 18;
                // BUG FIX #1: Read from ref instead of state to avoid dependency loop
                const currentUsedIds = usedQuestionIdsRef.current;

                console.log(`🎯 Starting game with topic: ${finalTopic} | Age: ${ageGroup} (DB: ${targetAge}) | Round: ${round} | Used IDs: ${currentUsedIds.length}`);

                // Clear answers from previous round - both locally AND in the DB
                // This prevents stale DB answers from triggering auto-skip on the next round
                setCurrentAnswers([]);
                if (gameId) {
                    await supabase.from('answers').delete().eq('game_id', gameId);
                    console.log('🗑️ Cleared old answers from DB for new round');
                }

                let questionsToUse: any[] = [];
                let count = 0;

                // 1. Fetch ALL questions for this category
                // We filter used questions IN MEMORY because the list of IDs can become 
                // too long for a URL (causing 414 URI Too Long errors)
                let query = supabase
                    .from("questions")
                    .select("*")
                    .ilike("category", finalTopic);
                const isUniversalTopic = finalTopic === "Bandeiras" || finalTopic === "Capitais do Mundo";

                if (!isUniversalTopic) {
                    if (targetAge === 18) {
                        query = query.gte('age_rating', 18);
                    } else {
                        query = query.eq('age_rating', targetAge);
                    }
                }

                const { data } = await query;
                const allQuestions = data || [];

                // Filter out used questions in memory
                const unusedQuestions = allQuestions.filter(q => !currentUsedIds.includes(String(q.id)));
                count = unusedQuestions.length;

                // We need at least questionCount unused questions
                if (count >= questionCount) {
                    const shuffled = unusedQuestions.sort(() => 0.5 - Math.random()).slice(0, questionCount);
                    questionsToUse = shuffled;
                    setQuestionSource("DB");
                    console.log(`✅ Found ${count} unused questions in DB. Using ${questionCount}.`);
                } else {
                    console.log(`⚠️ Only ${count} unused questions available in DB. Generating more...`);
                }

                // 2. If not enough, GENERATE new ones
                if (questionsToUse.length === 0) {
                    setQuestionSource("AI");
                    console.log(`🤖 Generating new questions for "${finalTopic}" (Age: ${ageGroup})`);

                    const aiQuestions = await generateQuestions(finalTopic, questionCount, ageGroup);
                    const dbAgeRating = targetAge;

                    // Insert into Supabase
                    const questionsToInsert = aiQuestions.map((q: any) => ({
                        text: q.text.trim().charAt(0).toUpperCase() + q.text.trim().slice(1),
                        image_url: q.image_url || null,
                        options: q.options,
                        correct_option: q.correct_option,
                        category: finalTopic.charAt(0).toUpperCase() + finalTopic.slice(1).toLowerCase(),
                        age_rating: dbAgeRating
                    }));

                    const { data: insertedData, error } = await supabase
                        .from("questions")
                        .upsert(questionsToInsert, {
                            onConflict: 'text,category',
                            ignoreDuplicates: true
                        })
                        .select();

                    // BUG FIX #2: Fetch available questions EXCLUDING already used ones
                    let finalQuery = supabase
                        .from("questions")
                        .select("*")
                        .ilike("category", finalTopic);

                    // Exclude used questions from this session
                    if (currentUsedIds.length > 0) {
                        finalQuery = finalQuery.not('id', 'in', `(${currentUsedIds.join(',')})`);
                    }

                    if (targetAge === 18) {
                        finalQuery = finalQuery.gte('age_rating', 18);
                    } else {
                        finalQuery = finalQuery.eq('age_rating', targetAge);
                    }

                    const { data: allAvailableQuestions } = await finalQuery;

                    if (allAvailableQuestions && allAvailableQuestions.length >= questionCount) {
                        questionsToUse = allAvailableQuestions.sort(() => 0.5 - Math.random()).slice(0, questionCount);
                        console.log(`✅ Using ${questionsToUse.length} questions (mixed new/existing, no repeats).`);
                    } else if (allAvailableQuestions && allAvailableQuestions.length > 0) {
                        // Use what we have, even if less than questionCount
                        questionsToUse = allAvailableQuestions.sort(() => 0.5 - Math.random());
                        console.log(`⚠️ Only ${questionsToUse.length} unique questions available.`);
                    } else if (insertedData && insertedData.length > 0) {
                        questionsToUse = insertedData;
                    }
                }

                // 3. Start the Game
                if (questionsToUse.length > 0) {
                    // Randomize options for EVERY question so the correct answer is in a random position
                    questionsToUse = questionsToUse.map(q => {
                        const options: string[] = q.options || [];
                        const correctText = options[q.correct_option ?? 0];
                        const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
                        const newCorrectIndex = Math.max(0, shuffledOptions.indexOf(correctText));
                        return { ...q, options: shuffledOptions, correct_option: newCorrectIndex };
                    });

                    setCurrentQuestions(questionsToUse);

                    // BUG FIX #1: Update the ref instead of state (no re-trigger)
                    const newUsedIds = [...currentUsedIds, ...questionsToUse.map(q => String(q.id))];
                    usedQuestionIdsRef.current = newUsedIds;
                    try {
                        localStorage.setItem('usedQuestionIds', JSON.stringify(newUsedIds));
                    } catch (e) {
                        console.error("Failed to save used questions to memory", e);
                    }
                    console.log(`📚 Used question IDs: ${newUsedIds.length}`);

                    // SYNC state to DB
                    const questionIds = questionsToUse.map(q => q.id);
                    await supabase.from("games").update({
                        settings: { 
                            ...gameSettings, 
                            question_ids: questionIds, 
                            current_question_id: questionsToUse[0].id,
                            current_correct_option: questionsToUse[0].correct_option
                        },
                        current_question_index: 1,
                        status: "QUESTION"
                    }).eq('id', gameId);
                }
            } catch (err) {
                console.error("Question loading failed:", err);
                // Revert status so user can try again
                updateStatus("LOBBY");
                alert("Falha ao gerar perguntas: " + (err instanceof Error ? err.message : "Erro desconhecido") + "\nTenta outro tema ou limpa a memória das perguntas usadas.");
            } finally {
                setIsGenerating(false);
                isStartingRef.current = false;
            }
        };
        startRound();
    }, [status, round]); // BUG FIX #1: Removed usedQuestionIds from deps — using ref instead

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

        const currentQ = currentQuestions[currentQuestionIndex - 1];
        if (status === "QUESTION" && currentQ?.id) {
            // Reset signals when a new question starts
            shouldRevealRef.current = false;
            questionStartTimeRef.current = Date.now();
            console.log("⏱️ Starting timer with duration:", timerDuration);
            timer = setInterval(() => {
                // Stop the interval immediately if auto-skip already triggered
                if (shouldRevealRef.current) {
                    console.log("⏹️ Auto-skip triggered, stopping timer early");
                    clearInterval(timer);
                    return;
                }

                setTimeLeft((prev) => {
                    const newValue = prev - 1;
                    if (newValue <= 5 && newValue > 0) playSound('tick');

                    if (newValue <= 0) {
                        console.log("⏱️ Timer expired! Advancing to REVEAL");
                        clearInterval(timer);
                        updateStatus("REVEAL");
                        return 0;
                    }
                    return newValue;
                });
            }, 1000);
        }

        return () => {
            if (timer) {
                console.log("⏹️ Clearing timer");
                clearInterval(timer);
            }
        };
    }, [status, playSound, updateStatus, currentQuestionIndex, currentQuestions]);

    // Reset Timer & Refresh Players when Question Index Changes OR when entering QUESTION state
    useEffect(() => {
        if (status === "QUESTION") {
            console.log("🔄 New Question Loaded: Resetting Timer & Answers", { currentQuestionIndex, timerDuration });
            setTimeLeft(timerDuration);
            setCurrentAnswers([]);

            // Small delay to ensure answers are cleared before auto-skip check
            const timer = setTimeout(() => {
                console.log("✅ Answers reset complete, ready for new question");
            }, 100);

            // Refresh players list to ensure we don't count "ghost" players who joined but left
            const syncPlayers = async () => {
                if (gameId) {
                    const { data } = await supabase.from('players').select('*').eq('game_id', gameId);
                    if (data) {
                        setPlayers(data);
                        console.log(`👥 Refreshed players: ${data.length}`);
                    }
                }
            };
            syncPlayers();

            return () => clearTimeout(timer);
        }
    }, [currentQuestionIndex, round]);


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
            {(status === "LOBBY" || status === "STARTING") && (
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative">
                    
                    {/* Botão de Limpeza de Memória */}
                    {usedQuestionIdsRef.current.length > 0 && (
                        <div className="absolute -top-10 right-0">
                            <button
                                onClick={() => {
                                    if (confirm(`Tens a certeza que queres limpar a memória da TV?\nForam memorizadas ${usedQuestionIdsRef.current.length} perguntas. Ao limpar, elas voltarão a repetir-se.`)) {
                                        localStorage.removeItem('usedQuestionIds');
                                        usedQuestionIdsRef.current = [];
                                        alert("Memória limpa! Podes começar um jogo novo com o baralho completo.");
                                    }
                                }}
                                className="px-4 py-2 bg-gray-800/80 hover:bg-red-600 text-gray-300 hover:text-white rounded-lg text-sm transition-all flex items-center gap-2 shadow-lg backdrop-blur-sm border border-white/10"
                                title="Limpar as perguntas memorizadas na TV"
                            >
                                🧹 Limpar Memória ({usedQuestionIdsRef.current.length})
                            </button>
                        </div>
                    )}

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
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4 text-violet-500" /> Nível da Arena
                                    </label>
                                    <div className="grid grid-cols-4 gap-3">
                                        {[
                                            { id: "7-9", label: "Infantil" },
                                            { id: "10-14", label: "Júnior" },
                                            { id: "15-17", label: "Teen" },
                                            { id: "adults", label: "Master" }
                                        ].map((age) => (
                                            <button
                                                key={age.id}
                                                onClick={() => setAgeGroup(age.id)}
                                                className={`py-3 rounded-2xl text-xs font-bold transition-all border-2 flex flex-col items-center gap-1 ${ageGroup === age.id
                                                    ? "bg-violet-600 border-violet-400 text-white shadow-[0_0_15px_rgba(139,92,246,0.5)] scale-105"
                                                    : "bg-white/5 border-white/5 text-gray-400 hover:border-white/10"
                                                    }`}
                                            >
                                                <span className="opacity-60 uppercase text-[10px]">{age.id === "adults" ? "18+" : age.id}</span>
                                                {age.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* TOPIC SELECTOR */}
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-pink-500" /> Escolha a Arena
                                    </label>
                                    <div className="flex flex-wrap gap-3">
                                        {Object.keys(arenaIcons).map(t => (
                                            <button
                                                key={t}
                                                onClick={() => { setTopic(t); setCustomTopic(""); }}
                                                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 border-2 ${topic === t && !customTopic
                                                    ? "bg-pink-500 border-pink-400 text-white scale-105 shadow-[0_0_15px_rgba(236,72,153,0.5)]"
                                                    : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:border-white/10"
                                                    }`}
                                            >
                                                {arenaIcons[t]}
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

                                {/* TIMER DURATION SELECTOR */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Tempo por Pergunta</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {[10, 15, 20, 30].map(seconds => (
                                            <button
                                                key={seconds}
                                                onClick={() => setTimerDuration(seconds)}
                                                className={`py-2 rounded-xl text-sm font-bold transition-all border-2 ${timerDuration === seconds
                                                    ? "bg-pink-500 border-pink-500 text-white shadow-lg"
                                                    : "bg-transparent border-white/10 text-gray-400 hover:border-white/30"
                                                    }`}
                                            >
                                                {seconds}s
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* QUESTION COUNT SELECTOR */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Número de Perguntas</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {[3, 5, 7, 10].map(count => (
                                            <button
                                                key={count}
                                                onClick={() => setQuestionCount(count)}
                                                className={`py-2 rounded-xl text-sm font-bold transition-all border-2 ${questionCount === count
                                                    ? "bg-violet-500 border-violet-500 text-white shadow-lg"
                                                    : "bg-transparent border-white/10 text-gray-400 hover:border-white/30"
                                                    }`}
                                            >
                                                {count}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                    {/* LOCAL MODE TOGGLE */}
                                    <div className="flex items-center justify-between bg-white/5 rounded-xl p-4 border border-white/10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                                <span className="text-xl">👆</span>
                                            </div>
                                            <div>
                                                <div className="font-bold text-white">Modo Local</div>
                                                <div className="text-xs text-gray-400">Responde no ecran</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setLocalMode(!localMode)}
                                            className={`w-14 h-8 rounded-full transition-all ${localMode ? 'bg-green-500' : 'bg-gray-600'}`}
                                        >
                                            <div className={`w-6 h-6 bg-white rounded-full shadow transform transition-transform ${localMode ? 'translate-x-7' : 'translate-x-1'}`} />
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => updateStatus("STARTING")}
                                        disabled={(players.length === 0 && !localMode) || isGenerating || status === "STARTING"}
                                        className="btn-quiz btn-primary w-full py-6 flex justify-center items-center gap-3 relative overflow-hidden group mt-auto"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-pink-600 opacity-0 group-hover:opacity-20 transition-opacity" />
                                        <span className="relative z-10 flex items-center gap-3 text-2xl tracking-tighter uppercase font-black">
                                            {(isGenerating || status === "STARTING") ? (
                                                <>
                                                    <Loader2 className="animate-spin" />
                                                    A Invocar Arena...
                                                </>
                                            ) : (
                                                <>{localMode ? 'Iniciar Quiz' : 'Entrar na Arena'} <ArrowRight className="group-hover:translate-x-2 transition-transform" /></>
                                            )}
                                        </span>
                                    </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}

            {/* LOCAL MODE SCORE */}
            {localMode && (
                <div className="absolute top-4 right-4 z-50 bg-green-500/20 backdrop-blur-md px-6 py-3 rounded-2xl border-2 border-green-500/50">
                    <div className="text-xs text-green-300 font-bold uppercase tracking-widest">Pontuação</div>
                    <div className="text-3xl font-black text-white">{localScore}</div>
                </div>
            )}

            {/* QUESTION VIEW */}
            {(status === "QUESTION" || status === "REVEAL") && currentQ && (
                <QuestionDisplay
                    question={currentQ}
                    timeLeft={timeLeft}
                    totalTime={timerDuration}
                    status={status}
                    players={players}
                    questionSource={questionSource}
                    answers={currentAnswers.filter(a => String(a.question_id) === String(currentQ.id))}
                    onTimerClick={() => setTimeLeft(0)}
                    localMode={localMode}
                    onLocalAnswer={handleLocalAnswer}
                />
            )}

            {/* REVEAL / LEADERBOARD INFO */}
            {status === "REVEAL" && currentQ && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row gap-3 sm:justify-end sm:items-end"
                >
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => {
                                const nextQ = currentQuestions[currentQuestionIndex];
                                if (nextQ) {
                                    nextQuestion(nextQ.id, nextQ.correct_option);
                                } else {
// No more questions - start new round
                                console.log(`🔄 Starting round ${round + 1}...`);
                                setRound(r => r + 1);
                                updateStatus("STARTING");
                                }
                            }}
                            className="btn-quiz btn-primary flex items-center gap-2"
                        >
                            {currentQuestionIndex < currentQuestions.length ? (
                                <>Próxima Pergunta <ArrowRight /></>
                        ) : (
                            <>Nova Volta <ArrowRight /></>
                        )}
                        </button>
                        <button
                            onClick={() => {
                                // Reset everything and go back to lobby
                                console.log(`🔙 Returning to lobby...`);
                                setGameId(null);
                                usedQuestionIdsRef.current = [];
                                setRound(1);
                                setCurrentQuestions([]);
                                window.location.reload();
                            }}
                            className="btn-quiz btn-secondary flex items-center gap-2"
                        >
                            <>Escolher Outro Tema</>
                        </button>
                    </div>
                </motion.div>
            )}

            {/* PODIUM VIEW */}
            {status === "PODIUM" && (
                <div className="flex flex-col items-center gap-8">
                    <Podium
                        players={players}
                        onRestart={() => {}}
                    />
                    <button
                        onClick={() => {
                            console.log(`🔙 Returning to lobby...`);
                            setGameId(null);
                            usedQuestionIdsRef.current = [];
                            setRound(1);
                            setCurrentQuestions([]);
                            window.location.reload();
                        }}
                        className="btn-quiz btn-primary flex items-center gap-2 text-xl px-8 py-4"
                    >
                        <>Escolher Outro Tema</>
                    </button>
                </div>
            )}
        </main>
    );
}
