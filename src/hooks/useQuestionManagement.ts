"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useGame } from "@/context/GameContext";
import { supabase } from "@/lib/supabase";
import { generateQuestions } from "@/lib/ai-service";
import { CATEGORIES } from "@/hooks/useGameSetup";
import type { Question, Answer } from "@/types";

export function useQuestionManagement(
  topic: string[],
  customTopic: string,
  ageGroup: string,
  questionCount: number,
  timerDuration: number,
  round: number,
  setCurrentAnswers: (answers: Answer[]) => void
) {
  const { gameId, status, updateStatus, gameSettings } = useGame();
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [questionSource, setQuestionSource] = useState<"DB" | "AI" | null>(null);
  const [availableCount, setAvailableCount] = useState<number | null>(null);
  const usedQuestionIdsRef = useRef<string[]>([]);
  const isStartingRef = useRef(false);

  // Reset the starting guard when status leaves STARTING
  useEffect(() => {
    if (status !== "STARTING") {
      isStartingRef.current = false;
    }
  }, [status]);

  useEffect(() => {
    try {
      const savedIds = localStorage.getItem("usedQuestionIds");
      if (savedIds) {
        usedQuestionIdsRef.current = JSON.parse(savedIds);
      }
    } catch (e) {
      console.error("Failed to parse used questions from memory", e);
    }
  }, []);

  const clearUsedQuestions = useCallback(() => {
    localStorage.removeItem("usedQuestionIds");
    usedQuestionIdsRef.current = [];
  }, []);

  useEffect(() => {
    const fetchCount = async () => {
      const dbNames = topic
        .map((t) => CATEGORIES.find((c) => c.name === t)?.dbName)
        .filter(Boolean);
      if (dbNames.length === 0) {
        setAvailableCount(null);
        return;
      }
      const ageMap: Record<string, number> = { "7-9": 8, "10-14": 12, "15-17": 16, adults: 16 };
      const targetAge = ageMap[ageGroup] || 16;
      const isUniversal = dbNames.some((n) => n === "Bandeiras" || n === "CAPITAIS_DO_MUNDO");
      let query = supabase
        .from("questions")
        .select("id", { count: "exact", head: true })
        .in("category", dbNames);
      if (!isUniversal) query = query.gte("age_rating", targetAge);
      const { count } = await query;
      setAvailableCount(count ?? 0);
    };
    fetchCount();
  }, [topic, ageGroup]);

  useEffect(() => {
    const startRound = async () => {
      if (status !== "STARTING") return;
      if (isStartingRef.current) {
        return;
      }
      isStartingRef.current = true;
      setIsGenerating(true);

      try {
        const ageMap: Record<string, number> = { "7-9": 8, "10-14": 12, "15-17": 16, adults: 16 };
        const targetAge = ageMap[ageGroup] || 16;
        const currentUsedIds = usedQuestionIdsRef.current;

        setCurrentAnswers([]);
        if (gameId) {
          await supabase.from("answers").delete().eq("game_id", gameId);
        }

        let questionsToUse: Question[] = [];
        const selectedDbNames = customTopic
          ? [customTopic]
          : topic.map((t) => CATEGORIES.find((c) => c.name === t)?.dbName || t);

        let query = supabase.from("questions").select("*").in("category", selectedDbNames);
        const isUniversalTopic =
          selectedDbNames.includes("Bandeiras") || selectedDbNames.includes("CAPITAIS_DO_MUNDO");

        if (!isUniversalTopic) {
          query = query.gte("age_rating", targetAge);
        }

        const { data } = await query;
        const allQuestions = data || [];
        const unusedQuestions = allQuestions.filter(
          (q) => !currentUsedIds.includes(String(q.id))
        );

        if (unusedQuestions.length >= questionCount) {
          questionsToUse = unusedQuestions
            .sort(() => 0.5 - Math.random())
            .slice(0, questionCount);
          setQuestionSource("DB");
        }

        if (questionsToUse.length === 0) {
          setQuestionSource("AI");
          const dbAgeRating = targetAge;
          const perCategory = Math.ceil(questionCount / selectedDbNames.length);
          const allInserted: { text: string; image_url: string | null; options: string[]; correct_option: number; category: string; age_rating: number }[] = [];

          for (const catName of selectedDbNames) {
            const aiQuestions = await generateQuestions(catName, perCategory, ageGroup);
            const questionsToInsert = aiQuestions.map((q: { text: string; image_url?: string; options: string[]; correct_option: number }) => ({
              text: q.text.trim().charAt(0).toUpperCase() + q.text.trim().slice(1),
              image_url: q.image_url || null,
              options: q.options,
              correct_option: q.correct_option,
              category: catName,
              age_rating: dbAgeRating,
            }));
            allInserted.push(...questionsToInsert);
          }

          await supabase.from("questions").insert(allInserted).select();

          let finalQuery = supabase
            .from("questions")
            .select("*")
            .in("category", selectedDbNames);

          if (currentUsedIds.length > 0) {
            finalQuery = finalQuery.not("id", "in", `(${currentUsedIds.join(",")})`);
          }

          if (!isUniversalTopic) {
            finalQuery = finalQuery.gte("age_rating", targetAge);
          }

          const { data: allAvailableQuestions } = await finalQuery;

          if (allAvailableQuestions && allAvailableQuestions.length >= questionCount) {
            questionsToUse = allAvailableQuestions
              .sort(() => 0.5 - Math.random())
              .slice(0, questionCount);
          } else if (allAvailableQuestions && allAvailableQuestions.length > 0) {
            questionsToUse = allAvailableQuestions.sort(() => 0.5 - Math.random());
          }
        }

        if (questionsToUse.length > 0) {
          setCurrentQuestions(questionsToUse);

          const newUsedIds = [...currentUsedIds, ...questionsToUse.map((q) => String(q.id))];
          usedQuestionIdsRef.current = newUsedIds;
          try {
            localStorage.setItem("usedQuestionIds", JSON.stringify(newUsedIds));
          } catch (e) {
            console.error("Failed to save used questions to memory", e);
          }

          const questionIds = questionsToUse.map((q) => q.id);
          await supabase
            .from("games")
            .update({
              settings: {
                ...gameSettings,
                question_ids: questionIds,
                current_question_id: questionsToUse[0].id,
                current_correct_option: questionsToUse[0].correct_option,
                timer_duration: timerDuration,
              },
              current_question_index: 1,
              status: "QUESTION",
            })
            .eq("id", gameId);
        }
      } catch (err) {
        console.error("Question loading failed:", err);
        updateStatus("LOBBY");
      } finally {
        setIsGenerating(false);
        isStartingRef.current = false;
      }
    };

    startRound();
  }, [status, round]);

  useEffect(() => {
    const recoverState = async () => {
      if (
        gameId &&
        gameSettings?.question_ids &&
        currentQuestions.length === 0 &&
        !isGenerating
      ) {
        const { data } = await supabase
          .from("questions")
          .select("*")
          .in("id", gameSettings.question_ids);

        if (data) {
          const sortedQuestions = gameSettings.question_ids
            .map((id: string) => data.find((q) => q.id === id))
            .filter(Boolean);
          setCurrentQuestions(sortedQuestions);
        }
      }
    };
    recoverState();
  }, [gameId, gameSettings, currentQuestions.length, isGenerating]);

  const handleStart = useCallback(() => {
    updateStatus("STARTING");
  }, [updateStatus]);

  return {
    currentQuestions,
    setCurrentQuestions,
    isGenerating,
    questionSource,
    availableCount,
    usedQuestionIdsRef,
    clearUsedQuestions,
    handleStart,
  };
}