"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Globe, Languages, History, FlaskConical, Music, Sparkles, Cpu, Palette, Map, Film, Trophy, Star, Crown, Rocket, ArrowLeft } from "lucide-react";

const getCategoryStyles = (color: string) => {
  const colors: Record<string, { bg: string; text: string; hover: string }> = {
    emerald: { bg: "bg-emerald-500/20", text: "text-emerald-400", hover: "bg-emerald-500 group-hover:text-white" },
    green: { bg: "bg-green-500/20", text: "text-green-400", hover: "bg-green-500 group-hover:text-white" },
    amber: { bg: "bg-amber-500/20", text: "text-amber-400", hover: "bg-amber-500 group-hover:text-white" },
    cyan: { bg: "bg-cyan-500/20", text: "text-cyan-400", hover: "bg-cyan-500 group-hover:text-white" },
    violet: { bg: "bg-violet-500/20", text: "text-violet-400", hover: "bg-violet-500 group-hover:text-white" },
    rose: { bg: "bg-rose-500/20", text: "text-rose-400", hover: "bg-rose-500 group-hover:text-white" },
    pink: { bg: "bg-pink-500/20", text: "text-pink-400", hover: "bg-pink-500 group-hover:text-white" },
    orange: { bg: "bg-orange-500/20", text: "text-orange-400", hover: "bg-orange-500 group-hover:text-white" },
    purple: { bg: "bg-purple-500/20", text: "text-purple-400", hover: "bg-purple-500 group-hover:text-white" },
    fuchsia: { bg: "bg-fuchsia-500/20", text: "text-fuchsia-400", hover: "bg-fuchsia-500 group-hover:text-white" },
    yellow: { bg: "bg-yellow-500/20", text: "text-yellow-400", hover: "bg-yellow-500 group-hover:text-white" },
    red: { bg: "bg-red-500/20", text: "text-red-400", hover: "bg-red-500 group-hover:text-white" },
  };
  return colors[color] || colors.violet;
};

export default function CategoriesPage() {
  const allCategories = [
    { icon: Globe, name: "Países", desc: "Capitais, bandeiras e geografia", color: "emerald", count: 120 },
    { icon: Map, name: "Geografia", desc: "Montanhas, rios e oceanos", color: "green", count: 85 },
    { icon: History, name: "História", desc: "Eventos históricos", color: "amber", count: 95 },
    { icon: FlaskConical, name: "Ciência", desc: "Física, química e biologia", color: "cyan", count: 110 },
    { icon: Cpu, name: "Tecnologia", desc: "Informática e programação", color: "violet", count: 75 },
    { icon: Film, name: "Cinema", desc: "Filmes e atores", color: "rose", count: 90 },
    { icon: Music, name: "Música", desc: "Músicas e artistas", color: "pink", count: 80 },
    { icon: Trophy, name: "Desporto", desc: "Futebol e outros desportos", color: "orange", count: 100 },
    { icon: Palette, name: "Arte", desc: "Pintura e escultura", color: "purple", count: 60 },
    { icon: Languages, name: "Idiomas", desc: "Culturas e línguas", color: "fuchsia", count: 70 },
    { icon: Star, name: "Entretenimento", desc: "TV e famosos", color: "yellow", count: 85 },
    { icon: Crown, name: "Política", desc: "Governantes e história política", color: "red", count: 65 },
  ];

  const ageGroups = [
    { id: "kids", label: "Crianças", age: "7-12" },
    { id: "teens", label: "Adolescentes", age: "13-17" },
    { id: "adults", label: "Adultos", age: "18+" },
  ];

  return (
    <main className="min-h-screen relative overflow-x-hidden pb-24">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[60vw] h-[60vw] bg-violet-600/10 blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-pink-600/10 blur-[150px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/50 backdrop-blur-xl border-b border-white/10">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-4xl mx-auto">
          <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </Link>
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>Categorias</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto p-6">
        {/* Age Groups Filter */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Filtrar por Idade</h2>
          <div className="flex flex-wrap gap-3">
            {ageGroups.map((age) => (
              <button
                key={age.id}
                className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white hover:border-violet-400/50 transition-all"
              >
                {age.label}
                <span className="text-white/40 ml-2 text-sm">({age.age})</span>
              </button>
            ))}
          </div>
        </section>

        {/* Categories Grid */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4">Todas as Categorias</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allCategories.map((cat, i) => {
              const styles = getCategoryStyles(cat.color);
              return (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="glass-panel p-5 flex flex-col items-start hover:border-violet-400/50 hover:shadow-[0_0_25px_rgba(139,92,246,0.15)] transition-all duration-300 cursor-pointer group"
                >
                  <div className={`${styles.bg} p-3 rounded-xl mb-3 ${styles.text} ${styles.hover} transition-colors duration-300`}>
                    <cat.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">{cat.name}</h3>
                  <p className="text-white/50 text-sm mb-3">{cat.desc}</p>
                  <div className="mt-auto flex items-center justify-between w-full">
                    <span className="text-white/40 text-xs">{cat.count} perguntas</span>
                    <button className="text-violet-400 text-sm group-hover:text-violet-300">
                      Jogar →
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Custom Topic */}
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-white mb-4">Tema Personalizado</h2>
          <div className="glass-panel p-6">
            <p className="text-white/60 mb-4">Não encontras o que procuras? Cria o teu próprio tema!</p>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Ex: Anime, Videojogos, Ciências..."
                className="flex-1 glass-input"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl">
                Criar
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full z-50 md:hidden border-t border-white/10">
        <div className="flex justify-around items-center px-4 py-3 bg-slate-950/90 backdrop-blur-2xl border-t border-white/10">
          <Link href="/" className="flex flex-col items-center justify-center text-white/50">
            <Rocket className="w-6 h-6" />
            <span className="text-[10px] mt-1">Home</span>
          </Link>
          <Link href="/categories" className="flex flex-col items-center justify-center text-pink-500">
            <Globe className="w-6 h-6" />
            <span className="text-[10px] mt-1">Categorias</span>
          </Link>
        </div>
      </nav>
    </main>
  );
}