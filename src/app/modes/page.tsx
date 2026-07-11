"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Rocket, Users, Trophy, ChevronLeft, Zap, Shield, Crown } from "lucide-react";
import MobileNav from "@/components/MobileNav";

const MODES = [
  {
    id: "solo",
    title: "Missão Solo",
    description: "Treina os teus conhecimentos e sobe de nível sozinho no vácuo.",
    icon: Rocket,
    players: "12k Pilotos",
    gradient: "from-[#d0bcff] to-[#a078ff]",
    color: "#d0bcff",
    bgGlow: "bg-[#d0bcff]/20",
    buttonGradient: "from-[#FFD700] to-[#d0bcff]",
    href: "/play",
  },
  {
    id: "team",
    title: "Batalha de Tripulação",
    description: "Junta-te aos teus amigos e dominem as galáxias em conjunto.",
    icon: Users,
    players: "8k Equipas",
    gradient: "from-[#d0bcff] to-[#a078ff]",
    color: "#d0bcff",
    bgGlow: "bg-[#d0bcff]/20",
    buttonGradient: "from-[#d0bcff] to-[#a078ff]",
    href: "/teams",
    featured: true,
  },
  {
    id: "tournament",
    title: "Nebula Championship",
    description: "Participa em eventos sazonais por prémios estelares exclusivos.",
    icon: Trophy,
    players: "AO VIVO",
    gradient: "from-[#FFB0CD] to-[#FF6B6B]",
    color: "#FFB0CD",
    bgGlow: "bg-[#FFB0CD]/20",
    buttonGradient: "border-[#FFB0CD]/50",
    href: "/tournaments",
    live: true,
  },
];

export default function ModesPage() {
  return (
    <main className="min-h-screen relative overflow-hidden pb-24">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#4a007f] blur-[150px] opacity-40 rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#aa0266] blur-[150px] opacity-30 rounded-full" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-[#23005c] blur-[150px] opacity-40 rounded-full" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#121223]/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-4xl mx-auto">
          <Link href="/" className="text-sm text-[#e3e0f9]/60 hover:text-[#e3e0f9] transition-colors flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-lg font-bold text-[#e3e0f9]">Modo de Jogo</h1>
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
          <h2 className="text-4xl font-bold text-[#e3e0f9] tracking-tight mb-2" style={{ fontFamily: "Space Grotesk" }}>
            MODO DE JOGO
          </h2>
          <p className="text-[#e3e0f9]/60 text-lg">Escolhe o teu destino e domina a arena galáctica.</p>
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
                  mode.featured ? "border-t-2 border-[#d0bcff]/40 md:scale-105 md:z-10" : ""
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

                {/* Player count / Live badge */}
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${
                  mode.live
                    ? "bg-[#FFB0CD]/10 text-[#FFB0CD] animate-pulse"
                    : "bg-white/5 text-[#e3e0f9]/60"
                }`}>
                  {mode.live && <Zap className="w-3 h-3 inline mr-1" />}
                  {mode.players}
                </span>

                {/* Title & description */}
                <h3 className="text-xl font-bold text-[#e3e0f9] mb-3" style={{ fontFamily: "Space Grotesk" }}>
                  {mode.title}
                </h3>
                <p className="text-sm text-[#e3e0f9]/50 mb-6 leading-relaxed">{mode.description}</p>

                {/* Button */}
                <div className="mt-auto pt-4 w-full">
                  <Link href={mode.href}>
                    {mode.live ? (
                      <button className="w-full py-3 bg-[#121223] border border-[#FFB0CD]/50 text-[#FFB0CD] font-bold rounded-lg hover:bg-[#FFB0CD]/10 active:scale-95 transition-all uppercase tracking-widest text-sm">
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
