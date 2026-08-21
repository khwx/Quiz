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
import SoloGame from "@/components/mobile/SoloGame";
import RevealView from "@/components/mobile/RevealView";
import MobileChat from "@/components/mobile/MobileChat";
import ReactionBar from "@/components/mobile/ReactionBar";
import type { Question } from "@/types";
import FinalView from "@/components/mobile/FinalView";
import SpectatorView from "@/components/mobile/SpectatorView";
import { supabase } from "@/lib/supabase";
import { triggerHaptic } from "@/lib/haptics";
import { GAME_CONSTANTS, GameStatus } from "@/lib/constants";
import { createContextLogger } from "@/lib/logger";

const log = createContextLogger("PlayPage");

export default function MobilePlay({ searchParams }: { searchParams: Promise<{ pin?: string; spectator?: string; solo?: string }> }) {
  const resolvedParams = use(searchParams);
  const isSpectator = resolvedParams.spectator === "1";
  const isSolo = resolvedParams.solo === "1";
  const { gameId, joinGame, joinSpectator, status, currentQuestionIndex, currentQuestionId, players, setGameId, setPlayers, gameSettings } = useGame();
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
  const [skipUsed, setSkipUsed] = useState(false);
  const [freezeUsed, setFreezeUsed] = useState(false);
  const [frozen, setFrozen] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const localTimerRef = useRef<NodeJS.Timeout | null>(null);
  const frozenRef = useRef(false);
  const submittingRef = useRef(false);
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
    try {
      let questionId = currentQuestionId;
      if (!questionId && gameSettings?.current_question_id) {
        questionId = gameSettings.current_question_id;
      }
      if (!questionId && gameSettings?.question_ids && currentQuestionIndex > 0) {
        const idx = currentQuestionIndex - 1;
        questionId = gameSettings.question_ids[idx] || null;
      }
      if (!questionId && gameId) {
        const { data: gameData, error: gameError } = await supabase
          .from("games")
          .select("settings, current_question_index")
          .eq("id", gameId)
          .single();
        if (!gameError && gameData) {
          questionId = gameData?.settings?.current_question_id || null;
          if (!questionId && gameData?.settings?.question_ids && gameData.current_question_index != null) {
            const idx = (typeof gameData.current_question_index === 'number' ? gameData.current_question_index : parseInt(gameData.current_question_index)) - 1;
            questionId = gameData.settings.question_ids[idx] || null;
          }
        }
      }
      let qData = null;
      if (questionId) {
        const { data, error } = await supabase
          .from("questions")
          .select("id, text, options, correct_option, image_url, category, metadata, age_rating")
          .eq("id", questionId)
          .single();
        if (!error && data) {
          qData = data;
        }
      }

      // Fallback: if specific questionId failed or was missing, fetch any available question from DB
      if (!qData) {
        const { data: anyQuestions } = await supabase
          .from("questions")
          .select("id, text, options, correct_option, image_url, category, metadata, age_rating")
          .limit(1);
        if (anyQuestions && anyQuestions.length > 0) {
          qData = anyQuestions[0];
        }
      }

      // Ultimate fallback if DB has zero questions or query failed
      if (!qData) {
        qData = {
          id: "fallback-question",
          text: "Qual é a capital de Portugal?",
          options: ["Lisboa", "Porto", "Coimbra", "Faro"],
          correct_option: 0,
          category: "CAPITAIS_DO_MUNDO",
          age_rating: 10,
          explanation: "Lisboa é a capital e a cidade mais populosa de Portugal.",
        };
      }

      setQuestionData(qData);
      setShowHint(false);
      setQuestionLoadError(false);
      setHasAnswered(false);
      setSelectedOption(null);
      setEliminatedOptions([]);
      setEarnedPoints(null);
      setStreak(0);
    } catch (err: any) {
      log.error("Error in fetchQuestion, using fallback", { error: err?.message || String(err) });
      // Guaranteed fallback so player never gets stuck on error screen
      setQuestionData({
        id: "fallback-question",
        text: "Qual é a capital de Portugal?",
        options: ["Lisboa", "Porto", "Coimbra", "Faro"],
        correct_option: 0,
        category: "CAPITAIS_DO_MUNDO",
        age_rating: 10,
        explanation: "Lisboa é a capital e a cidade mais populosa de Portugal.",
      });
      setShowHint(false);
      setQuestionLoadError(false);
      setHasAnswered(false);
      setSelectedOption(null);
      setEliminatedOptions([]);
      setEarnedPoints(null);
      setStreak(0);
    }
  }, [currentQuestionId, gameId, gameSettings, currentQuestionIndex]);

  useEffect(() => {
    if (questionData?.id && status === GameStatus.QUESTION) {
      setHasAnswered(false);
      setSelectedOption(null);
      setEliminatedOptions([]);
      setEarnedPoints(null);
      setStreak(0);
      setShowHint(false);
      setFiftyFiftyUsed(false);
      setSkipUsed(false);
      setFreezeUsed(false);
      setFrozen(false);
      frozenRef.current = false;
      submittingRef.current = false;
      setStartTime(Date.now());
    }
  }, [questionData?.id, status]);

  useEffect(() => {
    if (status === GameStatus.QUESTION) {
      fetchQuestion();
    }
  }, [status, currentQuestionId, currentQuestionIndex, gameSettings, fetchQuestion]);

  // Local countdown for the player's timer display (synced to question start)
  useEffect(() => {
    if (status !== GameStatus.QUESTION) return;
    const duration = gameSettings?.timer_duration || GAME_CONSTANTS.DEFAULT_TIMER;
    setTimeLeft(duration);
    setFrozen(false);
    frozenRef.current = false;
    if (localTimerRef.current) clearInterval(localTimerRef.current);
    localTimerRef.current = setInterval(() => {
      setTimeLeft((prev) => (frozenRef.current ? prev : Math.max(0, prev - 1)));
    }, 1000);
    return () => {
      if (localTimerRef.current) clearInterval(localTimerRef.current);
    };
  }, [status, currentQuestionId, gameSettings?.timer_duration]);

  const handleFreeze = useCallback(() => {
    if (freezeUsed || status !== GameStatus.QUESTION) return;
    setFreezeUsed(true);
    setFrozen(true);
    frozenRef.current = true;
    setTimeout(() => {
      setFrozen(false);
      frozenRef.current = false;
    }, 5000);
  }, [freezeUsed, status]);

  useEffect(() => {
    if ((status === GameStatus.LOBBY || status === GameStatus.STARTING || status === GameStatus.QUESTION) && gameId) {
      const syncGameState = async () => {
        try {
          const { data, error } = await supabase.from("games").select("settings, current_question_index, status").eq("id", gameId).single();
          if (error || !data) return;
          const gameStatus = data.status as GameStatus;
          const questionId = data.settings?.current_question_id || null;
          if (gameStatus === GameStatus.QUESTION && questionId && !questionData) {
            let qData = null;
            const { data: directQData, error: qError } = await supabase.from("questions").select("id, text, options, correct_option, image_url, category, metadata, age_rating").eq("id", questionId).single();
            if (!qError && directQData) {
              qData = directQData;
            } else {
              const { data: anyQ } = await supabase.from("questions").select("id, text, options, correct_option, image_url, category, metadata, age_rating").limit(1);
              if (anyQ && anyQ.length > 0) qData = anyQ[0];
            }

            if (qData) {
              setQuestionData(qData);
              setShowHint(false);
              setQuestionLoadError(false);
              setHasAnswered(false);
              setSelectedOption(null);
              setEliminatedOptions([]);
              setEarnedPoints(null);
              setStreak(0);
            } else {
              log.warn("Question ID not found in questions table", { questionId });
            }
          }
        } catch (err: any) {
          log.error("Polling sync failed", { error: err.message });
        }
        try {
          const { data: playerData, error: playerError } = await supabase.from("players").select("*").eq("game_id", gameId);
          if (!playerError && playerData && playerData.length > 0) {
            setPlayers(playerData);
          }
        } catch (err: any) {
          log.error("Player polling sync failed", { error: err.message });
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
        triggerHaptic("correct");
      } else {
        setEarnedPoints(0);
        setStreak(0);
        playSound("wrong");
        triggerHaptic("wrong");
      }
    }
  }, [correctOption, selectedOption, playSound, startTime, gameSettings?.timer_duration]);

  const handleAnswer = async (index: number) => {
    if (submittingRef.current) return;
    const qId = currentQuestionId || questionData?.id || gameSettings?.current_question_id;
    if (!qId) {
      showToast("Aguarde, a carregar...", "info");
      return;
    }
    submittingRef.current = true;
    setHasAnswered(true);
    setSelectedOption(index);
    playSound("tick");

    let player = players.find((p) => p.name === name);
    if (!player) {
      const { data: fallbackPlayer, error: fallbackError } = await supabase
        .from("players")
        .select("*")
        .eq("game_id", gameId)
        .eq("name", name)
        .maybeSingle();
      if (fallbackError || !fallbackPlayer) {
        console.error("[PlayPage] Player not found:", { name, gameId, fallbackError: fallbackError?.message });
        showToast("Jogador não encontrado. Atualiza a página.", "error");
        submittingRef.current = false;
        setHasAnswered(false);
        setSelectedOption(null);
        return;
      }
      setPlayers([fallbackPlayer]);
      player = fallbackPlayer;
    }

    const timeTaken = Math.max(0, Math.floor((Date.now() - startTime) / 1000));

    try {
      const res = await fetch("/api/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId,
          playerId: player!.id,
          questionId: qId,
          chosenOption: index,
          timeTaken,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha ao enviar resposta");
      submittingRef.current = false;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      showToast("Erro ao enviar resposta: " + errorMessage, "error");
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

  const handleSkip = useCallback(() => {
    if (skipUsed || hasAnswered || !questionData) return;
    setSkipUsed(true);
    setHasAnswered(true);
    playSound?.("tick");
  }, [skipUsed, hasAnswered, questionData, playSound]);

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

  // Solo practice mode — self-contained game, no host required
  if (isSolo) {
    return <SoloGame />;
  }

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
          eliminated={false}
          onAnswer={handleAnswer}
          onReport={() => setReportOpen(true)}
          onFiftyFifty={handleFiftyFifty}
          fiftyFiftyUsed={fiftyFiftyUsed}
          onSkip={handleSkip}
          skipUsed={skipUsed}
          onFreeze={handleFreeze}
          freezeUsed={freezeUsed}
          frozen={frozen}
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
          correctOption={correctOption ?? questionData?.correct_option ?? null}
          questionData={questionData}
          earnedPoints={earnedPoints}
          skipped={skipUsed}
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