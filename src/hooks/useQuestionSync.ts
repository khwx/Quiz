"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useGame } from "@/context/GameContext";
import type { Question } from "@/types";

export function useQuestionSync() {
  const { gameId, currentQuestionId, currentQuestionIndex, status } = useGame();
  const [questionData, setQuestionData] = useState<Question | null>(null);
  const [correctOption, setCorrectOption] = useState<number | null>(null);

  const fetchQuestion = useCallback(async () => {
    if (!currentQuestionId) return;
    const { data } = await supabase
      .from("questions")
      .select("id, text, options, image_url, category, metadata, age_rating")
      .eq("id", currentQuestionId)
      .single();
    if (data) {
      setQuestionData(data);
    }
  }, [currentQuestionId]);

  useEffect(() => {
    if (status === "QUESTION" && currentQuestionId) {
      setCorrectOption(null);
      fetchQuestion();
    }
  }, [status, currentQuestionIndex, currentQuestionId, fetchQuestion]);

  useEffect(() => {
    if (status === "REVEAL" && currentQuestionId) {
      const getResult = async () => {
        if (!gameId) return;
        const { data } = await supabase
          .from("games")
          .select("settings")
          .eq("id", gameId)
          .single();
        if (data && data.settings?.current_correct_option !== undefined) {
          setCorrectOption(data.settings.current_correct_option);
        } else {
          const { data: qData } = await supabase
            .from("questions")
            .select("correct_option")
            .eq("id", currentQuestionId)
            .single();
          if (qData) setCorrectOption(qData.correct_option);
        }
      };
      getResult();
    }
  }, [status, currentQuestionId, gameId]);

  return { questionData, setQuestionData, correctOption, setCorrectOption };
}