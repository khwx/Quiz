"use client";

import { motion } from "framer-motion";
import { Gamepad2, CheckCircle2, Loader2, Wifi, Rocket, ArrowLeft, LogOut, Users } from "lucide-react";

interface LobbyJoinViewProps {
  pin: string;
  name: string;
  isJoining: boolean;
  hasJoined: boolean;
  players: any[];
  onPinChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onJoin: () => void;
  onLeave: () => void;
}

export default function LobbyJoinView({
  pin,
  name,
  isJoining,
  hasJoined,
  players,
  onPinChange,
  onNameChange,
  onJoin,
  onLeave,
}: LobbyJoinViewProps) {
  if (hasJoined) {
    return (
      <main className="min-h-screen relative overflow-x-hidden flex items-center justify-center">
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-violet-600/20 blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-pink-600/20 blur-[100px]" />
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="relative z-10 glass-panel w-full max-w-sm flex flex-col items-center gap-6 m-6 p-8"
        >
          <div className="bg-emerald-500/20 p-6 rounded-full">
            <CheckCircle2 className="w-20 h-20 text-emerald-400" />
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-black text-white mb-2" style={{ fontFamily: "Space Grotesk" }}>
              ENTROU!
            </h2>
            <p className="text-white/60">Olá {name}! O jogo vai começar!</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full">
              <Wifi className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400">Conectado</span>
            </div>
            {players.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full">
                <Users className="w-4 h-4 text-white/50" />
                <span className="text-sm text-white/50">
                  {players.length} jogador{players.length !== 1 ? "es" : ""}
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col items-center gap-1 text-white/30 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Aguarda pelo anfitrião...</span>
          </div>
          <button
            onClick={onLeave}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-full hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Sair</span>
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative overflow-x-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-violet-600/20 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-pink-600/20 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm mx-auto p-6"
      >
        <div className="flex items-center gap-4 mb-8 justify-center">
          <div className="p-4 bg-gradient-to-r from-violet-600 to-pink-600 rounded-2xl shadow-lg shadow-pink-500/20">
            <Gamepad2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white" style={{ fontFamily: "Space Grotesk" }}>
            QUIZ<span className="text-pink-500">VERSE</span>
          </h1>
        </div>

        <div className="glass-panel p-6 space-y-6">
          <div>
            <label className="text-xs font-medium text-white/40 uppercase tracking-widest mb-2 block">
              Código do Jogo
            </label>
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="000000"
              value={pin}
              onChange={(e) => onPinChange(e.target.value.replace(/\D/g, ""))}
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
              onChange={(e) => onNameChange(e.target.value)}
              className="w-full glass-input text-xl"
            />
          </div>

          <button
            onClick={onJoin}
            disabled={isJoining || !pin || !name}
            className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${
              isJoining || !pin || !name
                ? "bg-white/5 text-white/30 cursor-not-allowed"
                : "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:scale-[0.98] active:scale-[0.95]"
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
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-white/40 hover:text-white/60 transition-colors mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Voltar</span>
          </button>
        </div>
      </motion.div>
    </main>
  );
}