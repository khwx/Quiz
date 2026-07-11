"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Timer, Trophy, Users, Star, Crown, Medal, Zap } from "lucide-react";
import MobileNav from "@/components/MobileNav";

interface Participant {
  id: string;
  name: string;
  rank: number;
  points: number;
  title: string;
}

const MOCK_STANDINGS: Participant[] = [
  { id: "1", name: "Nova_Pilot", rank: 1, points: 12450, title: "Líder Galáctico" },
  { id: "2", name: "Quant_X", rank: 2, points: 11920, title: "Explorador" },
  { id: "3", name: "Zero_G", rank: 3, points: 11105, title: "Veterano" },
  { id: "4", name: "Star_L", rank: 4, points: 10800, title: "Navegador" },
  { id: "5", name: "Pixel_D", rank: 5, points: 9950, title: "Recruta" },
];

const RECENT_PARTICIPANTS = [
  { id: "1", name: "Star_L" },
  { id: "2", name: "Pixel_D" },
  { id: "3", name: "Quant_X" },
  { id: "4", name: "Zero_G" },
  { id: "5", name: "Astro_K" },
];

const RANK_COLORS = ["text-[#FFD700]", "text-[#C0C0C0]", "text-[#CD7F32]", "text-[#e3e0f9]/60", "text-[#e3e0f9]/40"];
const BORDER_COLORS = ["border-[#FFD700]", "border-[#C0C0C0]", "border-[#CD7F32]", "border-white/10", "border-white/10"];

export default function TournamentDetailPage() {
  const [timeLeft, setTimeLeft] = useState({ h: 4, m: 12, s: 43 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 0; m = 0; s = 0; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <main className="min-h-screen relative overflow-hidden pb-24">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#4a007f] blur-[150px] opacity-40 rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#aa0266] blur-[150px] opacity-30 rounded-full" />
      </div>

      <header className="sticky top-0 z-50 bg-[#121223]/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-4xl mx-auto">
          <Link href="/tournaments" className="text-sm text-[#e3e0f9]/60 hover:text-[#e3e0f9] transition-colors flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-lg font-bold text-[#e3e0f9]">Torneio Ativo</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto p-6 space-y-6">
        {/* Title + Timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center gap-2">
            <span className="bg-[#FF6B6B] text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse uppercase tracking-widest">LIVE</span>
            <span className="text-[#d0bcff] text-xs uppercase tracking-widest font-bold">Série Estelar</span>
          </div>
          <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "Space Grotesk" }}>Nebula Championship</h2>
          <div className="flex items-center gap-3 bg-[#1e1e30]/50 backdrop-blur-sm rounded-xl p-3 w-fit border border-white/5">
            <Timer className="w-5 h-5 text-[#d0bcff]" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-[#e3e0f9]/50 font-medium tracking-tighter">Termina em</span>
              <span className="text-lg font-bold text-[#d0bcff]" style={{ fontFamily: "Space Grotesk" }}>
                {pad(timeLeft.h)}:{pad(timeLeft.m)}:{pad(timeLeft.s)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Prize Pool */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-3xl p-6 border-2 border-[#d0bcff]/30"
        >
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#d0bcff]/20 blur-3xl rounded-full" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <span className="text-[#d0bcff] text-xs uppercase tracking-widest font-bold mb-1">Prémio Total</span>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-bold text-white" style={{ fontFamily: "Space Grotesk" }}>50,000</span>
              <span className="text-lg font-bold text-[#FFB0CD] pb-2">SC</span>
            </div>
            <p className="text-[#e3e0f9]/50 text-sm mt-2">Stellar Coins & Skins Exclusivas</p>
            <div className="mt-6 w-full h-2 bg-[#121223] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "72%" }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="h-full bg-gradient-to-r from-[#d0bcff] to-[#FFB0CD] rounded-full shadow-[0_0_10px_rgba(208,188,255,0.5)]"
              />
            </div>
            <div className="flex justify-between w-full mt-2">
              <span className="text-[10px] text-[#e3e0f9]/30 font-medium uppercase">Preenchimento</span>
              <span className="text-[10px] text-[#d0bcff] font-bold">72% Vagas</span>
            </div>
          </div>
        </motion.section>

        {/* Standings */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-4"
        >
          <div className="flex justify-between items-end">
            <h3 className="text-lg font-bold text-white" style={{ fontFamily: "Space Grotesk" }}>Classificação</h3>
            <button className="text-[#d0bcff] text-xs uppercase font-bold hover:underline">Ver Todos</button>
          </div>
          <div className="flex flex-col gap-2">
            {MOCK_STANDINGS.map((p, idx) => (
              <div
                key={p.id}
                className={`glass-panel flex items-center justify-between p-4 rounded-2xl border-l-4 ${BORDER_COLORS[idx]}`}
              >
                <div className="flex items-center gap-4">
                  <span className={`text-lg font-bold w-6 ${RANK_COLORS[idx]}`} style={{ fontFamily: "Space Grotesk" }}>
                    {p.rank}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-[#1e1e30] border border-white/10 flex items-center justify-center">
                    {p.rank === 1 ? "👑" : p.rank === 2 ? "🥈" : p.rank === 3 ? "🥉" : "🧑‍🚀"}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-medium">{p.name}</span>
                    <span className="text-[10px] text-[#e3e0f9]/40 uppercase">{p.title}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-white font-bold" style={{ fontFamily: "Space Grotesk" }}>{p.points.toLocaleString()}</span>
                  <span className="text-[10px] text-[#e3e0f9]/40 uppercase font-bold">PTS</span>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Recent Participants */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-3"
        >
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">Participantes Recentes</h3>
          <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
            {RECENT_PARTICIPANTS.map((p) => (
              <div key={p.id} className="flex-none flex flex-col items-center gap-1">
                <div className="w-14 h-14 rounded-full border-2 border-[#d0bcff]/40 p-1">
                  <div className="w-full h-full rounded-full bg-[#1e1e30] flex items-center justify-center">
                    <span className="text-lg">🧑‍🚀</span>
                  </div>
                </div>
                <span className="text-[10px] text-[#e3e0f9]/50">{p.name}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Join Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button className="w-full py-4 bg-gradient-to-r from-[#d0bcff] to-[#FFB0CD] text-[#121223] font-bold rounded-xl shadow-lg active:scale-95 transition-transform uppercase tracking-widest text-sm">
            Inscrever Agora
          </button>
        </motion.div>
      </div>

      <MobileNav />
      <div className="h-20 md:hidden" />
    </main>
  );
}
