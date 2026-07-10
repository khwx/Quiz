"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Rocket, Settings, RotateCcw, Map } from "lucide-react";

interface PodiumPlayer {
  rank: number;
  name: string;
  score: number;
  avatar: string;
}

const podiumData: PodiumPlayer[] = [
  { rank: 1, name: "Você", score: 2890, avatar: "" },
  { rank: 2, name: "Léo", score: 2450, avatar: "" },
  { rank: 3, name: "Beto", score: 2120, avatar: "" },
];

const stats = [
  { icon: "timer", label: "Tempo", value: "04:12", color: "text-primary" },
  { icon: "bolt", label: "Combo Máx.", value: "x12", color: "text-secondary" },
  { icon: "verified", label: "Precisão", value: "94%", color: "text-tertiary" },
  { icon: "military_tech", label: "Rank", value: "#01", color: "text-error" },
];

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-transparent to-background">
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between px-4 h-16 max-w-screen-xl mx-auto">
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-primary" />
            <h1 className="font-display text-lg font-bold text-primary tracking-tighter">AstroQ</h1>
          </div>
          <Link href="/settings" className="text-on-surface-variant hover:text-primary transition-colors active:scale-95">
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </header>

      <main className="flex-grow pt-24 pb-32 px-4 max-w-md mx-auto w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="font-display text-4xl font-bold text-on-background mb-2">
            Missão Cumprida!
          </h2>
          <p className="text-on-surface-variant text-sm">
            Você explorou novos horizontes hoje.
          </p>
        </motion.div>

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
                <span className="text-2xl">🥈</span>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-surface-container-high rounded-full w-6 h-6 flex items-center justify-center border border-white/10">
                <span className="text-[10px] font-bold text-on-surface">2</span>
              </div>
            </div>
            <div className="w-full glass-panel h-20 rounded-t-lg flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-on-surface-variant">{podiumData[1].name}</span>
              <span className="text-sm font-bold text-secondary">{podiumData[1].score.toLocaleString()}</span>
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
                <span className="text-4xl">🚀</span>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-primary rounded-full w-8 h-8 flex items-center justify-center border-2 border-background">
                <span className="text-xs font-bold text-on-primary">1</span>
              </div>
            </div>
            <div className="w-full glass-panel h-32 rounded-t-lg flex flex-col items-center justify-center border-primary/40 bg-primary/10">
              <span className="text-sm font-bold text-primary">{podiumData[0].name}</span>
              <span className="text-lg font-bold text-on-primary-container">
                {podiumData[0].score.toLocaleString()}
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
                <span className="text-2xl">🥉</span>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-surface-container-high rounded-full w-6 h-6 flex items-center justify-center border border-white/10">
                <span className="text-[10px] font-bold text-on-surface">3</span>
              </div>
            </div>
            <div className="w-full glass-panel h-16 rounded-t-lg flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-on-surface-variant">{podiumData[2].name}</span>
              <span className="text-sm font-bold text-tertiary">{podiumData[2].score.toLocaleString()}</span>
            </div>
          </motion.div>
        </div>

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

        {/* Level Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass-panel p-6 rounded-2xl mb-8 relative overflow-hidden"
        >
          <div className="flex justify-between items-end mb-4">
            <div>
              <h3 className="font-display text-lg font-bold text-primary mb-1">Level 14</h3>
              <p className="text-sm text-on-surface-variant">Próximo: Comandante Estelar</p>
            </div>
            <p className="text-xs font-bold text-primary">+450 XP</p>
          </div>
          <div className="w-full bg-surface-container-highest h-3 rounded-full overflow-hidden">
            <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-primary to-secondary relative">
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] font-bold text-on-surface-variant">3.400 XP</span>
            <span className="text-[10px] font-bold text-on-surface-variant">4.000 XP</span>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-tertiary-container to-primary-container text-white font-bold text-lg shadow-[0_4px_20px_rgba(160,120,255,0.4)] active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Jogar Novamente
          </motion.button>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
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
