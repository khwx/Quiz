"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { triggerHaptic } from "@/lib/haptics";
import { useSound } from "@/hooks/useSound";
import { GAME_CONSTANTS, GameStatus } from "@/lib/constants";
import type { Question, Player } from "@/types";
import QuestionView from "@/components/mobile/QuestionView";
import RevealView from "@/components/mobile/RevealView";
import FinalView from "@/components/mobile/FinalView";

const SOLO_QUESTION_COUNT = 10;
const PLAYER_NAME = "Tu";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function SoloGame() {
  const { playSound } = useSound();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<GameStatus>(GameStatus.QUESTION);
  const [questionData, setQuestionData] = useState<Question | null>(null);
  const [correctOption, setCorrectOption] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(GAME_CONSTANTS.DEFAULT_TIMER);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState<number>(GAME_CONSTANTS.LIVES_DEFAULT);
  const [earnedPoints, setEarnedPoints] = useState<number | null>(null);
  const [fiftyFiftyUsed, setFiftyFiftyUsed] = useState(false);
  const [skipUsed, setSkipUsed] = useState(false);
  const [freezeUsed, setFreezeUsed] = useState(false);
  const [frozen, setFrozen] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const revealTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const answeredRef = useRef(false);
  const frozenRef = useRef(false);

  const timerDuration = GAME_CONSTANTS.DEFAULT_TIMER;

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (revealTimeoutRef.current) clearTimeout(revealTimeoutRef.current);
  }, []);

  // Load questions
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("questions")
        .select("id, text, options, correct_option, image_url, category, metadata, age_rating, explanation")
        .limit(200);
      if (cancelled) return;
      if (error || !data || data.length === 0) {
        setLoadError(true);
        setLoading(false);
        return;
      }
      const picked = shuffle(data as Question[]).slice(0, SOLO_QUESTION_COUNT);
      setQuestions(picked);
      setQuestionData(picked[0] ?? null);
      setCorrectOption(picked[0]?.correct_option ?? null);
      setTimeLeft(timerDuration);
      startTimeRef.current = Date.now();
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [timerDuration]);

  const goToReveal = useCallback(() => {
    clearTimers();
    setStatus(GameStatus.REVEAL);
  }, [clearTimers]);

  const nextQuestion = useCallback(() => {
    const next = index + 1;
    if (next >= questions.length) {
      setStatus(GameStatus.PODIUM);
      return;
    }
    const q = questions[next];
    setIndex(next);
    setQuestionData(q);
    setCorrectOption(q?.correct_option ?? null);
    setSelectedOption(null);
    setHasAnswered(false);
    setEarnedPoints(null);
    setFiftyFiftyUsed(false);
    setSkipUsed(false);
    setFreezeUsed(false);
    setFrozen(false);
    frozenRef.current = false;
    setEliminatedOptions([]);
    answeredRef.current = false;
    setTimeLeft(timerDuration);
    startTimeRef.current = Date.now();
    setStatus(GameStatus.QUESTION);
  }, [index, questions, timerDuration]);

  // Question timer
  useEffect(() => {
    if (status !== GameStatus.QUESTION || !questionData) return;
    startTimeRef.current = Date.now();
    answeredRef.current = false;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => (frozenRef.current ? prev : Math.max(0, prev - 1)));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, questionData, timerDuration]);

  // Auto-reveal when time runs out
  useEffect(() => {
    if (status === GameStatus.QUESTION && timeLeft <= 0 && !answeredRef.current) {
      answeredRef.current = true;
      setTimeout(() => goToReveal(), 0);
    }
  }, [status, timeLeft, goToReveal]);

  const handleAnswer = useCallback(
    (opt: number) => {
      if (answeredRef.current) return;
      answeredRef.current = true;
      clearTimers();
      setSelectedOption(opt);
      setHasAnswered(true);

      const isCorrect = opt === correctOption;
      const timeTaken = Math.max(0, Math.floor((Date.now() - startTimeRef.current) / 1000));
      const timeRatio = Math.max(0, timerDuration - timeTaken) / timerDuration;
      const points = Math.round(GAME_CONSTANTS.SCORE_MIN + (GAME_CONSTANTS.SCORE_MAX - GAME_CONSTANTS.SCORE_MIN) * timeRatio);

      if (isCorrect) {
        setScore((s) => s + points);
        setStreak((s) => {
          const ns = s + 1;
          if (ns >= 3) triggerHaptic("streak");
          return ns;
        });
        setEarnedPoints(points);
        playSound("correct");
        triggerHaptic("correct");
      } else {
        setStreak(0);
        setEarnedPoints(0);
        const newLives = lives - 1;
        setLives(newLives);
        if (newLives <= 0) {
          revealTimeoutRef.current = setTimeout(() => setStatus(GameStatus.PODIUM), GAME_CONSTANTS.REVEAL_DELAY_MS);
        }
        playSound("wrong");
        triggerHaptic("wrong");
      }

      revealTimeoutRef.current = setTimeout(() => goToReveal(), GAME_CONSTANTS.REVEAL_DELAY_MS);
    },
    [correctOption, timerDuration, playSound, clearTimers, goToReveal, lives]
  );

  const handleFiftyFifty = useCallback(() => {
    if (fiftyFiftyUsed || !questionData || correctOption === null) return;
    const wrong = questionData.options
      .map((_, i) => i)
      .filter((i) => i !== correctOption);
    const toEliminate = shuffle(wrong).slice(0, 2);
    setEliminatedOptions(toEliminate);
    setFiftyFiftyUsed(true);
    playSound("tick");
  }, [fiftyFiftyUsed, questionData, correctOption, playSound]);

  const handleSkip = useCallback(() => {
    if (answeredRef.current || hasAnswered) return;
    answeredRef.current = true;
    clearTimers();
    setSkipUsed(true);
    setHasAnswered(true);
    playSound("tick");
    revealTimeoutRef.current = setTimeout(() => goToReveal(), GAME_CONSTANTS.REVEAL_DELAY_MS);
  }, [hasAnswered, playSound, clearTimers, goToReveal]);

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

  useEffect(() => () => clearTimers(), [clearTimers]);

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#121223]">
        <div className="w-12 h-12 border-2 border-[#d0bcff] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#e3e0f9]/50 text-sm">A preparar a tua missão...</p>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#121223] p-6 text-center">
        <p className="text-[#e3e0f9]/60">Não foi possível carregar perguntas.</p>
        <button
          onClick={() => (window.location.href = "/")}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 text-[#e3e0f9] rounded-xl border border-white/10"
        >
          Voltar ao Início
        </button>
      </main>
    );
  }

  if (status === GameStatus.PODIUM) {
    const soloPlayer: Player = { id: "solo", name: PLAYER_NAME, score } as Player;
    return <FinalView players={[soloPlayer]} playerName={PLAYER_NAME} />;
  }

  if (status === GameStatus.REVEAL && questionData) {
    return (
      <>
        <RevealView
          selectedOption={selectedOption}
          correctOption={correctOption}
          questionData={questionData}
          earnedPoints={earnedPoints}
          skipped={skipUsed}
          onReport={() => {}}
        />
        <button
          onClick={nextQuestion}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-8 py-3 bg-gradient-to-r from-[#FFD700] to-[#d0bcff] text-[#121223] font-bold rounded-xl shadow-lg uppercase tracking-widest text-sm"
        >
          {index + 1 >= questions.length ? "Ver Resultado" : "Próxima Pergunta"}
        </button>
      </>
    );
  }

  if (questionData) {
    return (
      <QuestionView
        questionData={questionData}
        timeLeft={timeLeft}
        timerDuration={timerDuration}
        hasAnswered={hasAnswered}
        selectedOption={selectedOption}
        streak={streak}
        lives={lives}
        eliminated={false}
        onAnswer={handleAnswer}
        onReport={() => {}}
        onFiftyFifty={handleFiftyFifty}
        fiftyFiftyUsed={fiftyFiftyUsed}
        onSkip={handleSkip}
        skipUsed={skipUsed}
        onFreeze={handleFreeze}
        freezeUsed={freezeUsed}
        frozen={frozen}
        eliminatedOptions={eliminatedOptions}
        buzzerMode={false}
      />
    );
  }

  return null;
}
