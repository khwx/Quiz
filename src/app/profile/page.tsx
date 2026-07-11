"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trophy, Star, Coins, Flame, Activity, LogOut, Loader2, Target, Zap, Crown, Medal, BarChart3 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import MobileNav from "@/components/MobileNav";
import type { Profile, AnswerSummary, PlayerStats } from "@/types";
import type { User } from "@supabase/supabase-js";

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("stats");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<(import("@supabase/supabase-js").User & { name?: string; avatar?: string }) | null>(null);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [gamesHistory, setGamesHistory] = useState<AnswerSummary[]>([]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .single();

      const { data: userPlayers } = await supabase
        .from("players")
        .select("id")
        .eq("user_id", currentUser.id);
      
      const playerIds = userPlayers?.map(p => p.id) || [];

      const { data: answers } = playerIds.length > 0
        ? await supabase
            .from("answers")
            .select("game_id, is_correct, points, created_at")
            .in("player_id", playerIds)
            .order("created_at", { ascending: false })
        : { data: [] };

      setGamesHistory((answers || []).slice(0, 20));

      const userAnswers = answers || [];
      const totalGames = new Set(userAnswers.map((a) => a.game_id)).size;
      const correctAnswers = userAnswers.filter((a) => a.is_correct).length;
      const totalPoints = userAnswers.reduce((sum, a) => sum + (a.points || 0), 0);
      const accuracy = userAnswers.length > 0 
        ? Math.round((correctAnswers / userAnswers.length) * 100) 
        : 0;

      setUser({
        id: currentUser.id,
        email: currentUser.email,
        name: currentUser.user_metadata?.name || profile?.username || "Player",
        avatar: profile?.avatar || "🎮",
        ...(profile || {}),
      });

      setStats({
        totalGames,
        correctAnswers,
        totalPoints,
        accuracy,
        wins: correctAnswers,
      });
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const achievements = [
    { id: 1, name: "Primeira Vitória", icon: "🏆", earned: (stats?.wins ?? 0) >= 1, description: "Ganha o teu primeiro jogo" },
    { id: 2, name: "3 Vitórias", icon: "🔥", earned: (stats?.wins ?? 0) >= 3, description: "Ganha 3 jogos" },
    { id: 3, name: "10 Vitórias", icon: "💎", earned: (stats?.wins ?? 0) >= 10, description: "Ganha 10 jogos" },
    { id: 4, name: "Perfeito", icon: "🌟", earned: stats?.accuracy === 100, description: "100% de taxa de acerto" },
    { id: 5, name: "Velocista", icon: "⚡", earned: (stats?.totalGames ?? 0) >= 5, description: "Joga 5 jogos" },
    { id: 6, name: "Mestre", icon: "🎓", earned: (stats?.wins ?? 0) >= 20, description: "Ganha 20 jogos" },
    { id: 7, name: "Especialista", icon: "🚩", earned: (stats?.totalGames ?? 0) >= 50, description: "Joga 50 jogos" },
    { id: 8, name: "Lendário", icon: "👑", earned: (stats?.wins ?? 0) >= 50, description: "Ganha 50 jogos" },
  ];

  const tabs = [
    { id: "stats", label: "Estatísticas", icon: Activity },
    { id: "achievements", label: "Conquistas", icon: Star },
    { id: "history", label: "Histórico", icon: Trophy },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121223]">
        <Loader2 className="w-8 h-8 animate-spin text-[#d0bcff]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121223]">
        <Link href="/login" className="text-[#d0bcff]">Entrar</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen relative overflow-x-hidden pb-24">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[60vw] h-[60vw] bg-[#d0bcff]/10 blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-[#FFB0CD]/10 blur-[150px]" />
      </div>

      <header className="sticky top-0 z-50 bg-[#121223]/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-4xl mx-auto">
          <Link href="/" className="text-sm text-[#e3e0f9]/60 hover:text-[#e3e0f9] transition-colors flex items-center gap-1">
            ← Voltar
          </Link>
          <h1 className="text-lg font-bold text-[#e3e0f9]">Perfil</h1>
          <div className="flex items-center gap-3">
            <Link href="/stats" className="text-[#e3e0f9]/60 hover:text-[#d0bcff] transition-colors">
              <BarChart3 className="w-5 h-5" />
            </Link>
            <Link href="/profile/edit" className="text-[#e3e0f9]/60 hover:text-[#d0bcff] transition-colors text-sm font-bold">
              Editar
            </Link>
            <button onClick={handleLogout} className="text-[#e3e0f9]/60 hover:text-[#FFB0CD] transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto p-6">
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1e1e30]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="relative"
            >
              <div className="w-28 h-28 rounded-full bg-gradient-to-r from-[#d0bcff] to-[#FFB0CD] flex items-center justify-center text-5xl font-bold text-[#3c0091] shadow-[0_0_30px_rgba(208,188,255,0.3)]">
                {user.avatar}
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#FFD700] rounded-full flex items-center justify-center">
                <Crown className="w-4 h-4 text-[#121223]" />
              </div>
            </motion.div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-[#e3e0f9] mb-1">{user.name}</h2>
              <p className="text-[#e3e0f9]/50 mb-4">{user.email}</p>

              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                  <Target className="w-5 h-5 text-[#d0bcff]" />
                  <div>
                    <div className="text-[10px] text-[#e3e0f9]/40 uppercase tracking-wider">Acertos</div>
                    <div className="font-bold text-[#e3e0f9]">{stats?.correctAnswers || 0}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                  <Coins className="w-5 h-5 text-[#FFD700]" />
                  <div>
                    <div className="text-[10px] text-[#e3e0f9]/40 uppercase tracking-wider">Pontos</div>
                    <div className="font-bold text-[#e3e0f9]">{stats?.totalPoints || 0}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                  <Flame className="w-5 h-5 text-[#FF6B6B]" />
                  <div>
                    <div className="text-[10px] text-[#e3e0f9]/40 uppercase tracking-wider">Jogos</div>
                    <div className="font-bold text-[#e3e0f9]">{stats?.totalGames || 0}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-[#d0bcff]/15 text-[#d0bcff] border border-[#d0bcff]/30"
                  : "text-[#e3e0f9]/60 hover:text-[#e3e0f9] bg-white/5 border border-white/10 hover:border-white/20"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "stats" && (
            <motion.section 
              key="stats"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                { label: "Jogos Totais", value: stats?.totalGames || 0, color: "text-[#e3e0f9]", icon: <Activity className="w-5 h-5" /> },
                { label: "Respostas Certas", value: stats?.correctAnswers || 0, color: "text-[#4CAF50]", icon: <Target className="w-5 h-5" /> },
                { label: "Pontos Totais", value: stats?.totalPoints || 0, color: "text-[#FFD700]", icon: <Coins className="w-5 h-5" /> },
                { label: "Taxa de Acerto", value: `${stats?.accuracy || 0}%`, color: "text-[#d0bcff]", icon: <Zap className="w-5 h-5" /> },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[#1e1e30]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-5 text-center hover:border-white/20 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3 ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div className={`text-3xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
                  <div className="text-[11px] text-[#e3e0f9]/40 uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </motion.section>
          )}

          {activeTab === "achievements" && (
            <motion.section 
              key="achievements"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3"
            >
              {achievements.map((achievement, i) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`bg-[#1e1e30]/80 backdrop-blur-xl rounded-2xl border p-5 text-center transition-all ${
                    achievement.earned 
                      ? "border-[#FFD700]/30 hover:border-[#FFD700]/50 hover:shadow-[0_0_20px_rgba(255,215,0,0.1)]" 
                      : "border-white/10 opacity-40 grayscale"
                  }`}
                >
                  <div className="text-4xl mb-3">{achievement.icon}</div>
                  <div className="font-bold text-[#e3e0f9] text-sm mb-1">{achievement.name}</div>
                  <div className="text-[10px] text-[#e3e0f9]/40 mb-2">{achievement.description}</div>
                  {achievement.earned ? (
                    <div className="inline-flex items-center gap-1 text-[10px] font-bold text-[#4CAF50] bg-[#4CAF50]/10 px-2 py-1 rounded-full">
                      <Medal className="w-3 h-3" />
                      Desbloqueado
                    </div>
                  ) : (
                    <div className="text-[10px] text-[#e3e0f9]/30">Bloqueado</div>
                  )}
                </motion.div>
              ))}
            </motion.section>
          )}

          {activeTab === "history" && (
            <motion.section 
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <h3 className="text-lg font-bold text-[#e3e0f9] mb-4">Os teus últimos jogos</h3>
              {gamesHistory.length === 0 ? (
                <div className="bg-[#1e1e30]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-8 text-center">
                  <div className="text-4xl mb-4">🎮</div>
                  <p className="text-[#e3e0f9]/60 mb-2">Ainda não jogaste nenhum jogo!</p>
                  <p className="text-[#e3e0f9]/40 text-sm">Joga para veres o teu histórico aqui.</p>
                </div>
              ) : (() => {
                const gameMap = new Map<string, { correct: number; total: number; points: number; date: string }>();
                gamesHistory.forEach((g) => {
                  const id = g.game_id;
                  if (!gameMap.has(id)) {
                    gameMap.set(id, { correct: 0, total: 0, points: 0, date: g.created_at });
                  }
                  const entry = gameMap.get(id)!;
                  entry.total++;
                  if (g.is_correct) entry.correct++;
                  entry.points += g.points || 0;
                });
                const gameList = Array.from(gameMap.entries()).map(([id, data]) => ({ id, ...data }));
                return gameList.slice(0, 10).map((game, idx) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-[#1e1e30]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-4 flex justify-between items-center hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                        game.correct === game.total 
                          ? 'bg-[#4CAF50]/20 text-[#4CAF50]' 
                          : 'bg-[#d0bcff]/20 text-[#d0bcff]'
                      }`}>
                        {idx + 1}
                      </div>
                      <div>
                        <div className="text-[#e3e0f9] font-bold">Jogo #{game.id?.slice(-6)}</div>
                        <div className="text-[#e3e0f9]/40 text-sm">
                          {new Date(game.date).toLocaleDateString('pt-PT')} · {game.correct}/{game.total} corretas
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[#FFD700] font-bold">{game.points} pts</div>
                      <div className={`text-sm font-medium ${
                        game.correct === game.total 
                          ? 'text-[#4CAF50]' 
                          : game.correct > game.total / 2 
                            ? 'text-[#FFB0CD]' 
                            : 'text-[#FF6B6B]'
                      }`}>
                        {game.correct === game.total ? 'Perfeito!' : game.correct > game.total / 2 ? 'Bom jogo' : 'Pode melhorar'}
                      </div>
                    </div>
                  </motion.div>
                ));
              })()}
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      <MobileNav />
      <div className="h-20 md:hidden" />
    </main>
  );
}