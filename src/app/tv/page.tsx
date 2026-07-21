"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useGame } from "@/context/GameContext";
import { supabase } from "@/lib/supabase";
import QuestionDisplay from "@/components/tv/QuestionDisplay";
import LiveLeaderboard from "@/components/tv/LiveLeaderboard";
import LobbyView from "@/components/tv/LobbyView";
import RevealControls from "@/components/tv/RevealControls";
import PodiumView from "@/components/tv/PodiumView";
import TVChat from "@/components/tv/TVChat";
import TVReactions from "@/components/tv/TVReactions";
import SoundEnableButton from "@/components/SoundEnableButton";
import SoundControls from "@/components/SoundControls";
import ToastContainer from "@/components/Toast";
import ReportModal from "@/components/ReportModal";
import ConfirmModal from "@/components/ConfirmModal";
import { useSound } from "@/hooks/useSound";
import { useToast } from "@/hooks/useToast";
import { useGameSetup } from "@/hooks/useGameSetup";
import { useAnswerSubscription } from "@/hooks/useAnswerSubscription";
import { useQuestionFlowTimer } from "@/hooks/useQuestionFlowTimer";
import { useQuestionManagement } from "@/hooks/useQuestionManagement";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { GAME_CONSTANTS, GameStatus } from "@/lib/constants";

