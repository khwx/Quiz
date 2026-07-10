"use client";

import { useEffect, useState } from "react";
import { useGame } from "@/context/GameContext";

export function useKeyboardShortcuts(
  status: string,
  currentQuestions: any[],
  currentQuestionIndex: number,
  nextQuestion: (questionId: string, correctOption: number) => Promise<void>,
  updateStatus: (status: any) => Promise<void>,
  setTimeLeft: (n: number) => void,
  onReport: () => void,
  onMemoryClearClose: () => void
) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
        return;

      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        if (status === "REVEAL") {
          const nextQ = currentQuestions[currentQuestionIndex];
          if (nextQ) {
            nextQuestion(nextQ.id, nextQ.correct_option);
          } else {
            updateStatus("STARTING");
          }
        } else if (status === "QUESTION") {
          setTimeLeft(0);
        }
      }
      if (e.key === "r" || e.key === "R") {
        if (status === "QUESTION" || status === "REVEAL") {
          onReport();
        }
      }
      if (e.key === "Escape") {
        onMemoryClearClose();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [status, currentQuestionIndex, currentQuestions, nextQuestion, updateStatus]);
}