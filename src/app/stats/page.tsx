"use client";

import { useState, useEffect } from "react";
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

interface QuickStats {
  accuracy: number;
  missionsCompleted: number;
  flightTime: string;
}

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

const categories: CategoryStat[] = [
  { name: "Cultura Geral", icon: "🌍", accuracy: 88, color: "primary" },
  { name: "História", icon: "📜", accuracy: 76, color: "secondary" },
  { name: "Ciência", icon: "🔬", accuracy: 92, color: "tertiary" },
  { name: "Geografia", icon: "🗺️", accuracy: 84, color: "primary" },
  { name: "Tecnologia", icon: "💻", accuracy: 95, color: "secondary" },
  { name: "Desporto", icon: "⚽", accuracy: 72, color: "tertiary" },
];

const achievements: Achievement[] = [
  { id: 1, name: "Primeiro Voo", icon: "🚀", description: "Completa a tua primeira missão", progress: 1, target: 1, unlocked: true },
  { id: 2, name: "Explorador", icon: "🔭", description: "Joga 10 missões", progress: 7, target: 10, unlocked: false },
  { id: 3, name: "Mestre do Conhecimento", icon: "🧠", description: "Alcança 90% de precisão", progress: 85, target: 90, unlocked: false },
  { id: 4, name: "Velocista Estelar", icon: "⚡", description: "Responde em menos de 5 segundos", progress: 3, target: 5, unlocked: false },
  { id: 5, name: "Colecionador", icon: "🎯", description: "Joga todas as categorias", progress: 4, target: 6, unlocked: false },
  { id: 6, name: "Lenda Cósmica", icon: "👑", description: "Alcança o nível 50", progress: 23, target: 50, unlocked: false },
];

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
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<import("@supabase/supabase-js").User | null>(null);
  const [quickStats, setQuickStats] = useState<QuickStats>({
    accuracy: 0,
    missionsCompleted: 0,
    flightTime: "0h 0m",
  });
  const [chartData, setChartData] = useState<number[]>([]);

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

      // Fetch user's answers
      const { data: players } = await supabase
        .from("players")
        .select("id")
        .eq("user_id", currentUser.id);

      const playerIds = players?.map(p => p.id) || [];

      if (playerIds.length > 0) {
        const { data: answers } = await supabase
          .from("answers")
          .select("game_id, is_correct, points, created_at")
          .in("player_id", playerIds)
          .order("created_at", { ascending: false });

        const userAnswers = answers || [];
        const totalAnswers = userAnswers.length;
        const correctAnswers = userAnswers.filter(a => a.is_correct).length;
        const totalGames = new Set(userAnswers.map(a => a.game_id)).size;
        
        // Calculate accuracy
        const accuracy = totalAnswers > 0 
          ? Math.round((correctAnswers / totalAnswers) * 100) 
          : 0;

        // Generate chart data (simulated last 7 missions)
        const chartValues = Array.from({ length: 7 }, (_, i) => {
          const base = accuracy;
          return Math.min(100, Math.max(50, base + (Math.random() - 0.5) * 20));
        });

        setQuickStats({
          accuracy,
          missionsCompleted: totalGames,
          flightTime: `${Math.floor(totalAnswers * 0.5)}h ${(totalAnswers * 30) % 60}m`,
        });
        setChartData(chartValues);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
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
            {categories.map((cat, i) => (
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
            {achievements.map((achievement, i) => (
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
      <div className="h-20 md:hidden" />

      {/* Background effects */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -right-20 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 -left-20 w-64 h-64 bg-secondary/10 blur-[100px] rounded-full" />
      </div>
    </div>
  );
}