export default function TVHost() {
  const { gameId, status, updateStatus, players, currentQuestionIndex, nextQuestion, setPlayers, gameSettings } = useGame();
  const { playSound } = useSound();
  const { toasts, show: showToast, dismiss } = useToast();

  const {
    pin,
    loading,
    round,
    setRound,
    topic,
    setTopic,
    customTopic,
    setCustomTopic,
    ageGroup,
    setAgeGroup,
    timerDuration,
    setTimerDuration,
    questionCount,
    setQuestionCount,
    localMode,
    setLocalMode,
    localScore,
    setLocalScore,
    localLives,
    setLocalLives,
    tournamentId,
    teamId,
    blindMode,
    setBlindMode,
    saveTournamentScore,
    advanceTournament,
    resetToLobby,
  } = useGameSetup();

  const [buzzerMode, setBuzzerMode] = useState(false);
  const [hotseatMode, setHotseatMode] = useState(false);
  const [hotseatPlayers, setHotseatPlayers] = useState<string[]>([]);
  const [currentHotseatIndex, setCurrentHotseatIndex] = useState(0);
  const [hotseatScores, setHotseatScores] = useState<Record<string, number>>({});

  useEffect(() => {
    if (gameSettings?.buzzer_mode !== undefined) {
      setBuzzerMode(gameSettings.buzzer_mode);
    }
    if (gameSettings?.hotseat_mode !== undefined) {
      setHotseatMode(gameSettings.hotseat_mode);
      setHotseatPlayers(gameSettings.hotseat_players || []);
    }
  }, [gameSettings?.buzzer_mode, gameSettings?.hotseat_mode, gameSettings?.hotseat_players]);

  const { currentAnswers, setCurrentAnswers, updateQuestionIds } = useAnswerSubscription();

  const {
    currentQuestions,
    setCurrentQuestions,
    isGenerating,
    questionSource,
    availableCount,
    usedQuestionIdsRef,
    clearUsedQuestions,
  } = useQuestionManagement(topic, customTopic, ageGroup, questionCount, timerDuration, round, setCurrentAnswers);

  useEffect(() => {
    updateQuestionIds(currentQuestions.map((q) => String(q.id)));
  }, [currentQuestions, updateQuestionIds]);

  const {
    timeLeft,
    setTimeLeft,
    timeUntilNext,
    questionStartTimeRef,
    shouldRevealRef,
    triggerReveal,
  } = useQuestionFlowTimer(timerDuration, currentQuestions);

  // Auto-skip: advance to REVEAL when all players have answered
  const currentAnswersRef = useRef(currentAnswers);
  currentAnswersRef.current = currentAnswers;
  const playersRef = useRef(players);
  playersRef.current = players;

  useEffect(() => {
    if (status !== "QUESTION") return;
    const currentQ = currentQuestions[currentQuestionIndex - 1];
    if (!currentQ?.id) return;

    const elapsedMs = Date.now() - questionStartTimeRef.current;
    if (elapsedMs < 3000) return;

    const currentQuestionId = String(currentQ.id);
    const validAnswers = currentAnswersRef.current.filter(a => String(a.question_id) === currentQuestionId);
    const answeredPlayerIds = new Set(validAnswers.map(a => String(a.player_id)));
    const allPlayerIds = new Set(playersRef.current.map(p => String(p.id)));

    const buzzerMode = gameSettings?.buzzer_mode === true;

    if (buzzerMode && validAnswers.length > 0) {
      const firstAnswer = validAnswers[0];
      const buzzerPlayer = playersRef.current.find(p => String(p.id) === String(firstAnswer.player_id));
      if (buzzerPlayer) {
        showToast(`${buzzerPlayer.name} buzzed in!`, "success");
      }
      setTimeout(() => triggerReveal(), GAME_CONSTANTS.PLAYER_SYNC_DELAY_MS);
      return;
    }

    if (allPlayerIds.size > 0 && answeredPlayerIds.size >= allPlayerIds.size) {
      triggerReveal();
    }
  }, [status, currentQuestionIndex, currentQuestions, currentAnswers, questionStartTimeRef, triggerReveal, gameSettings?.buzzer_mode, showToast]);

  // Save tournament team score when game reaches PODIUM
  useEffect(() => {
    if (status === "PODIUM" && tournamentId && teamId && players.length > 0) {
      const memberIds = new Set(
        (players[0]?.team_members || [])
          .filter((m) => String(m.team_id) === String(teamId))
          .map((m) => String(m.user_id))
      );
      if (memberIds.size === 0) {
        players.forEach((p) => memberIds.add(String(p.user_id || p.id)));
      }
      const teamScore = players
        .filter((p) => memberIds.has(String(p.user_id || p.id)))
        .reduce((sum, p) => sum + (p.score || 0), 0);
      saveTournamentScore(teamScore);
    }
  }, [status, tournamentId, teamId, players, saveTournamentScore]);

  const [reportOpen, setReportOpen] = useState(false);
  const [memoryConfirmOpen, setMemoryConfirmOpen] = useState(false);
  const [revealStartTime, setRevealStartTime] = useState<number | null>(null);
  const [canAdvanceFromReveal, setCanAdvanceFromReveal] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  useKeyboardShortcuts(
    status,
    currentQuestions,
    currentQuestionIndex,
    nextQuestion,
    updateStatus,
    triggerReveal,
    () => setReportOpen(true),
    () => {
      setReportOpen(false);
      setMemoryConfirmOpen(false);
    }
  );

  useEffect(() => {
    if (status === GameStatus.REVEAL) {
      setRevealStartTime(Date.now());
      setCanAdvanceFromReveal(false);
      const timer = setTimeout(() => setCanAdvanceFromReveal(true), GAME_CONSTANTS.AUTO_SKIP_DELAY);
      return () => clearTimeout(timer);
    }
  }, [status]);

  useEffect(() => {
    if (status === GameStatus.QUESTION) {
      setCurrentAnswers([]);
      if (gameId) {
        const syncPlayers = async () => {
          const { data } = await supabase.from("players").select("*").eq("game_id", gameId);
          if (data && data.length > 0) setPlayers(data);
        };
        syncPlayers();
        const timeout = setTimeout(syncPlayers, GAME_CONSTANTS.PLAYER_SYNC_DELAY_MS);

        return () => clearTimeout(timeout);
      }
    }
  }, [currentQuestionIndex, round, status, gameId, setPlayers, setCurrentAnswers]);

  const handleLocalAnswer = useCallback(
    (optionIndex: number) => {
if (status !== GameStatus.QUESTION) return;
      const currentQ = currentQuestions[currentQuestionIndex - 1];
      if (!currentQ) return;

      if (hotseatMode && hotseatPlayers.length > 0) {
        const currentPlayer = hotseatPlayers[currentHotseatIndex];
        if (optionIndex === currentQ.correct_option) {
          const timerDurationVal = timerDuration || 20;
          const timeRatio = Math.max(0, timerDurationVal - timeLeft) / timerDurationVal;
          const points = Math.round(600 + (400 * timeRatio));
          setHotseatScores((prev) => ({ ...prev, [currentPlayer]: (prev[currentPlayer] || 0) + points }));
          playSound?.("correct");
        } else {
          playSound?.("wrong");
        }

        if (currentHotseatIndex < hotseatPlayers.length - 1) {
          setCurrentHotseatIndex((prev) => prev + 1);
        } else {
          setCurrentHotseatIndex(0);
          triggerReveal();
        }
        return;
      }

      if (localScore >= questionCount) return;

      if (optionIndex === currentQ.correct_option) {
        const timerDurationVal = timerDuration || 20;
        const timeRatio = Math.max(0, timerDurationVal - timeLeft) / timerDurationVal;
        const points = Math.round(600 + (400 * timeRatio));
        setLocalScore((prev) => prev + points);
        playSound?.("correct");
      } else {
        const newLives = Math.max(0, localLives - 1);
        setLocalLives(newLives);
        playSound?.("wrong");
        if (newLives === 0) {
          showToast("Ficaste sem vidas!", "error");
        }
      }
      updateStatus(GameStatus.REVEAL);
    },
    [status, currentQuestions, currentQuestionIndex, localScore, questionCount, timeLeft, timerDuration, localLives, playSound, updateStatus, setLocalLives, showToast, hotseatMode, hotseatPlayers, currentHotseatIndex, triggerReveal]
  );

  const handleReportQuestion = useCallback(
    async (reason: string) => {
      const currentQ = currentQuestions[currentQuestionIndex - 1];
      if (!currentQ?.id) return;

      const { data: q } = await supabase
        .from("questions")
        .select("metadata")
        .eq("id", currentQ.id)
        .single();

      const currentReports = q?.metadata?.reports || [];
      await supabase
        .from("questions")
        .update({
          metadata: {
            reports: [...currentReports, { reason, date: new Date().toISOString() }],
          },
        })
        .eq("id", currentQ.id);

      showToast("Obrigado! Pergunta reportada.", "success");
    },
    [currentQuestions, currentQuestionIndex, showToast]
  );

  const advanceFromReveal = useCallback(() => {
    if (!canAdvanceFromReveal) return;
    const nextQ = currentQuestions[currentQuestionIndex];
    if (nextQ) {
      nextQuestion(nextQ.id, nextQ.correct_option);
    } else {
      setRound((r) => r + 1);
      updateStatus("STARTING");
    }
  }, [currentQuestions, currentQuestionIndex, nextQuestion, updateStatus, setRound, canAdvanceFromReveal]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-[#d0bcff]/20 blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-[#FFB0CD]/20 blur-[100px]" />
        </div>
        <Loader2 className="w-12 h-12 animate-spin text-[#d0bcff] relative z-10" />
      </div>
    );
  }

  const currentQ = currentQuestions[currentQuestionIndex - 1];

  return (
    <main className="min-h-screen relative overflow-hidden p-4 sm:p-8 lg:p-12 flex flex-col items-center justify-center">
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Sair do ecrã inteiro" : "Ecrã inteiro"}
          title={isFullscreen ? "Sair do ecrã inteiro" : "Ecrã inteiro"}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-[#e3e0f9]/60 hover:text-[#e3e0f9] transition-colors"
        >
          {isFullscreen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
          )}
        </button>
      </div>
      <SoundEnableButton />
      <SoundControls />

      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-[#d0bcff]/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-[#FFB0CD]/10 rounded-full blur-[150px]" />
        <div className="absolute top-[30%] left-[40%] w-[30vw] h-[30vw] bg-[#FFD700]/5 rounded-full blur-[120px]" />
      </div>

      {(status === GameStatus.LOBBY || status === GameStatus.STARTING) && (
        <LobbyView
          pin={pin}
          players={players}
          topic={topic}
          customTopic={customTopic}
          ageGroup={ageGroup}
          timerDuration={timerDuration}
          questionCount={questionCount}
          localMode={localMode}
          availableCount={availableCount}
          isGenerating={isGenerating}
          status={status}
          usedCount={usedQuestionIdsRef.current.length}
          onTopicToggle={(name) => {
            if (topic.includes(name)) {
              setTopic(topic.filter((x) => x !== name));
            } else {
              setTopic([...topic, name]);
            }
            setCustomTopic("");
          }}
          onTopicChange={setTopic}
          onCustomTopicChange={setCustomTopic}
          onAgeGroupChange={setAgeGroup}
          onTimerDurationChange={setTimerDuration}
          onQuestionCountChange={setQuestionCount}
          onLocalModeToggle={() => setLocalMode(!localMode)}
          onBuzzerModeToggle={async () => {
            const newMode = !buzzerMode;
            setBuzzerMode(newMode);
            if (gameId) {
              await supabase
                .from("games")
                .update({ settings: { ...gameSettings, buzzer_mode: newMode } })
                .eq("id", gameId);
            }
          }}
          onHotseatModeToggle={async () => {
            const newMode = !hotseatMode;
            setHotseatMode(newMode);
            if (gameId) {
              await supabase
                .from("games")
                .update({ settings: { ...gameSettings, hotseat_mode: newMode, hotseat_players: hotseatMode ? [] : hotseatPlayers } })
                .eq("id", gameId);
            }
          }}
          hotseatMode={hotseatMode}
          hotseatPlayers={hotseatPlayers}
          onHotseatPlayerAdd={async (name: string) => {
            const newPlayers = [...hotseatPlayers, name];
            setHotseatPlayers(newPlayers);
            if (gameId) {
              await supabase
                .from("games")
                .update({ settings: { ...gameSettings, hotseat_players: newPlayers } })
                .eq("id", gameId);
            }
          }}
          onHotseatPlayerRemove={async (name: string) => {
            const newPlayers = hotseatPlayers.filter((p) => p !== name);
            setHotseatPlayers(newPlayers);
            if (gameId) {
              await supabase
                .from("games")
                .update({ settings: { ...gameSettings, hotseat_players: newPlayers } })
                .eq("id", gameId);
            }
          }}
          onStart={() => updateStatus(GameStatus.STARTING)}
          onClearMemory={() => setMemoryConfirmOpen(true)}
        />
      )}

      {localMode && (
        <div className="absolute top-4 right-4 z-50 bg-green-500/20 backdrop-blur-md px-6 py-3 rounded-2xl border-2 border-green-500/50">
          <div className="text-xs text-green-300 font-bold uppercase tracking-widest">Pontuação</div>
          <div className="text-3xl font-black text-white">{localScore}</div>
        </div>
      )}

      {status === GameStatus.QUESTION && (
        <button
          onClick={() => {
            setCurrentAnswers([]);
            triggerReveal();
          }}
          className="absolute top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-[#FF6B6B]/20 hover:bg-[#FF6B6B]/30 text-[#FF6B6B] rounded-xl border border-[#FF6B6B]/30 transition-all text-sm font-bold"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
          Saltar
        </button>
      )}

      {(status === GameStatus.QUESTION || status === GameStatus.REVEAL) && currentQ && (
        <QuestionDisplay
          question={currentQ}
          timeLeft={timeLeft}
          totalTime={timerDuration}
          status={status}
          players={players}
          questionSource={questionSource}
          answers={currentAnswers.filter((a) => String(a.question_id) === String(currentQ.id))}
          onTimerClick={() => setTimeLeft(0)}
          localMode={localMode}
          onLocalAnswer={handleLocalAnswer}
          questionNumber={currentQuestionIndex}
          totalQuestions={currentQuestions.length}
          localLives={localLives}
          blindMode={blindMode}
          buzzerMode={buzzerMode}
          hotseatMode={hotseatMode}
          currentHotseatPlayer={hotseatMode && hotseatPlayers[currentHotseatIndex] ? hotseatPlayers[currentHotseatIndex] : undefined}
        />
      )}

      {status === GameStatus.REVEAL && currentQ && <LiveLeaderboard players={players} />}

      {status === GameStatus.REVEAL && currentQ && (
        <RevealControls
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={currentQuestions.length}
          timeUntilNext={timeUntilNext}
          round={round}
          onNextQuestion={advanceFromReveal}
          onNewRound={() => {
            setRound((r) => r + 1);
            updateStatus(GameStatus.STARTING);
          }}
          onEditTopic={resetToLobby}
          onReport={() => setReportOpen(true)}
        />
      )}

      {status === GameStatus.PODIUM && (
        <PodiumView
          players={players}
          onRestart={() => {
            setRound((r) => r + 1);
            setCurrentAnswers([]);
            updateStatus(GameStatus.STARTING);
          }}
          onEditTopic={resetToLobby}
          onReport={() => setReportOpen(true)}
          onAdvanceTournament={tournamentId ? () => {
            const nextStatus = round >= 2 ? GameStatus.FINAL : GameStatus.QUALIFYING;
            advanceTournament(nextStatus);
            setRound((r) => r + 1);
            updateStatus(GameStatus.STARTING);
          } : undefined}
          tournamentStatus={tournamentId ? (round >= 2 ? GameStatus.FINAL : GameStatus.QUALIFYING) : undefined}
        />
      )}

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
      <TVChat gameId={gameId!} />
      <TVReactions gameId={gameId!} />
      <ReportModal isOpen={reportOpen} onClose={() => setReportOpen(false)} onSubmit={handleReportQuestion} />
      <ConfirmModal
        isOpen={memoryConfirmOpen}
        onClose={() => setMemoryConfirmOpen(false)}
        onConfirm={clearUsedQuestions}
        title="Limpar Memória"
        message={`Tens a certeza? ${usedQuestionIdsRef.current.length} perguntas memorizadas serão apagadas.`}
        confirmLabel="Limpar"
        danger
      />
    </main>
  );
}