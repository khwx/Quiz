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
import SoundEnableButton from "@/components/SoundEnableButton";
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

export default function TVHost() {
  const { gameId, status, updateStatus, players, currentQuestionIndex, nextQuestion, setPlayers } = useGame();
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
    tournamentId,
    teamId,
    saveTournamentScore,
    advanceTournament,
    resetToLobby,
  } = useGameSetup();

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

    if (allPlayerIds.size > 0 && answeredPlayerIds.size >= allPlayerIds.size) {
      triggerReveal();
    }
  }, [status, currentQuestionIndex, currentQuestions, questionStartTimeRef, triggerReveal]);

  // Save tournament team score when game reaches PODIUM
  useEffect(() => {
    if (status === "PODIUM" && tournamentId && teamId && players.length > 0) {
      const teamScore = players
        .filter((p) => {
          // If we have team info, sum scores of team members
          return true; // For now sum all players (team game = all players are the team)
        })
        .reduce((sum, p) => sum + (p.score || 0), 0);
      saveTournamentScore(teamScore);
    }
  }, [status, tournamentId, teamId, players, saveTournamentScore]);

  const [reportOpen, setReportOpen] = useState(false);
  const [memoryConfirmOpen, setMemoryConfirmOpen] = useState(false);

  useKeyboardShortcuts(
    status,
    currentQuestions,
    currentQuestionIndex,
    nextQuestion,
    updateStatus,
    setTimeLeft,
    () => setReportOpen(true),
    () => {
      setReportOpen(false);
      setMemoryConfirmOpen(false);
    }
  );

  useEffect(() => {
    if (status === "STARTING") {
      setCurrentAnswers([]);
    }
  }, [status, setCurrentAnswers]);

  useEffect(() => {
    if (status === "QUESTION") {
      setCurrentAnswers([]);
      if (gameId) {
        const syncPlayers = async () => {
          const { data } = await supabase.from("players").select("*").eq("game_id", gameId);
          if (data && data.length > 0) setPlayers(data);
        };
        syncPlayers();
        setTimeout(syncPlayers, 1500);
      }
    }
  }, [currentQuestionIndex, round, status]);

  const handleLocalAnswer = useCallback(
    (optionIndex: number) => {
      if (status !== "QUESTION") return;
      const currentQ = currentQuestions[currentQuestionIndex - 1];
      if (!currentQ || localScore >= questionCount) return;

      if (optionIndex === currentQ.correct_option) {
        const points = Math.max(10, Math.floor((timeLeft / timerDuration) * 100));
        setLocalScore((prev) => prev + points);
        playSound?.("correct");
      } else {
        playSound?.("wrong");
      }
      updateStatus("REVEAL");
    },
    [status, currentQuestions, currentQuestionIndex, localScore, questionCount, timeLeft, timerDuration, playSound, updateStatus, setLocalScore]
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
    const nextQ = currentQuestions[currentQuestionIndex];
    if (nextQ) {
      nextQuestion(nextQ.id, nextQ.correct_option);
    } else {
      setRound((r) => r + 1);
      updateStatus("STARTING");
    }
  }, [currentQuestions, currentQuestionIndex, nextQuestion, updateStatus, setRound]);

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
      <SoundEnableButton />

      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-[#d0bcff]/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-[#FFB0CD]/10 rounded-full blur-[150px]" />
        <div className="absolute top-[30%] left-[40%] w-[30vw] h-[30vw] bg-[#FFD700]/5 rounded-full blur-[120px]" />
      </div>

      {(status === "LOBBY" || status === "STARTING") && (
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
          onStart={() => updateStatus("STARTING")}
          onClearMemory={() => setMemoryConfirmOpen(true)}
        />
      )}

      {localMode && (
        <div className="absolute top-4 right-4 z-50 bg-green-500/20 backdrop-blur-md px-6 py-3 rounded-2xl border-2 border-green-500/50">
          <div className="text-xs text-green-300 font-bold uppercase tracking-widest">Pontuação</div>
          <div className="text-3xl font-black text-white">{localScore}</div>
        </div>
      )}

      {(status === "QUESTION" || status === "REVEAL") && currentQ && (
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
        />
      )}

      {status === "REVEAL" && currentQ && <LiveLeaderboard players={players} />}

      {status === "REVEAL" && currentQ && (
        <RevealControls
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={currentQuestions.length}
          timeUntilNext={timeUntilNext}
          round={round}
          onNextQuestion={advanceFromReveal}
          onNewRound={() => {
            setRound((r) => r + 1);
            updateStatus("STARTING");
          }}
          onEditTopic={resetToLobby}
          onReport={() => setReportOpen(true)}
        />
      )}

      {status === "PODIUM" && (
        <PodiumView
          players={players}
          onRestart={() => {
            setRound((r) => r + 1);
            setCurrentAnswers([]);
            updateStatus("STARTING");
          }}
          onEditTopic={resetToLobby}
          onReport={() => setReportOpen(true)}
          onAdvanceTournament={tournamentId ? () => {
            const nextStatus = round >= 2 ? "FINAL" : "QUALIFYING";
            advanceTournament(nextStatus);
            setRound((r) => r + 1);
            updateStatus("STARTING");
          } : undefined}
          tournamentStatus={tournamentId ? (round >= 2 ? "FINAL" : "QUALIFYING") : undefined}
        />
      )}

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
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