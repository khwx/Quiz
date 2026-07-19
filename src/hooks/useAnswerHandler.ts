"use client";

import { useCallback, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useGame } from "@/context/GameContext";
import { useSound } from "@/hooks/useSound";

export function useAnswerHandler(playerName: string) {
  const { gameId, players } = useGame();
  const [hasAnswered, setHasAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [earnedPoints, setEarnedPoints] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const { playSound } = useSound();

  const submitAnswer = useCallback(
    async (questionId: string | null, optionIndex: number, startTime: number) => {
      if (hasAnswered || !questionId) return false;

      setHasAnswered(true);
      setSelectedOption(optionIndex);
      playSound("tick");

      const player = players.find((p) => p.name === playerName);
      if (!player) {
        setHasAnswered(false);
        setSelectedOption(null);
        return false;
      }

      const timeTaken = Math.max(0, Math.floor((Date.now() - startTime) / 1000));

      try {
        const res = await fetch("/api/answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gameId,
            playerId: player.id,
            questionId,
            chosenOption: optionIndex,
            timeTaken,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Falha ao enviar resposta");
        return true;
      } catch (err: any) {
        setHasAnswered(false);
        setSelectedOption(null);
        return false;
      }
    },
    [hasAnswered, gameId, players, playerName, playSound]
  );

  const resetAnswer = useCallback(() => {
    setHasAnswered(false);
    setSelectedOption(null);
    setEarnedPoints(null);
  }, []);

  const handleCorrectAnswer = useCallback(
    (timerDuration: number, startTime: number) => {
      const timeTaken = Math.max(0, Math.floor((Date.now() - startTime) / 1000));
      const timeRatio = Math.max(0, timerDuration - timeTaken) / timerDuration;
      const basePoints = Math.round(600 + (400 * timeRatio));
      const newStreak = streak + 1;
      const multiplier = newStreak >= 5 ? 2 : newStreak >= 3 ? 1.5 : 1;
      const points = Math.round(basePoints * multiplier);
      setEarnedPoints(points);
      setStreak(newStreak);
      playSound("correct");
      setTimeout(() => setEarnedPoints(null), 2000);
    },
    [playSound, streak]
  );

  const handleWrongAnswer = useCallback(() => {
    setEarnedPoints(0);
    setStreak(0);
    playSound("wrong");
    setTimeout(() => setEarnedPoints(null), 2000);
  }, [playSound]);

  return {
    hasAnswered,
    setHasAnswered,
    selectedOption,
    setSelectedOption,
    earnedPoints,
    setEarnedPoints,
    streak,
    setStreak,
    submitAnswer,
    resetAnswer,
    handleCorrectAnswer,
    handleWrongAnswer,
  };
}