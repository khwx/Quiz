"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useGame } from "@/context/GameContext";
import type { Answer } from "@/types";

export function useAnswerSubscription() {
  const { gameId, players } = useGame();
  const [currentAnswers, setCurrentAnswers] = useState<Answer[]>([]);
  const currentQuestionIdsRef = useRef<string[]>([]);

  const updateQuestionIds = (questionIds: string[]) => {
    currentQuestionIdsRef.current = questionIds.map((q) => String(q));
  };

  useEffect(() => {
    if (!gameId) return;

    const channel = supabase
      .channel(`game-answers-${gameId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "answers",
          filter: `game_id=eq.${gameId}`,
        },
        (payload) => {
          const newAnswer = payload.new;
          if (!currentQuestionIdsRef.current.includes(String(newAnswer.question_id))) {
            return;
          }
          setCurrentAnswers((prev) => {
            if (prev.some((a) => a.id === newAnswer.id)) return prev;
            return [...prev, newAnswer as Answer];
          });
        }
      )
      .subscribe(() => {});

    const pollInterval = setInterval(async () => {
      const questionIds = currentQuestionIdsRef.current;
      if (questionIds.length === 0) return;

      const { data: polledAnswers, error } = await supabase
        .from("answers")
        .select("*")
        .eq("game_id", gameId)
        .in("question_id", questionIds);

      if (error) {
        console.error("❌ Polling Error:", error);
        return;
      }

      if (polledAnswers && polledAnswers.length > 0) {
        setCurrentAnswers((prev) => {
          const newAnswers = polledAnswers.filter(
            (pa) => !prev.some((existing) => existing.id === pa.id)
          );
          if (newAnswers.length > 0) {
            return [...prev, ...newAnswers];
          }
          return prev;
        });
      }
    }, 1500);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(pollInterval);
    };
  }, [gameId]);

  return { currentAnswers, setCurrentAnswers, updateQuestionIds };
}