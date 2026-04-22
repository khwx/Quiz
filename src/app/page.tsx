"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Tv, Gamepad2, Settings, Play, Globe, Languages, History, FlaskConical, Music, Sparkles, Cpu, Palette, Rocket } from "lucide-react";

export default function Home() {
  const categories = [
    { icon: Globe, name: "Países", desc: "Capitais, bandeiras e muito mais", color: "emerald" },
    { icon: History, name: "História", desc: "Eventos que moldaram o mundo", color: "amber" },
    { icon: FlaskConical, name: "Ciência", desc: "Descobertas e invenções", color: "cyan" },
    { icon: Languages, name: "Idiomas", desc: "Culturas e tradições", color: "violet" },
  ];

  return (
    <main className="min-h-screen relative overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-violet-600/10 rounded-full mix-blend-screen filter blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-pink-600/10 rounded-full mix-blend-screen filter blur-[150px]" />
      </div>

      {/* Top Bar - Desktop */}
      <header className="hidden md:flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto relative z-50">
        <div className="text-2xl font-black italic bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-pink-500" style={{ fontFamily: 'Space Grotesk, system-ui' }}>
          QUIZVERSE
        </div>
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-white font-bold border-b-2 border-pink-500 pb-1 text-sm">Home</Link>
          <Link href="/tutorial" className="text-white/60 hover:text-white transition-colors text-sm">Como Jogar</Link>
        </nav>
        <div className="flex gap-4">
          <Link href="/admin" className="text-white/60 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto p-6 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Hero & Actions */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Hero Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8 lg:p-12 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <span className="inline-block px-4 py-1 mb-4 text-xs font-semibold tracking-widest text-violet-400 uppercase bg-violet-400/10 rounded-full">
                Quiz Gaming v3.0
              </span>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-4" style={{ fontFamily: 'Space Grotesk, system-ui' }}>
                Acende a tua <span className="text-violet-400 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-purple-400">Mente</span>.
              </h1>
              <p className="text-white/70 text-lg max-w-xl mb-8">
                Entra na arena do conhecimento. Desafia os teus amigos e família num jogo de perguntas e respostaseno ecrã grande!
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/host" 
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-full hover:scale-[0.98] active:scale-[0.95] transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                >
                  <Tv className="w-5 h-5" />
                  Criar Jogo
                </Link>
                <Link 
                  href="/play" 
                  className="flex items-center gap-2 px-8 py-4 bg-white/5 text-white font-semibold rounded-full border border-white/20 hover:bg-white/10 transition-all"
                >
                  <Gamepad2 className="w-5 h-5" />
                  Entrar no Jogo
                </Link>
              </div>
            </div>
          </motion.section>

          {/* Category Grid */}
          <section>
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, system-ui' }}>Categorias</h2>
              <button className="text-sm text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1">
                Ver Todas <span className="material-symbols text-sm">arrow_forward</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className={`glass-panel p-6 flex flex-col items-start hover:border-${cat.color}-400/50 hover:shadow-[0_0_25px_rgba(139,92,246,0.15)] transition-all duration-300 cursor-pointer group`}
                >
                  <div className={`bg-white/10 p-3 rounded-xl mb-4 text-white/80 group-hover:bg-${cat.color}-500 group-hover:text-white transition-colors duration-300`}>
                    <cat.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-1">{cat.name}</h3>
                  <p className="text-white/50 mb-4">{cat.desc}</p>
                  <button className="w-full border border-white/10 bg-white/5 text-white/60 text-sm rounded-full px-4 py-2 group-hover:border-violet-400 group-hover:text-violet-400 transition-colors duration-300">
                    Jogar
                  </button>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column - Quick Actions & Info */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          {/* Quick Join Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-6 h-fit"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Rocket className="w-5 h-5 text-violet-400" />
              Entrada Rápida
            </h3>
            <form className="space-y-4">
              <div>
                <input 
                  type="text" 
                  placeholder="Código do Jogo" 
                  className="w-full glass-input text-center text-lg font-mono tracking-widest uppercase"
                  maxLength={6}
                />
              </div>
              <Link 
                href="/play" 
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl hover:brightness-110 transition-all"
              >
                <Play className="w-5 h-5" />
                Entrar
              </Link>
            </form>
          </motion.div>

          {/* How to Play Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Como Funciona?</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold shrink-0">1</div>
                <div>
                  <p className="text-white font-medium">Cria um jogo</p>
                  <p className="text-white/50 text-sm">O anfitrião abre o jogo na TV</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold shrink-0">2</div>
                <div>
                  <p className="text-white font-medium">Entra com código</p>
                  <p className="text-white/50 text-sm">Os jogadores juntam-se com o PIN</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold shrink-0">3</div>
                <div>
                  <p className="text-white font-medium">Responde no telemóvel</p>
                  <p className="text-white/50 text-sm">Cada ronda é mais rápida!</p>
                </div>
              </div>
            </div>
            <Link 
              href="/tutorial" 
              className="w-full mt-6 flex items-center justify-center gap-2 text-violet-400 hover:text-violet-300 transition-colors"
            >
              <Play className="w-4 h-4" />
              <span className="text-sm font-medium">Ver Tutorial</span>
            </Link>
          </motion.div>

          {/* Admin Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <Link href="/admin" prefetch={false} className="flex items-center justify-center gap-2 text-white/40 hover:text-white/60 transition-colors text-sm">
              <Settings className="w-4 h-4" />
              Painel de Administração
            </Link>
          </motion.div>
        </aside>
      </div>

      {/* Bottom Nav - Mobile */}
      <nav className="fixed bottom-0 w-full z-50 md:hidden border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
        <div className="flex justify-around items-center px-4 py-3 bg-slate-950/90 backdrop-blur-2xl border-t border-white/10">
          <Link href="/" className="flex flex-col items-center justify-center text-pink-500 relative">
            <Tv className="w-6 h-6" style={{ fill: 'currentColor' }} />
            <span className="text-[10px] uppercase tracking-widest font-bold mt-1">Home</span>
          </Link>
          <Link href="/play" className="flex flex-col items-center justify-center text-white/50">
            <Gamepad2 className="w-6 h-6" />
            <span className="text-[10px] uppercase tracking-widest font-bold mt-1">Jogar</span>
          </Link>
          <Link href="/tutorial" className="flex flex-col items-center justify-center text-white/50">
            <Play className="w-6 h-6" />
            <span className="text-[10px] uppercase tracking-widest font-bold mt-1">Ajuda</span>
          </Link>
        </div>
      </nav>

      {/* Spacer for mobile nav */}
      <div className="h-20 md:hidden" />
    </main>
  );
}