"use client";

import { useEffect } from "react";
import type { GameStatus } from "@/context/GameContext";
import type { Question } from "@/types";
import { GameStatus as GameStatusConst } from "@/lib/constants";

export function useKeyboardShortcuts(
  status: string,
  currentQuestions: Question[],
  currentQuestionIndex: number,
  nextQuestion: (questionId: string, correctOption: number) => Promise<void>,
  updateStatus: (status: GameStatus) => Promise<void>,
  triggerReveal: () => void,
  onReport: () => void,
  onMemoryClearClose: () => void,
  onTogglePause?: () => void,
  onPreviousQuestion?: () => void,
  onSkipQuestion?: () => void
) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
        return;

      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        if (status === GameStatusConst.REVEAL) {
          const nextQ = currentQuestions[currentQuestionIndex];
          if (nextQ) {
            nextQuestion(nextQ.id, nextQ.correct_option ?? 0);
          } else {
            updateStatus(GameStatusConst.STARTING);
          }
        } else if (status === GameStatusConst.QUESTION) {
          triggerReveal();
        }
      }
      if (e.key === "p" || e.key === "P") {
        onTogglePause?.();
      }
      if (e.key === "b" || e.key === "B") {
        onPreviousQuestion?.();
      }
      if (e.key === "s" || e.key === "S") {
        onSkipQuestion?.();
      }
      if (e.key === "r" || e.key === "R") {
        if (status === GameStatusConst.QUESTION || status === GameStatusConst.REVEAL) {
          onReport();
        }
      }
      if (e.key === "Escape") {
        onMemoryClearClose();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [status, currentQuestionIndex, currentQuestions, nextQuestion, updateStatus, triggerReveal, onTogglePause, onPreviousQuestion, onSkipQuestion]);
}