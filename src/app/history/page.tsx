"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Rocket, FlaskConical, Brain, Globe, Palette, History } from "lucide-react";
import { supabase } from "@/lib/supabase";
import MobileNav from "@/components/MobileNav";

interface GameHistoryItem {
  id: string;
  category: string;
  date: string;
  score: number;
  accuracy: number;
  icon: any;
  color: string;
}

const CATEGORY_ICONS: Record<string, { icon: any; color: string }> = {
  "CULTURA_GERAL": { icon: Globe, color: "#d0bcff" },
  "HISTORIA": { icon: History, color: "#FFD700" },
  "CIENCIA": { icon: FlaskConical, color: "#4CAF50" },
  "MATEMATICA": { icon: Brain, color: "#FFB0CD" },
  "ARTE": { icon: Palette, color: "#deb7ff" },
  "default": { icon: Rocket, color: "#d0bcff" },
};

const FILTERS = ["Tudo", "Vitórias", "Recentes"];

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" });
}

function modeCategory(categories: string[]): string {
  if (categories.length === 0) return "CULTURA_GERAL";
  const counts = new Map<string, number>();
  for (const c of categories) counts.set(c, (counts.get(c) || 0) + 1);
  let best = categories[0];
  let bestCount = 0;
  for (const [cat, count] of counts) {
    if (count > bestCount) {
      best = cat;
      bestCount = count;
    }
  }
  return best;
}

export default function HistoryPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("Tudo");
  const [history, setHistory] = useState<GameHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: players } = await supabase
        .from("players")
        .select("id")
        .eq("user_id", user.id);

      const playerIds = players?.map((p) => p.id) || [];
      if (playerIds.length === 0) {
        setLoading(false);
        return;
      }

      const { data: answers } = await supabase
        .from("answers")
        .select("game_id, is_correct, points, created_at, question_id")
        .in("player_id", playerIds)
        .order("created_at", { ascending: false })
        .limit(500);

      const userAnswers = answers || [];
      if (userAnswers.length === 0) {
        setLoading(false);
        return;
      }

      const questionIds = Array.from(new Set(userAnswers.map((a) => a.question_id).filter(Boolean)));
      const { data: questions } = await supabase
        .from("questions")
        .select("id, category")
        .in("id", questionIds);
      const questionCategoryMap = new Map((questions || []).map((q) => [q.id, q.category]));

      const gamesMap = new Map<string, { points: number; total: number; correct: number; date: string; categories: string[] }>();
      for (const a of userAnswers) {
        const gameId = a.game_id as string;
        const entry = gamesMap.get(gameId) || { points: 0, total: 0, correct: 0, date: a.created_at, categories: [] as string[] };
        entry.points += a.points || 0;
        entry.total += 1;
        if (a.is_correct) entry.correct += 1;
        if (a.created_at > entry.date) entry.date = a.created_at;
        const cat = questionCategoryMap.get(a.question_id);
        if (cat) entry.categories.push(cat);
        gamesMap.set(gameId, entry);
      }

      const items: GameHistoryItem[] = Array.from(gamesMap.entries())
        .map(([gameId, e]) => {
          const accuracy = e.total > 0 ? Math.round((e.correct / e.total) * 100) : 0;
          const category = modeCategory(e.categories);
          const config = CATEGORY_ICONS[category] || CATEGORY_ICONS.default;
          return {
            id: gameId,
            category,
            date: formatDate(e.date),
            score: e.points,
            accuracy,
            icon: config.icon,
            color: config.color,
          };
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setHistory(items);
    } catch {
      // keep empty on error
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    if (activeFilter === "Vitórias") return history.filter((item) => item.accuracy >= 80);
    return history;
  }, [activeFilter, history]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#121223]">
        <div className="w-8 h-8 border-2 border-[#d0bcff]/30 border-t-[#d0bcff] rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden pb-24">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-[#d0bcff]/10 blur-[120px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-[#FFB0CD]/10 blur-[100px]" />
      </div>

      <header className="sticky top-0 z-50 bg-[#121223]/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-4xl mx-auto">
          <Link href="/" className="text-sm text-[#e3e0f9]/60 hover:text-[#e3e0f9] transition-colors flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-lg font-bold text-[#e3e0f9]">Histórico de Missões</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto p-6">
        {/* Filter chips */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                activeFilter === filter
                  ? "bg-[#d0bcff]/15 text-[#d0bcff] border border-[#d0bcff]/30 shadow-[0_0_15px_rgba(208,188,255,0.3)]"
                  : "text-[#e3e0f9]/50 border border-white/10 hover:text-[#d0bcff] hover:border-[#d0bcff]/30 transition-all"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* History list */}
        <div className="space-y-3">
          {filtered.map((item, idx) => {
            const catConfig = CATEGORY_ICONS[item.category] || CATEGORY_ICONS.default;
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-panel p-4 rounded-xl flex items-center gap-4 relative overflow-hidden group hover:border-[#d0bcff]/30 transition-all"
              >
                {/* Accent bar */}
                <div
                  className="absolute inset-y-0 left-0 w-1 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"
                  style={{ backgroundColor: item.color }}
                />

                <div
                  className="w-14 h-14 rounded-lg flex items-center justify-center border shrink-0"
                  style={{
                    backgroundColor: `${item.color}20`,
                    borderColor: `${item.color}30`,
                    color: item.color,
                  }}
                >
                  <Icon className="w-7 h-7" />
                </div>

                <div className="flex-grow min-w-0">
                  <h3 className="font-bold text-[#d0bcff] truncate">{item.category.replace(/_/g, " ")}</h3>
                  <p className="text-[#e3e0f9]/50 text-sm">{item.date}</p>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#e3e0f9]/40 uppercase">Pontuação</span>
                    <span className="font-bold text-[#d0bcff]">{item.score.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#e3e0f9]/40 uppercase">Precisão</span>
                    <span className="font-bold text-[#FFB0CD]">{item.accuracy}%</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <History className="w-12 h-12 text-[#e3e0f9]/20 mx-auto mb-4" />
            <p className="text-[#e3e0f9]/50">Ainda não tens missões registadas</p>
          </div>
        )}
      </div>

      <MobileNav />
      <div className="h-20 md:hidden" />
    </main>
  );
}
