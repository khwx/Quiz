"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Trophy, Globe, Medal, ChevronLeft, Star } from "lucide-react";
import MobileNav from "@/components/MobileNav";

interface LeaderboardPlayer {
  rank: number;
  name: string;
  points: number;
  avatar: string;
  isMe: boolean;
}

const MOCK_LEADERBOARD: LeaderboardPlayer[] = [
  { rank: 1, name: "NovaPrime", points: 24150, avatar: "🚀", isMe: false },
  { rank: 2, name: "VortexRunner", points: 18420, avatar: "⚡", isMe: false },
  { rank: 3, name: "StarDust_X", points: 16890, avatar: "🌟", isMe: false },
  { rank: 4, name: "NebulaKnight", points: 15200, avatar: "🛡️", isMe: false },
  { rank: 5, name: "CosmoQueen", points: 14950, avatar: "👑", isMe: false },
  { rank: 6, name: "IonStorm", points: 13800, avatar: "🌪️", isMe: false },
  { rank: 7, name: "Tu", points: 12410, avatar: "🎮", isMe: true },
  { rank: 8, name: "SolarFlare", points: 11500, avatar: "☀️", isMe: false },
  { rank: 9, name: "GravityGhost", points: 10900, avatar: "👻", isMe: false },
  { rank: 10, name: "OrbitalEcho", points: 9850, avatar: "🌍", isMe: false },
];

