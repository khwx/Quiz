"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trophy, Plus, Users, Loader2, Clock, Target, Play, Flag, ArrowLeft, Copy, Check, Zap, Timer, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import MobileNav from "@/components/MobileNav";
import ConfirmModal from "@/components/ConfirmModal";
import type { TournamentWithTeams, Team } from "@/types";
import type { User } from "@supabase/supabase-js";

function generatePin(length: number = 6): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let pin = "";
  for (let i = 0; i < length; i++) {
    pin += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pin;
}

// Animated tournament card with hover effects
function TournamentCard({ tournament, onClick }: { tournament: TournamentWithTeams; onClick?: () => void }) {
  const teamCount = tournament.tournament_teams?.length || 0;
  const fillPercentage = (teamCount / tournament.max_teams) * 100;
  const teamNames = tournament.tournament_teams?.map((tt) => tt.teams?.name).filter(Boolean) || [];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="glass-panel rounded-2xl border border-white/10 p-5 hover:border-white/20 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="font-bold text-on-surface text-lg group-hover:text-primary transition-colors">
            {tournament.name}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${statusConfig[tournament.status]?.bg} ${statusConfig[tournament.status]?.text}`}>
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-2 h-2 rounded-full ${statusConfig[tournament.status]?.dot}`}
              />
              {statusLabels[tournament.status]}
            </div>
          </div>
        </div>
        <div className="font-mono text-xl font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-lg">
          {tournament.pin}
        </div>
      </div>

      {/* Registered teams */}
      {teamNames.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {teamNames.map((name, i) => (
            <span key={i} className="px-2 py-0.5 bg-white/5 rounded-full text-xs text-on-surface-variant/70">
              {name}
            </span>
          ))}
        </div>
      )}

      {/* Team capacity bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-on-surface-variant/60 mb-1.5">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            Equipas
          </span>
          <span className="font-bold text-on-surface">
            {teamCount}/{tournament.max_teams}
          </span>
        </div>
        <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${fillPercentage}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
          />
        </div>
      </div>
    </motion.div>
  );
}

const statusLabels: Record<string, string> = {
  LOBBY: "Aguardando",
  QUALIFYING: "Qualificação",
  FINAL: "Final",
  FINISHED: "Finalizado",
};

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  LOBBY: { bg: "bg-[#d0bcff]/15", text: "text-[#d0bcff]", dot: "bg-[#d0bcff]" },
  QUALIFYING: { bg: "bg-[#FFD700]/15", text: "text-[#FFD700]", dot: "bg-[#FFD700]" },
  FINAL: { bg: "bg-[#FFB0CD]/15", text: "text-[#FFB0CD]", dot: "bg-[#FFB0CD]" },
  FINISHED: { bg: "bg-[#4CAF50]/15", text: "text-[#4CAF50]", dot: "bg-[#4CAF50]" },
};

export default function TournamentsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [tournaments, setTournaments] = useState<TournamentWithTeams[]>([]);
  const [createMode, setCreateMode] = useState(false);
  const [joinMode, setJoinMode] = useState(false);
  const [tournamentName, setTournamentName] = useState("");
  const [tournamentPin, setTournamentPin] = useState("");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [myTournament, setMyTournament] = useState<TournamentWithTeams | null>(null);
  const [startConfirmOpen, setStartConfirmOpen] = useState(false);
  const [myTeams, setMyTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);
      await Promise.all([loadTournaments(), loadMyTeams(user.id)]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMyTeams = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("team_members")
        .select("team_id, teams(id, name, pin)")
        .eq("user_id", userId);
      if (error) throw error;
      const teams = (data || [])
        .map((m: any) => m.teams?.[0])
        .filter(Boolean) as Team[];
      setMyTeams(teams);
      if (teams.length === 1) setSelectedTeamId(teams[0].id);
    } catch (err) {
      console.error("Erro ao carregar equipas:", err);
    }
  };

  const loadTournaments = async () => {
    try {
      const { data, error } = await supabase
        .from("tournaments")
        .select("*, tournament_teams(*, teams(id, name, pin))")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      const allData = data || [];
      setTournaments(allData);

      // Check if current user is already in a tournament
      if (user) {
        const myTournamentData = allData.find((t: any) =>
          t.tournament_teams?.some((tt: any) =>
            tt.teams && myTeams.some((mt) => mt.id === tt.team_id)
          )
        );
        if (myTournamentData) setMyTournament(myTournamentData);
      }
    } catch (err) {
      console.error("Erro ao carregar torneios:", err);
      setError("Erro ao carregar torneios");
    }
  };

  const createTournament = async () => {
    if (!user) return;
    if (!tournamentName.trim()) {
      setError("Nome do torneo é obrigatório");
      return;
    }
    setSaving(true);
    setError("");

    try {
      const pin = generatePin();
      
      const { data: tournament, error: tournamentError } = await supabase
        .from("tournaments")
        .insert({
          name: tournamentName,
          pin: pin,
          max_teams: 8,
          status: "LOBBY",
          settings: { timer: 20, questions: 10 },
          created_by: user!.id,
        })
        .select()
        .single();

      if (tournamentError) throw tournamentError;

      // Auto-register user's team if they selected one
      if (selectedTeamId) {
        const { error: ttError } = await supabase
          .from("tournament_teams")
          .insert({
            tournament_id: tournament.id,
            team_id: selectedTeamId,
          });
        if (ttError) console.error("Erro ao registar equipa:", ttError);
      }

      setMyTournament({ ...tournament, tournament_teams: [] });
      setTournamentName("");
      setCreateMode(false);
      setSelectedTeamId("");
      await loadTournaments();
    } catch (err: any) {
      setError(err.message || "Erro ao criar torneo");
    } finally {
      setSaving(false);
    }
  };

  const joinTournament = async () => {
    if (!tournamentPin.trim()) {
      setError("Código do torneo é obrigatório");
      return;
    }
    if (!selectedTeamId) {
      setError("Selecciona uma equipa para entrar no torneio");
      return;
    }
    setSaving(true);
    setError("");

    try {
      const { data: tournament, error: findError } = await supabase
        .from("tournaments")
        .select("*, tournament_teams(*, teams(id, name, pin))")
        .eq("pin", tournamentPin.toUpperCase())
        .eq("status", "LOBBY")
        .single();

      if (findError || !tournament) {
        setError("Torneio não encontrado ou já iniciado");
        setSaving(false);
        return;
      }

      const teamCount = tournament.tournament_teams?.length || 0;
      if (teamCount >= tournament.max_teams) {
        setError("Torneio cheio");
        setSaving(false);
        return;
      }

      // Check if team is already in this tournament
      const alreadyJoined = tournament.tournament_teams?.some(
        (tt: any) => tt.team_id === selectedTeamId
      );
      if (alreadyJoined) {
        setError("A tua equipa já está neste torneio");
        setSaving(false);
        return;
      }

      // Actually insert into tournament_teams
      const { error: insertError } = await supabase
        .from("tournament_teams")
        .insert({
          tournament_id: tournament.id,
          team_id: selectedTeamId,
        });

      if (insertError) throw insertError;

      setMyTournament(tournament);
      setTournamentPin("");
      setJoinMode(false);
      setSelectedTeamId("");
      await loadTournaments();
    } catch (err: any) {
      setError(err.message || "Erro ao entrar no torneo");
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121223]">
        <Loader2 className="w-8 h-8 animate-spin text-[#d0bcff]" />
      </div>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden pb-24">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#121223]">
        <div className="absolute top-0 left-0 w-[60vw] h-[60vw] bg-[#FFD700]/5 blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-[#FFB0CD]/5 blur-[150px]" />
      </div>

      <header className="sticky top-0 z-50 bg-[#121223]/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-4xl mx-auto">
          <Link href="/profile" className="flex items-center gap-2 text-[#e3e0f9]/60 hover:text-[#e3e0f9] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-bold text-[#e3e0f9]">Torneios</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto p-6 space-y-6">
        <AnimatePresence mode="wait">
          {myTournament && (
            <motion.section 
              key="my-tournament"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-[#1e1e30]/80 backdrop-blur-xl rounded-2xl border border-[#FFD700]/30 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="w-5 h-5 text-[#FFD700]" />
                    <h2 className="text-2xl font-bold text-[#e3e0f9]">{myTournament.name}</h2>
                  </div>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${statusConfig[myTournament.status]?.bg} ${statusConfig[myTournament.status]?.text}`}>
                    <div className={`w-2 h-2 rounded-full ${statusConfig[myTournament.status]?.dot}`} />
                    {statusLabels[myTournament.status]}
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 mb-4">
                <div className="text-[10px] text-[#e3e0f9]/40 uppercase tracking-widest mb-2">Código do Torneio</div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 font-mono text-3xl tracking-widest text-[#FFD700]">
                    {myTournament.pin}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => copyToClipboard(myTournament.pin)}
                    className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-[#4CAF50]" />
                    ) : (
                      <Copy className="w-5 h-5 text-[#e3e0f9]/60" />
                    )}
                  </motion.button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <Users className="w-5 h-5 mx-auto mb-1 text-[#d0bcff]" />
                  <div className="text-[#e3e0f9] font-bold">{myTournament.tournament_teams?.length || 0}/{myTournament.max_teams}</div>
                  <div className="text-[#e3e0f9]/40 text-xs">Equipas</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <Target className="w-5 h-5 mx-auto mb-1 text-[#FFB0CD]" />
                  <div className="text-[#e3e0f9] font-bold">{myTournament.settings?.questions || 10}</div>
                  <div className="text-[#e3e0f9]/40 text-xs">Perguntas</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <Clock className="w-5 h-5 mx-auto mb-1 text-[#FFD700]" />
                  <div className="text-[#e3e0f9] font-bold">{myTournament.settings?.timer || 20}s</div>
                  <div className="text-[#e3e0f9]/40 text-xs">Tempo</div>
                </div>
              </div>

              {/* Registered Teams */}
              {myTournament.tournament_teams && myTournament.tournament_teams.length > 0 && (
                <div className="bg-white/5 rounded-xl p-4 mb-4">
                  <div className="text-[10px] text-[#e3e0f9]/40 uppercase tracking-widest mb-3">Equipas Registadas</div>
                  <div className="space-y-2">
                    {myTournament.tournament_teams.map((tt, i) => (
                      <div key={tt.id || i} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[#e3e0f9]/30 text-sm font-bold">#{i + 1}</span>
                          <span className="text-[#e3e0f9] font-medium">{tt.teams?.name || "Equipa"}</span>
                        </div>
                        <span className="text-[#e3e0f9]/30 text-xs font-mono">{tt.teams?.pin}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {myTournament.status === 'LOBBY' && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStartConfirmOpen(true)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#FFD700] text-[#121223] rounded-xl font-bold"
                >
                  <Play className="w-5 h-5" />
                  Iniciar Torneio
                </motion.button>
              )}
            </motion.section>
          )}

          {!myTournament && (
            <motion.div
              key="actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-2 gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setCreateMode(true); setJoinMode(false); }}
                className="bg-[#1e1e30]/80 backdrop-blur-xl border border-white/10 p-6 text-center rounded-2xl hover:border-[#FFD700]/30 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[#FFD700]/15 flex items-center justify-center mx-auto mb-3">
                  <Plus className="w-6 h-6 text-[#FFD700]" />
                </div>
                <div className="font-bold text-[#e3e0f9]">Criar Torneio</div>
                <div className="text-[#e3e0f9]/50 text-sm">Começar um campeonato</div>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setJoinMode(true); setCreateMode(false); }}
                className="bg-[#1e1e30]/80 backdrop-blur-xl border border-white/10 p-6 text-center rounded-2xl hover:border-[#FFB0CD]/30 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[#FFB0CD]/15 flex items-center justify-center mx-auto mb-3">
                  <Flag className="w-6 h-6 text-[#FFB0CD]" />
                </div>
                <div className="font-bold text-[#e3e0f9]">Entrar em Torneio</div>
                <div className="text-[#e3e0f9]/50 text-sm">Entrar com código</div>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {createMode && !myTournament && (
            <motion.section 
              key="create-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-[#1e1e30]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
            >
              <h3 className="text-lg font-bold text-[#e3e0f9] mb-4">Novo Torneio</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-[#e3e0f9]/40 uppercase tracking-widest mb-2 ml-1 block">Nome do Torneio</label>
                  <input
                    type="text"
                    placeholder="Campeonato QuizVerse"
                    value={tournamentName}
                    onChange={(e) => setTournamentName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#e3e0f9] placeholder-[#e3e0f9]/30 focus:outline-none focus:border-[#d0bcff]/50 transition-all"
                  />
                </div>

                {myTeams.length > 0 && (
                  <div>
                    <label className="text-[10px] text-[#e3e0f9]/40 uppercase tracking-widest mb-2 ml-1 block">A tua Equipa</label>
                    <select
                      value={selectedTeamId}
                      onChange={(e) => setSelectedTeamId(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#e3e0f9] focus:outline-none focus:border-[#d0bcff]/50 transition-all"
                    >
                      <option value="">Sem equipa (só anfitrião)</option>
                      {myTeams.map((team) => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {myTeams.length === 0 && (
                  <div className="p-3 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-xl text-[#FFD700] text-sm">
                    Cria uma equipa primeiro em <button onClick={() => router.push("/teams")} className="underline font-bold">Equipas</button> para participar no torneio.
                  </div>
                )}

                {error && (
                  <div className="p-3 bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 rounded-xl text-[#FF6B6B] text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setCreateMode(false)}
                    className="flex-1 py-4 bg-white/5 rounded-xl text-[#e3e0f9]/60 hover:bg-white/10 transition-colors"
                  >
                    Cancelar
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={createTournament}
                    disabled={saving || !tournamentName}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#FFD700] text-[#121223] rounded-xl font-bold disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Criar"}
                  </motion.button>
                </div>
              </div>
            </motion.section>
          )}

          {joinMode && !myTournament && (
            <motion.section 
              key="join-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-[#1e1e30]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
            >
              <h3 className="text-lg font-bold text-[#e3e0f9] mb-4">Entrar em Torneio</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-[#e3e0f9]/40 uppercase tracking-widest mb-2 ml-1 block">Código do Torneio</label>
                  <input
                    type="text"
                    placeholder="ABCD12"
                    value={tournamentPin}
                    onChange={(e) => setTournamentPin(e.target.value.toUpperCase())}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-[#e3e0f9] text-center font-mono text-2xl tracking-widest placeholder-[#e3e0f9]/30 focus:outline-none focus:border-[#FFB0CD]/50 transition-all"
                    maxLength={6}
                  />
                </div>

                {myTeams.length > 0 && (
                  <div>
                    <label className="text-[10px] text-[#e3e0f9]/40 uppercase tracking-widest mb-2 ml-1 block">A tua Equipa</label>
                    <select
                      value={selectedTeamId}
                      onChange={(e) => setSelectedTeamId(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#e3e0f9] focus:outline-none focus:border-[#FFB0CD]/50 transition-all"
                    >
                      <option value="">Selecciona uma equipa</option>
                      {myTeams.map((team) => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {myTeams.length === 0 && (
                  <div className="p-3 bg-[#FFB0CD]/10 border border-[#FFB0CD]/30 rounded-xl text-[#FFB0CD] text-sm">
                    Precisas de ter uma equipa para entrar num torneio. Cria em <button onClick={() => router.push("/teams")} className="underline font-bold">Equipas</button>.
                  </div>
                )}

                {error && (
                  <div className="p-3 bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 rounded-xl text-[#FF6B6B] text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setJoinMode(false)}
                    className="flex-1 py-4 bg-white/5 rounded-xl text-[#e3e0f9]/60 hover:bg-white/10 transition-colors"
                  >
                    Cancelar
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={joinTournament}
                    disabled={saving || !tournamentPin || !selectedTeamId}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#FFB0CD] text-[#640039] rounded-xl font-bold disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Entrar"}
                  </motion.button>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {tournaments.length > 0 && !myTournament && (
          <section>
            <h3 className="text-lg font-bold text-[#e3e0f9] mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#FFD700]" />
              Torneios Ativos
            </h3>
            <div className="space-y-3">
              {tournaments.map((tournament, i) => (
                <TournamentCard
                  key={tournament.id}
                  tournament={tournament}
                />
              ))}
            </div>
          </section>
        )}

        {tournaments.length === 0 && !myTournament && !createMode && !joinMode && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1e1e30]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-8 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#FFD700]/10 flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-[#FFD700]/40" />
            </div>
            <h3 className="text-xl font-bold text-[#e3e0f9] mb-2">Sem Torneios Ativos</h3>
            <p className="text-[#e3e0f9]/50 mb-6">Cria o primeiro torneo ou entra num com código</p>
          </motion.div>
        )}
      </div>

      <ConfirmModal
        isOpen={startConfirmOpen}
        onClose={() => setStartConfirmOpen(false)}
        onConfirm={async () => {
          if (!myTournament) return;
          await supabase
            .from('tournaments')
            .update({ status: 'QUALIFYING' })
            .eq('id', myTournament.id);
          setMyTournament({ ...myTournament, status: 'QUALIFYING' } as any);
          // Find user's team in this tournament
          const userTeamEntry = myTournament.tournament_teams?.find((tt) =>
            myTeams.some((mt) => mt.id === tt.team_id)
          );
          const teamParam = userTeamEntry ? `&team=${userTeamEntry.team_id}` : '';
          window.open(`/tv?tournament=${myTournament.id}${teamParam}`, '_blank');
        }}
        title="Iniciar Torneio?"
        message="Tens a certeza que queres iniciar o torneio?"
        confirmLabel="Iniciar"
      />
      <MobileNav />
      <div className="h-20 md:hidden" />
    </main>
  );
}