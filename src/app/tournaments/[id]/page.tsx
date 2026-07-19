"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Trophy, Users, Crown, Medal, Loader2, Target, Swords } from "lucide-react";
import { supabase } from "@/lib/supabase";
import MobileNav from "@/components/MobileNav";
import ToastContainer from "@/components/Toast";
import { useToast } from "@/hooks/useToast";
import TournamentBracket from "@/components/tv/TournamentBracket";
import type { TournamentWithTeams } from "@/types";

export default function TournamentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tournamentId = params.id as string;
  const [tournament, setTournament] = useState<TournamentWithTeams | null>(null);
  const [loading, setLoading] = useState(true);
  const { toasts, show: showToast, dismiss } = useToast();

  useEffect(() => {
    const fetchTournament = async () => {
      const { data, error } = await supabase
        .from("tournaments")
        .select("*, tournament_teams(*, teams(id, name, pin))")
        .eq("id", tournamentId)
        .single();

      if (error || !data) {
        showToast("Erro ao carregar torneio.", "error");
        setLoading(false);
        return;
      }

      setTournament(data as TournamentWithTeams);
      setLoading(false);
    };

    if (tournamentId) fetchTournament();
  }, [tournamentId, showToast]);

  const statusLabels: Record<string, string> = {
    LOBBY: "A aguardar equipas",
    QUALIFYING: "Fase de Qualificação",
    FINAL: "Final",
    FINISHED: "Terminado",
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#d0bcff]" />
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-[#e3e0f9]/50">Torneio não encontrado.</p>
        <Link href="/tournaments" className="text-[#d0bcff] font-bold">Voltar</Link>
      </div>
    );
  }

  const teams = tournament.tournament_teams || [];
  const sortedTeams = [...teams].sort((a, b) => (b.score || 0) - (a.score || 0));
  const teamCount = teams.length;
  const maxTeams = tournament.max_teams || 8;

  return (
    <main className="min-h-screen relative overflow-hidden pb-24">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[60vw] h-[60vw] bg-[#d0bcff]/10 blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-[#FFB0CD]/10 blur-[150px]" />
      </div>

      <header className="sticky top-0 z-50 bg-[#121223]/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-4xl mx-auto">
          <Link href="/tournaments" className="text-sm text-[#e3e0f9]/60 hover:text-[#e3e0f9] transition-colors flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-lg font-bold text-[#e3e0f9]">Detalhe do Torneio</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto p-6 space-y-6">
        {/* Tournament Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-2xl p-6 text-center"
        >
          <Trophy className="w-12 h-12 text-[#FFD700] mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "Space Grotesk" }}>
            {tournament.name}
          </h2>
          <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
            tournament.status === "FINISHED"
              ? "bg-white/10 text-[#e3e0f9]/50"
              : "bg-[#FFD700]/20 text-[#FFD700]"
          }`}>
            {statusLabels[tournament.status] || tournament.status}
          </span>
          <p className="text-sm text-[#e3e0f9]/50 mt-3">
            {teamCount} / {maxTeams} equipas inscritas
          </p>
          <div className="w-full bg-white/10 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#FFD700] to-[#FFB0CD] rounded-full transition-all"
              style={{ width: `${(teamCount / maxTeams) * 100}%` }}
            />
          </div>
        </motion.div>

        {/* Standings */}
        {sortedTeams.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel rounded-2xl p-6"
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2" style={{ fontFamily: "Space Grotesk" }}>
              <Medal className="w-5 h-5 text-[#FFD700]" />
              Classificação
            </h3>
            <div className="space-y-3">
              {sortedTeams.map((tt, idx) => (
                <div key={tt.id} className={`flex items-center justify-between p-3 rounded-xl ${
                  idx === 0 ? "bg-[#FFD700]/10 border border-[#FFD700]/20" : "bg-white/5"
                }`}>
                  <div className="flex items-center gap-3">
                    <span className={`text-lg font-bold w-8 text-center ${
                      idx === 0 ? "text-[#FFD700]" : idx === 1 ? "text-[#C0C0C0]" : idx === 2 ? "text-[#CD7F32]" : "text-[#e3e0f9]/40"
                    }`}>
                      #{idx + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      {idx === 0 && <Crown className="w-4 h-4 text-[#FFD700]" />}
                      <span className="font-bold text-white">{tt.teams?.name || "Equipa"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {tt.score !== undefined && tt.score > 0 && (
                      <span className="text-[#FFD700] font-bold">{tt.score.toLocaleString()} pts</span>
                    )}
                    <span className="text-[#e3e0f9]/30 text-xs font-mono">{tt.teams?.pin}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {sortedTeams.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel rounded-2xl p-8 text-center"
          >
            <Users className="w-12 h-12 text-[#e3e0f9]/20 mx-auto mb-3" />
            <p className="text-[#e3e0f9]/50">Nenhuma equipa inscrita ainda.</p>
          </motion.div>
        )}

        {/* Tournament Bracket */}
        {sortedTeams.length >= 2 && tournament.status !== "LOBBY" && (() => {
          const teamCount = sortedTeams.length;
          const totalRounds = Math.ceil(Math.log2(teamCount));
          const matchesPerRound = [];
          let matchId = 0;

          for (let round = 1; round <= totalRounds; round++) {
            const teamsInRound = Math.pow(2, totalRounds - round + 1);
            const matchesInRound = teamsInRound / 2;
            matchesPerRound.push(matchesInRound);
          }

          const bracketMatches = [];
          for (let round = 1; round <= totalRounds; round++) {
            const matchesInRound = matchesPerRound[round - 1];
            for (let pos = 0; pos < matchesInRound; pos++) {
              const team1Idx = round === 1 ? pos * 2 : undefined;
              const team2Idx = round === 1 ? pos * 2 + 1 : undefined;

              bracketMatches.push({
                id: `match-${matchId++}`,
                round,
                position: pos,
                team1: team1Idx !== undefined ? {
                  id: sortedTeams[team1Idx]?.teams?.name || `team-${team1Idx}`,
                  name: sortedTeams[team1Idx]?.teams?.name || "TBD",
                  score: sortedTeams[team1Idx]?.score,
                  eliminated: sortedTeams[team1Idx]?.eliminated,
                } : undefined,
                team2: team2Idx !== undefined ? {
                  id: sortedTeams[team2Idx]?.teams?.name || `team-${team2Idx}`,
                  name: sortedTeams[team2Idx]?.teams?.name || "TBD",
                  score: sortedTeams[team2Idx]?.score,
                  eliminated: sortedTeams[team2Idx]?.eliminated,
                } : undefined,
                isBye: false,
              });
            }
          }

          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glass-panel rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2" style={{ fontFamily: "Space Grotesk" }}>
                <Swords className="w-5 h-5 text-[#FFB0CD]" />
                Bracket do Torneio
              </h3>
              <TournamentBracket
                teams={sortedTeams.map((tt) => ({
                  id: tt.teams?.name || tt.id,
                  name: tt.teams?.name || "Equipa",
                  score: tt.score,
                  eliminated: tt.eliminated,
                }))}
                currentRound={tournament.current_round || 1}
                totalRounds={totalRounds}
                matches={bracketMatches}
              />
            </motion.div>
          );
        })()}

        {/* Tournament Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="glass-panel rounded-2xl p-4 text-center">
            <span className="text-xs text-[#e3e0f9]/40 uppercase font-bold">Equipas</span>
            <p className="text-2xl font-bold text-white" style={{ fontFamily: "Space Grotesk" }}>{teamCount}</p>
          </div>
          <div className="glass-panel rounded-2xl p-4 text-center">
            <span className="text-xs text-[#e3e0f9]/40 uppercase font-bold">Estado</span>
            <p className="text-lg font-bold text-[#FFD700]">{statusLabels[tournament.status] || tournament.status}</p>
          </div>
        </motion.div>

        {/* Tournament Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2" style={{ fontFamily: "Space Grotesk" }}>
            <Target className="w-5 h-5 text-[#FFB0CD]" />
            Definições
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <span className="text-xs text-[#e3e0f9]/40 uppercase font-bold">Tempo por Pergunta</span>
              <p className="text-xl font-bold text-white">{tournament.settings?.timer || 20}s</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <span className="text-xs text-[#e3e0f9]/40 uppercase font-bold">Perguntas</span>
              <p className="text-xl font-bold text-white">{tournament.settings?.questions || 10}</p>
            </div>
          </div>
          {tournament.settings?.blind_mode && (
            <div className="mt-4 p-3 bg-[#d0bcff]/10 border border-[#d0bcff]/30 rounded-xl text-[#d0bcff] text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.292-4.292M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Modo Cego ativado — o anfitrião não vê as respostas dos jogadores
            </div>
          )}
        </motion.div>
      </div>

      <MobileNav />
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
      <div className="h-20 md:hidden" />
    </main>
  );
}
