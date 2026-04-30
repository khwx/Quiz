"use client";

import { use, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { Gamepad2, CheckCircle2, Loader2, Trophy, Wifi, Rocket, ArrowLeft, LogOut, Flag, Lightbulb, Clock, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSound } from "@/hooks/useSound";
import MobileNav from "@/components/MobileNav";

export default function MobilePlay({ searchParams }: { searchParams: Promise<{ pin?: string }> }) {
  const resolvedParams = use(searchParams);
  const { gameId, joinGame, status, currentQuestionIndex, currentQuestionId, players, setGameId } = useGame();
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

  const { playSound } = useSound();

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
      setTimeLeft(20);
      fetchQuestion();
    }
    if (status !== "QUESTION") {
      setTimerActive(false);
    }
  }, [status, currentQuestionIndex, currentQuestionId, fetchQuestion]);

  useEffect(() => {
    if (!timerActive) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setTimerActive(false);
          return 0;
        }
        if (prev <= 5) playSound('tick');
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
        playSound('correct');
      } else {
        playSound('wrong');
      }
    }
  }, [correctOption, selectedOption, playSound]);

  const handleJoin = async () => {
    if (!pin || !name) return;
    setIsJoining(true);
    try {
      const { data, error: pinError } = await supabase.from('games').select('id').eq('pin', pin).single();
      if (pinError || !data) {
        alert("Pin invalido ou jogo nao encontrado!");
        return;
      }
      await joinGame(data.id, name);
      setHasJoined(true);
    } catch (err: any) {
      console.error("Erro ao entrar:", err);
      alert("Erro ao entrar no jogo: " + (err.message || "Tenta novamente"));
    } finally {
      setIsJoining(false);
    }
  };

  const handleAnswer = async (index: number) => {
    if (hasAnswered) return;
    if (!currentQuestionId) {
      alert("Aguarde um segundo, a sincronizar...");
      return;
    }
    setHasAnswered(true);
    setSelectedOption(index);
    playSound('tick');

    const player = players.find(p => p.name === name);
    if (!player) {
      alert("Erro: Jogador nao encontrado. Atualiza a pagina.");
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
          timeTaken
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha ao enviar resposta");
    } catch (err: any) {
      alert("Erro ao enviar resposta: " + err.message);
      setHasAnswered(false);
      setSelectedOption(null);
    }
  };

  const handleLeave = async () => {
    if (window.confirm("Queres sair do jogo?")) {
      if (gameId) {
        const player = players.find(p => p.name === name);
        if (player) await supabase.from('players').delete().eq('id', player.id);
      }
      setHasJoined(false);
      setGameId(null);
      window.location.href = '/';
    }
  };

  const handleReport = async (reason: string) => {
    if (!currentQuestionId) return;
    const { data: q } = await supabase.from('questions').select('metadata').eq('id', currentQuestionId).single();
    const currentReports = q?.metadata?.reports || [];
    await supabase.from('questions').update({
      metadata: { reports: [...currentReports, { reason, reporter: name, date: new Date().toISOString() }] }
    }).eq('id', currentQuestionId);
    alert("Obrigado! Pergunta reportada.");
  };

  const optionColors = [
    "bg-red-500 active:bg-red-600 border-red-700",
    "bg-blue-500 active:bg-blue-600 border-blue-700",
    "bg-yellow-500 active:bg-yellow-600 border-yellow-700",
    "bg-green-500 active:bg-green-600 border-green-700"
  ];
  const optionLetters = ["A", "B", "C", "D"];

  const hint = questionData?.metadata?.hint;
  const flagCode = questionData?.image_url?.match(/\/flags\/([a-z]{2})\.svg/i)?.[1] ||
    questionData?.image_url?.match(/flagcdn\.com\/.*?\/([a-z]{2})\.svg/i)?.[1];
  const isFlagQuestion = questionData?.category?.toLowerCase().includes("bandeira") || flagCode;

  if (hasJoined) {
    if (status === "LOBBY" || status === "STARTING") {
      return (
        <main className="min-h-screen relative overflow-x-hidden flex items-center justify-center">
          <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-violet-600/20 blur-[100px]" />
            <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-pink-600/20 blur-[100px]" />
          </div>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative z-10 glass-panel w-full max-w-sm flex flex-col items-center gap-6 m-6 p-8">
            <div className="bg-emerald-500/20 p-6 rounded-full">
              <CheckCircle2 className="w-20 h-20 text-emerald-400" />
            </div>
            <div className="text-center">
              <h2 className="text-3xl font-black text-white mb-2" style={{ fontFamily: 'Space Grotesk' }}>ENTROU!</h2>
              <p className="text-white/60">Ola {name}! O jogo vai comecar!</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full">
              <Wifi className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400">Conectado</span>
            </div>
            <button onClick={handleLeave} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-full hover:bg-red-500/20 transition-colors">
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Sair</span>
            </button>
          </motion.div>
        </main>
      );
    }

    if (status === "QUESTION" && questionData) {
      return (
        <main className="min-h-screen flex flex-col bg-slate-950">
          {/* Timer bar */}
          <div className="w-full h-2 bg-slate-800">
            <motion.div
              animate={{ width: `${(timeLeft / 20) * 100}%` }}
              transition={{ ease: "linear", duration: 1 }}
              className={`h-full ${timeLeft <= 5 ? 'bg-red-500' : 'bg-pink-500'}`}
            />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-xs font-bold text-white/40 uppercase tracking-widest">
              {questionData.category?.replace(/_/g, ' ')}
            </span>
            <div className="flex items-center gap-2">
              <Clock className={`w-4 h-4 ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-white/40'}`} />
              <span className={`text-lg font-black font-mono ${timeLeft <= 5 ? 'text-red-400' : 'text-white'}`}>
                {timeLeft}
              </span>
            </div>
          </div>

          {/* Image area for flags */}
          {isFlagQuestion && (
            <div className="flex justify-center px-4 mb-2">
              <div className="w-40 h-28 bg-black/30 rounded-xl overflow-hidden border-2 border-white/10 flex items-center justify-center">
                {flagCode ? (
                  <img src={`/flags/${flagCode}.svg`} alt="Bandeira" className="max-h-full max-w-full object-contain" />
                ) : questionData.image_url ? (
                  <img src={questionData.image_url} alt="Bandeira" className="max-h-full max-w-full object-contain" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-white/20" />
                )}
              </div>
            </div>
          )}

          {/* Question text */}
          <div className="px-4 py-3 text-center">
            <h2 className="text-xl font-black text-white leading-tight">
              {questionData.text}
            </h2>
          </div>

          {/* Hint button */}
          {hint && !hasAnswered && (
            <div className="flex justify-center mb-2">
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-full text-sm transition-colors border border-amber-500/20"
              >
                <Lightbulb className="w-4 h-4" />
                {showHint ? 'Esconder Dica' : 'Ver Dica'}
              </button>
            </div>
          )}

          {/* Hint display */}
          <AnimatePresence>
            {showHint && hint && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mx-4 mb-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <p className="text-amber-300 text-sm font-medium">{hint}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Options */}
          <div className="flex-1 px-4 pb-4 grid grid-cols-1 gap-3 content-center">
            {questionData.options?.map((option: string, idx: number) => (
              <motion.button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={hasAnswered}
                whileTap={!hasAnswered ? { scale: 0.97 } : {}}
                className={`
                  ${optionColors[idx]}
                  ${selectedOption === idx ? 'ring-4 ring-white scale-[0.97]' : ''}
                  ${hasAnswered ? 'opacity-50 cursor-not-allowed' : ''}
                  relative overflow-hidden
                  p-4 rounded-2xl border-b-4 shadow-lg
                  flex items-center gap-4
                  transition-all duration-100
                `}
              >
                <div className="bg-black/20 w-10 h-10 rounded-lg flex items-center justify-center text-xl font-black text-white/80 shrink-0">
                  {optionLetters[idx]}
                </div>
                <span className="text-lg font-bold text-white/90 text-left flex-1">{option}</span>
              </motion.button>
            ))}
          </div>

          {/* Waiting indicator */}
          {hasAnswered && (
            <div className="px-4 pb-4 flex items-center justify-center gap-2 text-white/50">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Aguarda...</span>
            </div>
          )}

          {/* Report button */}
          <button
            onClick={() => {
              const reason = prompt("Qual e o problema desta pergunta?");
              if (reason) handleReport(reason);
            }}
            className="fixed bottom-4 right-4 flex items-center gap-1 px-3 py-2 bg-white/10 hover:bg-white/20 text-white/50 rounded-full text-xs transition-colors z-40"
          >
            <Flag className="w-3 h-3" />
            Reportar
          </button>
        </main>
      );
    }

    // Fallback: waiting for question data
    if (status === "QUESTION" && !questionData) {
      return (
        <main className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-violet-400" />
        </main>
      );
    }

    if (status === "REVEAL") {
      const isCorrect = selectedOption === correctOption;
      const hasNoSelection = selectedOption === null;
      const correctText = questionData?.options?.[correctOption ?? -1];

      return (
        <main className={`min-h-screen flex flex-col items-center justify-center p-6 text-center transition-colors duration-500 ${hasNoSelection ? "bg-gray-900" : isCorrect ? "bg-green-600" : "bg-red-600"}`}>
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-4">
            {hasNoSelection ? (
              <>
                <div className="text-white opacity-50"><Loader2 className="w-20 h-20 animate-spin" /></div>
                <h2 className="text-4xl font-black text-white italic">DEMASIADO LENTO!</h2>
                <p className="text-white/60 text-lg font-bold uppercase tracking-widest">Nao chegaste a responder...</p>
              </>
            ) : isCorrect ? (
              <>
                <motion.div animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="bg-white/20 p-6 rounded-full">
                  <Trophy className="w-16 h-16 text-yellow-300" />
                </motion.div>
                <h2 className="text-5xl font-black text-white italic tracking-tighter">BOA!!!</h2>
                <p className="text-white/80 text-lg font-bold uppercase tracking-widest">Acertaste em cheio!</p>
              </>
            ) : (
              <>
                <div className={`p-6 rounded-3xl border-b-8 shadow-xl ${optionColors[selectedOption || 0]}`}>
                  <span className="text-5xl font-black text-white/90">{optionLetters[selectedOption || 0]}</span>
                </div>
                <h2 className="text-5xl font-black text-white italic tracking-tighter">ERRADO...</h2>
                {correctText && (
                  <p className="text-white/80 text-lg font-bold">Resposta certa: {correctText}</p>
                )}
              </>
            )}

            {/* Show hint on reveal */}
            {hint && (
              <div className="mt-4 p-3 bg-white/10 rounded-xl border border-white/20 max-w-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Lightbulb className="w-4 h-4 text-amber-300" />
                  <span className="text-amber-300 text-xs font-bold uppercase">Dica</span>
                </div>
                <p className="text-white/70 text-sm">{hint}</p>
              </div>
            )}

            <p className="text-white/40 text-sm mt-4 animate-pulse">Aguarda pela proxima pergunta</p>
          </motion.div>

          <button
            onClick={() => { const reason = prompt("Qual e o problema?"); if (reason) handleReport(reason); }}
            className="fixed bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white/60 rounded-full text-sm transition-colors"
          >
            <Flag className="w-4 h-4" /> Reportar
          </button>
        </main>
      );
    }

    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <Trophy className="w-24 h-24 text-yellow-500 mb-6 animate-bounce" />
        <h2 className="text-3xl font-bold text-white">Fim do Jogo!</h2>
        <p className="text-gray-400">Ve a classificacao na TV...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative overflow-x-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-violet-600/20 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-pink-600/20 blur-[100px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-sm mx-auto p-6">
        <div className="flex items-center gap-4 mb-8 justify-center">
          <div className="p-4 bg-gradient-to-r from-violet-600 to-pink-600 rounded-2xl shadow-lg shadow-pink-500/20">
            <Gamepad2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white" style={{ fontFamily: 'Space Grotesk' }}>QUIZ<span className="text-pink-500">VERSE</span></h1>
        </div>

        <div className="glass-panel p-6 space-y-6">
          <div>
            <label className="text-xs font-medium text-white/40 uppercase tracking-widest mb-2 block">
              Codigo do Jogo
            </label>
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="000000"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              className="w-full glass-input text-center text-3xl font-mono tracking-[0.3em] uppercase"
              maxLength={6}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-white/40 uppercase tracking-widest mb-2 block">
              O Teu Nome
            </label>
            <input
              type="text"
              placeholder="Como te queres chamar?"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full glass-input text-xl"
            />
          </div>

          <button
            onClick={handleJoin}
            disabled={isJoining || !pin || !name}
            className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${
              isJoining || !pin || !name
                ? 'bg-white/5 text-white/30 cursor-not-allowed'
                : 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:scale-[0.98] active:scale-[0.95]'
            }`}
          >
            {isJoining ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <Rocket className="w-5 h-5" />
                ENTRAR NO JOGO
              </>
            )}
          </button>
        </div>

        <div className="mt-8 text-center">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 text-white/40 hover:text-white/60 transition-colors mx-auto">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Voltar</span>
          </button>
        </div>
      </motion.div>

      <MobileNav />
      <div className="h-20 md:hidden" />
    </main>
  );
}
