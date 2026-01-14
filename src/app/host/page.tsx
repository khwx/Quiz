"use client";

import { useState, useEffect } from "react";
import { useGame } from "@/context/GameContext";
import { supabase } from "@/lib/supabase";
import { Play, ArrowRight, Trophy, Users, RefreshCw, StopCircle, Monitor } from "lucide-react";
import { motion } from "framer-motion";

export default function HostPage() {
    const { gameId, status, players, nextQuestion, updateStatus, setGameId, currentQuestionIndex, gameSettings } = useGame();
    const [gamePin, setGamePin] = useState<string>("");

    // Fetch PIN when gameId is available
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

    if (!gameId) {
        return (
            <main className="min-h-screen bg-gray-900 p-6 flex flex-col items-center justify-center text-white">
                <h1 className="text-3xl font-bold mb-8">Painel do Anfitrião</h1>
                <button
                    onClick={handleCreateGame}
                    disabled={loading}
                    className="btn-quiz btn-primary w-full max-w-sm py-4 text-xl flex items-center justify-center gap-2"
                >
                    {loading ? <RefreshCw className="animate-spin" /> : <Play />}
                    Criar Novo Jogo
                </button>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-900 p-4 pb-24 text-white">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 p-4 bg-white/10 rounded-xl">
                <div>
                    <div className="text-xs text-gray-400 uppercase tracking-widest">PIN DO JOGO</div>
                    <div className="text-3xl font-black font-mono tracking-widest text-pink-500">
                        {/* We need to fetch the pin properly, assuming it's in context or we fetch it */}
                        {gamePin || "A gerar..."}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Users size={20} />
                    <span className="text-xl font-bold">{players.length}</span>
                </div>
            </div>

            {/* Main Controls */}
            <div className="grid gap-4">
                {status === "LOBBY" && (
                    <button
                        onClick={() => updateStatus("STARTING")}
                        disabled={players.length === 0}
                        className={`py-8 text-2xl flex flex-col items-center gap-2 transition-all rounded-xl ${players.length > 0
                            ? 'btn-quiz btn-primary'
                            : 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                            }`}
                    >
                        <Play size={48} />
                        {players.length > 0 ? "Começar Jogo" : "Aguardando Jogadores..."}
                    </button>
                )}

                {status === "QUESTION" && (
                    <div className="bg-blue-600/20 p-8 rounded-2xl border-2 border-blue-500 text-center animate-pulse">
                        <h2 className="text-2xl font-bold mb-2">Pergunta em Curso...</h2>
                        <p className="text-gray-400">Aguarda que o tempo termine ou todos respondam.</p>
                    </div>
                )}

                {status === "REVEAL" && (
                    <>
                        {gameSettings?.question_ids && currentQuestionIndex < gameSettings.question_ids.length ? (
                            <button
                                onClick={() => {
                                    // Make Host smart: Pass the ID explicitly if we have it
                                    // currentQuestionIndex is 1-based. So for Q1 (index 0), current is 1.
                                    // Next question is at index (currentQuestionIndex).
                                    // Example: Current is 1 (Array[0]). Next is 2 (Array[1]).
                                    const nextId = gameSettings.question_ids[currentQuestionIndex];
                                    nextQuestion(nextId);
                                }}
                                className="btn-quiz btn-primary py-8 text-2xl flex flex-col items-center gap-2"
                            >
                                <ArrowRight size={48} />
                                Próxima Pergunta ({currentQuestionIndex + 1}/{gameSettings.question_ids.length})
                            </button>
                        ) : (
                            <button
                                onClick={() => updateStatus("PODIUM")}
                                className="btn-quiz btn-secondary py-8 text-2xl flex flex-col items-center gap-2"
                            >
                                <Trophy size={48} className="text-yellow-400" />
                                Ver Vencedores
                            </button>
                        )}
                    </>
                )}

                {status === "PODIUM" && (
                    <button
                        onClick={() => window.location.reload()}
                        className="btn-quiz btn-secondary py-6 text-xl flex items-center justify-center gap-2"
                    >
                        <RefreshCw />
                        Novo Jogo
                    </button>
                )}
            </div>

            {/* Quick Actions Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4 border-t border-gray-700 flex justify-around">
                <button onClick={handleOpenTV} className="flex flex-col items-center gap-1 text-gray-400 hover:text-white">
                    <Monitor size={24} />
                    <span className="text-xs">Abrir TV</span>
                </button>
                <button
                    onClick={() => updateStatus("PODIUM")}
                    className="flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    <Trophy size={32} className="text-yellow-500" />
                    <span className="text-sm font-bold uppercase tracking-widest text-yellow-500">Ver Vencedores</span>
                </button>
            </div>
        </main>
    );
}
