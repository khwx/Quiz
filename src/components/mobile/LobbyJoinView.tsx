"use client";

import { motion } from "framer-motion";
import { Gamepad2, CheckCircle2, Loader2, Wifi, Rocket, ArrowLeft, LogOut, Users } from "lucide-react";
import type { Player } from "@/types";

interface LobbyJoinViewProps {
  pin: string;
  name: string;
  isJoining: boolean;
  hasJoined: boolean;
  players: Player[];
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
          <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-[#4CAF50]/15 blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-[#d0bcff]/10 blur-[100px]" />
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="relative z-10 glass-panel w-full max-w-sm flex flex-col items-center gap-6 m-6 p-8"
        >
          <div className="bg-[#4CAF50]/20 p-6 rounded-full">
            <CheckCircle2 className="w-20 h-20 text-[#4CAF50]" />
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-black text-[#e3e0f9] mb-2" style={{ fontFamily: "Space Grotesk" }}>
              ENTROU!
            </h2>
            <p className="text-[#e3e0f9]/60">Olá {name}! O jogo vai começar!</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#4CAF50]/10 rounded-full">
              <Wifi className="w-4 h-4 text-[#4CAF50]" />
              <span className="text-sm text-[#4CAF50]">Conectado</span>
            </div>
            {players.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full">
                <Users className="w-4 h-4 text-[#e3e0f9]/50" />
                <span className="text-sm text-[#e3e0f9]/50">
                  {players.length} jogador{players.length !== 1 ? "es" : ""}
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col items-center gap-1 text-[#e3e0f9]/30 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Aguarda pelo anfitrião...</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onLeave}
            className="flex items-center gap-2 px-4 py-2 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-full hover:bg-[#FF6B6B]/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Sair</span>
          </motion.button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative overflow-x-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-[#d0bcff]/10 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-[#FFB0CD]/10 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm mx-auto p-6"
      >
        <div className="flex items-center gap-4 mb-8 justify-center">
          <div className="p-4 bg-gradient-to-r from-[#d0bcff] to-[#FFB0CD] rounded-2xl shadow-lg shadow-[#d0bcff]/20">
            <Gamepad2 className="w-10 h-10 text-[#3c0091]" />
          </div>
          <h1 className="text-4xl font-black text-[#e3e0f9]" style={{ fontFamily: "Space Grotesk" }}>
            QUIZ<span className="text-[#FFB0CD]">VERSE</span>
          </h1>
        </div>

        <div className="glass-panel p-6 space-y-6">
          <div>
            <label className="text-[10px] font-bold text-[#e3e0f9]/40 uppercase tracking-widest mb-2 block">
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
            <label className="text-[10px] font-bold text-[#e3e0f9]/40 uppercase tracking-widest mb-2 block">
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

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onJoin}
            disabled={isJoining || !pin || !name}
            className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${
              isJoining || !pin || !name
                ? "bg-white/5 text-[#e3e0f9]/30 cursor-not-allowed"
                : "bg-gradient-to-r from-[#d0bcff] to-[#FFB0CD] text-[#3c0091] shadow-[0_0_20px_rgba(208,188,255,0.4)] hover:scale-[0.98] active:scale-[0.95]"
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
          </motion.button>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-[#e3e0f9]/40 hover:text-[#e3e0f9]/60 transition-colors mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Voltar</span>
          </button>
        </div>
      </motion.div>
    </main>
  );
}
