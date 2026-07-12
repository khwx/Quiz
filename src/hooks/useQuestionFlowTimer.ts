"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useGame } from "@/context/GameContext";
import { useSound } from "@/hooks/useSound";
import type { Question } from "@/types";

export function useQuestionFlowTimer(timerDuration: number, currentQuestions: Question[]) {
  const { status, currentQuestionIndex, updateStatus, nextQuestion } = useGame();
  const [timeLeft, setTimeLeft] = useState(timerDuration);
  const [timeUntilNext, setTimeUntilNext] = useState(20);
  const shouldRevealRef = useRef(false);
  const questionStartTimeRef = useRef<number>(0);
  const { playSound } = useSound();

  // Use refs for values used in effects to prevent unnecessary re-runs
  const currentQuestionsRef = useRef(currentQuestions);
  currentQuestionsRef.current = currentQuestions;
  const timerDurationRef = useRef(timerDuration);
  timerDurationRef.current = timerDuration;

  const triggerReveal = useCallback(() => {
    shouldRevealRef.current = true;
    updateStatus("REVEAL");
  }, [updateStatus]);

  const resetTimer = useCallback(() => {
    setTimeLeft(timerDurationRef.current);
    shouldRevealRef.current = false;
    questionStartTimeRef.current = Date.now();
  }, []);

  // Timer effect — only re-runs when status or currentQuestionIndex changes
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentQ = currentQuestionsRef.current[currentQuestionIndex - 1];

    if (status === "QUESTION" && currentQ?.id) {
      resetTimer();

      timer = setInterval(() => {
        if (shouldRevealRef.current) {
          clearInterval(timer);
          return;
        }

        setTimeLeft((prev) => {
          const newValue = prev - 1;
          if (newValue <= 5 && newValue > 0) playSound("tick");

          if (newValue <= 0) {
            clearInterval(timer);
            updateStatus("REVEAL");
            return 0;
          }
          return newValue;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [status, currentQuestionIndex, playSound, updateStatus, resetTimer]);

  useEffect(() => {
    if (status === "QUESTION") {
      setTimeUntilNext(20);
    }
  }, [status, currentQuestionIndex]);

  const nextQuestionRef = useRef(nextQuestion);
  const updateStatusRef = useRef(updateStatus);
  const currentQuestionIndexRef = useRef(currentQuestionIndex);

  useEffect(() => {
    nextQuestionRef.current = nextQuestion;
    updateStatusRef.current = updateStatus;
    currentQuestionIndexRef.current = currentQuestionIndex;
  }, [nextQuestion, updateStatus, currentQuestionIndex]);

  useEffect(() => {
    if (status !== "REVEAL") {
      setTimeUntilNext(20);
      return;
    }

    const interval = setInterval(() => {
      setTimeUntilNext((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(interval);
          const qs = currentQuestionsRef.current;
          const idx = currentQuestionIndexRef.current;
          const nextQ = qs[idx];
          if (nextQ) {
            nextQuestionRef.current(nextQ.id, nextQ.correct_option);
          }
          return 20;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  return {
    timeLeft,
    setTimeLeft,
    timeUntilNext,
    questionStartTimeRef,
    shouldRevealRef,
    triggerReveal,
    resetTimer,
  };
}