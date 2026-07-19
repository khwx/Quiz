"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Gamepad2, HelpCircle, MessageSquare, Users, TrendingUp } from "lucide-react";
import { supabase } from "@/lib/supabase";
import MobileNav from "@/components/MobileNav";
import ToastContainer from "@/components/Toast";
import { useToast } from "@/hooks/useToast";

interface AnalyticsData {
  totalGames: number;
  totalQuestions: number;
  totalAnswers: number;
  totalPlayers: number;
  avgAnswersPerGame: number;
  categoryStats: { name: string; count: number }[];
  recentGames: { id: string; created_at: string; status: string }[];
  difficultyStats: { difficulty: number; count: number }[];
}

export default function AnalyticsPage() {
  const router = useRouter();
  const { toasts, show: showToast, dismiss } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [gamesRes, questionsRes, answersRes, playersRes, questionsWithCategoryRes, recentGamesRes, difficultyRes] = await Promise.all([
        supabase.from("games").select("id, created_at, status", { count: "exact" }),
        supabase.from("questions").select("id", { count: "exact" }),
        supabase.from("answers").select("id, question_id", { count: "exact" }),
        supabase.from("players").select("id", { count: "exact" }),
        supabase.from("questions").select("category, difficulty"),
        supabase.from("games").select("id, created_at, status").order("created_at", { ascending: false }).limit(5),
        supabase.from("questions").select("difficulty", { count: "exact" }),
      ]);

      const games = gamesRes.data || [];
      const questions = questionsRes.data || [];
      const answers = answersRes.data || [];
      const players = playersRes.data || [];
      const questionsWithCategory = questionsWithCategoryRes.data || [];

      const categoryMap = new Map<string, number>();
      (questionsWithCategory || []).forEach((q) => {
        const cat = q.category || "Outros";
        categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
      });

      const categoryStats = Array.from(categoryMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      const difficultyMap = new Map<number, number>();
      questionsWithCategory.forEach((q) => {
        const diff = q.difficulty || 2;
        difficultyMap.set(diff, (difficultyMap.get(diff) || 0) + 1);
      });
      const difficultyStats = Array.from(difficultyMap.entries())
        .map(([difficulty, count]) => ({ difficulty, count }))
        .sort((a, b) => a.difficulty - b.difficulty);

      setData({
        totalGames: games.length,
        totalQuestions: questions.length,
        totalAnswers: answers.length,
        totalPlayers: players.length,
        avgAnswersPerGame: games.length ? Math.round(answers.length / games.length) : 0,
        categoryStats,
        recentGames: recentGamesRes.data || [],
        difficultyStats,
      });
    } catch {
      showToast("Erro ao carregar analytics.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface via-transparent to-surface">
      <header className="fixed top-0 w-full z-50 bg-surface/50 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between px-4 h-16 max-w-screen-xl mx-auto">
          <Link href="/admin" className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-display text-lg font-bold text-primary">Analytics</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="pt-20 pb-32 px-4 max-w-2xl mx-auto space-y-6">
        {data && (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-4">
              <div className="glass-panel rounded-xl p-4 text-center">
                <Gamepad2 className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-on-surface">{data.totalGames}</div>
                <div className="text-xs text-on-surface-variant">Jogos</div>
              </div>
              <div className="glass-panel rounded-xl p-4 text-center">
                <HelpCircle className="w-6 h-6 text-secondary mx-auto mb-2" />
                <div className="text-2xl font-bold text-on-surface">{data.totalQuestions}</div>
                <div className="text-xs text-on-surface-variant">Perguntas</div>
              </div>
              <div className="glass-panel rounded-xl p-4 text-center">
                <MessageSquare className="w-6 h-6 text-tertiary mx-auto mb-2" />
                <div className="text-2xl font-bold text-on-surface">{data.totalAnswers}</div>
                <div className="text-xs text-on-surface-variant">Respostas</div>
              </div>
              <div className="glass-panel rounded-xl p-4 text-center">
                <Users className="w-6 h-6 text-error mx-auto mb-2" />
                <div className="text-2xl font-bold text-on-surface">{data.totalPlayers}</div>
                <div className="text-xs text-on-surface-variant">Jogadores</div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-on-surface">Métricas</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-on-surface-variant">Média respostas/jogo</span>
                  <span className="font-bold text-on-surface">{data.avgAnswersPerGame}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-on-surface-variant">Jogos recentes</span>
                  <span className="font-bold text-on-surface">{data.recentGames.length}</span>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-panel rounded-xl p-5">
              <h3 className="font-bold text-on-surface mb-4">Dificuldade das Perguntas</h3>
              <div className="space-y-2">
                {data.difficultyStats.map((stat) => (
                  <div key={stat.difficulty} className="flex items-center justify-between">
                    <span className="text-sm text-on-surface">
                      {stat.difficulty === 1 ? "Fácil" : stat.difficulty === 2 ? "Médio" : "Difícil"}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-secondary"
                          style={{ width: `${(stat.count / data.totalQuestions) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-on-surface w-8 text-right">{stat.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel rounded-xl p-5">
              <h3 className="font-bold text-on-surface mb-4">Categorias Populares</h3>
              <div className="space-y-2">
                {data.categoryStats.map((cat, i) => (
                  <div key={cat.name} className="flex items-center justify-between">
                    <span className="text-sm text-on-surface">{cat.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-tertiary-container to-primary-container"
                          style={{ width: `${(cat.count / data.totalQuestions) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-primary w-8 text-right">{cat.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {data.recentGames.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-panel rounded-xl p-5">
                <h3 className="font-bold text-on-surface mb-4">Jogos Recentes</h3>
                <div className="space-y-2">
                  {data.recentGames.map((game) => (
                    <div key={game.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          game.status === "PODIUM" ? "bg-green-400" : game.status === "LOBBY" ? "bg-yellow-400" : "bg-blue-400"
                        }`} />
                        <span className="text-sm text-on-surface">
                          {new Date(game.created_at).toLocaleDateString("pt-PT")}
                        </span>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        game.status === "PODIUM" ? "bg-green-500/10 text-green-400" : "bg-blue-500/10 text-blue-400"
                      }`}>
                        {game.status}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}
      </main>

      <MobileNav />
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
      <div className="h-20 md:hidden" />
    </div>
  );
}
