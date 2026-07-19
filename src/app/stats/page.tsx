"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Target,
  CheckSquare,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import MobileNav from "@/components/MobileNav";
import ToastContainer from "@/components/Toast";
import { useToast } from "@/hooks/useToast";

interface CategoryStat {
  name: string;
  icon: string;
  accuracy: number;
  color: string;
}

interface Achievement {
  id: number;
  name: string;
  icon: string;
  description: string;
  progress: number;
  target: number;
  unlocked: boolean;
}

interface QuickStats {
  accuracy: number;
  missionsCompleted: number;
  flightTime: string;
}

// Simple SVG chart component
function AccuracyChart({ data }: { data: number[] }) {
  const width = 300;
  const height = 120;
  const padding = 20;

  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - (value / 100) * (height - padding * 2);
    return { x, y };
  });

  const pathD = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-32">
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a078ff" />
          <stop offset="100%" stopColor="#ffb0cd" />
        </linearGradient>
        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a078ff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#a078ff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map((value) => {
        const y = height - padding - (value / 100) * (height - padding * 2);
        return (
          <line
            key={value}
            x1={padding}
            y1={y}
            x2={width - padding}
            y2={y}
            stroke="#333346"
            strokeWidth="0.5"
          />
        );
      })}

      {/* Area fill */}
      <path
        d={`${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`}
        fill="url(#areaGradient)"
      />

      {/* Line */}
      <path
        d={pathD}
        fill="none"
        stroke="url(#lineGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="chart-line-gradient"
      />

      {/* Points */}
      {points.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r="4"
          fill="#a078ff"
          stroke="#1e1e30"
          strokeWidth="2"
        />
      ))}
    </svg>
  );
}

