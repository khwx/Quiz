"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Trophy, ChevronLeft, Shield, Users, Crown, Zap, Loader2 } from "lucide-react";
import MobileNav from "@/components/MobileNav";
import ToastContainer from "@/components/Toast";
import { useToast } from "@/hooks/useToast";
import { supabase } from "@/lib/supabase";
import type { TeamWithMembers } from "@/types";

export default function TeamsRankingPage() {
  const { toasts, show: showToast, dismiss } = useToast();
  const [teams, setTeams] = useState<TeamWithMembers[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeamRanking() {
      try {
        const { data, error } = await supabase
          .from("teams")
          .select("*, team_members(*, profiles(id, username, avatar))")
          .eq("is_active", true)
          .order("total_score", { ascending: false });

        if (error) throw error;
        setTeams((data || []) as TeamWithMembers[]);
      } catch (err: any) {
        showToast("Erro ao carregar ranking de equipas.", "error");
      } finally {
        setLoading(false);
      }
    }
    loadTeamRanking();
  }, [showToast]);

  const top3 = teams.slice(0, 3);
  const rest = teams.slice(3);
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);

  return (
    <main className="min-h-screen relative overflow-hidden pb-24">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[60vw] h-[60vw] bg-primary/10 blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-secondary/10 blur-[150px]" />
      </div>

      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-4xl mx-auto">
          <Link href="/teams" className="text-sm text-on-surface/60 hover:text-on-surface transition-colors flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
            Equipas
          </Link>
          <h1 className="text-lg font-bold text-on-surface">Ranking de Equipas</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : teams.length === 0 ? (
          <div className="text-center mt-16">
            <Trophy className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 text-sm">Ainda não há equipas no ranking.</p>
            <Link href="/teams" className="mt-4 inline-block px-6 py-3 bg-primary text-on-primary font-bold rounded-xl">
              Criar ou Entrar numa Equipa
            </Link>
          </div>
        ) : (
          <>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-on-surface/50 text-center text-sm mb-8"
            >
              As equipas mais poderosas e sincronizadas do QuizVerse.
            </motion.p>

            {top3.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex justify-center items-end gap-4 md:gap-8 mb-12 mt-4 h-72 md:h-80"
              >
                {podiumOrder.map((team, idx) => {
                  const actualRank = teams.findIndex((t) => t.id === team.id) + 1;
                  const isCenter = actualRank === 1;

                  return (
                    <motion.div
                      key={team.id}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + idx * 0.15, type: "spring" }}
                      className={`flex flex-col items-center w-1/3 md:w-48 transition-transform duration-300 hover:scale-105 ${
                        isCenter ? "z-10 -translate-y-6 md:-translate-y-8" : ""
                      }`}
                    >
                      <div className="relative mb-3">
                        {isCenter && (
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-amber-400 animate-bounce text-2xl">
                            👑
                          </span>
                        )}
                        <div
                          className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden flex items-center justify-center text-3xl md:text-4xl bg-surface-container border-2 ${
                            actualRank === 1
                              ? "border-amber-400 shadow-[0_0_15px_rgba(255,215,0,0.4)]"
                              : actualRank === 2
                              ? "border-[#C0C0C0] shadow-[0_0_15px_rgba(192,192,192,0.4)]"
                              : "border-[#CD7F32] shadow-[0_0_15px_rgba(205,127,50,0.4)]"
                          }`}
                        >
                          <Shield className="w-8 h-8 text-primary" />
                        </div>
                        <div
                          className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center border font-bold text-sm ${
                            actualRank === 1
                              ? "bg-amber-400 border-surface text-on-primary"
                              : "bg-surface-container-high border-white/20 text-on-surface"
                          }`}
                        >
                          {actualRank}
                        </div>
                      </div>

                      <div
                        className={`glass-panel w-full rounded-t-xl p-3 text-center ${
                          isCenter ? "border-primary/30 bg-primary/10" : ""
                        }`}
                      >
                        <p className={`font-bold truncate text-sm ${isCenter ? "text-white" : "text-on-surface/80"}`}>
                          {team.name}
                        </p>
                        <p
                          className={`font-extrabold text-sm ${
                            actualRank === 1 ? "text-amber-400 text-base" : "text-primary"
                          }`}
                        >
                          {(team.total_score || 0).toLocaleString()} pts
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
            )}

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-panel p-4 md:p-6 shadow-2xl mb-6 overflow-hidden"
            >
              <div className="flex justify-between items-center px-3 py-2 border-b border-white/10 mb-3">
                <span className="text-[10px] font-bold text-on-surface/50 uppercase tracking-widest">
                  Equipa
                </span>
                <span className="text-[10px] font-bold text-on-surface/50 uppercase tracking-widest">
                  Pontuação Coletiva
                </span>
              </div>
              <div className="space-y-2">
                {teams.map((team, idx) => {
                  const rank = idx + 1;
                  return (
                    <motion.div
                      key={team.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + idx * 0.05 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <span className="w-6 text-center font-bold font-mono text-primary">
                          #{rank}
                        </span>
                        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-white/10 flex items-center justify-center">
                          <Shield className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-base">{team.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-on-surface/50 flex items-center gap-1">
                              <Users className="w-3 h-3" /> {team.team_members?.length || 0}/{team.max_members} membros
                            </span>
                            <span className="text-xs font-mono text-primary/70">• PIN: {team.pin}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-primary text-lg">
                          {(team.total_score || 0).toLocaleString()}
                        </span>
                        <span className="block text-[10px] text-on-surface/40 uppercase tracking-wider">
                          PONTOS
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          </>
        )}
      </div>

      <MobileNav />
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
      <div className="h-20 md:hidden" />
    </main>
  );
}
