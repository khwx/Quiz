"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users, Plus, Copy, Check, QrCode, Trophy, Crown, Loader2, ArrowRight, Trash2, UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabase";

function generatePin(length: number = 6): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let pin = "";
  for (let i = 0; i < length; i++) {
    pin += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pin;
}

export default function TeamsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [createMode, setCreateMode] = useState(false);
  const [joinMode, setJoinMode] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamPin, setTeamPin] = useState("");
  const [playerPin, setPlayerPin] = useState("");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [myTeam, setMyTeam] = useState<any>(null);

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
      await loadTeams();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadTeams = async () => {
    const { data } = await supabase
      .from("teams")
      .select("*, team_members(*)")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    setTeams(data || []);
  };

  const createTeam = async () => {
    if (!teamName.trim()) {
      setError("Nome da equipa é obrigatório");
      return;
    }
    setSaving(true);
    setError("");

    try {
      const pin = generatePin();
      
      const { data: team, error: teamError } = await supabase
        .from("teams")
        .insert({
          name: teamName,
          pin: pin,
          max_members: 4,
        })
        .select()
        .single();

      if (teamError) throw teamError;

      const { error: memberError } = await supabase
        .from("team_members")
        .insert({
          team_id: team.id,
          user_id: user.id,
          role: "host",
        });

      if (memberError) throw memberError;

      setMyTeam(team);
      setTeamName("");
      setCreateMode(false);
      await loadTeams();
    } catch (err: any) {
      setError(err.message || "Erro ao criar equipa");
    } finally {
      setSaving(false);
    }
  };

  const joinTeam = async () => {
    if (!teamPin.trim()) {
      setError("Código da equipa é obrigatório");
      return;
    }
    setSaving(true);
    setError("");

    try {
      const { data: team, error: findError } = await supabase
        .from("teams")
        .select("*, team_members(count)")
        .eq("pin", teamPin.toUpperCase())
        .eq("is_active", true)
        .single();

      if (findError || !team) {
        setError("Equipa não encontrada");
        setSaving(false);
        return;
      }

      if (team.team_members && team.team_members[0]?.count >= team.max_members) {
        setError("Equipa cheia");
        setSaving(false);
        return;
      }

      const { error: memberError } = await supabase
        .from("team_members")
        .insert({
          team_id: team.id,
          user_id: user.id,
          role: "member",
        });

      if (memberError) throw memberError;

      setMyTeam(team);
      setTeamPin("");
      setJoinMode(false);
      await loadTeams();
    } catch (err: any) {
      setError(err.message || "Erro ao entrar na equipa");
    } finally {
      setSaving(false);
    }
  };

  const leaveTeam = async (teamId: string) => {
    try {
      await supabase
        .from("team_members")
        .delete()
        .eq("team_id", teamId)
        .eq("user_id", user.id);

      setMyTeam(null);
      await loadTeams();
    } catch (error) {
      console.error("Error leaving team:", error);
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
        <div className="absolute top-0 left-0 w-[60vw] h-[60vw] bg-violet-600/10 blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-pink-600/10 blur-[150px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/50 backdrop-blur-xl border-b border-white/10">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-4xl mx-auto">
          <Link href="/profile" className="text-xl font-bold text-white/60 hover:text-white transition-colors">
            ←
          </Link>
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>Equipas</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto p-6 space-y-6">
        {/* My Team Card */}
        {myTeam && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 border-2 border-violet-500/30"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>{myTeam.name}</h2>
                </div>
                <p className="text-white/50 text-sm">A tua equipa</p>
              </div>
              <button 
                onClick={() => leaveTeam(myTeam.id)}
                className="text-pink-400 hover:text-pink-300 text-sm"
              >
                Sair
              </button>
            </div>

            {/* Share Code */}
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-xs text-white/40 uppercase mb-2">Código para amigos</div>
              <div className="flex items-center gap-3">
                <div className="flex-1 font-mono text-3xl tracking-widest text-violet-400">
                  {myTeam.pin}
                </div>
                <button
                  onClick={() => copyToClipboard(myTeam.pin)}
                  className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Members */}
            <div className="mt-4">
              <div className="text-xs text-white/40 uppercase mb-2">Membros</div>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
                  <UserPlus className="w-4 h-4 text-violet-400" />
                  <span className="text-white text-sm">Tu</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push(`/host?team=${myTeam.id}`)}
              className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl font-bold text-white"
            >
              <Trophy className="w-5 h-5" />
              Criar Jogo em Equipa
            </button>
          </motion.section>
        )}

        {/* Create/Join Buttons */}
        {!myTeam && (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => { setCreateMode(true); setJoinMode(false); }}
              className="glass-panel p-6 text-center hover:border-violet-400/50 transition-all"
            >
              <Plus className="w-8 h-8 mx-auto mb-3 text-violet-400" />
              <div className="font-bold text-white">Criar Equipa</div>
              <div className="text-white/50 text-sm">Start a new team</div>
            </button>
            <button
              onClick={() => { setJoinMode(true); setCreateMode(false); }}
              className="glass-panel p-6 text-center hover:border-pink-400/50 transition-all"
            >
              <QrCode className="w-8 h-8 mx-auto mb-3 text-pink-400" />
              <div className="font-bold text-white">Entrar em Equipa</div>
              <div className="text-white/50 text-sm">Join with code</div>
            </button>
          </div>
        )}

        {/* Create Team Form */}
        {createMode && !myTeam && (
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-panel p-6"
          >
            <h3 className="text-lg font-bold text-white mb-4">Nova Equipa</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/40 uppercase mb-2 ml-1 block">Nome da Equipa</label>
                <input
                  type="text"
                  placeholder="Os QuizMasters"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
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
                  onClick={createTeam}
                  disabled={saving || !teamName}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl font-bold text-white disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Criar"}
                </button>
              </div>
            </div>
          </motion.section>
        )}

        {/* Join Team Form */}
        {joinMode && !myTeam && (
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-panel p-6"
          >
            <h3 className="text-lg font-bold text-white mb-4">Entrar em Equipa</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/40 uppercase mb-2 ml-1 block">Código da Equipa</label>
                <input
                  type="text"
                  placeholder="ABCD12"
                  value={teamPin}
                  onChange={(e) => setTeamPin(e.target.value.toUpperCase())}
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
                  onClick={joinTeam}
                  disabled={saving || !teamPin}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl font-bold text-white disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Entrar"}
                </button>
              </div>
            </div>
          </motion.section>
        )}

        {/* Active Teams List */}
        {teams.length > 0 && !myTeam && (
          <section>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Equipas Ativas
            </h3>
            <div className="space-y-3">
              {teams.map((team) => (
                <div 
                  key={team.id}
                  className="glass-panel p-4 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-white">{team.name}</div>
                    <div className="text-white/40 text-sm">{team.team_members?.length || 0}/{team.max_members} membros</div>
                  </div>
                  <div className="font-mono text-violet-400">{team.pin}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full z-50 md:hidden border-t border-white/10">
        <div className="flex justify-around items-center px-4 py-3 bg-slate-950/90 backdrop-blur-2xl border-t border-white/10">
          <Link href="/" className="flex flex-col items-center justify-center text-white/50">
            <Trophy className="w-6 h-6" />
            <span className="text-[10px] mt-1">Home</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center justify-center text-white/50">
            <Users className="w-6 h-6" />
            <span className="text-[10px] mt-1">Perfil</span>
          </Link>
        </div>
      </nav>
    </main>
  );
}