export default function StatsPage() {
  const router = useRouter();
  const { toasts, show: showToast, dismiss } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<import("@supabase/supabase-js").User | null>(null);
  const [quickStats, setQuickStats] = useState<QuickStats>({
    accuracy: 0,
    missionsCompleted: 0,
    flightTime: "0h 0m",
  });
  const [chartData, setChartData] = useState<number[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const sortedCategories = useMemo(() => {
    return [...categoryStats].sort((a, b) => b.accuracy - a.accuracy);
  }, [categoryStats]);

  const sortedAchievements = useMemo(() => {
    return [...achievements].sort((a, b) => Number(b.unlocked) - Number(a.unlocked));
  }, [achievements]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        router.push("/login");
        return;
      }

      setUser(currentUser);

      const { data: players } = await supabase
        .from("players")
        .select("id")
        .eq("user_id", currentUser.id);

      const playerIds = players?.map(p => p.id) || [];

      if (playerIds.length > 0) {
        const { data: answers } = await supabase
          .from("answers")
          .select("game_id, is_correct, points, created_at, question_id")
          .in("player_id", playerIds)
          .order("created_at", { ascending: false });

        const userAnswers = answers || [];
        const totalAnswers = userAnswers.length;
        const correctAnswers = userAnswers.filter(a => a.is_correct).length;
        const totalGames = new Set(userAnswers.map(a => a.game_id)).size;
        
        const accuracy = totalAnswers > 0 
          ? Math.round((correctAnswers / totalAnswers) * 100) 
          : 0;

        const chartValues = userAnswers.slice(0, 7).reverse().map((a) => a.is_correct ? 80 + Math.min(20, (a.points || 0) / 50) : 20 + Math.random() * 20);

        // Fetch categories from questions linked to answers
        const questionIds = userAnswers.map(a => a.question_id).filter(Boolean);
        const { data: questions } = await supabase
          .from("questions")
          .select("id, category")
          .in("id", questionIds);

        const questionCategoryMap = new Map((questions || []).map(q => [q.id, q.category]));
        const categoryStatsMap = new Map<string, { correct: number; total: number }>();
        
        userAnswers.forEach(a => {
          const cat = questionCategoryMap.get(a.question_id) || "Outros";
          const entry = categoryStatsMap.get(cat) || { correct: 0, total: 0 };
          entry.total += 1;
          if (a.is_correct) entry.correct += 1;
          categoryStatsMap.set(cat, entry);
        });

        const categoriesData: CategoryStat[] = Array.from(categoryStatsMap.entries())
          .map(([name, stats]) => ({
            name,
            icon: "📝",
            accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
            color: "primary",
          }))
          .sort((a, b) => b.accuracy - a.accuracy)
          .slice(0, 6);

        setCategoryStats(categoriesData);

        // Real achievements based on data
        const uniqueCategories = categoryStatsMap.size;
        const unlockedAchievements: Achievement[] = [
          {
            id: 1,
            name: "Primeiro Voo",
            icon: "🚀",
            description: "Completa a tua primeira missão",
            progress: Math.min(totalGames, 1),
            target: 1,
            unlocked: totalGames >= 1,
          },
          {
            id: 2,
            name: "Explorador",
            icon: "🔭",
            description: "Joga 10 missões",
            progress: Math.min(totalGames, 10),
            target: 10,
            unlocked: totalGames >= 10,
          },
          {
            id: 3,
            name: "Mestre do Conhecimento",
            icon: "🧠",
            description: "Alcança 90% de precisão",
            progress: Math.min(accuracy, 90),
            target: 90,
            unlocked: accuracy >= 90,
          },
          {
            id: 4,
            name: "Colecionador",
            icon: "🎯",
            description: `Joga ${Math.max(uniqueCategories, 6)} categorias`,
            progress: Math.min(uniqueCategories, 6),
            target: 6,
            unlocked: uniqueCategories >= 6,
          },
          {
            id: 5,
            name: "Dedicado",
            icon: "🔥",
            description: "Responde a 100 perguntas",
            progress: Math.min(totalAnswers, 100),
            target: 100,
            unlocked: totalAnswers >= 100,
          },
          {
            id: 6,
            name: "Lenda Cósmica",
            icon: "👑",
            description: "Alcança 100% de precisão",
            progress: accuracy,
            target: 100,
            unlocked: accuracy === 100 && totalAnswers > 0,
          },
        ];

        setAchievements(unlockedAchievements);

        setQuickStats({
          accuracy,
          missionsCompleted: totalGames,
          flightTime: `${Math.floor(totalAnswers * 0.5)}h ${(totalAnswers * 30) % 60}m`,
        });
        setChartData(chartValues);
      }
    } catch {
      showToast("Erro ao carregar estatísticas.", "error");
    } finally {
      setLoading(false);
    }
  };

  const colorMap: Record<string, string> = {
    primary: "text-primary",
    secondary: "text-secondary",
    tertiary: "text-tertiary",
  };

  const bgMap: Record<string, string> = {
    primary: "bg-primary/10",
    secondary: "bg-secondary/10",
    tertiary: "bg-tertiary/10",
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface via-transparent to-surface">
      <header className="fixed top-0 w-full z-50 bg-surface/50 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between px-4 h-16 max-w-screen-xl mx-auto">
          <Link href="/profile" className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-display text-lg font-bold text-primary">Estatísticas</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="pt-20 pb-32 px-4 max-w-md mx-auto space-y-6">
        {/* Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h2 className="font-display text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Estatísticas
          </h2>
          <p className="text-on-surface-variant text-sm">
            Acompanha a tua evolução cognitiva através do cosmos.
          </p>
        </motion.section>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3"
        >
          <div className="glass-panel rounded-xl p-4 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
              <Target className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
              Precisão
            </span>
            <span className="font-display text-lg font-bold text-primary">
              {quickStats.accuracy}%
            </span>
          </div>

          <div className="glass-panel rounded-xl p-4 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary mb-2">
              <CheckSquare className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
              Missões
            </span>
            <span className="font-display text-lg font-bold text-secondary">
              {quickStats.missionsCompleted}
            </span>
          </div>

          <div className="glass-panel rounded-xl p-4 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary mb-2">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
              Tempo
            </span>
            <span className="font-display text-lg font-bold text-tertiary">
              {quickStats.flightTime}
            </span>
          </div>
        </motion.div>

        {/* Performance Chart */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel rounded-xl p-5 overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] -z-10" />
          <div className="mb-4">
            <h3 className="font-display text-lg font-bold text-on-surface mb-1">
              Precisão ao Longo do Tempo
            </h3>
            <p className="text-on-surface-variant text-xs">
              Desempenho nas últimas missões
            </p>
          </div>
          
          {chartData.length > 0 ? (
            <AccuracyChart data={chartData} />
          ) : (
            <div className="h-32 flex items-center justify-center text-on-surface-variant/50">
              Joga para veres o teu gráfico
            </div>
          )}

          <div className="flex justify-between mt-2 text-[10px] text-on-surface-variant/60">
            <span>7 atrás</span>
            <span>6 atrás</span>
            <span>5 atrás</span>
            <span>4 atrás</span>
            <span>3 atrás</span>
            <span>Ontem</span>
            <span>Hoje</span>
          </div>
        </motion.section>

        {/* Category Breakdown */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h3 className="font-display text-lg font-bold text-on-surface">
            Domínio por Categoria
          </h3>
          
          <div className="glass-panel rounded-xl p-4 space-y-4">
            {sortedCategories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{cat.icon}</span>
                    <span className="text-sm text-on-surface">{cat.name}</span>
                  </div>
                  <span className={`font-bold text-sm ${colorMap[cat.color]}`}>
                    {cat.accuracy}%
                  </span>
                </div>
                <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.accuracy}%` }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                  />
                </div>
              </motion.div>
            ))}
            {categoryStats.length === 0 && (
              <p className="text-on-surface-variant/50 text-sm text-center py-4">
                Joga para veres as tuas categorias
              </p>
            )}
          </div>
        </motion.section>

        {/* Achievements */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <h3 className="font-display text-lg font-bold text-on-surface">
            Progresso de Conquistas
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {sortedAchievements.map((achievement, i) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className={`glass-panel rounded-xl p-4 relative overflow-hidden ${
                  achievement.unlocked 
                    ? "border-primary/30" 
                    : "opacity-70"
                }`}
              >
                {achievement.unlocked && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                )}
                
                <div className="text-2xl mb-2">
                  {achievement.unlocked ? achievement.icon : "🔒"}
                </div>
                <h4 className="font-bold text-sm text-on-surface mb-1">
                  {achievement.name}
                </h4>
                <p className="text-[10px] text-on-surface-variant/60 mb-3">
                  {achievement.description}
                </p>

                {!achievement.unlocked && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-on-surface-variant/60">Progresso</span>
                      <span className="text-primary font-bold">
                        {achievement.progress}/{achievement.target}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                        style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      <MobileNav />
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
      <div className="h-20 md:hidden" />

      {/* Background effects */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -right-20 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 -left-20 w-64 h-64 bg-secondary/10 blur-[100px] rounded-full" />
      </div>
    </div>
  );
}
