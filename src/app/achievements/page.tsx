"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Lock, CheckCircle } from "lucide-react";
import MobileNav from "@/components/MobileNav";
import { supabase } from "@/lib/supabase";
import { ACHIEVEMENT_CATALOG, RARITY_POINTS } from "@/lib/achievements";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "legendary" | "epic" | "rare" | "common";
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  category: string;
}

const RARITY_CONFIG = {
  legendary: { label: "Lendário", color: "text-secondary", bg: "bg-secondary/10", border: "border-secondary/20", glow: "shadow-[0_0_20px_rgba(255,176,205,0.2)]" },
  epic: { label: "Épico", color: "text-tertiary", bg: "bg-tertiary/10", border: "border-tertiary/20", glow: "shadow-[0_0_20px_rgba(222,183,255,0.2)]" },
  rare: { label: "Raro", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", glow: "shadow-[0_0_20px_rgba(208,188,255,0.2)]" },
  common: { label: "Comum", color: "text-on-surface/50", bg: "bg-white/5", border: "border-white/10", glow: "" },
};

const CATEGORIES = ["Todas", "Vitórias", "Sequências", "Precisão", "Social"];

export default function AchievementsPage() {
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setAchievements(ACHIEVEMENT_CATALOG.map((a) => ({ ...a, progress: 0, maxProgress: 1, unlocked: false })));
          setLoading(false);
          return;
        }

        const { data: players } = await supabase
          .from("players")
          .select("id")
          .eq("user_id", user.id);

        const playerIds = (players || []).map((p) => p.id);

        let unlockedIds = new Set<string>();
        if (playerIds.length > 0) {
          const { data: rows } = await supabase
            .from("achievements")
            .select("achievement_id")
            .in("player_id", playerIds);
          unlockedIds = new Set((rows || []).map((r) => r.achievement_id));
        }

        setAchievements(
          ACHIEVEMENT_CATALOG.map((a) => ({
            ...a,
            progress: unlockedIds.has(a.id) ? 1 : 0,
            maxProgress: 1,
            unlocked: unlockedIds.has(a.id),
          }))
        );
      } catch {
        setAchievements(ACHIEVEMENT_CATALOG.map((a) => ({ ...a, progress: 0, maxProgress: 1, unlocked: false })));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = activeCategory === "Todas"
    ? achievements
    : achievements.filter((a) => a.category === activeCategory);

  const unlocked = achievements.filter((a) => a.unlocked).length;
  const total = achievements.length;
  const astroPoints = useMemo(
    () => achievements.filter((a) => a.unlocked).reduce((sum, a) => sum + RARITY_POINTS[a.rarity], 0),
    [achievements]
  );

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <span className="text-primary animate-pulse">A carregar conquistas...</span>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden pb-24">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[60vw] h-[60vw] bg-primary/10 blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-secondary/10 blur-[150px]" />
      </div>

      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-4xl mx-auto">
          <Link href="/profile" className="text-sm text-on-surface/60 hover:text-on-surface transition-colors flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-lg font-bold text-on-surface">Conquistas</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto p-6">
        {/* Stats header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6 bg-surface-container/50 backdrop-blur-sm p-4 rounded-xl border border-white/5"
        >
          <div>
            <p className="text-[10px] text-secondary uppercase tracking-wider font-bold">Desbloqueadas</p>
            <p className="text-xl font-bold text-on-surface">{unlocked}/{total}</p>
          </div>
          <div className="h-10 w-px bg-white/10" />
          <div>
            <p className="text-[10px] text-amber-400 uppercase tracking-wider font-bold">Pontos Astro</p>
            <p className="text-xl font-bold text-on-surface">{astroPoints.toLocaleString("pt-PT")}</p>
          </div>
        </motion.div>

        {/* Category filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "text-on-surface/50 border border-white/10 hover:text-primary hover:border-primary/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Achievements grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((achievement, idx) => {
            const rarity = RARITY_CONFIG[achievement.rarity];
            const progressPercent = (achievement.progress / achievement.maxProgress) * 100;

            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className={`glass-panel p-5 rounded-2xl flex flex-col items-center text-center relative overflow-hidden group ${
                  !achievement.unlocked ? "opacity-60" : ""
                } ${rarity.glow}`}
              >
                {/* Rarity badge */}
                <div className="absolute top-3 right-3">
                  <span className={`text-[10px] font-bold ${rarity.color} ${rarity.bg} px-2 py-1 rounded-full uppercase tracking-wider`}>
                    {rarity.label}
                  </span>
                </div>

                {/* Icon */}
                <div className="w-20 h-20 mb-3 relative flex items-center justify-center">
                  <div className={`absolute inset-0 ${rarity.bg} blur-xl rounded-full group-hover:opacity-80 transition-all`} />
                  <motion.span
                    animate={achievement.unlocked ? { y: [0, -5, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="text-4xl relative z-10"
                  >
                    {achievement.unlocked ? achievement.icon : "🔒"}
                  </motion.span>
                </div>

                <h3 className={`font-bold mb-1 ${achievement.unlocked ? "text-on-surface" : "text-on-surface/50"}`}>
                  {achievement.name}
                </h3>
                <p className="text-xs text-on-surface/40 mb-3">{achievement.description}</p>

                {/* Progress bar */}
                <div className="w-full mt-auto">
                  <div className="flex justify-between text-[10px] uppercase font-bold text-on-surface/30 mb-1">
                    <span>Progresso</span>
                    <span>{achievement.progress}/{achievement.maxProgress}</span>
                  </div>
                  <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ delay: 0.3 + idx * 0.05, duration: 0.5 }}
                      className="h-full rounded-full"
                      style={{
                        background: achievement.unlocked
                          ? "linear-gradient(90deg, #d0bcff, #FFB0CD)"
                          : `linear-gradient(90deg, ${rarity.color === "text-secondary" ? "#FFB0CD" : rarity.color === "text-tertiary" ? "#deb7ff" : "#d0bcff"} 0%, ${rarity.color === "text-secondary" ? "#FFB0CD" : rarity.color === "text-tertiary" ? "#b86dfd" : "#a078ff"} 100%)`,
                      }}
                    />
                  </div>
                  {achievement.unlocked && (
                    <div className="mt-2 flex items-center justify-center gap-1 text-green-400">
                      <CheckCircle className="w-3 h-3" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Concluído</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <MobileNav />
      <div className="h-20 md:hidden" />
    </main>
  );
}
