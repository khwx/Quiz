"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

interface FinalViewProps {
  players: any[];
  playerName: string;
}

export default function FinalView({ players, playerName }: FinalViewProps) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-[#FFD700]/10 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-[#FFB0CD]/10 blur-[100px]" />
      </div>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <Trophy className="w-24 h-24 text-[#FFD700]" />
        </motion.div>
        <div>
          <h2 className="text-4xl font-black text-[#e3e0f9] mb-2" style={{ fontFamily: "Space Grotesk" }}>
            Fim do Jogo!
          </h2>
          <p className="text-[#e3e0f9]/50">Ve a classificação na TV</p>
        </div>
        {players.length > 0 && (
          <div className="glass-panel p-6 w-full max-w-sm">
            <h3 className="text-[10px] text-[#e3e0f9]/40 uppercase tracking-widest mb-3 font-bold">
              Classificação Final
            </h3>
            {players
              .sort((a: any, b: any) => (b.score || 0) - (a.score || 0))
              .slice(0, 5)
              .map((p: any, idx: number) => (
                <div
                  key={p.id}
                  className={`flex items-center gap-3 py-2 ${
                    p.name === playerName ? "text-[#FFB0CD] font-bold" : "text-[#e3e0f9]/60"
                  }`}
                >
                  <span className="text-lg w-8 text-center">
                    {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                  </span>
                  <span className="flex-1 text-left">{p.name}</span>
                  <span className="font-mono">{p.score || 0}</span>
                </div>
              ))}
          </div>
        )}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => (window.location.href = "/")}
          className="px-8 py-3 bg-white/10 hover:bg-white/20 text-[#e3e0f9] rounded-xl transition-colors border border-white/10"
        >
          Voltar ao Início
        </motion.button>
      </motion.div>
    </main>
  );
}
