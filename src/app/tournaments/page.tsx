"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trophy, Plus, Crown, Users, Loader2, Calendar, Clock, Medal, Target, ArrowRight, Play, Flag } from "lucide-react";
import { supabase } from "@/lib/supabase";
import MobileNav from "@/components/MobileNav";

function generatePin(length: number = 6): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let pin = "";
  for (let i = 0; i < length; i++) {
    pin += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pin;
}

const statusLabels: Record<string, string> = {
  LOBBY: "Aguardando",
  QUALIFYING: "Qualificação",
  FINAL: "Final",
  FINISHED: "Finalizado",
};

const statusColors: Record<string, string> = {
  LOBBY: "text-blue-400",
  QUALIFYING: "text-yellow-400",
  FINAL: "text-orange-400",
  FINISHED: "text-green-400",
};

export default function TournamentsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [activeTournaments, setActiveTournaments] = useState<any[]>([]);
  const [createMode, setCreateMode] = useState(false);
  const [joinMode, setJoinMode] = useState(false);
  const [tournamentName, setTournamentName] = useState("");
  const [tournamentPin, setTournamentPin] = useState("");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [myTournament, setMyTournament] = useState<any>(null);

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
      await loadTournaments();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadTournaments = async () => {
    const { data } = await supabase
      .from("tournaments")
      .select("*, tournament_teams(*)")
      .order("created_at", { ascending: false });
    
    const allData = data || [];
    setTournaments(allData.filter(t => t.status !== 'FINISHED'));
    setActiveTournaments(allData.filter(t => t.status === 'LOBBY'));
  };

  const createTournament = async () => {
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
        })
        .select()
        .single();

      if (tournamentError) throw tournamentError;

      setMyTournament(tournament);
      setTournamentName("");
      setCreateMode(false);
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
    setSaving(true);
    setError("");

    try {
      const { data: tournament, error: findError } = await supabase
        .from("tournaments")
        .select("*, tournament_teams(count)")
        .eq("pin", tournamentPin.toUpperCase())
        .eq("status", "LOBBY")
        .single();

      if (findError || !tournament) {
        setError("Torneio não encontrado ou já started");
        setSaving(false);
        return;
      }

      if (tournament.tournament_teams && tournament.tournament_teams[0]?.count >= tournament.max_teams) {
        setError("Torneio cheio");
        setSaving(false);
        return;
      }

      setMyTournament(tournament);
      setTournamentPin("");
      setJoinMode(false);
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
      </div>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden pb-24">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[60vw] h-[60vw] bg-amber-600/10 blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-orange-600/10 blur-[150px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/50 backdrop-blur-xl border-b border-white/10">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-4xl mx-auto">
          <Link href="/profile" className="text-xl font-bold text-white/60 hover:text-white transition-colors">
            ←
          </Link>
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>Torneios</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto p-6 space-y-6">
        {/* My Tournament Card */}
        {myTournament && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 border-2 border-amber-500/30"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>{myTournament.name}</h2>
                </div>
                <p className={`text-sm ${statusColors[myTournament.status]}`}>
                  {statusLabels[myTournament.status]}
                </p>
              </div>
            </div>

            {/* Share Code */}
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-xs text-white/40 uppercase mb-2">Código do Torneio</div>
              <div className="flex items-center gap-3">
                <div className="flex-1 font-mono text-3xl tracking-widest text-amber-400">
                  {myTournament.pin}
                </div>
                <button
                  onClick={() => copyToClipboard(myTournament.pin)}
                  className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  {copied ? (
                    <span className="text-green-400">Copiado!</span>
                  ) : (
                    <span className="text-white/60">Copiar</span>
                  )}
                </button>
              </div>
            </div>

            {/* Tournament Info */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <Users className="w-5 h-5 mx-auto mb-1 text-violet-400" />
                <div className="text-white text-sm">{myTournament.tournament_teams?.length || 0}/{myTournament.max_teams}</div>
                <div className="text-white/40 text-xs">Equipas</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <Target className="w-5 h-5 mx-auto mb-1 text-pink-400" />
                <div className="text-white text-sm">{myTournament.settings?.questions || 10}</div>
                <div className="text-white/40 text-xs">Perguntas</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <Clock className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                <div className="text-white text-sm">{myTournament.settings?.timer || 20}s</div>
                <div className="text-white/40 text-xs">Tempo</div>
              </div>
            </div>

{myTournament.status === 'LOBBY' && (
              <button
                onClick={async () => {
                  if (!confirm("Iniciar o torneio?")) return;
                  await supabase
                    .from('tournaments')
                    .update({ status: 'QUALIFYING' })
                    .eq('id', myTournament.id);
                  setMyTournament({ ...myTournament, status: 'QUALIFYING' });
                  // Open TV
                  window.open(`/tv?tournament=${myTournament.id}`, '_blank');
                }}
                className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl font-bold text-white"
              >
                <Play className="w-5 h-5" />
                Iniciar Torneio
              </button>
            )}
          </motion.section>
        )}

        {/* Create/Join Buttons */}
        {!myTournament && (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => { setCreateMode(true); setJoinMode(false); }}
              className="glass-panel p-6 text-center hover:border-amber-400/50 transition-all"
            >
              <Plus className="w-8 h-8 mx-auto mb-3 text-amber-400" />
              <div className="font-bold text-white">Criar Torneio</div>
              <div className="text-white/50 text-sm">Start a championship</div>
            </button>
            <button
              onClick={() => { setJoinMode(true); setCreateMode(false); }}
              className="glass-panel p-6 text-center hover:border-orange-400/50 transition-all"
            >
              <Flag className="w-8 h-8 mx-auto mb-3 text-orange-400" />
              <div className="font-bold text-white">Entrar em Torneio</div>
              <div className="text-white/50 text-sm">Join with code</div>
            </button>
          </div>
        )}

        {/* Create Tournament Form */}
        {createMode && !myTournament && (
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-panel p-6"
          >
            <h3 className="text-lg font-bold text-white mb-4">Novo Torneio</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/40 uppercase mb-2 ml-1 block">Nome do Torneio</label>
                <input
                  type="text"
                  placeholder="Campeonato Quizverse"
                  value={tournamentName}
                  onChange={(e) => setTournamentName(e.target.value)}
                  className="w-full glass-input"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setCreateMode(false)}
                  className="flex-1 py-4 bg-white/5 rounded-xl text-white/60"
                >
                  Cancelar
                </button>
                <button
                  onClick={createTournament}
                  disabled={saving || !tournamentName}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl font-bold text-white disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Criar"}
                </button>
              </div>
            </div>
          </motion.section>
        )}

        {/* Join Tournament Form */}
        {joinMode && !myTournament && (
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-panel p-6"
          >
            <h3 className="text-lg font-bold text-white mb-4">Entrar em Torneio</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/40 uppercase mb-2 ml-1 block">Código do Torneio</label>
                <input
                  type="text"
                  placeholder="ABCD12"
                  value={tournamentPin}
                  onChange={(e) => setTournamentPin(e.target.value.toUpperCase())}
                  className="w-full glass-input font-mono text-2xl tracking-widest text-center"
                  maxLength={6}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setJoinMode(false)}
                  className="flex-1 py-4 bg-white/5 rounded-xl text-white/60"
                >
                  Cancelar
                </button>
                <button
                  onClick={joinTournament}
                  disabled={saving || !tournamentPin}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl font-bold text-white disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Entrar"}
                </button>
              </div>
            </div>
          </motion.section>
        )}

        {/* Active Tournaments List */}
        {tournaments.length > 0 && !myTournament && (
          <section>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              Torneios Ativos
            </h3>
            <div className="space-y-3">
              {tournaments.map((tournament) => (
                <div 
                  key={tournament.id}
                  className="glass-panel p-4 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-white">{tournament.name}</div>
                    <div className="text-white/40 text-sm flex items-center gap-2">
                      <span className={statusColors[tournament.status]}>{statusLabels[tournament.status]}</span>
                      <span>•</span>
                      <span>{tournament.tournament_teams?.length || 0}/{tournament.max_teams} equipas</span>
                    </div>
                  </div>
                  <div className="font-mono text-amber-400">{tournament.pin}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {tournaments.length === 0 && !myTournament && !createMode && !joinMode && (
          <div className="glass-panel p-8 text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-white/20" />
            <h3 className="text-xl font-bold text-white mb-2">Sem Torneios Ativos</h3>
            <p className="text-white/50 mb-6">Cria o primeiro torneo ou entra num com código</p>
          </div>
        )}
      </div>

      <MobileNav />
      <div className="h-20 md:hidden" />
    </main>
  );
}