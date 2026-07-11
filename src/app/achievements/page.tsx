"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Trophy, Rocket, Users, Target, Zap, Lock, CheckCircle } from "lucide-react";
import MobileNav from "@/components/MobileNav";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "legendary" | "epic" | "rare" | "common";
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  category: string;
}

const RARITY_CONFIG = {
  legendary: { label: "Lendário", color: "text-[#FFB0CD]", bg: "bg-[#FFB0CD]/10", border: "border-[#FFB0CD]/20", glow: "shadow-[0_0_20px_rgba(255,176,205,0.2)]" },
  epic: { label: "Épico", color: "text-[#deb7ff]", bg: "bg-[#deb7ff]/10", border: "border-[#deb7ff]/20", glow: "shadow-[0_0_20px_rgba(222,183,255,0.2)]" },
  rare: { label: "Raro", color: "text-[#d0bcff]", bg: "bg-[#d0bcff]/10", border: "border-[#d0bcff]/20", glow: "shadow-[0_0_20px_rgba(208,188,255,0.2)]" },
  common: { label: "Comum", color: "text-[#e3e0f9]/50", bg: "bg-white/5", border: "border-white/10", glow: "" },
};

const CATEGORIES = ["Todas", "Vitórias", "Sequências", "Precisão", "Social"];

const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: "1", name: "Mestre do Vácuo", description: "Vence 50 quizzes sem errar.", icon: "🏆", rarity: "legendary", progress: 42, maxProgress: 50, unlocked: false, category: "Vitórias" },
  { id: "2", name: "Velocidade de Dobra", description: "Responde 10 perguntas em <3s.", icon: "🚀", rarity: "epic", progress: 10, maxProgress: 10, unlocked: true, category: "Sequências" },
  { id: "3", name: "Embaixador Estelar", description: "Convida 5 amigos.", icon: "👥", rarity: "rare", progress: 3, maxProgress: 5, unlocked: false, category: "Social" },
  { id: "4", name: "Viajante Global", description: "Torneios em 5 fusos horários.", icon: "🌍", rarity: "common", progress: 0, maxProgress: 5, unlocked: false, category: "Social" },
  { id: "5", name: "Primeira Estrela", description: "Ganha o teu primeiro jogo.", icon: "⭐", rarity: "common", progress: 1, maxProgress: 1, unlocked: true, category: "Vitórias" },
  { id: "6", name: "Sequência Infinita", description: "10 vitórias consecutivas.", icon: "🔥", rarity: "epic", progress: 7, maxProgress: 10, unlocked: false, category: "Sequências" },
  { id: "7", name: "Olho de Águia", description: "90% de precisão em 20 jogos.", icon: "🎯", rarity: "rare", progress: 14, maxProgress: 20, unlocked: false, category: "Precisão" },
  { id: "8", name: "Lenda Viva", description: "100 vitórias totais.", icon: "👑", rarity: "legendary", progress: 67, maxProgress: 100, unlocked: false, category: "Vitórias" },
];

export default function AchievementsPage() {
  const [activeCategory, setActiveCategory] = useState("Todas");

  const filtered = activeCategory === "Todas"
    ? MOCK_ACHIEVEMENTS
    : MOCK_ACHIEVEMENTS.filter((a) => a.category === activeCategory);

  const unlocked = MOCK_ACHIEVEMENTS.filter((a) => a.unlocked).length;
  const total = MOCK_ACHIEVEMENTS.length;

  return (
    <main className="min-h-screen relative overflow-hidden pb-24">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[60vw] h-[60vw] bg-[#d0bcff]/10 blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-[#FFB0CD]/10 blur-[150px]" />
      </div>

      <header className="sticky top-0 z-50 bg-[#121223]/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-4xl mx-auto">
          <Link href="/profile" className="text-sm text-[#e3e0f9]/60 hover:text-[#e3e0f9] transition-colors flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-lg font-bold text-[#e3e0f9]">Conquistas</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto p-6">
        {/* Stats header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6 bg-[#1e1e30]/50 backdrop-blur-sm p-4 rounded-xl border border-white/5"
        >
          <div>
            <p className="text-[10px] text-[#FFB0CD] uppercase tracking-wider font-bold">Desbloqueadas</p>
            <p className="text-xl font-bold text-[#e3e0f9]">{unlocked}/{total}</p>
          </div>
          <div className="h-10 w-px bg-white/10" />
          <div>
            <p className="text-[10px] text-[#FFD700] uppercase tracking-wider font-bold">Pontos Astro</p>
            <p className="text-xl font-bold text-[#e3e0f9]">2,450</p>
          </div>
        </motion.div>

        {/* Category filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "bg-[#d0bcff]/15 text-[#d0bcff] border border-[#d0bcff]/30"
                  : "text-[#e3e0f9]/50 border border-white/10 hover:text-[#d0bcff] hover:border-[#d0bcff]/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Achievements grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((achievement, idx) => {
            const rarity = RARITY_CONFIG[achievement.rarity];
            const progressPercent = (achievement.progress / achievement.maxProgress) * 100;

            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className={`glass-panel p-5 rounded-2xl flex flex-col items-center text-center relative overflow-hidden group ${
                  !achievement.unlocked ? "opacity-60" : ""
                } ${rarity.glow}`}
              >
                {/* Rarity badge */}
                <div className="absolute top-3 right-3">
                  <span className={`text-[10px] font-bold ${rarity.color} ${rarity.bg} px-2 py-1 rounded-full uppercase tracking-wider`}>
                    {rarity.label}
                  </span>
                </div>

                {/* Icon */}
                <div className="w-20 h-20 mb-3 relative flex items-center justify-center">
                  <div className={`absolute inset-0 ${rarity.bg} blur-xl rounded-full group-hover:opacity-80 transition-all`} />
                  <motion.span
                    animate={achievement.unlocked ? { y: [0, -5, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="text-4xl relative z-10"
                  >
                    {achievement.unlocked ? achievement.icon : "🔒"}
                  </motion.span>
                </div>

                <h3 className={`font-bold mb-1 ${achievement.unlocked ? "text-[#e3e0f9]" : "text-[#e3e0f9]/50"}`}>
                  {achievement.name}
                </h3>
                <p className="text-xs text-[#e3e0f9]/40 mb-3">{achievement.description}</p>

                {/* Progress bar */}
                <div className="w-full mt-auto">
                  <div className="flex justify-between text-[10px] uppercase font-bold text-[#e3e0f9]/30 mb-1">
                    <span>Progresso</span>
                    <span>{achievement.progress}/{achievement.maxProgress}</span>
                  </div>
                  <div className="h-2 w-full bg-[#121223] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ delay: 0.3 + idx * 0.05, duration: 0.5 }}
                      className="h-full rounded-full"
                      style={{
                        background: achievement.unlocked
                          ? "linear-gradient(90deg, #d0bcff, #FFB0CD)"
                          : `linear-gradient(90deg, ${rarity.color === "text-[#FFB0CD]" ? "#FFB0CD" : rarity.color === "text-[#deb7ff]" ? "#deb7ff" : "#d0bcff"} 0%, ${rarity.color === "text-[#FFB0CD]" ? "#FFB0CD" : rarity.color === "text-[#deb7ff]" ? "#b86dfd" : "#a078ff"} 100%)`,
                      }}
                    />
                  </div>
                  {achievement.unlocked && (
                    <div className="mt-2 flex items-center justify-center gap-1 text-[#4CAF50]">
                      <CheckCircle className="w-3 h-3" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Concluído</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <MobileNav />
      <div className="h-20 md:hidden" />
    </main>
  );
}
