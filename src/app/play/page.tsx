"use client";

import { use, useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Loader2, Eye } from "lucide-react";
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
import MobileChat from "@/components/mobile/MobileChat";
import ReactionBar from "@/components/mobile/ReactionBar";
import type { Question } from "@/types";
import FinalView from "@/components/mobile/FinalView";
import SpectatorView from "@/components/mobile/SpectatorView";
import { supabase } from "@/lib/supabase";
import { GAME_CONSTANTS, GameStatus } from "@/lib/constants";
import { createContextLogger } from "@/lib/logger";

const log = createContextLogger("PlayPage");

export default function MobilePlay({ searchParams }: { searchParams: Promise<{ pin?: string; spectator?: string }> }) {
  const resolvedParams = use(searchParams);
  const isSpectator = resolvedParams.spectator === "1";
  const { gameId, joinGame, joinSpectator, status, currentQuestionIndex, currentQuestionId, players, setGameId, gameSettings } = useGame();
  const [pin, setPin] = useState(resolvedParams.pin || "");
  const [name, setName] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [correctOption, setCorrectOption] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [questionData, setQuestionData] = useState<Question | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(GAME_CONSTANTS.DEFAULT_TIMER);
  const [timerActive, setTimerActive] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [questionLoadError, setQuestionLoadError] = useState(false);
  const [fiftyFiftyUsed, setFiftyFiftyUsed] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const submittingRef = useRef(false);
  const questionDataRef = useRef(questionData);
  questionDataRef.current = questionData;
  const clientPlayerId = `guest-${Math.random().toString(36).slice(2, 9)}`;

  const { playSound } = useSound();
  const { toasts, show: showToast, dismiss } = useToast();
  const [reportOpen, setReportOpen] = useState(false);
  const [leaveConfirmOpen, setLeaveConfirmOpen] = useState(false);
  const [spectatorPin, setSpectatorPin] = useState(resolvedParams.pin || "");
  const [isSpectatorJoining, setIsSpectatorJoining] = useState(false);

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
      log.error("Erro ao entrar", { error: err.message || String(err) });
      showToast("Erro ao entrar: " + (err.message || "Tenta novamente"), "error");
    } finally {
      setIsJoining(false);
    }
  };

   const handleSpectatorJoin = async () => {
     if (!spectatorPin) return;
     setIsSpectatorJoining(true);
     try {
       const { data, error: pinError } = await supabase.from("games").select("id").eq("pin", spectatorPin).single();
       if (pinError || !data) {
         showToast("Pin inválido ou jogo não encontrado!", "error");
         return;
       }
       await joinSpectator(data.id);
       setHasJoined(true);
     } catch (err: any) {
       log.error("Erro ao entrar como espectador", { error: err.message || String(err) });
       showToast("Erro ao entrar: " + (err.message || "Tenta novamente"), "error");
     } finally {
       setIsSpectatorJoining(false);
     }
   };

  const fetchQuestion = useCallback(async () => {
    log.info("fetchQuestion called", { currentQuestionId, gameId });
    let questionId = currentQuestionId;
    if (!questionId && gameId) {
      const { data } = await supabase.from("games").select("settings, current_question_index").eq("id", gameId).single();
      questionId = data?.settings?.current_question_id || null;
      if (!questionId && data?.settings?.question_ids && data.current_question_index != null) {
        const idx = (typeof data.current_question_index === 'number' ? data.current_question_index : parseInt(data.current_question_index)) - 1;
        questionId = data.settings.question_ids[idx] || null;
      }
    }
    if (!questionId) return;
    log.info("Fetching question", { questionId });
    const { data, error } = await supabase
      .from("questions")
      .select("id, text, options, correct_option, image_url, category, metadata, age_rating, difficulty")
      .eq("id", questionId)
      .single();
    if (error) {
      log.error("Failed to fetch question", { questionId, error: error.message });
      setQuestionLoadError(true);
      return;
    }
    if (data) {
      log.info("Question fetched successfully", { questionId });
      setQuestionData(data);
      setShowHint(false);
      setQuestionLoadError(false);
    } else {
      log.warn("Question not found in DB", { questionId });
    }
  }, [currentQuestionId, gameId]);

  useEffect(() => {
    if (status === GameStatus.QUESTION) {
      log.info("Question phase detected, fetching question", { currentQuestionId, gameId });
      fetchQuestion();
    }
  }, [status, currentQuestionId, gameSettings, fetchQuestion]);

  useEffect(() => {
    if ((status === GameStatus.LOBBY || status === GameStatus.STARTING || status === GameStatus.QUESTION) && gameId) {
      const syncGameState = async () => {
        const { data } = await supabase.from("games").select("status, settings, current_question_index").eq("id", gameId).single();
        if (!data) return;
        const newStatus = data.status as GameStatus;
        const newQuestionId = data.settings?.current_question_id || null;
        if (newStatus === GameStatus.QUESTION && !questionDataRef.current && newQuestionId) {
          log.info("Polling detected question, fetching", { questionId: newQuestionId });
          const { data: qData } = await supabase.from("questions").select("id, text, options, correct_option, image_url, category, metadata, age_rating, difficulty").eq("id", newQuestionId).single();
          if (qData) {
            setQuestionData(qData);
            setShowHint(false);
            setQuestionLoadError(false);
          }
        }
      };
      syncGameState();
      const interval = setInterval(syncGameState, GAME_CONSTANTS.PLAYER_SYNC_DELAY_MS);
      return () => clearInterval(interval);
    }
  }, [status, gameId]);

  const handleLeave = async () => {
    if (gameId) {
      const player = players.find((p) => p.name === name);
      if (player) await supabase.from("players").delete().eq("id", player.id);
    }
    setHasJoined(false);
    setGameId(null);
    window.location.href = "/";
  };

  const handleSpectatorLeave = () => {
    setHasJoined(false);
    setGameId(null);
    window.location.href = "/";
  };

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
      const timerDur = gameSettings?.timer_duration || GAME_CONSTANTS.DEFAULT_TIMER;
      const timeRatio = Math.max(0, timerDur - timeTaken) / timerDur;
      const points = Math.round(600 + (400 * timeRatio));
      setEarnedPoints(points);
        setStreak((prev) => prev + 1);
        playSound("correct");
        setTimeout(() => setEarnedPoints(null), GAME_CONSTANTS.FEEDBACK_DISMISS_MS);
      } else {
        setEarnedPoints(0);
        setStreak(0);
        playSound("wrong");
        setTimeout(() => setEarnedPoints(null), GAME_CONSTANTS.FEEDBACK_DISMISS_MS);
      }
    }
  }, [correctOption, selectedOption, playSound, startTime]);

  const handleAnswer = async (index: number) => {
    if (submittingRef.current) return;
    if (!currentQuestionId) {
      showToast("Aguarde, a sincronizar...", "info");
      return;
    }
    submittingRef.current = true;
    setHasAnswered(true);
    setSelectedOption(index);
    playSound("tick");

    const player = players.find((p) => p.name === name);
    if (!player) {
      showToast("Jogador não encontrado. Atualiza a página.", "error");
      submittingRef.current = false;
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
      
      if (data.eliminated) {
        showToast("Ficaste sem vidas! Estás eliminado!", "error");
        playSound("wrong");
      }
    } catch (err: any) {
      showToast("Erro ao enviar resposta: " + err.message, "error");
      submittingRef.current = false;
      setHasAnswered(false);
      setSelectedOption(null);
    }
  };

  const handleFiftyFifty = useCallback(() => {
    if (fiftyFiftyUsed || !questionData || !correctOption) return;
    
    const wrongOptions = questionData.options
      .map((_, idx) => idx)
      .filter((idx) => idx !== correctOption);
    
    const shuffled = wrongOptions.sort(() => Math.random() - 0.5);
    const toEliminate = shuffled.slice(0, 2);
    
    setEliminatedOptions(toEliminate);
    setFiftyFiftyUsed(true);
    playSound?.("tick");
  }, [fiftyFiftyUsed, questionData, correctOption, playSound]);

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

  // Spectator mode
  if (isSpectator) {
    if (!hasJoined) {
      return (
        <>
          <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
            <div className="w-16 h-16 rounded-full bg-[#d0bcff]/10 flex items-center justify-center mb-2">
              <Eye className="w-8 h-8 text-[#d0bcff]" />
            </div>
            <h1 className="text-2xl font-bold text-white text-center">Modo Espectador</h1>
            <p className="text-white/50 text-center text-sm max-w-xs">
              Introduz o PIN do jogo para assistir em tempo real.
            </p>
            <div className="w-full max-w-xs space-y-3">
              <input
                type="text"
                placeholder="PIN do jogo"
                value={spectatorPin}
                onChange={(e) => setSpectatorPin(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleSpectatorJoin()}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-center text-2xl font-mono tracking-widest placeholder-white/20 focus:outline-none focus:border-[#d0bcff]"
                maxLength={6}
              />
              <button
                onClick={handleSpectatorJoin}
                disabled={!spectatorPin || isSpectatorJoining}
                className="w-full py-3 bg-[#d0bcff] text-[#121223] rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSpectatorJoining ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    A ligar...
                  </>
                ) : (
                  <>
                    <Eye className="w-5 h-5" />
                    Assistir
                  </>
                )}
              </button>
            </div>
          </main>
          <MobileNav />
          <ToastContainer toasts={toasts} onDismiss={dismiss} />
        </>
      );
    }

    if (status === GameStatus.LOBBY || status === GameStatus.STARTING || status === GameStatus.QUESTION || status === GameStatus.REVEAL || status === GameStatus.PODIUM || status === GameStatus.FINAL) {
      return (
        <>
          <SpectatorView pin={spectatorPin} onLeave={handleSpectatorLeave} />
          <MobileChat gameId={gameId!} playerId="spectator" playerName="Espectador" />
          <MobileNav />
          <ToastContainer toasts={toasts} onDismiss={dismiss} />
        </>
      );
    }

    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#d0bcff]" />
      </main>
    );
  }

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
  if (status === GameStatus.LOBBY || status === GameStatus.STARTING) {
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
        <MobileChat gameId={gameId!} playerId={clientPlayerId} playerName={name || "Anónimo"} />
        <ToastContainer toasts={toasts} onDismiss={dismiss} />
        <ReportModal isOpen={reportOpen} onClose={() => setReportOpen(false)} onSubmit={handleReport} />
      </>
    );
  }

  // Question phase
  if (status === GameStatus.QUESTION && questionData) {
    const currentPlayer = players.find((p) => p.name === name);
    const playerLives = currentPlayer?.lives ?? 3;
    const isEliminated = currentPlayer?.eliminated ?? false;
    return (
      <>
        <QuestionView
          questionData={questionData}
          timeLeft={timeLeft}
          timerDuration={gameSettings?.timer_duration || GAME_CONSTANTS.DEFAULT_TIMER}
          hasAnswered={hasAnswered}
          selectedOption={selectedOption}
          streak={streak}
          lives={playerLives}
          eliminated={isEliminated}
          onAnswer={handleAnswer}
          onReport={() => setReportOpen(true)}
          onFiftyFifty={handleFiftyFifty}
          fiftyFiftyUsed={fiftyFiftyUsed}
          eliminatedOptions={eliminatedOptions}
          buzzerMode={gameSettings?.buzzer_mode === true}
        />
        <MobileChat gameId={gameId!} playerId={currentPlayer?.id || clientPlayerId} playerName={name} />
        <ReactionBar gameId={gameId!} playerName={name} />
        <ToastContainer toasts={toasts} onDismiss={dismiss} />
        <ReportModal isOpen={reportOpen} onClose={() => setReportOpen(false)} onSubmit={handleReport} />
      </>
    );
  }

  // Waiting for question data
  if (status === GameStatus.QUESTION && !questionData) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-[#d0bcff]" />
        {questionLoadError ? (
          <>
            <p className="text-[#e3e0f9]/50 text-sm">Erro ao carregar pergunta.</p>
            <button
              onClick={() => { setQuestionLoadError(false); fetchQuestion(); }}
              className="px-6 py-2 bg-[#d0bcff]/20 hover:bg-[#d0bcff]/30 text-[#d0bcff] rounded-xl font-bold text-sm border border-[#d0bcff]/30"
            >
              Tentar Novamente
            </button>
          </>
        ) : (
          <p className="text-[#e3e0f9]/30 text-sm">A carregar pergunta...</p>
        )}
        <MobileChat gameId={gameId!} playerId={clientPlayerId} playerName={name || "Anónimo"} />
      </main>
    );
  }

  // Reveal phase
  if (status === GameStatus.REVEAL && questionData) {
    const currentPlayer = players.find((p) => p.name === name);
    return (
      <>
        <RevealView
          selectedOption={selectedOption}
          correctOption={correctOption}
          questionData={questionData}
          earnedPoints={earnedPoints}
          onReport={() => setReportOpen(true)}
        />
        <MobileChat gameId={gameId!} playerId={currentPlayer?.id || clientPlayerId} playerName={name} />
        <ToastContainer toasts={toasts} onDismiss={dismiss} />
        <ReportModal isOpen={reportOpen} onClose={() => setReportOpen(false)} onSubmit={handleReport} />
      </>
    );
  }

  // Final phase
  const currentPlayer = players.find((p) => p.name === name);
  return (
    <>
      <FinalView players={players} playerName={name} />
      <MobileChat gameId={gameId!} playerId={currentPlayer?.id || clientPlayerId} playerName={name} />
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </>
  );
}