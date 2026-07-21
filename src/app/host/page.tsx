"use client";

import { useState, useEffect } from "react";
import { useGame } from "@/context/GameContext";
import { supabase } from "@/lib/supabase";
import { GAME_CONSTANTS, GameStatus } from "@/lib/constants";
import { Play, ArrowRight, Trophy, Users, RefreshCw, Monitor, Rocket, Wifi, Gamepad2, Share2, Clock, HelpCircle, Zap, Settings, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HostPage() {
    const { gameId, status, players, nextQuestion, updateStatus, setGameId, currentQuestionIndex, gameSettings } = useGame();
    const [loading, setLoading] = useState(false);
    const [gamePin, setGamePin] = useState<string>("");
    const [showSettings, setShowSettings] = useState(false);
    const [categories, setCategories] = useState<{ name: string; dbName: string }[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(["Cultura Geral"]);

    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabase.from("questions").select("category").not("category", "is", null);
            if (data) {
                const unique = Array.from(new Set(data.map(q => q.category))).sort();
                setCategories(unique.map(c => ({ name: c.replace(/_/g, " "), dbName: c })));
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (gameSettings?.topic) {
            const cats = Array.isArray(gameSettings.topic) ? gameSettings.topic : [gameSettings.topic];
            setSelectedCategories(cats);
        }
    }, [gameSettings?.topic]);

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
        const pinArray = new Uint32Array(1);
        crypto.getRandomValues(pinArray);
        const newPin = String(100000 + (pinArray[0] % 900000));
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

    const toggleCategory = async (dbName: string) => {
        if (!gameId) return;
        const newSelected = selectedCategories.includes(dbName)
            ? selectedCategories.filter(c => c !== dbName)
            : [...selectedCategories, dbName];
        setSelectedCategories(newSelected);
        await supabase
            .from("games")
            .update({ settings: { ...gameSettings, topic: newSelected } })
            .eq("id", gameId);
    };

const getStatusLabel = () => {
        switch(status) {
            case GameStatus.LOBBY: return "Sala de Espera";
            case GameStatus.STARTING: return "A Iniciar...";
            case GameStatus.QUESTION: return "Pergunta em Curso";
            case GameStatus.REVEAL: return "A Revelar Resposta";
            case GameStatus.PODIUM: return "Pódio";
            default: return status;
        }
    };

    const getStatusColor = () => {
        switch(status) {
            case GameStatus.LOBBY: return { bg: "bg-[#d0bcff]/20", dot: "bg-[#d0bcff]", text: "text-[#d0bcff]" };
            case GameStatus.STARTING: return { bg: "bg-[#FFB0CD]/20", dot: "bg-[#FFB0CD]", text: "text-[#FFB0CD]" };
            case GameStatus.QUESTION: return { bg: "bg-[#deb7ff]/20", dot: "bg-[#deb7ff] animate-pulse", text: "text-[#deb7ff]" };
            case GameStatus.REVEAL: return { bg: "bg-[#4CAF50]/20", dot: "bg-[#4CAF50]", text: "text-[#4CAF50]" };
            case GameStatus.PODIUM: return { bg: "bg-[#FFD700]/20", dot: "bg-[#FFD700]", text: "text-[#FFD700]" };
            default: return { bg: "bg-[#d0bcff]/20", dot: "bg-[#d0bcff]", text: "text-[#d0bcff]" };
        }
    };

    if (!gameId) {
        return (
            <main className="min-h-screen relative overflow-x-hidden">
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-[#d0bcff]/10 blur-[100px]" />
                    <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-[#FFB0CD]/10 blur-[100px]" />
                </div>
                
                <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <div className="inline-block p-5 mb-6 bg-[#d0bcff]/10 rounded-2xl border border-[#d0bcff]/20">
                            <Gamepad2 className="w-16 h-16 text-[#d0bcff]" />
                        </div>
                        <h1 className="text-4xl font-bold text-[#e3e0f9] mb-4">
                            Quiz<span className="text-[#FFB0CD]">Verse</span>
                        </h1>
                        <p className="text-[#e3e0f9]/60 mb-8 max-w-md">
                            Painel de controlo para anfitriões. Cria um jogo e controla a experiência no ecrã grande.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleCreateGame}
                            disabled={loading}
                            className="flex items-center justify-center gap-3 px-10 py-5 bg-[#d0bcff] text-[#3c0091] font-bold rounded-2xl hover:shadow-[0_0_30px_rgba(208,188,255,0.3)] transition-all"
                        >
                            {loading ? (
                                <RefreshCw className="w-6 h-6 animate-spin" />
                            ) : (
                                <Rocket className="w-6 h-6" />
                            )}
                            <span className="text-lg">Criar Novo Jogo</span>
                        </motion.button>
                    </motion.div>
                </div>
            </main>
        );
    }

    const statusColors = getStatusColor();

    return (
        <main className="min-h-screen relative overflow-x-hidden pb-32">
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-[50vw] h-[50vw] bg-[#d0bcff]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-[#FFB0CD]/5 rounded-full blur-[120px]" />
            </div>

            <header className="relative z-10 flex justify-between items-center p-6 max-w-4xl mx-auto">
                <div>
                    <div className="text-xs text-[#e3e0f9]/40 uppercase tracking-widest mb-1">Código do Jogo</div>
                    <motion.div 
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-3"
                    >
                        <span className="text-5xl font-bold font-mono tracking-widest text-[#d0bcff]">
                            {gamePin || "••••••"}
                        </span>
                        <button 
                            onClick={copyPin}
                            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                            aria-label="Copiar código"
                            title="Copiar código"
                        >
                            <Share2 className="w-5 h-5 text-[#e3e0f9]/60" />
                        </button>
                    </motion.div>
                </div>
                <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusColors.bg} border border-white/10`}>
                        <div className={`w-2 h-2 rounded-full ${statusColors.dot}`} />
                        <span className={`text-sm font-medium ${statusColors.text}`}>{getStatusLabel()}</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                        <Wifi className="w-4 h-4 text-[#4CAF50]" />
                        <span className="text-sm font-medium text-[#e3e0f9]">{players.length} jogador{players.length !== 1 ? 'es' : ''}</span>
                    </div>
                </div>
            </header>

            <div className="relative z-10 max-w-4xl mx-auto p-6">
                <AnimatePresence mode="wait">
                    {status === GameStatus.LOBBY && gameSettings?.question_ids && (
                        <motion.div 
                            key="settings-summary"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-[#1e1e30]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-4 mb-6"
                        >
                            <button 
                                onClick={() => setShowSettings(!showSettings)}
                                className="w-full flex items-center justify-between"
                            >
                                <div className="flex items-center gap-2 text-[#e3e0f9]/60">
                                    <Settings className="w-4 h-4 text-[#d0bcff]" />
                                    <span className="text-sm">Configurações do Jogo</span>
                                </div>
                                {showSettings ? <ChevronUp className="w-4 h-4 text-[#e3e0f9]/40" /> : <ChevronDown className="w-4 h-4 text-[#e3e0f9]/40" />}
                            </button>
                            
                            <AnimatePresence>
                                {showSettings && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pt-4 mt-4 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="flex items-center gap-2 text-[#e3e0f9]/60">
                                                <HelpCircle className="w-4 h-4 text-[#d0bcff]" />
                                                <span><strong className="text-[#e3e0f9]">{gameSettings.question_ids.length}</strong> perguntas</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[#e3e0f9]/60">
                                                <Clock className="w-4 h-4 text-[#FFB0CD]" />
                                                <span><strong className="text-[#e3e0f9]">{gameSettings.timer_duration || 20}s</strong> por pergunta</span>
                                            </div>
                                         <div className="flex items-center gap-2 text-[#e3e0f9]/60">
                                             <Zap className="w-4 h-4 text-[#FFD700]" />
                                             <span>Modo Buzzer: <strong className="text-[#e3e0f9]">{gameSettings?.buzzer_mode ? "ON" : "OFF"}</strong></span>
                                         </div>
                                            <div className="flex items-center gap-2 text-[#e3e0f9]/60">
                                                <Users className="w-4 h-4 text-[#4CAF50]" />
                                                <span><strong className="text-[#e3e0f9]">{players.length}</strong> jogadores</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>

                <section className="bg-[#1e1e30]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6">
                    <h3 className="text-lg font-bold text-[#e3e0f9] mb-4 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#d0bcff]/20 flex items-center justify-center">
                            <Users className="w-4 h-4 text-[#d0bcff]" />
                        </div>
                        Jogadores Conectados
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {players.length === 0 ? (
                            <div className="col-span-full text-center py-8 text-[#e3e0f9]/40">
                                <p>Aguardando jogadores...</p>
                                <p className="text-sm mt-2">Partilha o código {gamePin}</p>
                            </div>
                        ) : (
                            players.map((player, i: number) => (
                                <motion.div
                                    key={player.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#d0bcff] to-[#FFB0CD] flex items-center justify-center font-bold text-[#3c0091]">
                                        {player.name?.charAt(0)?.toUpperCase() || "?"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-[#e3e0f9] truncate">{player.name}</p>
                                        <p className="text-xs text-[#e3e0f9]/40">{player.score || 0} pts</p>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </section>

                <section className="bg-[#1e1e30]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6">
                    <h3 className="text-lg font-bold text-[#e3e0f9] mb-4 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#FFB0CD]/20 flex items-center justify-center">
                            <Users className="w-4 h-4 text-[#FFB0CD]" />
                        </div>
                        Convidar Amigos
                    </h3>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder="Username do amigo..."
                            id="invite-username"
                            className="flex-1 glass-input"
                        />
                        <button
                            onClick={async () => {
                                const input = document.getElementById("invite-username") as HTMLInputElement;
                                const username = input.value.trim();
                                if (!username) return;

                                const { data: { user } } = await supabase.auth.getUser();
                                if (!user) {
                                    alert("Precisas de estar autenticado");
                                    return;
                                }

                                const { data: profile } = await supabase
                                    .from("profiles")
                                    .select("id")
                                    .eq("username", username)
                                    .single();

                                if (!profile) {
                                    alert("Utilizador não encontrado");
                                    return;
                                }

                                await fetch("/api/invites", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        fromUserId: user.id,
                                        toUserId: profile.id,
                                        gameId,
                                        gamePin,
                                    }),
                                });

                                input.value = "";
                                alert("Convite enviado!");
                            }}
                            className="px-6 py-3 bg-[#FFB0CD] text-[#121223] rounded-xl font-bold"
                        >
                            Convidar
                        </button>
                    </div>
                </section>

                {categories.length > 0 && (
                    <section className="bg-[#1e1e30]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6">
                        <h3 className="text-lg font-bold text-[#e3e0f9] mb-4 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[#4CAF50]/20 flex items-center justify-center">
                                <Zap className="w-4 h-4 text-[#4CAF50]" />
                            </div>
                            Categorias
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => {
                                const isSelected = selectedCategories.includes(cat.dbName);
                                return (
                                    <button
                                        key={cat.dbName}
                                        onClick={() => toggleCategory(cat.dbName)}
                                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all border-2 ${
                                            isSelected
                                                ? "bg-[#d0bcff] border-[#d0bcff] text-[#121223] shadow-[0_0_15px_rgba(208,188,255,0.3)]"
                                                : "bg-white/5 border-white/5 text-gray-400 hover:border-white/10"
                                        }`}
                                    >
                                        {cat.name}
                                    </button>
                                );
                            })}
                        </div>
                    </section>
                )}

                <section className="flex flex-col items-center justify-center py-12">
                    <AnimatePresence mode="wait">
                        {status === GameStatus.LOBBY && (
                            <motion.div
                                key="lobby-control"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="text-center"
                            >
                                <motion.button
                                    whileHover={{ scale: players.length > 0 ? 1.02 : 1 }}
                                    whileTap={{ scale: players.length > 0 ? 0.98 : 1 }}
                                    onClick={() => updateStatus(GameStatus.STARTING)}
                                    disabled={players.length === 0}
                                    className={`flex flex-col items-center gap-4 px-16 py-8 rounded-2xl transition-all ${
                                        players.length > 0
                                        ? 'bg-[#d0bcff] text-[#3c0091] shadow-[0_0_30px_rgba(208,188,255,0.3)]'
                                        : 'bg-white/10 text-[#e3e0f9]/30 cursor-not-allowed'
                                    }`}
                                >
                                    <Play className="w-12 h-12" />
                                    <span className="text-2xl font-bold">
                                        {players.length > 0 ? "Começar Jogo" : "Aguardando Jogadores..."}
                                    </span>
                                </motion.button>
                                {players.length > 0 && (
                                    <p className="text-[#e3e0f9]/40 mt-4">
                                        {players.length} jogador{players.length !== 1 ? 'es' : ''} pront{players.length !== 1 ? 'os' : 'o'}
                                    </p>
                                )}
                            </motion.div>
                        )}

                        {status === GameStatus.STARTING && (
                            <motion.div
                                key="starting-control"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center"
                            >
                                <div className="bg-[#FFB0CD]/10 p-8 rounded-2xl border border-[#FFB0CD]/30">
                                    <RefreshCw className="w-16 h-16 text-[#FFB0CD] mx-auto mb-4 animate-spin" />
                                    <h2 className="text-2xl font-bold text-[#e3e0f9] mb-2">A Iniciar...</h2>
                                    <p className="text-[#e3e0f9]/60">O jogo vai começar em breve!</p>
                                </div>
                            </motion.div>
                        )}

                        {status === GameStatus.QUESTION && (
                            <motion.div
                                key="question-control"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center"
                            >
                                <div className="bg-[#d0bcff]/10 p-8 rounded-2xl border border-[#d0bcff]/30">
                                    <div className="w-16 h-16 rounded-full bg-[#d0bcff]/20 flex items-center justify-center mx-auto mb-4">
                                        <Zap className="w-8 h-8 text-[#d0bcff] animate-pulse" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-[#e3e0f9] mb-2">Pergunta em Curso</h2>
                                    <p className="text-[#e3e0f9]/60">Aguarda que todos respondam</p>
                                </div>
                            </motion.div>
                        )}

                        {status === GameStatus.REVEAL && (
                            <motion.div
                                key="reveal-control"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="text-center w-full max-w-md"
                            >
                                {gameSettings?.question_ids && currentQuestionIndex < gameSettings.question_ids.length ? (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => {
                                            const nextId = gameSettings.question_ids![currentQuestionIndex];
                                            nextQuestion(nextId);
                                        }}
                                        className="w-full flex flex-col items-center gap-4 px-16 py-8 bg-[#d0bcff] text-[#3c0091] rounded-2xl shadow-[0_0_30px_rgba(208,188,255,0.3)]"
                                    >
                                        <ArrowRight className="w-12 h-12" />
                                        <span className="text-xl font-bold">
                                            Próxima Pergunta ({currentQuestionIndex + 1}/{gameSettings.question_ids.length})
                                        </span>
                                    </motion.button>
                                ) : (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
onClick={() => updateStatus(GameStatus.PODIUM)}
                                        className="w-full flex flex-col items-center gap-4 px-16 py-8 bg-[#FFD700] text-[#121223] rounded-2xl shadow-[0_0_30px_rgba(255,215,0,0.3)]"
                                    >
                                        <Trophy className="w-12 h-12" />
                                        <span className="text-xl font-bold">Ver Vencedores</span>
                                    </motion.button>
                                )}
                            </motion.div>
                        )}

                        {status === GameStatus.PODIUM && (
                            <motion.div
                                key="podium-control"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="text-center"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => window.location.reload()}
                                    className="flex flex-col items-center gap-4 px-16 py-8 bg-[#FFD700] text-[#121223] rounded-2xl shadow-[0_0_30px_rgba(255,215,0,0.3)]"
                                >
                                    <RefreshCw className="w-12 h-12" />
                                    <span className="text-xl font-bold">Novo Jogo</span>
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>
            </div>

            <footer className="fixed bottom-0 left-0 right-0 z-50 bg-[#121223]/90 backdrop-blur-2xl border-t border-white/10 p-4">
                <div className="flex justify-around items-center max-w-4xl mx-auto">
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleOpenTV} 
                        className="flex flex-col items-center gap-2 text-[#e3e0f9]/60 hover:text-[#d0bcff] transition-colors"
                    >
                        <Monitor className="w-6 h-6" />
                        <span className="text-xs font-medium">Abrir TV</span>
                    </motion.button>
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={copyPin}
                        className="flex flex-col items-center gap-2 text-[#e3e0f9]/60 hover:text-[#FFB0CD] transition-colors"
                    >
                        <Share2 className="w-6 h-6" />
                        <span className="text-xs font-medium">Partilhar</span>
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateStatus("PODIUM")}
                        className="flex flex-col items-center gap-2 text-[#e3e0f9]/60 hover:text-[#FFD700] transition-colors"
                    >
                        <Trophy className="w-6 h-6" />
                        <span className="text-xs font-medium">Ranking</span>
                    </motion.button>
                </div>
            </footer>
        </main>
    );
}