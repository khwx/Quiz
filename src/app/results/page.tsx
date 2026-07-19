"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Rocket, Settings, RotateCcw, Map, Clock, Share2, Copy, Check } from "lucide-react";
import { useGame } from "@/context/GameContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ResultsPage() {
  const { players, gameId } = useGame();
  const router = useRouter();
  const [shared, setShared] = useState(false);

  const sortedPlayers = [...players].sort((a, b) => (b.score || 0) - (a.score || 0));
  const top3 = sortedPlayers.slice(0, 3);
  const podiumData = [
    top3[1] || { name: "-", score: 0, avatar: "🚀" },
    top3[0] || { name: "-", score: 0, avatar: "🚀" },
    top3[2] || { name: "-", score: 0, avatar: "🚀" },
  ];

  const totalScore = sortedPlayers.reduce((s, p) => s + (p.score || 0), 0);
  const topScore = sortedPlayers[0]?.score || 0;
  const avgScore = sortedPlayers.length > 0 ? Math.round(totalScore / sortedPlayers.length) : 0;

  const shareResults = async () => {
    const winner = sortedPlayers[0];
    const text = `🎮 QuizVerse - Resultados\n👑 Vencedor: ${winner?.name || "N/A"} com ${(winner?.score || 0).toLocaleString()} pts\n📊 ${sortedPlayers.length} jogadores\n🏆 Total: ${totalScore.toLocaleString()} pts`;
    const url = typeof window !== "undefined" ? window.location.origin : "https://quizverse.app";

    if (navigator.share) {
      try {
        await navigator.share({ title: "QuizVerse Resultados", text, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const stats = [
    { icon: "timer", label: "Jogadores", value: String(sortedPlayers.length), color: "text-primary" },
    { icon: "bolt", label: "Pontuação Máx.", value: topScore.toLocaleString(), color: "text-secondary" },
    { icon: "verified", label: "Pontuação Média", value: avgScore.toLocaleString(), color: "text-tertiary" },
    { icon: "military_tech", label: "Total Pontos", value: totalScore.toLocaleString(), color: "text-error" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-transparent to-background">
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between px-4 h-16 max-w-screen-xl mx-auto">
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-primary" />
            <h1 className="font-display text-lg font-bold text-primary tracking-tighter">QuizVerse</h1>
          </div>
          <Link href="/settings" className="text-on-surface-variant hover:text-primary transition-colors active:scale-95">
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </header>

      <main className="flex-grow pt-24 pb-32 px-4 max-w-md mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="font-display text-4xl font-bold text-on-background mb-2">
            Missão Cumprida!
          </h2>
          <p className="text-on-surface-variant text-sm">
            {sortedPlayers.length > 0
              ? `${sortedPlayers.length} jogadores competiram nesta partida.`
              : "Ainda não há dados desta partida."}
          </p>
        </motion.div>

        {sortedPlayers.length > 0 ? (
          <>
            {/* Podium */}
            <div className="flex items-end justify-center gap-2 mb-10 h-48">
              {/* 2nd Place */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col items-center w-24"
              >
                <div className="relative mb-2">
                  <div className="w-14 h-14 rounded-full border-2 border-on-surface-variant/30 bg-surface-container-high flex items-center justify-center shadow-lg">
                    <span className="text-2xl">{podiumData[0].avatar || "🥈"}</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-surface-container-high rounded-full w-6 h-6 flex items-center justify-center border border-white/10">
                    <span className="text-[10px] font-bold text-on-surface">2</span>
                  </div>
                </div>
                <div className="w-full glass-panel h-20 rounded-t-lg flex flex-col items-center justify-center">
                  <span className="text-xs font-bold text-on-surface-variant truncate max-w-full px-1">{podiumData[0].name}</span>
                  <span className="text-sm font-bold text-secondary">{(podiumData[0].score || 0).toLocaleString()}</span>
                </div>
              </motion.div>

              {/* 1st Place */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center w-28 animate-float"
              >
                <div className="relative mb-3">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-tertiary">
                    <span className="text-3xl">👑</span>
                  </div>
                  <div className="w-20 h-20 rounded-full border-4 border-primary bg-surface-container flex items-center justify-center shadow-[0_0_20px_rgba(208,188,255,0.6)]">
                    <span className="text-4xl">{podiumData[1].avatar || "🚀"}</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-primary rounded-full w-8 h-8 flex items-center justify-center border-2 border-background">
                    <span className="text-xs font-bold text-on-primary">1</span>
                  </div>
                </div>
                <div className="w-full glass-panel h-32 rounded-t-lg flex flex-col items-center justify-center border-primary/40 bg-primary/10">
                  <span className="text-sm font-bold text-primary truncate max-w-full px-1">{podiumData[1].name}</span>
                  <span className="text-lg font-bold text-on-primary-container">
                    {(podiumData[1].score || 0).toLocaleString()}
                  </span>
                </div>
              </motion.div>

              {/* 3rd Place */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center w-24"
              >
                <div className="relative mb-2">
                  <div className="w-14 h-14 rounded-full border-2 border-on-surface-variant/30 bg-surface-container-high flex items-center justify-center shadow-lg">
                    <span className="text-2xl">{podiumData[2].avatar || "🥉"}</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-surface-container-high rounded-full w-6 h-6 flex items-center justify-center border border-white/10">
                    <span className="text-[10px] font-bold text-on-surface">3</span>
                  </div>
                </div>
                <div className="w-full glass-panel h-16 rounded-t-lg flex flex-col items-center justify-center">
                  <span className="text-xs font-bold text-on-surface-variant truncate max-w-full px-1">{podiumData[2].name}</span>
                  <span className="text-sm font-bold text-tertiary">{(podiumData[2].score || 0).toLocaleString()}</span>
                </div>
              </motion.div>
            </div>

            {/* Full Rankings */}
            {sortedPlayers.length > 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-panel p-4 rounded-xl mb-8"
              >
                <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">
                  Classificação Completa
                </h3>
                <div className="space-y-2">
                  {sortedPlayers.slice(3).map((player, idx) => (
                    <div key={player.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5">
                      <div className="flex items-center gap-3">
                        <span className="w-6 text-center font-bold text-on-surface-variant text-sm">
                          {idx + 4}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-lg">
                          {player.avatar || "🎮"}
                        </div>
                        <span className="font-bold text-on-surface text-sm">{player.name}</span>
                      </div>
                      <span className="font-bold text-secondary text-sm">{(player.score || 0).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-on-surface-variant/50 text-sm">Nenhum dado de partida disponível.</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="glass-panel p-4 rounded-xl text-center"
            >
              <span className={`material-symbols-outlined ${stat.color} mb-1`}>
                {stat.icon}
              </span>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
                {stat.label}
              </p>
              <p className="font-display text-lg font-bold text-on-surface">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {gameId && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              onClick={shareResults}
              className="w-full py-4 rounded-xl glass-panel text-on-surface font-bold text-lg border-primary/50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {shared ? <Check className="w-5 h-5 text-green-400" /> : <Share2 className="w-5 h-5" />}
              {shared ? "Copiado!" : "Partilhar Resultados"}
            </motion.button>
          )}
          {gameId && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
              onClick={async () => {
                await fetch("/api/game/reset", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ gameId }),
                });
                router.push(`/tv?gameId=${gameId}`);
              }}
              className="w-full py-4 rounded-xl glass-panel text-on-surface font-bold text-lg border-primary/50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Revanche
            </motion.button>
          )}
          {gameId && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
              onClick={() => router.push(`/replay?gameId=${gameId}`)}
              className="w-full py-4 rounded-xl glass-panel text-on-surface font-bold text-lg border-secondary/50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Clock className="w-5 h-5" />
              Ver Replay
            </motion.button>
          )}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            onClick={() => router.push("/play")}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-tertiary-container to-primary-container text-white font-bold text-lg shadow-[0_4px_20px_rgba(160,120,255,0.4)] active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Jogar Novamente
          </motion.button>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            onClick={() => router.push("/")}
            className="w-full py-4 rounded-xl glass-panel text-on-surface font-bold text-lg border-secondary/50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Map className="w-5 h-5" />
            Voltar ao Mapa
          </motion.button>
        </div>
      </main>

      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -right-20 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 -left-20 w-64 h-64 bg-secondary/10 blur-[100px] rounded-full" />
      </div>
    </div>
  );
}
