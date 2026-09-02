"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Rocket, Users, Trophy, ChevronLeft, Zap, Shield, Crown } from "lucide-react";
import MobileNav from "@/components/MobileNav";

const MODES = [
  {
    id: "solo",
    title: "Missão Solo",
    description: "Treina os teus conhecimentos, usa power-ups e sobe de nível ao teu próprio ritmo.",
    icon: Rocket,
    players: "12k Pilotos",
    duration: "⚡ ~3 min",
    format: "👤 1 Jogador",
    tag: "Power-ups Ativos",
    gradient: "from-primary to-primary-container",
    color: "#d0bcff",
    bgGlow: "bg-primary/20",
    buttonGradient: "from-amber-400 to-primary",
    href: "/play?solo=1",
  },
  {
    id: "team",
    title: "Batalha de Tripulação",
    description: "Junta-te aos teus amigos, responde em conjunto e liderem o ranking galáctico.",
    icon: Users,
    players: "8k Equipas",
    duration: "⏱️ ~5 min",
    format: "👥 2 a 4 Jogadores",
    tag: "Pontuação Coletiva",
    gradient: "from-primary to-primary-container",
    color: "#d0bcff",
    bgGlow: "bg-primary/20",
    buttonGradient: "from-primary to-primary-container",
    href: "/teams",
    featured: true,
  },
  {
    id: "tournament",
    title: "Nebula Championship",
    description: "Participa em torneios eliminatórios ao vivo e conquista troféus e prémios estelares.",
    icon: Trophy,
    players: "AO VIVO",
    duration: "🏆 Por Rondas",
    format: "⚔️ Competição Aberta",
    tag: "Pódio & Prémios",
    gradient: "from-secondary to-red-500",
    color: "#FFB0CD",
    bgGlow: "bg-secondary/20",
    buttonGradient: "border-secondary/50",
    href: "/tournaments",
    live: true,
  },
];

export default function ModesPage() {
  return (
    <main className="min-h-screen relative overflow-hidden pb-24">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-on-tertiary blur-[150px] opacity-40 rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-secondary-container blur-[150px] opacity-30 rounded-full" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-on-primary-fixed blur-[150px] opacity-40 rounded-full" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-4xl mx-auto">
          <Link href="/" className="text-sm text-on-surface/60 hover:text-on-surface transition-colors flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-lg font-bold text-on-surface">Modo de Jogo</h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto p-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl font-bold text-on-surface tracking-tight mb-2" style={{ fontFamily: "Space Grotesk" }}>
            MODO DE JOGO
          </h2>
          <p className="text-on-surface/60 text-lg">Escolhe o teu destino e domina a arena galáctica.</p>
        </motion.div>

        {/* Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MODES.map((mode, idx) => {
            const Icon = mode.icon;
            return (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`glass-panel p-8 rounded-2xl flex flex-col items-center text-center relative overflow-hidden group ${
                  mode.featured ? "border-t-2 border-primary/40 md:scale-105 md:z-10" : ""
                }`}
              >
                {/* Shimmer on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                {/* Icon */}
                <div className="mb-6 relative">
                  <div className={`absolute inset-0 ${mode.bgGlow} blur-xl rounded-full scale-150`} />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: idx * 0.5 }}
                  >
                    <Icon className="w-16 h-16 relative z-10" style={{ color: mode.color }} />
                  </motion.div>
                </div>

                {/* Badges & Legends */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    mode.live
                      ? "bg-secondary/15 text-secondary border border-secondary/30 animate-pulse"
                      : "bg-white/5 text-on-surface/70 border border-white/10"
                  }`}>
                    {mode.live && <Zap className="w-3 h-3 inline mr-1" />}
                    {mode.players}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
                    {mode.duration}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/5 text-on-surface/60 border border-white/5">
                    {mode.format}
                  </span>
                </div>

                {/* Title & description */}
                <h3 className="text-xl font-bold text-on-surface mb-2" style={{ fontFamily: "Space Grotesk" }}>
                  {mode.title}
                </h3>
                <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-2">
                  ✦ {mode.tag}
                </span>
                <p className="text-sm text-on-surface/50 mb-6 leading-relaxed">{mode.description}</p>

                {/* Button */}
                <div className="mt-auto pt-4 w-full">
                  <Link href={mode.href}>
                    {mode.live ? (
                      <button className="w-full py-3 bg-background border border-secondary/50 text-secondary font-bold rounded-lg hover:bg-secondary/10 active:scale-95 transition-all uppercase tracking-widest text-sm">
                        Inscrever Agora
                      </button>
                    ) : (
                      <button className={`w-full py-3 bg-gradient-to-r ${mode.buttonGradient} text-[#121223] font-bold rounded-lg shadow-lg active:scale-95 transition-transform uppercase tracking-widest text-sm`}>
                        {mode.id === "solo" ? "Lançar Missão" : "Reunir Tripulação"}
                      </button>
                    )}
                  </Link>
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
