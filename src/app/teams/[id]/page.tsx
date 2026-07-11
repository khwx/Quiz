"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Copy, Users, Trophy, Swords, Shield, Crown, UserMinus, CheckCircle } from "lucide-react";
import MobileNav from "@/components/MobileNav";

interface TeamMember {
  id: string;
  name: string;
  role: "leader" | "member";
  online: boolean;
}

const MOCK_MEMBERS: TeamMember[] = [
  { id: "1", name: "Commander Nova", role: "leader", online: true },
  { id: "2", name: "Star_L", role: "member", online: true },
  { id: "3", name: "Quant_X", role: "member", online: false },
  { id: "4", name: "Pixel_D", role: "member", online: true },
  { id: "5", name: "Zero_G", role: "member", online: false },
];

const MOCK_MATCHES = [
  { id: "1", opponent: "Void Hunters", result: "win", score: "5-3", date: "Há 2h" },
  { id: "2", opponent: "Star Academy", result: "win", score: "7-4", date: "Ontem" },
  { id: "3", opponent: "Quantum League", result: "loss", score: "4-6", date: "Há 3 dias" },
];

export default function TeamDetailPage() {
  const [copied, setCopied] = useState(false);
  const inviteCode = "ASTRO-X92";

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen relative overflow-hidden pb-24">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[60vw] h-[60vw] bg-[#d0bcff]/10 blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-[#FFB0CD]/10 blur-[150px]" />
      </div>

      <header className="sticky top-0 z-50 bg-[#121223]/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-4xl mx-auto">
          <Link href="/teams" className="text-sm text-[#e3e0f9]/60 hover:text-[#e3e0f9] transition-colors flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-lg font-bold text-[#e3e0f9]">Detalhe da Equipa</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto p-6 space-y-6">
        {/* Team Header + Invite */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 glass-panel rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6"
          >
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-[#d0bcff]/10 flex items-center justify-center border border-[#d0bcff]/30">
                <Users className="w-12 h-12 text-[#d0bcff]" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-[#FFB0CD] text-[#121223] px-3 py-1 rounded-full text-xs font-bold">
                RANK #12
              </div>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "Space Grotesk" }}>Nebula Rangers</h2>
              <p className="text-sm text-[#e3e0f9]/60">Explorando as fronteiras do conhecimento galáctico. Unidos pelo vácuo, vencemos pela inteligência.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel rounded-2xl p-6 flex flex-col items-center text-center"
          >
            <span className="text-xs text-[#e3e0f9]/60 uppercase tracking-widest font-bold mb-3">Código de Convite</span>
            <div className="bg-[#1e1e30] px-4 py-3 rounded-xl border border-white/5 w-full flex items-center justify-between mb-4">
              <span className="text-lg font-bold text-[#d0bcff] tracking-widest" style={{ fontFamily: "Space Grotesk" }}>{inviteCode}</span>
              <button onClick={handleCopy} className="text-[#e3e0f9]/60 hover:text-white transition-colors">
                {copied ? <CheckCircle className="w-4 h-4 text-[#4CAF50]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <button className="w-full py-3 bg-[#d0bcff] text-[#121223] font-bold rounded-lg text-sm active:scale-95 transition-transform">
              Convidar Membro
            </button>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-4"
        >
          {[
            { icon: Trophy, label: "Vitórias", value: "142", color: "#4CAF50" },
            { icon: Swords, label: "Partidas Totais", value: "250", color: "#d0bcff" },
            { icon: Shield, label: "Taxa de Vitória", value: "56%", color: "#FFB0CD" },
          ].map((stat) => (
            <div key={stat.label} className="glass-panel rounded-2xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}10` }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-xs text-[#e3e0f9]/50">{stat.label}</p>
                <p className="text-lg font-bold text-white" style={{ fontFamily: "Space Grotesk" }}>{stat.value}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Members */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2" style={{ fontFamily: "Space Grotesk" }}>
              <Users className="w-5 h-5 text-[#d0bcff]" />
              Tripulação
            </h3>
            <span className="text-xs text-[#e3e0f9]/50">{MOCK_MEMBERS.length} / 20 Pilotos</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {MOCK_MEMBERS.map((member) => (
              <div key={member.id} className="glass-panel rounded-xl p-4 flex items-center gap-3 relative overflow-hidden">
                {member.role === "leader" && <div className="absolute top-0 left-0 w-1 h-full bg-[#FFB0CD]" />}
                <div className="w-12 h-12 rounded-full bg-[#1e1e30] border-2 border-white/10 flex items-center justify-center">
                  <span className="text-lg">{member.role === "leader" ? "👑" : "🧑‍🚀"}</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white">{member.name}</p>
                  <p className={`text-xs ${member.role === "leader" ? "text-[#FFB0CD]" : "text-[#e3e0f9]/50"}`}>
                    {member.role === "leader" ? "Líder da Tripulação" : "Membro"}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${member.online ? "bg-[#4CAF50] animate-pulse" : "bg-white/20"}`} />
                  <span className="text-[10px] text-[#e3e0f9]/40 uppercase font-bold">{member.online ? "Online" : "Offline"}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Matches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2" style={{ fontFamily: "Space Grotesk" }}>
            <Swords className="w-5 h-5 text-[#d0bcff]" />
            Partidas Recentes
          </h3>
          <div className="space-y-3">
            {MOCK_MATCHES.map((match) => (
              <div key={match.id} className="glass-panel rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-8 rounded-full ${match.result === "win" ? "bg-[#4CAF50]" : "bg-[#FF6B6B]"}`} />
                  <div>
                    <p className="font-bold text-white">vs {match.opponent}</p>
                    <p className="text-xs text-[#e3e0f9]/50">{match.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${match.result === "win" ? "text-[#4CAF50]" : "text-[#FF6B6B]"}`} style={{ fontFamily: "Space Grotesk" }}>
                    {match.score}
                  </p>
                  <p className={`text-xs uppercase font-bold ${match.result === "win" ? "text-[#4CAF50]" : "text-[#FF6B6B]"}`}>
                    {match.result === "win" ? "Vitória" : "Derrota"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Leave Team */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full py-4 rounded-xl border border-[#FF6B6B]/30 text-[#FF6B6B] text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#FF6B6B]/5 transition-colors"
        >
          <UserMinus className="w-4 h-4" />
          Sair da Equipa
        </motion.button>
      </div>

      <MobileNav />
      <div className="h-20 md:hidden" />
    </main>
  );
}
