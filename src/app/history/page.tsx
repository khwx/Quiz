"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Rocket, FlaskConical, Brain, Globe, Palette, History } from "lucide-react";
import MobileNav from "@/components/MobileNav";

interface GameHistoryItem {
  id: string;
  category: string;
  date: string;
  score: number;
  accuracy: number;
  icon: any;
  color: string;
}

const CATEGORY_ICONS: Record<string, { icon: any; color: string }> = {
  "CULTURA_GERAL": { icon: Globe, color: "#d0bcff" },
  "HISTORIA": { icon: History, color: "#FFD700" },
  "CIENCIA": { icon: FlaskConical, color: "#4CAF50" },
  "MATEMATICA": { icon: Brain, color: "#FFB0CD" },
  "ARTE": { icon: Palette, color: "#deb7ff" },
  "default": { icon: Rocket, color: "#d0bcff" },
};

const MOCK_HISTORY: GameHistoryItem[] = [
  { id: "1", category: "CULTURA_GERAL", date: "12 Out 2023", score: 2850, accuracy: 94, icon: Globe, color: "#d0bcff" },
  { id: "2", category: "CIENCIA", date: "08 Out 2023", score: 3120, accuracy: 98, icon: FlaskConical, color: "#4CAF50" },
  { id: "3", category: "MATEMATICA", date: "02 Out 2023", score: 1950, accuracy: 82, icon: Brain, color: "#FFB0CD" },
  { id: "4", category: "HISTORIA", date: "28 Set 2023", score: 4400, accuracy: 100, icon: History, color: "#FFD700" },
  { id: "5", category: "ARTE", date: "15 Set 2023", score: 1200, accuracy: 65, icon: Palette, color: "#deb7ff" },
];

const FILTERS = ["Tudo", "Vitórias", "Recentes"];

export default function HistoryPage() {
  const [activeFilter, setActiveFilter] = useState("Tudo");
  const [history] = useState(MOCK_HISTORY);

  const filtered = history.filter((item) => {
    if (activeFilter === "Vitórias") return item.accuracy >= 80;
    return true;
  });

  return (
    <main className="min-h-screen relative overflow-hidden pb-24">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-[#d0bcff]/10 blur-[120px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-[#FFB0CD]/10 blur-[100px]" />
      </div>

      <header className="sticky top-0 z-50 bg-[#121223]/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-4xl mx-auto">
          <Link href="/" className="text-sm text-[#e3e0f9]/60 hover:text-[#e3e0f9] transition-colors flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-lg font-bold text-[#e3e0f9]">Histórico de Missões</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto p-6">
        {/* Filter chips */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                activeFilter === filter
                  ? "bg-[#d0bcff]/15 text-[#d0bcff] border border-[#d0bcff]/30 shadow-[0_0_15px_rgba(208,188,255,0.3)]"
                  : "text-[#e3e0f9]/50 border border-white/10 hover:text-[#d0bcff] hover:border-[#d0bcff]/30 transition-all"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* History list */}
        <div className="space-y-3">
          {filtered.map((item, idx) => {
            const catConfig = CATEGORY_ICONS[item.category] || CATEGORY_ICONS.default;
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-panel p-4 rounded-xl flex items-center gap-4 relative overflow-hidden group hover:border-[#d0bcff]/30 transition-all"
              >
                {/* Accent bar */}
                <div
                  className="absolute inset-y-0 left-0 w-1 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"
                  style={{ backgroundColor: item.color }}
                />

                <div
                  className="w-14 h-14 rounded-lg flex items-center justify-center border shrink-0"
                  style={{
                    backgroundColor: `${item.color}20`,
                    borderColor: `${item.color}30`,
                    color: item.color,
                  }}
                >
                  <Icon className="w-7 h-7" />
                </div>

                <div className="flex-grow min-w-0">
                  <h3 className="font-bold text-[#d0bcff] truncate">{item.category.replace(/_/g, " ")}</h3>
                  <p className="text-[#e3e0f9]/50 text-sm">{item.date}</p>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#e3e0f9]/40 uppercase">Pontuação</span>
                    <span className="font-bold text-[#d0bcff]">{item.score.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#e3e0f9]/40 uppercase">Precisão</span>
                    <span className="font-bold text-[#FFB0CD]">{item.accuracy}%</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <History className="w-12 h-12 text-[#e3e0f9]/20 mx-auto mb-4" />
            <p className="text-[#e3e0f9]/50">Sem jogos neste filtro</p>
          </div>
        )}

        <div className="flex justify-center mt-8">
          <button className="flex items-center gap-2 px-6 py-3 glass-panel rounded-full text-[#d0bcff] text-sm font-bold active:scale-95 transition-all">
            Ver mais missões
            <ChevronLeft className="w-4 h-4 rotate-[-90deg]" />
          </button>
        </div>
      </div>

      <MobileNav />
      <div className="h-20 md:hidden" />
    </main>
  );
}
