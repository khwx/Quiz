"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Trophy, Clock, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import MobileNav from "@/components/MobileNav";
import ToastContainer from "@/components/Toast";
import { useToast } from "@/hooks/useToast";
import type { Question, Answer, Player } from "@/types";

export default function ReplayPage() {
  const searchParams = useSearchParams();
  const gameId = searchParams.get("gameId");
  const { toasts, show: showToast, dismiss } = useToast();
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState<{ id: string; status: string; created_at: string } | null>(null);
  const [questions, setQuestions] = useState<(Question & { answers: (Answer & { player: Player })[] })[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    if (!gameId) return;
    loadReplay();
  }, [gameId]);

  const loadReplay = async () => {
    try {
      const { data: gameData } = await supabase.from("games").select("*").eq("id", gameId!).single();
      if (!gameData) {
        showToast("Jogo não encontrado.", "error");
        setLoading(false);
        return;
      }
      setGame(gameData);

      const { data: playersData } = await supabase.from("players").select("*").eq("game_id", gameId!);
      setPlayers(playersData || []);

      const { data: answersData } = await supabase
        .from("answers")
        .select("*, players(*)")
        .eq("game_id", gameId!)
        .order("created_at", { ascending: true });

      const { data: questionsData } = await supabase
        .from("questions")
        .select("*")
        .in("id", (answersData || []).map((a) => a.question_id).filter(Boolean));

      const questionsMap = new Map<string, Question>();
      (questionsData || []).forEach((q) => questionsMap.set(q.id, q));

      const answersByQuestion = new Map<string, (Answer & { player: Player })[]>();
      (answersData || []).forEach((a) => {
        const list = answersByQuestion.get(a.question_id) || [];
        list.push({ ...a, player: a.players as Player });
        answersByQuestion.set(a.question_id, list);
      });

      const replayQuestions = Array.from(questionsMap.entries())
        .map(([id, q]) => ({
          ...q,
          answers: answersByQuestion.get(id) || [],
        }))
        .sort((a, b) => {
          const aAnswers = a.answers;
          const bAnswers = b.answers;
          return (aAnswers[0]?.created_at || "").localeCompare(bAnswers[0]?.created_at || "");
        });

      setQuestions(replayQuestions);
    } catch {
      showToast("Erro ao carregar replay.", "error");
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

  if (!gameId || !game) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-on-surface-variant">Jogo não encontrado.</p>
        <Link href="/" className="text-primary font-bold">Voltar</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface via-transparent to-surface">
      <header className="fixed top-0 w-full z-50 bg-surface/50 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between px-4 h-16 max-w-screen-xl mx-auto">
          <Link href="/" className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-display text-lg font-bold text-primary">Replay do Jogo</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="pt-20 pb-32 px-4 max-w-2xl mx-auto space-y-6">
        {questions.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
            <Trophy className="w-12 h-12 text-on-surface-variant/30 mx-auto mb-4" />
            <p className="text-on-surface-variant">Sem respostas para mostrar.</p>
          </motion.div>
        )}

        {questions.map((q, idx) => {
          const correctOption = q.options[q.correct_option ?? 0];
          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-panel rounded-xl p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Pergunta {idx + 1}</span>
                <span className="text-xs text-on-surface-variant/60">{q.category}</span>
              </div>

              <h3 className="text-lg font-bold text-on-surface">{q.text}</h3>

              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  const optAnswers = q.answers.filter((a) => a.chosen_option === oi);
                  const isCorrect = oi === q.correct_option;
                  return (
                    <div
                      key={oi}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        isCorrect
                          ? "bg-green-500/10 border-green-500/30"
                          : "bg-white/5 border-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isCorrect ? "bg-green-500 text-white" : "bg-white/10 text-on-surface-variant"
                        }`}>
                          {String.fromCharCode(65 + oi)}
                        </span>
                        <span className={`text-sm ${isCorrect ? "text-green-300 font-bold" : "text-on-surface"}`}>
                          {opt}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isCorrect && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                        <span className="text-xs text-on-surface-variant/60">
                          {optAnswers.length} {optAnswers.length === 1 ? "resposta" : "respostas"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {q.answers.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Quem respondeu</h4>
                  <div className="flex flex-wrap gap-2">
                    {q.answers.map((a) => (
                      <div
                        key={a.id}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${
                          a.is_correct ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"
                        }`}
                      >
                        <span>{a.player.avatar || "🎮"}</span>
                        <span>{a.player.name}</span>
                        {a.is_correct ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </main>

      <MobileNav />
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
      <div className="h-20 md:hidden" />
    </div>
  );
}
