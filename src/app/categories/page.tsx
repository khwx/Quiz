"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Globe, Languages, History, FlaskConical, Music, Sparkles, Cpu, Palette, Map, Film, Trophy, Star, Crown, Rocket, ArrowLeft, Flag, Zap, PawPrint, Utensils, Check } from "lucide-react";
import MobileNav from "@/components/MobileNav";

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

const CATEGORIES = [
  { name: "Cultura Geral", icon: Globe, color: "violet", desc: "Conhecimentos gerais", dbName: "CULTURA_GERAL" },
  { name: "Capitais do Mundo", icon: Zap, color: "emerald", desc: "Capitais e países", dbName: "CAPITAIS_DO_MUNDO" },
  { name: "Bandeiras", icon: Flag, color: "green", desc: "Bandeiras de países", dbName: "Bandeiras" },
  { name: "Geografia", icon: Map, color: "green", desc: "Montanhas, rios e oceanos", dbName: "GEOGRAFIA" },
  { name: "História", icon: History, color: "amber", desc: "Eventos históricos", dbName: "HISTORIA" },
  { name: "Ciência", icon: FlaskConical, color: "cyan", desc: "Física, química e biologia", dbName: "CIENCIA" },
  { name: "Tecnologia", icon: Cpu, color: "violet", desc: "Informática e programação", dbName: "TECNOLOGIA" },
  { name: "Cinema", icon: Film, color: "rose", desc: "Filmes e atores", dbName: "CINEMA" },
  { name: "Música", icon: Music, color: "pink", desc: "Músicas e artistas", dbName: "MUSICA" },
  { name: "Desporto", icon: Trophy, color: "orange", desc: "Futebol e outros desportos", dbName: "DESPORTO" },
  { name: "Arte", icon: Palette, color: "purple", desc: "Pintura e escultura", dbName: "ARTE" },
  { name: "Animais", icon: PawPrint, color: "amber", desc: "Animais e natureza", dbName: "ANIMAIS" },
  { name: "Gastronomia", icon: Utensils, color: "orange", desc: "Comida e receitas", dbName: "GASTRONOMIA" },
  { name: "Matemática", icon: Sparkles, color: "cyan", desc: "Números e cálculos", dbName: "MATEMATICA" },
  { name: "Política", icon: Crown, color: "red", desc: "Governantes e política", dbName: "POLITICA" },
];

interface CategoryCount {
  name: string;
  count: number;
}

export default function CategoriesPage() {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<CategoryCount[]>([]);
  const [ageGroup, setAgeGroup] = useState<string>("adults");

  useEffect(() => {
    async function fetchCounts() {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        'https://lmfexrtxrxmeajxtuoof.supabase.co',
        'sb_publishable_9UJr6k6WUFOIOn4Iebynpg_ROzznDve'
      );
      
      const { data } = await supabase.from('questions').select('category, age_rating');
      
      const counts: Record<string, number> = {};
      const ageMap: Record<string, number> = { "kids": 8, "teens": 12, "adults": 18 };
      const targetAge = ageMap[ageGroup];
      
      data?.forEach(q => {
        const cat = q.category;
        if (ageGroup === "adults" || q.age_rating >= targetAge) {
          if (!cat.includes("Bandeiras")) { // Skip bandeiras in age filtering
            counts[cat] = (counts[cat] || 0) + 1;
          }
        }
      });
      
      // Add bandeiras count separately
      const bandeirasCount = data?.filter(q => q.category === "Bandeiras").length || 0;
      counts["Bandeiras"] = bandeirasCount;
      
      setCategoryCounts(Object.entries(counts).map(([name, count]) => ({ name, count })));
    }
    
    fetchCounts();
  }, [ageGroup]);

  const toggleCategory = (name: string) => {
    if (selectedCategories.includes(name)) {
      setSelectedCategories(selectedCategories.filter(c => c !== name));
    } else {
      setSelectedCategories([...selectedCategories, name]);
    }
  };

  const handlePlay = () => {
    if (selectedCategories.length === 0) {
      alert("Seleciona pelo menos uma categoria!");
      return;
    }
    // Navigate to TV page with selected categories
    const params = new URLSearchParams();
    params.set('categories', selectedCategories.join(','));
    params.set('age', ageGroup);
    router.push(`/tv?${params.toString()}`);
  };

  const getCount = (dbName: string) => {
    const found = categoryCounts.find(c => c.name === dbName);
    return found?.count || 0;
  };

  const totalSelected = selectedCategories.length;

  return (
    <main className="min-h-screen relative overflow-x-hidden pb-32">
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
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Filtrar por Idade</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { id: "kids", label: "Crianças", age: "7-12" },
              { id: "teens", label: "Adolescentes", age: "13-17" },
              { id: "adults", label: "Adultos", age: "18+" }
            ].map((age) => (
              <button
                key={age.id}
                onClick={() => setAgeGroup(age.id)}
                className={`px-6 py-3 rounded-xl transition-all ${
                  ageGroup === age.id 
                    ? 'bg-violet-500/20 border border-violet-400 text-violet-400' 
                    : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-violet-400/50'
                }`}
              >
                {age.label}
                <span className="text-white/40 ml-2 text-sm">({age.age})</span>
              </button>
            ))}
          </div>
        </section>

        {/* Selection Info */}
        {totalSelected > 0 && (
          <div className="mb-4 p-4 bg-pink-500/20 border border-pink-500/30 rounded-xl">
            <p className="text-pink-300">
              {totalSelected} categoria{totalSelected !== 1 ? 's' : ''} selecionada{totalSelected !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Categories Grid */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4">Todas as Categorias</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map((cat, i) => {
              const styles = getCategoryStyles(cat.color);
              const isSelected = selectedCategories.includes(cat.name);
              const count = getCount(cat.dbName);
              
              return (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  onClick={() => toggleCategory(cat.name)}
                  className={`glass-panel p-5 flex flex-col items-start transition-all duration-300 cursor-pointer group ${
                    isSelected 
                      ? 'border-pink-400/50 shadow-[0_0_25px_rgba(236,72,153,0.25)]' 
                      : 'hover:border-violet-400/50 hover:shadow-[0_0_25px_rgba(139,92,246,0.15)]'
                  }`}
                >
                  <div className={`${styles.bg} p-3 rounded-xl mb-3 ${styles.text} ${styles.hover} transition-colors duration-300`}>
                    <cat.icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-white">{cat.name}</h3>
                    {isSelected && <Check className="w-5 h-5 text-pink-400" />}
                  </div>
                  <p className="text-white/50 text-sm mb-3">{cat.desc}</p>
                  <div className="mt-auto flex items-center justify-between w-full">
                    <span className="text-white/40 text-xs">{count} perguntas</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Play Button */}
        <section className="mt-8">
          <button
            onClick={handlePlay}
            disabled={totalSelected === 0}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              totalSelected > 0
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:brightness-110'
                : 'bg-white/10 text-white/30 cursor-not-allowed'
            }`}
          >
            {totalSelected > 0 ? `Jogar com ${totalSelected} Categorias` : 'Seleciona uma Categoria'}
          </button>
        </section>

        {/* Custom Topic - disabled for now */}
        <section className="mt-6">
          <div className="glass-panel p-6 opacity-50">
            <p className="text-white/60 mb-4">Tema personalizado brevemente disponível!</p>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Ex: Anime, Videojogos..."
                className="flex-1 glass-input"
                disabled
              />
              <button className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl opacity-50 cursor-not-allowed" disabled>
                Criar
              </button>
            </div>
          </div>
        </section>
      </div>

      <MobileNav />
      <div className="h-20 md:hidden" />
    </main>
  );
}