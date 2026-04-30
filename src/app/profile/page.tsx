"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Settings, Trophy, Star, Coins, Flame, Crown, Activity, LogOut, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import MobileNav from "@/components/MobileNav";

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("stats");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [gamesHistory, setGamesHistory] = useState<any[]>([]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Get current user
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        router.push("/login");
        return;
      }

      // Get profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .single();

      // Get player's answers for stats
      const { data: answers } = await supabase
        .from("answers")
        .select("game_id, is_correct, score, created_at")
        .eq("player_id", currentUser.id)
        .order("created_at", { ascending: false });

      // Get games history
      const { data: games } = await supabase
        .from("answers")
        .select("game_id, is_correct, score, created_at")
        .eq("player_id", currentUser.id)
        .order("created_at", { ascending: false })
        .limit(20);

      setGamesHistory(games || []);

      const userAnswers = answers || [];
      const totalGames = new Set(userAnswers.map((a: any) => a.game_id)).size;
      const correctAnswers = userAnswers.filter((a: any) => a.is_correct).length;
      const totalPoints = userAnswers.reduce((sum: number, a: any) => sum + (a.score || 0), 0);
      const accuracy = userAnswers.length > 0 
        ? Math.round((correctAnswers / userAnswers.length) * 100) 
        : 0;

      setUser({
        id: currentUser.id,
        email: currentUser.email,
        name: currentUser.user_metadata?.name || profile?.username || "Player",
        avatar: profile?.avatar || "🎮",
        ...profile,
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
    { id: 1, name: "Primeira Vitória", icon: "🏆", earned: stats?.wins >= 1, date: null },
    { id: 2, name: "3 Vitórias", icon: "🔥", earned: stats?.wins >= 3, date: null },
    { id: 3, name: "10 Vitórias", icon: "💎", earned: stats?.wins >= 10, date: null },
    { id: 4, name: "Perfeito", icon: "🌟", earned: stats?.accuracy === 100, date: null },
    { id: 5, name: "Velocista", icon: "⚡", earned: stats?.totalGames >= 5, date: null },
    { id: 6, name: "Mestre", icon: "🎓", earned: stats?.wins >= 20, date: null },
    { id: 7, name: "Especialista", icon: "🚩", earned: stats?.totalGames >= 50, date: null },
    { id: 8, name: "Lendário", icon: "👑", earned: stats?.wins >= 50, date: null },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Link href="/login" className="text-violet-400">Entrar</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen relative overflow-x-hidden pb-24">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[60vw] h-[60vw] bg-violet-600/10 blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-pink-600/10 blur-[150px]" />
      </div>

      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-slate-950/50 backdrop-blur-xl border-b border-white/10">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-4xl mx-auto">
          <Link href="/" className="text-xl font-bold text-white/60 hover:text-white transition-colors">
            ← Back
          </Link>
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>Perfil</h1>
          <button onClick={handleLogout} className="text-white/60 hover:text-white transition-colors">
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto p-6">
        {/* Profile Header Card */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center text-5xl font-bold text-white">
                {user.avatar}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Space Grotesk' }}>{user.name}</h2>
              <p className="text-white/50 mb-3">{user.email}</p>

              {/* Stats Row */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
                  <Trophy className="w-5 h-5 text-violet-400" />
                  <div>
                    <div className="text-xs text-white/40 uppercase">Vitórias</div>
                    <div className="font-bold text-white">{stats?.wins || 0}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
                  <Coins className="w-5 h-5 text-yellow-400" />
                  <div>
                    <div className="text-xs text-white/40 uppercase">Pontos</div>
                    <div className="font-bold text-white">{stats?.totalPoints || 0}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <div>
                    <div className="text-xs text-white/40 uppercase">Jogos</div>
                    <div className="font-bold text-white">{stats?.totalGames || 0}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {["stats", "achievements", "history"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "bg-violet-500/15 text-violet-400 border border-violet-400/30"
                  : "text-white/60 hover:text-white bg-white/5 border border-white/10"
              }`}
            >
              {tab === "stats" && <Activity className="w-4 h-4 inline mr-2" />}
              {tab === "achievements" && <Star className="w-4 h-4 inline mr-2" />}
              {tab === "history" && <Trophy className="w-4 h-4 inline mr-2" />}
              {tab === "stats" && "Estatísticas"}
              {tab === "achievements" && "Conquistas"}
              {tab === "history" && "Histórico"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "stats" && (
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div className="glass-panel p-4 text-center">
              <div className="text-3xl font-bold text-white mb-1">{stats?.totalGames || 0}</div>
              <div className="text-xs text-white/40 uppercase">Jogos Totais</div>
            </div>
            <div className="glass-panel p-4 text-center">
              <div className="text-3xl font-bold text-violet-400 mb-1">{stats?.wins || 0}</div>
              <div className="text-xs text-white/40 uppercase">Vitórias</div>
            </div>
            <div className="glass-panel p-4 text-center">
              <div className="text-3xl font-bold text-pink-400 mb-1">{stats?.totalPoints || 0}</div>
              <div className="text-xs text-white/40 uppercase">Pontos Totais</div>
            </div>
            <div className="glass-panel p-4 text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-1">{stats?.accuracy || 0}%</div>
              <div className="text-xs text-white/40 uppercase">Taxa de Acerto</div>
            </div>
          </motion.section>
        )}

        {activeTab === "achievements" && (
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            {achievements.map((achievement) => (
              <div 
                key={achievement.id}
                className={`glass-panel p-4 text-center transition-all ${
                  achievement.earned 
                    ? "hover:border-violet-400/50" 
                    : "opacity-40 grayscale"
                }`}
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <div className="font-medium text-white text-sm">{achievement.name}</div>
                {achievement.earned && (
                  <div className="text-xs text-emerald-400 mt-1">Desbloqueado!</div>
                )}
              </div>
            ))}
          </motion.section>
        )}

        {activeTab === "history" && (
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <h3 className="text-lg font-bold text-white mb-4">Os teus últimos jogos</h3>
            {gamesHistory.length === 0 ? (
              <div className="glass-panel p-6 text-center">
                <p className="text-white/50">Ainda não jogaste nenhum jogo!</p>
                <p className="text-white/30 text-sm mt-2">Joga para veres o teu histórico aqui.</p>
              </div>
            ) : (
              gamesHistory.slice(0, 10).map((game: any, idx: number) => (
                <div key={game.id} className="glass-panel p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="text-white font-medium">Jogo #{game.game_id?.slice(-6)}</div>
                      <div className="text-white/40 text-sm">
                        {new Date(game.created_at).toLocaleDateString('pt-PT')}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-violet-400 font-bold">{game.score || 0} pts</div>
                    <div className={`text-sm ${game.is_correct ? 'text-green-400' : 'text-red-400'}`}>
                      {game.is_correct ? '✓ Acertou' : '✗ Errou'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </motion.section>
        )}
      </div>

      <MobileNav />
      <div className="h-20 md:hidden" />
    </main>
  );
}