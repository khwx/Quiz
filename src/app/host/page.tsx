"use client";

import { useState, useEffect } from "react";
import { useGame } from "@/context/GameContext";
import { supabase } from "@/lib/supabase";
import { Play, ArrowRight, Trophy, Users, RefreshCw, StopCircle, Monitor, Rocket, Wifi, Gamepad2, Share2 } from "lucide-react";
import { motion } from "framer-motion";

export default function HostPage() {
    const { gameId, status, players, nextQuestion, updateStatus, setGameId, currentQuestionIndex, gameSettings } = useGame();
    const [loading, setLoading] = useState(false);
    const [gamePin, setGamePin] = useState<string>("");

    useEffect(() => {
        if (!gameId) return;
        const fetchPin = async () => {
            const { data } = await supabase.from("games").select("pin").eq("id", gameId).single();
            if (data?.pin) setGamePin(data.pin);
        };
        fetchPin();
    }, [gameId]);

    const handleCreateGame = async () => {
        setLoading(true);
        const newPin = Math.floor(100000 + Math.random() * 900000).toString();
        const { data } = await supabase
            .from("games")
            .insert([{ pin: newPin, status: "LOBBY" }])
            .select()
            .single();

        if (data) {
            setGameId(data.id);
            setGamePin(data.pin);
        }
        setLoading(false);
    };

    const handleOpenTV = () => {
        if (!gameId) return;
        window.open(`/tv?gameId=${gameId}`, '_blank');
    };

    const copyPin = () => {
        if (gamePin) {
            navigator.clipboard.writeText(gamePin);
        }
    };

    if (!gameId) {
        return (
            <main className="min-h-screen relative overflow-x-hidden">
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-violet-600/20 blur-[100px]" />
                    <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-pink-600/20 blur-[100px]" />
                </div>
                
                <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <div className="inline-block p-4 mb-6 bg-violet-500/20 rounded-2xl">
                            <Gamepad2 className="w-16 h-16 text-violet-400" />
                        </div>
                        <h1 className="text-4xl font-black text-white mb-4" style={{ fontFamily: 'Space Grotesk, system-ui' }}>
                            QUIZ<span className="text-pink-500">VERSE</span>
                        </h1>
                        <p className="text-white/60 mb-8 max-w-md">
                            Painel de controlo para anfitriões. Cria um jogo e controla a experiência no ecrã grande.
                        </p>
                        <button
                            onClick={handleCreateGame}
                            disabled={loading}
                            className="flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold rounded-2xl hover:scale-[0.98] active:scale-[0.95] transition-all shadow-[0_0_30px_rgba(139,92,246,0.4)]"
                        >
                            {loading ? (
                                <RefreshCw className="w-6 h-6 animate-spin" />
                            ) : (
                                <Rocket className="w-6 h-6" />
                            )}
                            <span className="text-lg">Criar Novo Jogo</span>
                        </button>
                    </motion.div>
                </div>
            </main>
        );
    }

    const getStatusColor = () => {
        switch(status) {
            case "LOBBY": return "bg-violet-500";
            case "STARTING": return "bg-amber-500";
            case "QUESTION": return "bg-blue-500 animate-pulse";
            case "REVEAL": return "bg-emerald-500";
            case "PODIUM": return "bg-pink-500";
            default: return "bg-violet-500";
        }
    };

    return (
        <main className="min-h-screen relative overflow-x-hidden pb-32">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-[50vw] h-[50vw] bg-violet-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-pink-600/10 rounded-full blur-[120px]" />
            </div>

            {/* Header */}
            <header className="relative z-10 flex justify-between items-center p-6 max-w-4xl mx-auto">
                <div>
                    <div className="text-xs text-white/40 uppercase tracking-widest mb-1">Código do Jogo</div>
                    <motion.div 
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-3"
                    >
                        <span className="text-5xl font-black font-mono tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-500">
                            {gamePin || "••••••"}
                        </span>
                        <button 
                            onClick={copyPin}
                            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                            title="Copiar código"
                        >
                            <Share2 className="w-5 h-5 text-white/60" />
                        </button>
                    </motion.div>
                </div>
                <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor()}/20 border border-white/10`}>
                        <Wifi className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-medium text-white">{players.length} jogadores</span>
                    </div>
                </div>
            </header>

            {/* Main Game Area */}
            <div className="relative z-10 max-w-4xl mx-auto p-6">
                {/* Players Grid */}
                <section className="glass-panel p-6 mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-violet-400" />
                        Jogadores Conectados
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {players.length === 0 ? (
                            <div className="col-span-full text-center py-8 text-white/40">
                                <p>Aguardando jogadores...</p>
                                <p className="text-sm mt-2">Partilha o código {gamePin}</p>
                            </div>
                        ) : (
                            players.map((player: any, i: number) => (
                                <motion.div
                                    key={player.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center font-bold text-white">
                                        {player.name?.charAt(0)?.toUpperCase() || "?"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">{player.name}</p>
                                        <p className="text-xs text-white/40">{player.score || 0} pts</p>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </section>

                {/* Main Controls */}
                <section className="flex flex-col items-center justify-center py-12">
                    {status === "LOBBY" && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center"
                        >
                            <button
                                onClick={() => updateStatus("STARTING")}
                                disabled={players.length === 0}
                                className={`flex flex-col items-center gap-4 px-16 py-8 rounded-2xl transition-all ${
                                    players.length > 0
                                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:brightness-110'
                                    : 'bg-white/10 text-white/30 cursor-not-allowed'
                                }`}
                            >
                                <Play className="w-12 h-12" />
                                <span className="text-2xl font-bold">
                                    {players.length > 0 ? "Começar Jogo" : "Aguardando Jogadores..."}
                                </span>
                            </button>
                            {players.length > 0 && (
                                <p className="text-white/40 mt-4">
                                    {players.length} jogador{players.length !== 1 ? 'es' : ''} pront{players.length !== 1 ? 'os' : 'o'}
                                </p>
                            )}
                        </motion.div>
                    )}

                    {status === "STARTING" && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center"
                        >
                            <div className="bg-amber-500/20 p-8 rounded-2xl border border-amber-500/30">
                                <RefreshCw className="w-16 h-16 text-amber-400 mx-auto mb-4 animate-spin" />
                                <h2 className="text-2xl font-bold text-white mb-2">A Iniciar...</h2>
                                <p className="text-white/60">O jogo vai começar em breve!</p>
                            </div>
                        </motion.div>
                    )}

                    {status === "QUESTION" && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center"
                        >
                            <div className="bg-blue-500/20 p-8 rounded-2xl border border-blue-500/30 animate-pulse">
                                <h2 className="text-2xl font-bold text-white mb-2">Pergunta em Curso</h2>
                                <p className="text-white/60">Aguarda que todos respondam</p>
                            </div>
                        </motion.div>
                    )}

                    {status === "REVEAL" && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center w-full max-w-md"
                        >
                            {gameSettings?.question_ids && currentQuestionIndex < gameSettings.question_ids.length ? (
                                <button
                                    onClick={() => {
                                        const nextId = gameSettings.question_ids[currentQuestionIndex];
                                        nextQuestion(nextId);
                                    }}
                                    className="w-full flex flex-col items-center gap-4 px-16 py-8 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:brightness-110"
                                >
                                    <ArrowRight className="w-12 h-12" />
                                    <span className="text-xl font-bold">
                                        Próxima Pergunta ({currentQuestionIndex + 1}/{gameSettings.question_ids.length})
                                    </span>
                                </button>
                            ) : (
                                <button
                                    onClick={() => updateStatus("PODIUM")}
                                    className="w-full flex flex-col items-center gap-4 px-16 py-8 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-2xl shadow-[0_0_30px_rgba(236,72,153,0.4)] hover:brightness-110"
                                >
                                    <Trophy className="w-12 h-12" />
                                    <span className="text-xl font-bold">Ver Vencedores</span>
                                </button>
                            )}
                        </motion.div>
                    )}

                    {status === "PODIUM" && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center"
                        >
                            <button
                                onClick={() => window.location.reload()}
                                className="flex flex-col items-center gap-4 px-16 py-8 bg-gradient-to-r from-amber-500 to-yellow-500 text-black rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:brightness-110"
                            >
                                <RefreshCw className="w-12 h-12" />
                                <span className="text-xl font-bold">Novo Jogo</span>
                            </button>
                        </motion.div>
                    )}
                </section>
            </div>

            {/* Quick Actions Footer */}
            <footer className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-2xl border-t border-white/10 p-4">
                <div className="flex justify-around items-center max-w-4xl mx-auto">
                    <button 
                        onClick={handleOpenTV} 
                        className="flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors"
                    >
                        <Monitor className="w-6 h-6" />
                        <span className="text-xs font-medium">Abrir TV</span>
                    </button>
                    <button 
                        onClick={copyPin}
                        className="flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors"
                    >
                        <Share2 className="w-6 h-6" />
                        <span className="text-xs font-medium">Partilhar</span>
                    </button>
                    <button
                        onClick={() => updateStatus("PODIUM")}
                        className="flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors"
                    >
                        <Trophy className="w-6 h-6" />
                        <span className="text-xs font-medium">Ranking</span>
                    </button>
                </div>
            </footer>
        </main>
    );
}