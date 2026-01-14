"use client";

import { useState, useEffect } from "react";
import { useGame } from "@/context/GameContext";
import { supabase } from "@/lib/supabase";
import { Play, ArrowRight, Trophy, Users, RefreshCw, StopCircle, Monitor } from "lucide-react";
import { motion } from "framer-motion";

export default function HostPage() {
    const { gameId, status, players, nextQuestion, updateStatus, setGameId } = useGame();
    const [loading, setLoading] = useState(false);

    // Initial check for active game in local storage or session
    useEffect(() => {
        // Here we could implement logic to restore session if needed
    }, []);

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
                        Running...
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
                        className="btn-quiz btn-primary py-8 text-2xl flex flex-col items-center gap-2"
                    >
                        <Play size={48} />
                        Começar Jogo
                    </button>
                )}

                {status === "QUESTION" && (
                    <div className="bg-blue-600/20 p-8 rounded-2xl border-2 border-blue-500 text-center animate-pulse">
                        <h2 className="text-2xl font-bold mb-2">Pergunta em Curso...</h2>
                        <p className="text-gray-400">Aguarda que o tempo termine ou todos respondam.</p>
                    </div>
                )}

                {status === "REVEAL" && (
                    <button
                        onClick={() => nextQuestion()}
                        className="btn-quiz btn-primary py-8 text-2xl flex flex-col items-center gap-2"
                    >
                        <ArrowRight size={48} />
                        Próxima Pergunta
                    </button>
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
                <button onClick={() => updateStatus("PODIUM")} className="flex flex-col items-center gap-1 text-gray-400 hover:text-white">
                    <StopCircle size={24} />
                    <span className="text-xs">Terminar</span>
                </button>
            </div>
        </main>
    );
}
