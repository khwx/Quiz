"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Trophy, Users, Crown, Medal, Loader2, Target, Gift, Globe, ShieldCheck, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";
import MobileNav from "@/components/MobileNav";
import ToastContainer from "@/components/Toast";
import { useToast } from "@/hooks/useToast";
import type { TournamentWithTeams, Team } from "@/types";

export default function TournamentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tournamentId = params.id as string;
  const [tournament, setTournament] = useState<TournamentWithTeams | null>(null);
  const [loading, setLoading] = useState(true);
  const [myTeams, setMyTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [joining, setJoining] = useState(false);
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

  useEffect(() => {
    const loadMyTeams = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("team_members")
        .select("team_id, teams(id, name, pin)")
        .eq("user_id", user.id);
      const teams = (data || []).map((m) => m.teams?.[0]).filter(Boolean) as Team[];
      setMyTeams(teams);
      if (teams.length === 1) setSelectedTeamId(teams[0].id);
    };
    loadMyTeams();
  }, []);

  const joinPublicTournament = async () => {
    if (!tournament || !selectedTeamId) {
      showToast("Selecciona uma equipa para entrar.", "error");
      return;
    }
    setJoining(true);
    try {
      const alreadyJoined = tournament.tournament_teams?.some((tt) => tt.team_id === selectedTeamId);
      if (alreadyJoined) {
        showToast("A tua equipa já está neste torneio.", "error");
        setJoining(false);
        return;
      }
      const { error } = await supabase
        .from("tournament_teams")
        .insert({ tournament_id: tournament.id, team_id: selectedTeamId });
      if (error) throw error;
      showToast("Entraste no torneio!", "success");
      const { data } = await supabase
        .from("tournaments")
        .select("*, tournament_teams(*, teams(id, name, pin))")
        .eq("id", tournament.id)
        .single();
      if (data) setTournament(data as TournamentWithTeams);
      setSelectedTeamId("");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Erro ao entrar no torneio.", "error");
    } finally {
      setJoining(false);
    }
  };

  const alreadyJoined = (teamId: string) =>
    tournament?.tournament_teams?.some((tt) => tt.team_id === teamId) ?? false;

  const statusLabels: Record<string, string> = {
    LOBBY: "A aguardar equipas",
    QUALIFYING: "Fase de Qualificação",
    FINAL: "Final",
    FINISHED: "Terminado",
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-on-surface/50">Torneio não encontrado.</p>
        <Link href="/tournaments" className="text-primary font-bold">Voltar</Link>
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
        <div className="absolute top-0 left-0 w-[60vw] h-[60vw] bg-primary/10 blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-secondary/10 blur-[150px]" />
      </div>

      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-4xl mx-auto">
          <Link href="/tournaments" className="text-sm text-on-surface/60 hover:text-on-surface transition-colors flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-lg font-bold text-on-surface">Detalhe do Torneio</h1>
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
          <Trophy className="w-12 h-12 text-amber-400 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "Space Grotesk" }}>
            {tournament.name}
          </h2>
          <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
            tournament.status === "FINISHED"
              ? "bg-white/10 text-on-surface/50"
              : "bg-amber-400/20 text-amber-400"
          }`}>
            {statusLabels[tournament.status] || tournament.status}
          </span>
          {tournament.is_public && (
            <span className="ml-2 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-green-500/20 text-green-400 align-middle">
              <Globe className="w-3 h-3" />
              Público
            </span>
          )}
          {tournament.is_featured && (
            <span className="ml-2 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-400/20 text-amber-400 align-middle">
              <Star className="w-3 h-3" />
              Destaque
            </span>
          )}
          {Array.isArray(tournament.whitelisted_team_ids) && tournament.whitelisted_team_ids.length > 0 && (
            <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-primary/80">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Torneio por convite — apenas {tournament.whitelisted_team_ids.length} equipa(s) convidada(s)
            </div>
          )}
          <p className="text-sm text-on-surface/50 mt-3">
            {teamCount} / {maxTeams} equipas inscritas
          </p>
          <div className="w-full bg-white/10 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-secondary rounded-full transition-all"
              style={{ width: `${(teamCount / maxTeams) * 100}%` }}
            />
          </div>
        </motion.div>

        {/* Join public tournament */}
        {tournament.is_public && tournament.status === "LOBBY" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-2xl p-6 border border-green-500/30"
          >
            {myTeams.length === 0 ? (
              <div className="text-center">
                <p className="text-green-400 text-sm mb-3">Cria uma equipa para entrares neste torneio público.</p>
                <button
                  onClick={() => router.push("/teams")}
                  className="px-6 py-3 bg-green-500 text-white rounded-xl font-bold"
                >
                  Ir para Equipas
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-green-400" />
                  Entrar no Torneio Público
                </h3>
                <select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-green-500/50 transition-all"
                >
                  <option value="">Selecciona uma equipa</option>
                  {myTeams.map((team) => (
                    <option key={team.id} value={team.id} disabled={alreadyJoined(team.id)}>
                      {team.name}{alreadyJoined(team.id) ? " (já inscrita)" : ""}
                    </option>
                  ))}
                </select>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={joinPublicTournament}
                  disabled={joining || !selectedTeamId || alreadyJoined(selectedTeamId)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-500 text-white rounded-xl font-bold disabled:opacity-50"
                >
                  {joining ? <Loader2 className="w-5 h-5 animate-spin" /> : "Entrar no Torneio"}
                </motion.button>
              </div>
            )}
          </motion.div>
        )}

        {/* Standings */}
        {sortedTeams.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel rounded-2xl p-6"
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2" style={{ fontFamily: "Space Grotesk" }}>
              <Medal className="w-5 h-5 text-amber-400" />
              Classificação
            </h3>
            <div className="space-y-3">
              {sortedTeams.map((tt, idx) => (
                <div key={tt.id} className={`flex items-center justify-between p-3 rounded-xl ${
                  idx === 0 ? "bg-amber-400/10 border border-amber-400/20" : "bg-white/5"
                }`}>
                  <div className="flex items-center gap-3">
                    <span className={`text-lg font-bold w-8 text-center ${
                      idx === 0 ? "text-amber-400" : idx === 1 ? "text-[#C0C0C0]" : idx === 2 ? "text-[#CD7F32]" : "text-on-surface/40"
                    }`}>
                      #{idx + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      {idx === 0 && <Crown className="w-4 h-4 text-amber-400" />}
                      <span className="font-bold text-white">{tt.teams?.name || "Equipa"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {tt.score !== undefined && tt.score > 0 && (
                      <span className="text-amber-400 font-bold">{tt.score.toLocaleString()} pts</span>
                    )}
                    <span className="text-on-surface/30 text-xs font-mono">{tt.teams?.pin}</span>
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
            <Users className="w-12 h-12 text-on-surface/20 mx-auto mb-3" />
            <p className="text-on-surface/50">Nenhuma equipa inscrita ainda.</p>
          </motion.div>
        )}

        {/* Prizes / Loot */}
        {(() => {
          const prizes = tournament.prizes || {};
          const hasPrizes = prizes.first || prizes.second || prizes.third;
          if (!hasPrizes) return null;
          const prizeRows = [
            { rank: 0, icon: <Crown className="w-5 h-5 text-amber-400" />, color: "text-amber-400", label: "1º Lugar", value: prizes.first },
            { rank: 1, icon: <Medal className="w-5 h-5 text-[#C0C0C0]" />, color: "text-[#C0C0C0]", label: "2º Lugar", value: prizes.second },
            { rank: 2, icon: <Medal className="w-5 h-5 text-[#CD7F32]" />, color: "text-[#CD7F32]", label: "3º Lugar", value: prizes.third },
          ];
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glass-panel rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2" style={{ fontFamily: "Space Grotesk" }}>
                <Gift className="w-5 h-5 text-amber-400" />
                Prémios do Top 3
              </h3>
              <div className="space-y-3">
                {prizeRows.map((row) => {
                  const winner = tournament.status === "FINISHED" ? sortedTeams[row.rank] : undefined;
                  return (
                    <div key={row.rank} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                      <span className={`font-bold ${row.color}`}>{row.label}</span>
                      {row.icon}
                      <div className="flex-1">
                        <p className="text-on-surface font-medium">{row.value || "—"}</p>
                        {winner && (
                          <p className={`text-xs ${row.color}`}>
                            🏆 {winner.teams?.name || "Equipa"}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
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
            <span className="text-xs text-on-surface/40 uppercase font-bold">Equipas</span>
            <p className="text-2xl font-bold text-white" style={{ fontFamily: "Space Grotesk" }}>{teamCount}</p>
          </div>
          <div className="glass-panel rounded-2xl p-4 text-center">
            <span className="text-xs text-on-surface/40 uppercase font-bold">Estado</span>
            <p className="text-lg font-bold text-amber-400">{statusLabels[tournament.status] || tournament.status}</p>
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
            <Target className="w-5 h-5 text-secondary" />
            Definições
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <span className="text-xs text-on-surface/40 uppercase font-bold">Tempo por Pergunta</span>
              <p className="text-xl font-bold text-white">{tournament.settings?.timer || 20}s</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <span className="text-xs text-on-surface/40 uppercase font-bold">Perguntas</span>
              <p className="text-xl font-bold text-white">{tournament.settings?.questions || 10}</p>
            </div>
          </div>
          {tournament.settings?.blind_mode && (
            <div className="mt-4 p-3 bg-primary/10 border border-primary/30 rounded-xl text-primary text-sm flex items-center gap-2">
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
