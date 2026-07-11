"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Tv,
  Gamepad2,
  Settings,
  Play,
  Globe,
  Languages,
  History,
  FlaskConical,
  Rocket,
  User as UserIcon,
  ArrowRight,
  Zap,
  Trophy,
  Users,
  Sparkles,
  ChevronDown,
  Star,
  Timer,
  Brain,
  Target,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import MobileNav from "@/components/MobileNav";
import Onboarding, { QUIZVERSE_STEPS } from "@/components/Onboarding";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<import("@supabase/supabase-js").User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [quickPin, setQuickPin] = useState("");
  const [activeCategory, setActiveCategory] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  useEffect(() => {
    supabase.auth
      .getUser()
      .then(({ data: { user } }) => {
        setUser(user);
      })
      .finally(() => setAuthLoading(false));
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCategory((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const categories = [
    {
      icon: Globe,
      name: "Países",
      desc: "Capitais, bandeiras e muito mais",
      color: "emerald",
      gradient: "from-emerald-500 to-teal-500",
      questions: "250+",
    },
    {
      icon: History,
      name: "História",
      desc: "Eventos que moldaram o mundo",
      color: "amber",
      gradient: "from-amber-500 to-orange-500",
      questions: "180+",
    },
    {
      icon: FlaskConical,
      name: "Ciência",
      desc: "Descobertas e invenções",
      color: "cyan",
      gradient: "from-cyan-500 to-blue-500",
      questions: "200+",
    },
    {
      icon: Languages,
      name: "Idiomas",
      desc: "Culturas e tradições",
      color: "violet",
      gradient: "from-violet-500 to-purple-500",
      questions: "150+",
    },
  ];

  const stats = [
    { icon: Users, value: "1.2K+", label: "Jogadores Ativos" },
    { icon: Trophy, value: "5K+", label: "Jogos Criados" },
    { icon: Brain, value: "10K+", label: "Perguntas" },
    { icon: Target, value: "95%", label: "Taxa de Acerto" },
  ];

  const steps = [
    {
      num: "01",
      title: "Cria um Jogo",
      desc: "O anfitrião abre o jogo na TV e escolhe as categorias",
      icon: Tv,
    },
    {
      num: "02",
      title: "Entra com Código",
      desc: "Os jogadores juntam-se com o PIN de 6 dígitos",
      icon: Gamepad2,
    },
    {
      num: "03",
      title: "Responde no Telemóvel",
      desc: "Cada ronda é mais rápida! Ganha pontos por velocidade",
      icon: Zap,
    },
  ];

  return (
    <main className="min-h-screen relative overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-violet-600/10 rounded-full mix-blend-screen filter blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-pink-600/10 rounded-full mix-blend-screen filter blur-[150px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] bg-purple-500/5 rounded-full mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />
        {/* Cursor glow effect */}
        <div
          className="absolute w-[300px] h-[300px] bg-violet-500/10 rounded-full filter blur-[100px] pointer-events-none transition-all duration-300"
          style={{
            left: mousePosition.x - 150,
            top: mousePosition.y - 150,
          }}
        />
      </div>

      <Onboarding steps={QUIZVERSE_STEPS} onComplete={() => {}} />

      {/* Top Bar - Desktop */}
      <header className="hidden md:flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto relative z-50">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-black italic bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-pink-500"
          style={{ fontFamily: "Space Grotesk, system-ui" }}
        >
          QUIZVERSE
        </motion.div>
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-6"
        >
          <Link href="/" className="text-white font-bold border-b-2 border-pink-500 pb-1 text-sm">
            Início
          </Link>
          <Link href="/teams" className="text-white/60 hover:text-white transition-colors text-sm">
            Equipas
          </Link>
          <Link href="/tournaments" className="text-white/60 hover:text-white transition-colors text-sm">
            Torneios
          </Link>
          <Link href="/tutorial" className="text-white/60 hover:text-white transition-colors text-sm">
            Como Jogar
          </Link>
        </motion.nav>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-4"
        >
          {authLoading ? (
            <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
          ) : user ? (
            <Link href="/profile" className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
              <UserIcon className="w-5 h-5" />
              <span className="text-sm">{user.email?.split("@")[0]}</span>
            </Link>
          ) : (
            <Link href="/login" className="flex items-center gap-2 px-4 py-2 bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 rounded-full transition-colors">
              <UserIcon className="w-5 h-5" />
              <span className="text-sm">Entrar</span>
            </Link>
          )}
          <Link href="/admin" className="text-white/60 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
          </Link>
        </motion.div>
      </header>

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        style={{ opacity, scale }}
        className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-20 lg:pt-20 lg:pb-32"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-semibold tracking-widest text-violet-400 uppercase">Quiz Gaming v3.0</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6 leading-[1.1]" style={{ fontFamily: "Space Grotesk, system-ui" }}>
              Acende a tua{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400">
                Mente
              </span>
              .
            </h1>

            <p className="text-white/60 text-lg md:text-xl max-w-xl mb-8 leading-relaxed">
              Entra na arena do conhecimento. Desafia os teus amigos e família num jogo de perguntas e respostas no ecrã grande!
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Link
                href="/host"
                className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-2xl hover:scale-[0.98] active:scale-[0.95] transition-all shadow-[0_0_30px_rgba(139,92,246,0.4)] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Tv className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Criar Jogo</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/play"
                className="group flex items-center gap-3 px-8 py-4 bg-white/5 text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all"
              >
                <Gamepad2 className="w-5 h-5" />
                <span>Entrar no Jogo</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
                    {stat.value}
                  </div>
                  <div className="text-xs text-white/40 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Interactive Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-8 -right-4 z-20"
            >
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                <Trophy className="w-8 h-8 text-white" />
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-4 -left-4 z-20"
            >
              <div className="bg-gradient-to-r from-violet-500 to-purple-500 p-3 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.4)]">
                <Star className="w-6 h-6 text-white" />
              </div>
            </motion.div>

            {/* Main Card */}
            <div className="glass-card p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-pink-500/10" />

              {/* PIN Input Section */}
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2" style={{ fontFamily: "Space Grotesk" }}>
                  <Rocket className="w-5 h-5 text-violet-400" />
                  Entrar no Jogo
                </h3>
                <p className="text-white/40 text-sm mb-6">Insere o código de 6 dígitos</p>

                <div className="flex gap-3 mb-4">
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="000000"
                    value={quickPin}
                    onChange={(e) => setQuickPin(e.target.value.replace(/\D/g, ""))}
                    maxLength={6}
                    className="flex-1 bg-black/30 border border-white/10 rounded-xl px-6 py-4 text-white text-center text-2xl font-mono tracking-[0.4em] placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all"
                  />
                </div>

                <button
                  onClick={() => {
                    if (quickPin.length >= 4) {
                      router.push(`/play?pin=${quickPin}`);
                    }
                  }}
                  disabled={quickPin.length < 4}
                  className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold transition-all ${
                    quickPin.length >= 4
                      ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:brightness-110"
                      : "bg-white/5 text-white/30 cursor-not-allowed"
                  }`}
                >
                  <Play className="w-5 h-5" />
                  Entrar
                </button>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <Link
                    href="/play"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white/5 text-white/60 font-medium rounded-xl border border-white/10 hover:bg-white/10 hover:text-white transition-all"
                  >
                    <Gamepad2 className="w-5 h-5" />
                    Jogar no Telemóvel
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Categories Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4" style={{ fontFamily: "Space Grotesk" }}>
            Escolhe a tua{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">Arena</span>
          </h2>
          <p className="text-white/50 max-w-md mx-auto">Cada categoria tem centenas de perguntas esperando por ti</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass-panel p-6 relative overflow-hidden group cursor-pointer"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
              <div className="relative z-10">
                <div className={`bg-white/10 p-4 rounded-xl mb-4 text-white/80 group-hover:bg-gradient-to-r group-hover:${cat.gradient} group-hover:text-white transition-all duration-300 w-fit`}>
                  <cat.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{cat.name}</h3>
                <p className="text-white/50 text-sm mb-4">{cat.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40">{cat.questions} perguntas</span>
                  <span className={`text-xs font-bold text-${cat.color}-400 opacity-0 group-hover:opacity-100 transition-opacity`}>
                    Jogar →
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors"
          >
            Ver Todas as Categorias
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* How it Works */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4" style={{ fontFamily: "Space Grotesk" }}>
            Como{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">Funciona?</span>
          </h2>
          <p className="text-white/50 max-w-md mx-auto">Três passos simples para começar a jogar</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500/50 via-pink-500/50 to-violet-500/50 -translate-y-1/2" />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative"
            >
              <div className="glass-panel p-8 text-center relative z-10 bg-slate-950/50">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.5)]">
                  <span className="text-white font-bold text-sm">{step.num}</span>
                </div>
                <div className="mt-4 mb-4">
                  <step.icon className="w-10 h-10 text-violet-400 mx-auto" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-white/50 text-sm">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-pink-500/10" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4" style={{ fontFamily: "Space Grotesk" }}>
              Pronto para o{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">Desafio</span>?
            </h2>
            <p className="text-white/50 mb-8 max-w-md mx-auto">
              Cria um jogo agora e desafia os teus amigos a uma batalha de conhecimento!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/host"
                className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-2xl hover:scale-[0.98] active:scale-[0.95] transition-all shadow-[0_0_30px_rgba(139,92,246,0.4)]"
              >
                <Tv className="w-5 h-5" />
                Criar Jogo Agora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/tutorial"
                className="flex items-center gap-3 px-8 py-4 bg-white/5 text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/10 transition-all"
              >
                <Play className="w-5 h-5" />
                Ver Tutorial
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-black italic bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-pink-500 mb-4" style={{ fontFamily: "Space Grotesk" }}>
                QUIZVERSE
              </div>
              <p className="text-white/40 text-sm">A arena do conhecimento. Desafia os teus amigos num jogo de perguntas épico!</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Jogar</h4>
              <ul className="space-y-2">
                <li><Link href="/host" className="text-white/40 hover:text-white text-sm transition-colors">Criar Jogo</Link></li>
                <li><Link href="/play" className="text-white/40 hover:text-white text-sm transition-colors">Entrar no Jogo</Link></li>
                <li><Link href="/categories" className="text-white/40 hover:text-white text-sm transition-colors">Categorias</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Social</h4>
              <ul className="space-y-2">
                <li><Link href="/teams" className="text-white/40 hover:text-white text-sm transition-colors">Equipas</Link></li>
                <li><Link href="/tournaments" className="text-white/40 hover:text-white text-sm transition-colors">Torneios</Link></li>
                <li><Link href="/profile" className="text-white/40 hover:text-white text-sm transition-colors">Perfil</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Suporte</h4>
              <ul className="space-y-2">
                <li><Link href="/tutorial" className="text-white/40 hover:text-white text-sm transition-colors">Como Jogar</Link></li>
                <li><Link href="/admin" className="text-white/40 hover:text-white text-sm transition-colors">Admin</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-white/30 text-sm">© 2026 QuizVerse. Feito com 💜 em Portugal</p>
          </div>
        </div>
      </footer>

      <MobileNav />
      <div className="h-20 md:hidden" />
    </main>
  );
}