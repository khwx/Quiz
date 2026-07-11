"use client";

import { use, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useGame } from "@/context/GameContext";
import { useSound } from "@/hooks/useSound";
import { useToast } from "@/hooks/useToast";
import ToastContainer from "@/components/Toast";
import ReportModal from "@/components/ReportModal";
import ConfirmModal from "@/components/ConfirmModal";
import MobileNav from "@/components/MobileNav";
import LobbyJoinView from "@/components/mobile/LobbyJoinView";
import QuestionView from "@/components/mobile/QuestionView";
import RevealView from "@/components/mobile/RevealView";
import type { Question } from "@/types";
import FinalView from "@/components/mobile/FinalView";
import { supabase } from "@/lib/supabase";

export default function MobilePlay({ searchParams }: { searchParams: Promise<{ pin?: string }> }) {
  const resolvedParams = use(searchParams);
  const { gameId, joinGame, status, currentQuestionIndex, currentQuestionId, players, setGameId, gameSettings } = useGame();
  const [pin, setPin] = useState(resolvedParams.pin || "");
  const [name, setName] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [correctOption, setCorrectOption] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [questionData, setQuestionData] = useState<any>(null);
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [timerActive, setTimerActive] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);

  const { playSound } = useSound();
  const { toasts, show: showToast, dismiss } = useToast();
  const [reportOpen, setReportOpen] = useState(false);
  const [leaveConfirmOpen, setLeaveConfirmOpen] = useState(false);

  const fetchQuestion = useCallback(async () => {
    if (!currentQuestionId) return;
    const { data } = await supabase
      .from("questions")
      .select("id, text, options, image_url, category, metadata, age_rating")
      .eq("id", currentQuestionId)
      .single();
    if (data) {
      setQuestionData(data);
      setShowHint(false);
    }
  }, [currentQuestionId]);

  useEffect(() => {
    if (status === "QUESTION" && currentQuestionId) {
      setHasAnswered(false);
      setSelectedOption(null);
      setCorrectOption(null);
      setStartTime(Date.now());
      setTimerActive(true);
      setTimeLeft(gameSettings?.timer_duration || 20);
      fetchQuestion();
    }
    if (status !== "QUESTION") {
      setTimerActive(false);
    }
    if (status === "REVEAL") {
      setStreak(0);
    }
  }, [status, currentQuestionIndex, currentQuestionId, fetchQuestion]);

  useEffect(() => {
    if (!timerActive) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setTimerActive(false);
          return 0;
        }
        if (prev <= 5) playSound("tick");
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, playSound]);

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
      setTimerActive(false);
    }
  }, [status, currentQuestionId, gameId]);

  useEffect(() => {
    if (correctOption !== null && selectedOption !== null) {
      if (selectedOption === correctOption) {
        const timeTaken = Math.max(0, Math.floor((Date.now() - startTime) / 1000));
        const timerDur = gameSettings?.timer_duration || 20;
        const points = Math.max(10, Math.floor(((timerDur - timeTaken) / timerDur) * 100));
        setEarnedPoints(points);
        setStreak((prev) => prev + 1);
        playSound("correct");
        setTimeout(() => setEarnedPoints(null), 2000);
      } else {
        setEarnedPoints(0);
        setStreak(0);
        playSound("wrong");
        setTimeout(() => setEarnedPoints(null), 2000);
      }
    }
  }, [correctOption, selectedOption, playSound, startTime]);

  const handleJoin = async () => {
    if (!pin || !name) return;
    setIsJoining(true);
    try {
      const { data, error: pinError } = await supabase.from("games").select("id").eq("pin", pin).single();
      if (pinError || !data) {
        showToast("Pin inválido ou jogo não encontrado!", "error");
        return;
      }
      await joinGame(data.id, name);
      setHasJoined(true);
    } catch (err: any) {
      console.error("Erro ao entrar:", err);
      showToast("Erro ao entrar: " + (err.message || "Tenta novamente"), "error");
    } finally {
      setIsJoining(false);
    }
  };

  const handleAnswer = async (index: number) => {
    if (hasAnswered) return;
    if (!currentQuestionId) {
      showToast("Aguarde, a sincronizar...", "info");
      return;
    }
    setHasAnswered(true);
    setSelectedOption(index);
    playSound("tick");

    const player = players.find((p) => p.name === name);
    if (!player) {
      showToast("Jogador não encontrado. Atualiza a página.", "error");
      setHasAnswered(false);
      setSelectedOption(null);
      return;
    }

    const timeTaken = Math.max(0, Math.floor((Date.now() - startTime) / 1000));

    try {
      const res = await fetch("/api/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId,
          playerId: player.id,
          questionId: currentQuestionId,
          chosenOption: index,
          timeTaken,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha ao enviar resposta");
    } catch (err: any) {
      showToast("Erro ao enviar resposta: " + err.message, "error");
      setHasAnswered(false);
      setSelectedOption(null);
    }
  };

  const handleLeave = async () => {
    if (gameId) {
      const player = players.find((p) => p.name === name);
      if (player) await supabase.from("players").delete().eq("id", player.id);
    }
    setHasJoined(false);
    setGameId(null);
    window.location.href = "/";
  };

  const handleReport = async (reason: string) => {
    if (!currentQuestionId) return;
    const { data: q } = await supabase.from("questions").select("metadata").eq("id", currentQuestionId).single();
    const currentReports = q?.metadata?.reports || [];
    await supabase
      .from("questions")
      .update({
        metadata: { reports: [...currentReports, { reason, reporter: name, date: new Date().toISOString() }] },
      })
      .eq("id", currentQuestionId);
    showToast("Obrigado! Pergunta reportada.", "success");
  };

  // Not joined yet - show join form
  if (!hasJoined) {
    return (
      <>
        <LobbyJoinView
          pin={pin}
          name={name}
          isJoining={isJoining}
          hasJoined={hasJoined}
          players={players}
          onPinChange={setPin}
          onNameChange={setName}
          onJoin={handleJoin}
          onLeave={handleLeave}
        />
        <MobileNav />
        <ToastContainer toasts={toasts} onDismiss={dismiss} />
        <ReportModal isOpen={reportOpen} onClose={() => setReportOpen(false)} onSubmit={handleReport} />
        <ConfirmModal
          isOpen={leaveConfirmOpen}
          onClose={() => setLeaveConfirmOpen(false)}
          onConfirm={handleLeave}
          title="Sair do Jogo?"
          message="Tens a certeza que queres sair?"
          confirmLabel="Sair"
          danger
        />
        <div className="h-20 md:hidden" />
      </>
    );
  }

  // Joined - show lobby waiting
  if (status === "LOBBY" || status === "STARTING") {
    return (
      <>
        <LobbyJoinView
          pin={pin}
          name={name}
          isJoining={isJoining}
          hasJoined={hasJoined}
          players={players}
          onPinChange={setPin}
          onNameChange={setName}
          onJoin={handleJoin}
          onLeave={() => setLeaveConfirmOpen(true)}
        />
        <ToastContainer toasts={toasts} onDismiss={dismiss} />
        <ReportModal isOpen={reportOpen} onClose={() => setReportOpen(false)} onSubmit={handleReport} />
      </>
    );
  }

  // Question phase
  if (status === "QUESTION" && questionData) {
    return (
      <>
        <QuestionView
          questionData={questionData}
          timeLeft={timeLeft}
          timerDuration={gameSettings?.timer_duration || 20}
          hasAnswered={hasAnswered}
          selectedOption={selectedOption}
          streak={streak}
          onAnswer={handleAnswer}
          onReport={() => setReportOpen(true)}
        />
        <ToastContainer toasts={toasts} onDismiss={dismiss} />
        <ReportModal isOpen={reportOpen} onClose={() => setReportOpen(false)} onSubmit={handleReport} />
      </>
    );
  }

  // Waiting for question data
  if (status === "QUESTION" && !questionData) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-violet-400" />
      </main>
    );
  }

  // Reveal phase
  if (status === "REVEAL") {
    return (
      <>
        <RevealView
          selectedOption={selectedOption}
          correctOption={correctOption}
          questionData={questionData}
          earnedPoints={earnedPoints}
          onReport={() => setReportOpen(true)}
        />
        <ToastContainer toasts={toasts} onDismiss={dismiss} />
        <ReportModal isOpen={reportOpen} onClose={() => setReportOpen(false)} onSubmit={handleReport} />
      </>
    );
  }

  // Final phase
  return (
    <>
      <FinalView players={players} playerName={name} />
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </>
  );
}