const GLOW_CLASSES = {
  gold: "glow-gold",
  silver: "glow-silver",
  bronze: "glow-bronze",
};

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<LeaderboardPlayer[]>(MOCK_LEADERBOARD);
  const [userRank, setUserRank] = useState<LeaderboardPlayer | null>(null);

  useEffect(() => {
    const me = players.find((p) => p.isMe);
    setUserRank(me || null);
  }, [players]);

  const top3 = players.filter((p) => p.rank <= 3);
  const rest = players.filter((p) => p.rank > 3);

  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);

  const getGlowClass = (rank: number) => {
    if (rank === 1) return GLOW_CLASSES.gold;
    if (rank === 2) return GLOW_CLASSES.silver;
    if (rank === 3) return GLOW_CLASSES.bronze;
    return "";
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-[#FFD700]";
    if (rank === 2) return "text-[#C0C0C0]";
    if (rank === 3) return "text-[#CD7F32]";
    return "text-on-surface-variant";
  };

  return (
    <main className="min-h-screen relative overflow-hidden pb-24">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[60vw] h-[60vw] bg-[#d0bcff]/10 blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-[#FFB0CD]/10 blur-[150px]" />
      </div>

      <header className="sticky top-0 z-50 bg-[#121223]/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-4xl mx-auto">
          <Link href="/" className="text-sm text-[#e3e0f9]/60 hover:text-[#e3e0f9] transition-colors flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-lg font-bold text-[#e3e0f9]">Classificação Global</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto p-6">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[#e3e0f9]/50 text-center text-sm mb-8"
        >
          Os exploradores mais lendários do cosmos.
        </motion.p>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center items-end gap-4 md:gap-8 mb-12 mt-4 h-72 md:h-80"
        >
          {podiumOrder.map((player, idx) => {
            const actualRank = player.rank;
            const isCenter = actualRank === 1;
            const height = isCenter ? "h-28" : actualRank === 2 ? "h-16" : "h-12";

            return (
              <motion.div
                key={player.rank}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.15, type: "spring" }}
                className={`flex flex-col items-center w-1/3 md:w-48 transition-transform duration-300 hover:scale-105 ${
                  isCenter ? "z-10 -translate-y-6 md:-translate-y-8" : ""
                }`}
              >
                <div className="relative mb-3">
                  {isCenter && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-primary animate-bounce text-2xl">
                      🚀
                    </span>
                  )}
                  <div
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden flex items-center justify-center text-3xl md:text-4xl bg-[#1e1e30] border-2 ${
                      actualRank === 1
                        ? "border-[#FFD700] shadow-[0_0_12px_rgba(255,215,0,0.4)]"
                        : actualRank === 2
                        ? "border-[#C0C0C0] shadow-[0_0_12px_rgba(192,192,192,0.4)]"
                        : "border-[#CD7F32] shadow-[0_0_12px_rgba(205,127,50,0.4)]"
                    } ${isCenter ? "w-20 h-20 md:w-24 md:h-24" : ""}`}
                  >
                    {player.avatar}
                  </div>
                  <div
                    className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center border font-bold text-sm ${
                      actualRank === 1
                        ? "bg-primary w-10 h-10 text-lg border-surface text-[#3c0091]"
                        : "bg-[#28283a] border-white/20 text-[#e3e0f9]"
                    }`}
                  >
                    {actualRank}
                  </div>
                </div>

                <div
                  className={`glass-panel w-full rounded-t-xl p-3 text-center ${
                    isCenter ? "border-primary/20 bg-primary/5" : ""
                  }`}
                >
                  <p className={`font-bold truncate text-sm ${isCenter ? "text-[#e3e0f9]" : "text-[#e3e0f9]/80"}`}>
                    {player.name}
                  </p>
                  <p
                    className={`font-extrabold text-sm ${
                      actualRank === 1
                        ? "text-primary neon-text-primary text-base"
                        : "text-secondary"
                    }`}
                  >
                    {player.points.toLocaleString()} pts
                  </p>
                </div>
                <div
                  className={`w-full bg-gradient-to-b ${
                    isCenter
                      ? "h-28 from-primary/20 to-transparent border-x border-primary/10"
                      : "h-12 from-white/10 to-transparent border-x border-white/5"
                  }`}
                />
              </motion.div>
            );
          })}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-panel p-4 md:p-6 shadow-2xl mb-6 overflow-hidden"
        >
          <div className="flex justify-between items-center px-3 py-2 border-b border-white/10 mb-3">
            <span className="text-[10px] font-bold text-[#e3e0f9]/50 uppercase tracking-widest">
              Piloto
            </span>
            <span className="text-[10px] font-bold text-[#e3e0f9]/50 uppercase tracking-widest">
              Pontuação
            </span>
          </div>
          <div className="space-y-1">
            {rest.map((player, idx) => (
              <motion.div
                key={player.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.05 }}
                className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                  player.isMe
                    ? "bg-primary/10 border border-primary/30 ring-1 ring-primary/20"
                    : "hover:bg-white/5 hover:translate-x-1"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 text-center font-bold ${player.isMe ? "text-primary" : "text-[#e3e0f9]/60"}`}>
                    {player.rank}
                  </span>
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 flex items-center justify-center bg-[#1e1e30] text-xl">
                    {player.avatar}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-[#e3e0f9] text-sm flex items-center gap-1">
                      {player.name}
                    </span>
                    {player.isMe && (
                      <span className="text-[10px] text-primary uppercase font-bold tracking-tighter">
                        Estás aqui!
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`font-bold text-sm ${player.isMe ? "text-primary" : "text-secondary"}`}>
                    {player.points.toLocaleString()}
                  </span>
                  <span className="block text-[10px] text-[#e3e0f9]/40 uppercase">
                    PONTOS
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          <div className="glass-panel p-6 rounded-xl flex flex-col items-center">
            <Globe className="text-primary mb-2 w-6 h-6" />
            <span className="text-[10px] font-bold text-[#e3e0f9]/50 uppercase">Global</span>
            <span className="text-xl font-bold text-[#e3e0f9]">1.2M</span>
            <span className="text-[10px] text-[#e3e0f9]/40">Jogadores ativos</span>
          </div>
          <div className="glass-panel p-6 rounded-xl flex flex-col items-center">
            <Medal className="text-secondary mb-2 w-6 h-6" />
            <span className="text-[10px] font-bold text-[#e3e0f9]/50 uppercase">A Tua Liga</span>
            <span className="text-xl font-bold text-[#e3e0f9]">Prata II</span>
            <span className="text-[10px] text-[#e3e0f9]/40">Próxima: Ouro I</span>
          </div>
        </motion.section>
      </div>

      <MobileNav />
      <div className="h-20 md:hidden" />
    </main>
  );
}
