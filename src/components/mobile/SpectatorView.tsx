"use client";

import { useGame } from "@/context/GameContext";
import { supabase } from "@/lib/supabase";
import { GAME_CONSTANTS, GameStatus } from "@/lib/constants";
import { useEffect, useState, useCallback } from "react";
import type { Question, Answer } from "@/types";
import { Eye, Users, Trophy, Clock } from "lucide-react";

export default function SpectatorView({ pin, onLeave }: { pin: string; onLeave: () => void }) {
  const { gameId, status, currentQuestionIndex, players, gameSettings, joinSpectator } = useGame();
  const [questionData, setQuestionData] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(GAME_CONSTANTS.DEFAULT_TIMER);
  const [correctOption, setCorrectOption] = useState<number | null>(null);

  useEffect(() => {
    if (!gameId) return;
    joinSpectator(gameId);
  }, [gameId, joinSpectator]);

  const fetchQuestion = useCallback(async () => {
    const qid = gameSettings?.current_question_id || gameSettings?.question_ids?.[currentQuestionIndex - 1];
    if (!qid) return;
    const { data } = await supabase
      .from("questions")
      .select("id, text, options, correct_option, image_url, category, metadata, difficulty")
      .eq("id", qid)
      .single();
    if (data) {
      setQuestionData(data);
      setCorrectOption(data.correct_option ?? null);
    }
  }, [gameSettings, currentQuestionIndex]);

  useEffect(() => {
    if (status === "QUESTION") {
      (async () => {
        await fetchQuestion();
      })();
    }
  }, [status, currentQuestionIndex, fetchQuestion, gameSettings]);

  useEffect(() => {
    if (status === "QUESTION") {
      setTimeout(() => {
        setTimeLeft(gameSettings?.timer_duration || GAME_CONSTANTS.DEFAULT_TIMER);
      }, 0);
    }
  }, [status, currentQuestionIndex, gameSettings]);

  useEffect(() => {
    if (status === "QUESTION" && gameId) {
      const channel = supabase
        .channel(`spectator-answers-${gameId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "answers",
            filter: `game_id=eq.${gameId}`,
          },
          (payload) => {
            setAnswers((prev) => {
              if (prev.some((a) => a.id === payload.new.id)) return prev;
              return [...prev, payload.new as Answer];
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [status, gameId]);

  useEffect(() => {
    if (status === "QUESTION") {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status]);

  useEffect(() => {
    if (status === "REVEAL") {
      const qid = gameSettings?.current_question_id || gameSettings?.question_ids?.[currentQuestionIndex - 1];
      if (qid && correctOption === null) {
        supabase
          .from("questions")
          .select("correct_option")
          .eq("id", qid)
          .single()
          .then(({ data }) => {
            if (data) setCorrectOption(data.correct_option);
          });
      }
    }
  }, [status, gameSettings, currentQuestionIndex, correctOption]);

  const statusLabel: Record<string, string> = {
    [GameStatus.LOBBY]: "Lobby",
    [GameStatus.STARTING]: "A iniciar...",
    [GameStatus.QUESTION]: "Pergunta",
    [GameStatus.REVEAL]: "Revelação",
    [GameStatus.LEADERBOARD]: "Classificação",
    [GameStatus.FINAL]: "Final",
    [GameStatus.PODIUM]: "Pódio",
  };

  const getDifficultyLabel = (d?: number) => {
    if (d === 1) return "Fácil";
    if (d === 2) return "Médio";
    if (d === 3) return "Difícil";
    return undefined;
  };

  const currentQid = gameSettings?.current_question_id || gameSettings?.question_ids?.[currentQuestionIndex - 1];
  const questionAnswers = answers.filter((a) => String(a.question_id) === String(currentQid));

  return (
    <main className="min-h-screen relative overflow-hidden pb-24">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#4a007f] blur-[150px] opacity-40 rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#aa0266] blur-[150px] opacity-30 rounded-full" />
      </div>

      <header className="sticky top-0 z-50 bg-[#121223]/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-[#d0bcff]" />
            <h1 className="text-lg font-bold text-[#e3e0f9]">Modo Espectador</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-white/60 font-mono">PIN: {pin}</span>
            <button
              onClick={onLeave}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-all"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto p-6 space-y-6">
        <div className="glass-panel p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-[#d0bcff]/10 rounded-xl">
              <div className="text-xs text-[#d0bcff]/70 uppercase tracking-widest font-bold">Fase</div>
              <div className="text-lg font-black text-[#d0bcff]">{statusLabel[status] || status}</div>
            </div>
{status === GameStatus.QUESTION && (
              <div className="px-4 py-2 bg-[#FF6B6B]/10 rounded-xl">
                <div className="text-xs text-[#FF6B6B]/70 uppercase tracking-widest font-bold">Pergunta</div>
                <div className="text-lg font-black text-white">
                  {currentQuestionIndex} / {gameSettings?.question_ids?.length || "?"}
                </div>
              </div>
            )}
          </div>
          {status === "QUESTION" && (
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-white/40" />
              <span className={`text-2xl font-black ${timeLeft <= 5 ? "text-red-400 animate-pulse" : "text-white"}`}>
                {timeLeft}s
              </span>
            </div>
          )}
        </div>

        {status === GameStatus.LOBBY || status === GameStatus.STARTING ? (
          <div className="glass-panel p-8 text-center">
            <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">A aguardar início...</h2>
            <p className="text-white/50 text-sm">O anfitrião vai iniciar o jogo em breve.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {players.map((p) => (
                <div key={p.id} className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-xl">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                    style={{ backgroundColor: p.color + "33", color: p.color }}
                  >
                    {p.avatar}
                  </div>
                  <span className="text-white text-sm font-medium">{p.name}</span>
                  {p.is_host && <span className="text-[10px] bg-[#d0bcff]/20 text-[#d0bcff] px-1.5 py-0.5 rounded-full font-bold">HOST</span>}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {status === GameStatus.QUESTION && questionData && (
          <div className="space-y-4">
            <div className="glass-panel p-6">
              {questionData.category && (
                <span className="text-xs font-bold text-[#d0bcff] uppercase tracking-widest">{questionData.category}</span>
              )}
              {getDifficultyLabel(questionData.difficulty) && (
                <span className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-full ${
                  questionData.difficulty === 1 ? "bg-green-500/20 text-green-300" :
                  questionData.difficulty === 2 ? "bg-yellow-500/20 text-yellow-300" :
                  "bg-red-500/20 text-red-300"
                }`}>
                  {getDifficultyLabel(questionData.difficulty)}
                </span>
              )}
              <h2 className="text-xl font-bold text-white mt-2 leading-relaxed">{questionData.text}</h2>
              {questionData.image_url && (
                <img src={questionData.image_url} alt="" className="mt-4 rounded-xl max-h-48 object-contain mx-auto" />
              )}
              <div className="mt-4 grid grid-cols-2 gap-3">
                {questionData.options.map((opt, idx) => {
                  const answerCount = questionAnswers.filter((a) => a.chosen_option === idx).length;
                  const isCorrect = idx === correctOption;
                  const showResults = correctOption !== null;
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl text-sm font-medium transition-all ${
                        showResults && isCorrect
                          ? "bg-green-500/20 border-2 border-green-500/50 text-green-300"
                          : showResults && answerCount > 0
                            ? "bg-white/5 border border-white/10 text-white/60"
                            : "bg-white/5 border border-white/10 text-white/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{opt}</span>
                        {showResults && answerCount > 0 && (
                          <span className="text-xs font-bold">{answerCount}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {status === GameStatus.REVEAL && questionData && (
          <div className="glass-panel p-6">
            <h3 className="text-lg font-bold text-white mb-3">Resultados</h3>
            <div className="space-y-2">
              {players
                .slice()
                .sort((a, b) => b.score - a.score)
                .map((p, idx) => {
                  const playerAnswers = questionAnswers.filter((a) => a.player_id === p.id);
                  const lastAnswer = playerAnswers[playerAnswers.length - 1];
                  return (
                    <div key={p.id} className="flex items-center justify-between bg-white/5 p-3 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-black text-white/30 w-6">{idx + 1}</span>
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                          style={{ backgroundColor: p.color + "33", color: p.color }}
                        >
                          {p.avatar}
                        </div>
                        <span className="text-white font-medium">{p.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {lastAnswer && (
                          <span className={`text-xs font-bold ${lastAnswer.is_correct ? "text-green-400" : "text-red-400"}`}>
                            {lastAnswer.is_correct ? `+${lastAnswer.points}` : "+0"}
                          </span>
                        )}
                        <span className="text-white font-bold">{p.score}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {(status === GameStatus.LEADERBOARD || status === GameStatus.PODIUM || status === GameStatus.FINAL) && (
          <div className="glass-panel p-6">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-[#d0bcff]" />
              <h3 className="text-lg font-bold text-white">Classificação</h3>
            </div>
            <div className="space-y-2">
              {players
                .slice()
                .sort((a, b) => b.score - a.score)
                .map((p, idx) => (
                  <div key={p.id} className="flex items-center justify-between bg-white/5 p-3 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-black text-white/30 w-6">{idx + 1}</span>
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                        style={{ backgroundColor: p.color + "33", color: p.color }}
                      >
                        {p.avatar}
                      </div>
                      <span className="text-white font-medium">{p.name}</span>
                    </div>
                    <span className="text-white font-bold">{p.score}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {!gameId && status === GameStatus.LOBBY && (
          <div className="glass-panel p-8 text-center">
            <Eye className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">A ligar ao jogo...</h2>
            <p className="text-white/50 text-sm">PIN: {pin}</p>
          </div>
        )}
      </div>
    </main>
  );
}
