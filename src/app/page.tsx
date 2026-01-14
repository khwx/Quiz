"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Tv, Gamepad2, Settings } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      {/* Elementos de Fundo */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-violet-600/20 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-pink-600/20 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-12"
      >
        <span className="inline-block px-4 py-1 mb-4 text-sm font-semibold tracking-wider text-violet-400 uppercase bg-violet-400/10 rounded-full">
          A Melhor Experiência em Família
        </span>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-4 italic">
          QUIZ<span className="text-pink-500">MASTER</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-md mx-auto">
          Joguem juntos no ecrã grande usando os vossos telemóveis como comandos!
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Link href="/host" className="flex flex-col items-center gap-4 p-8 glass-card hover:bg-white/10 transition-all group">
            <div className="p-4 bg-violet-500/20 rounded-2xl group-hover:scale-110 transition-transform">
              <Tv className="w-12 h-12 text-violet-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Painel do Anfitrião</h3>
              <p className="text-sm text-gray-400">Comando para controlar o jogo na TV</p>
            </div>
            <button className="btn-quiz btn-primary w-full mt-4 underline-none">Abrir Comando</button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/play" className="flex flex-col items-center gap-4 p-8 glass-card hover:bg-white/10 transition-all group">
            <div className="p-4 bg-pink-500/20 rounded-2xl group-hover:scale-110 transition-transform">
              <Gamepad2 className="w-12 h-12 text-pink-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Jogar no Telemóvel</h3>
              <p className="text-sm text-gray-400">Entra num jogo e começa a responder</p>
            </div>
            <button className="btn-quiz btn-secondary w-full mt-4 underline-none">Entrar no Jogo</button>
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12"
      >
        <Link href="/admin" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors">
          <Settings className="w-4 h-4" />
          <span className="text-sm font-medium">Painel de Administração</span>
        </Link>
      </motion.div>
    </main>
  );
}
