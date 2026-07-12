"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Copy, Users, Trophy, Swords, Shield, Crown, UserMinus, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import MobileNav from "@/components/MobileNav";
import ToastContainer from "@/components/Toast";
import { useToast } from "@/hooks/useToast";
import type { TeamWithMembers } from "@/types";

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const teamId = params.id as string;
  const [team, setTeam] = useState<TeamWithMembers | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { toasts, show: showToast, dismiss } = useToast();

  useEffect(() => {
    const fetchTeam = async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("*, team_members(*, profiles(id, username, avatar))")
        .eq("id", teamId)
        .single();

      if (error || !data) {
        showToast("Erro ao carregar equipa.", "error");
        setLoading(false);
        return;
      }

      setTeam(data as TeamWithMembers);
      setLoading(false);
    };

    if (teamId) fetchTeam();
  }, [teamId, showToast]);

  const handleCopy = () => {
    if (!team?.pin) return;
    navigator.clipboard.writeText(team.pin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#d0bcff]" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-[#e3e0f9]/50">Equipa não encontrada.</p>
        <Link href="/teams" className="text-[#d0bcff] font-bold">Voltar</Link>
      </div>
    );
  }

  const members = team.team_members || [];
  const memberCount = members.length;

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
            <div className="w-24 h-24 rounded-2xl bg-[#d0bcff]/10 flex items-center justify-center border border-[#d0bcff]/30">
              <Users className="w-12 h-12 text-[#d0bcff]" />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "Space Grotesk" }}>{team.name}</h2>
              <p className="text-sm text-[#e3e0f9]/60">{memberCount} / {team.max_members} membros</p>
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
              <span className="text-lg font-bold text-[#d0bcff] tracking-widest" style={{ fontFamily: "Space Grotesk" }}>{team.pin}</span>
              <button onClick={handleCopy} className="text-[#e3e0f9]/60 hover:text-white transition-colors">
                {copied ? <CheckCircle className="w-4 h-4 text-[#4CAF50]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Members */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2" style={{ fontFamily: "Space Grotesk" }}>
              <Users className="w-5 h-5 text-[#d0bcff]" />
              Tripulação
            </h3>
            <span className="text-xs text-[#e3e0f9]/50">{memberCount} / {team.max_members} Pilotos</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {members.map((member) => (
              <div key={member.id} className="glass-panel rounded-xl p-4 flex items-center gap-3 relative overflow-hidden">
                {member.role === "host" && <div className="absolute top-0 left-0 w-1 h-full bg-[#FFB0CD]" />}
                <div className="w-12 h-12 rounded-full bg-[#1e1e30] border-2 border-white/10 flex items-center justify-center">
                  <span className="text-lg">{member.profiles?.avatar || "🧑‍🚀"}</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white">{member.profiles?.username || "Jogador"}</p>
                  <p className={`text-xs ${member.role === "host" ? "text-[#FFB0CD]" : "text-[#e3e0f9]/50"}`}>
                    {member.role === "host" ? "Líder da Tripulação" : "Membro"}
                  </p>
                </div>
              </div>
            ))}
            {members.length === 0 && (
              <p className="text-[#e3e0f9]/30 text-sm col-span-2">Nenhum membro ainda.</p>
            )}
          </div>
        </motion.div>

        {/* Leave Team */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => {
            if (confirm("Tens a certeza que queres sair desta equipa?")) {
              router.push("/teams");
            }
          }}
          className="w-full py-4 rounded-xl border border-[#FF6B6B]/30 text-[#FF6B6B] text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#FF6B6B]/5 transition-colors"
        >
          <UserMinus className="w-4 h-4" />
          Sair da Equipa
        </motion.button>
      </div>

      <MobileNav />
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
      <div className="h-20 md:hidden" />
    </main>
  );
}
