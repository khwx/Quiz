"use client";

import { use, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { Gamepad2, Send, CheckCircle2, Loader2, Trophy, Wifi, WifiOff, Rocket, ArrowLeft, LogOut, Flag } from "lucide-react";
import AnswerController from "@/components/mobile/AnswerController";
import { supabase } from "@/lib/supabase";
import { useSound } from "@/hooks/useSound";

export default function MobilePlay({ searchParams }: { searchParams: Promise<{ pin?: string }> }) {
    const resolvedParams = use(searchParams);
    const { gameId, joinGame, status, currentQuestionIndex, currentQuestionId, players, setGameId } = useGame();
    const [pin, setPin] = useState(resolvedParams.pin || "");
    const [name, setName] = useState("");
    const [isJoining, setIsJoining] = useState(false);
    const [hasJoined, setHasJoined] = useState(false);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [correctOption, setCorrectOption] = useState<number | null>(null);
    const [startTime, setStartTime] = useState<number>(Date.now());

    const { playSound } = useSound();

    useEffect(() => {
        if (status === "QUESTION") {
            setHasAnswered(false);
            setSelectedOption(null);
            setCorrectOption(null);
            setStartTime(Date.now());
            console.log("New question started, resetting mobile state");
        }
    }, [status, currentQuestionIndex]);

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
                } else {
                    const { data: qData } = await supabase
                        .from("questions")
                        .select("correct_option")
                        .eq("id", currentQuestionId)
                        .single();
                    if (qData) setCorrectOption(qData.correct_option);
                }
            };
            getResult();
        }
    }, [status, currentQuestionId]);

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
            console.warn("Cannot answer: no question ID");
            alert("Aguarde um segundo, a sincronizar com a TV...");
            return;
        }

        setHasAnswered(true);
        setSelectedOption(index);
        playSound('tick');

        const player = players.find(p => p.name === name);
        if (!player) {
            console.error("Player not found:", name, players);
            alert("Erro: Jogador não encontrado. Atualiza a página do telemóvel.");
            setHasAnswered(false);
            setSelectedOption(null);
            return;
        }

        const timeTaken = Math.max(0, Math.floor((Date.now() - startTime) / 1000));

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

            if (!res.ok) {
                throw new Error(data.error || "Falha ao enviar resposta");
            }
        } catch (err: any) {
            console.error("Failed to submit answer:", err);
            alert("Erro ao enviar resposta: " + err.message);
            setHasAnswered(false);
            setSelectedOption(null);
        }
    };

    const handleLeave = async () => {
        if (window.confirm("Queres sair do jogo?")) {
            if (gameId) {
                const player = players.find(p => p.name === name);
                if (player) {
                    await supabase.from('players').delete().eq('id', player.id);
                }
            }
            setHasJoined(false);
            setGameId(null);
            window.location.href = '/';
        }
    };

    const handleReport = async (reason: string) => {
        if (!currentQuestionId) return;
        
        // Get question current metadata
        const { data: q } = await supabase
            .from('questions')
            .select('metadata')
            .eq('id', currentQuestionId)
            .single();
        
        const currentReports = q?.metadata?.reports || [];
        
        // Add new report
        await supabase
            .from('questions')
            .update({
                metadata: {
                    reports: [...currentReports, { 
                        reason, 
                        reporter: name,
                        date: new Date().toISOString() 
                    }]
                }
            })
            .eq('id', currentQuestionId);
        
        alert("Obrigado! Pergunta reportada.");
    };


    if (hasJoined) {
        if (status === "LOBBY" || status === "STARTING") {
            return (
                <main className="min-h-screen relative overflow-x-hidden">
                    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-violet-600/20 blur-[100px]" />
                        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-pink-600/20 blur-[100px]" />
                    </div>
                    
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="relative z-10 glass-panel w-full max-w-sm flex flex-col items-center gap-6 m-6"
                    >
                        <div className="bg-emerald-500/20 p-6 rounded-full">
                            <CheckCircle2 className="w-20 h-20 text-emerald-400" />
                        </div>
                        <div className="text-center">
                            <h2 className="text-3xl font-black text-white mb-2" style={{ fontFamily: 'Space Grotesk' }}>ENTROU!</h2>
                            <p className="text-white/60">Olá {name}! Olha para a TV, o jogo vai começar!</p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full">
                            <Wifi className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm text-emerald-400">Conectado</span>
                        </div>
                        <button 
                            onClick={handleLeave}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-full hover:bg-red-500/20 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm">Sair</span>
                        </button>
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
                        onReport={handleReport}
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
                                <p className="text-white/60 text-xl font-bold uppercase tracking-widest">Não chegaste a responder...</p>
                            </>
                        ) : isCorrect ? (
                            <>
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="bg-white/20 p-8 rounded-full"
                                >
                                    <Trophy className="w-24 h-24 text-yellow-300" />
                                </motion.div>
                                <h2 className="text-5xl font-black text-white italic tracking-tighter shadow-2xl">BOA!!!</h2>
                                <p className="text-white/80 text-xl font-bold uppercase tracking-widest">Acertaste em cheio!</p>
                            </>
                        ) : (
                            <>
                                <div className={`p-8 rounded-3xl mb-4 border-b-8 shadow-xl ${["bg-red-500 border-red-800", "bg-blue-500 border-blue-800", "bg-yellow-500 border-yellow-800", "bg-green-500 border-green-800"][selectedOption || 0]}`}>
                                    <span className="text-6xl font-black text-white/90 drop-shadow-lg">
                                        {["A", "B", "C", "D"][selectedOption || 0]}
                                    </span>
                                </div>
                                <h2 className="text-5xl font-black text-white italic tracking-tighter">ERRADO...</h2>
                                <p className="text-white/80 text-xl font-bold uppercase tracking-widest">Tenta na próxima!</p>
                            </>
                        )}
                        <p className="text-white/40 text-sm mt-8 animate-pulse">Aguarda pela próxima pergunta</p>
                    </motion.div>
                    
                    {/* Report Button - Always visible */}
                    <button
                        onClick={() => {
                            const reason = prompt("Qual é o problema desta pergunta? (Resposta errada, etc)");
                            if (reason) handleReport(reason);
                        }}
                        className="fixed bottom-8 right-4 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white/60 rounded-full text-sm transition-colors"
                    >
                        <Flag className="w-4 h-4" />
                        Reportar
                    </button>
                </main>
            );
        }

        return (
            <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <Trophy className="w-24 h-24 text-yellow-500 mb-6 animate-bounce" />
                <h2 className="text-3xl font-bold text-white">Fim do Jogo!</h2>
                <p className="text-gray-400">Vê a classificação na TV...</p>
            </main>
        )
    }

    return (
        <main className="min-h-screen relative overflow-x-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-violet-600/20 blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-pink-600/20 blur-[100px]" />
            </div>
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-sm mx-auto p-6"
            >
                <div className="flex items-center gap-4 mb-8 justify-center">
                    <div className="p-4 bg-gradient-to-r from-violet-600 to-pink-600 rounded-2xl shadow-lg shadow-pink-500/20">
                        <Gamepad2 className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-black text-white" style={{ fontFamily: 'Space Grotesk' }}>QUIZ<span className="text-pink-500">VERSE</span></h1>
                </div>

                <div className="glass-panel p-6 space-y-6">
                    <div>
                        <label className="text-xs font-medium text-white/40 uppercase tracking-widest mb-2 block">
                            Código do Jogo
                        </label>
                        <input
                            type="tel"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="000000"
                            value={pin}
                            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                            className="w-full glass-input text-center text-3xl font-mono tracking-[0.3em] uppercase"
                            maxLength={6}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium text-white/40 uppercase tracking-widest mb-2 block">
                            O Teu Nome
                        </label>
                        <input
                            type="text"
                            placeholder="Como te queres chamar?"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full glass-input text-xl"
                        />
                    </div>

                    <button
                        onClick={handleJoin}
                        disabled={isJoining || !pin || !name}
                        className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${
                            isJoining || !pin || !name
                            ? 'bg-white/5 text-white/30 cursor-not-allowed'
                            : 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:scale-[0.98] active:scale-[0.95]'
                        }`}
                    >
                        {isJoining ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <>
                                <Rocket className="w-5 h-5" />
                                ENTRAR NO JOGO
                            </>
                        )}
                    </button>
                </div>

                <div className="mt-8 text-center">
                    <button 
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 text-white/40 hover:text-white/60 transition-colors mx-auto"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">Voltar</span>
                    </button>
                </div>
            </motion.div>
        </main>
    );
}