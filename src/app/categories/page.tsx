"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Globe, History, FlaskConical, Map, Trophy, Flag, Zap, PawPrint, Utensils, Check, Crown, Cpu, Film, Music, Palette, Sparkles, ArrowLeft, Users } from "lucide-react";
import MobileNav from "@/components/MobileNav";
import { createContextLogger } from "@/lib/logger";

const log = createContextLogger("CategoriesPage");

const getCategoryStyles = (color: string) => {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    emerald: { bg: "bg-[#4CAF50]/15", text: "text-[#4CAF50]", border: "border-[#4CAF50]/30" },
    green: { bg: "bg-[#4CAF50]/15", text: "text-[#4CAF50]", border: "border-[#4CAF50]/30" },
    amber: { bg: "bg-[#FFB0CD]/15", text: "text-[#FFB0CD]", border: "border-[#FFB0CD]/30" },
    cyan: { bg: "bg-[#deb7ff]/15", text: "text-[#deb7ff]", border: "border-[#deb7ff]/30" },
    violet: { bg: "bg-[#d0bcff]/15", text: "text-[#d0bcff]", border: "border-[#d0bcff]/30" },
    rose: { bg: "bg-[#FF6B6B]/15", text: "text-[#FF6B6B]", border: "border-[#FF6B6B]/30" },
    pink: { bg: "bg-[#FFB0CD]/15", text: "text-[#FFB0CD]", border: "border-[#FFB0CD]/30" },
    orange: { bg: "bg-[#FFD700]/15", text: "text-[#FFD700]", border: "border-[#FFD700]/30" },
    purple: { bg: "bg-[#d0bcff]/15", text: "text-[#d0bcff]", border: "border-[#d0bcff]/30" },
    fuchsia: { bg: "bg-[#FFB0CD]/15", text: "text-[#FFB0CD]", border: "border-[#FFB0CD]/30" },
    yellow: { bg: "bg-[#FFD700]/15", text: "text-[#FFD700]", border: "border-[#FFD700]/30" },
    red: { bg: "bg-[#FF6B6B]/15", text: "text-[#FF6B6B]", border: "border-[#FF6B6B]/30" },
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
  const [catError, setCatError] = useState("");
  const [countsLoading, setCountsLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      setCountsLoading(true);
      try {
        const { supabase } = await import('@/lib/supabase');
        
        const { data, error } = await supabase.from('questions').select('category, age_rating');
        
        if (error) throw error;
        
        const counts: Record<string, number> = {};
        const ageMap: Record<string, number> = { "kids": 8, "teens": 12, "adults": 18 };
        const targetAge = ageMap[ageGroup];
        
        data?.forEach(q => {
          const cat = q.category;
          if (ageGroup === "adults" || q.age_rating >= targetAge) {
            if (!cat.includes("Bandeiras")) {
              counts[cat] = (counts[cat] || 0) + 1;
            }
          }
        });
        
        const bandeirasCount = data?.filter(q => q.category === "Bandeiras").length || 0;
        counts["Bandeiras"] = bandeirasCount;
        
        setCategoryCounts(Object.entries(counts).map(([name, count]) => ({ name, count })));
      } catch (err: any) {
        log.error("Erro ao carregar contagens", { error: err.message || String(err) });
        setCatError("Erro ao carregar categorias");
      } finally {
        setCountsLoading(false);
      }
    }
    
    fetchCounts();
  }, [ageGroup]);

  const toggleCategory = (name: string) => {
    setCatError("");
    if (selectedCategories.includes(name)) {
      setSelectedCategories(selectedCategories.filter(c => c !== name));
    } else {
      setSelectedCategories([...selectedCategories, name]);
    }
  };

  const handlePlay = () => {
    if (selectedCategories.length === 0) {
      setCatError("Seleciona pelo menos uma categoria!");
      return;
    }
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

  const ageGroups = [
    { id: "kids", label: "Crianças", age: "7-12", icon: "👶" },
    { id: "teens", label: "Adolescentes", age: "13-17", icon: "🧑" },
    { id: "adults", label: "Adultos", age: "18+", icon: "🧑‍💼" }
  ];

  return (
    <main className="min-h-screen relative overflow-x-hidden pb-32">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[60vw] h-[60vw] bg-[#d0bcff]/10 blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-[#FFB0CD]/10 blur-[150px]" />
      </div>

      <header className="sticky top-0 z-50 bg-[#121223]/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-4xl mx-auto">
          <Link href="/" className="flex items-center gap-2 text-[#e3e0f9]/60 hover:text-[#e3e0f9] transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Voltar</span>
          </Link>
          <h1 className="text-lg font-bold text-[#e3e0f9]">Categorias</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto p-6">
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-lg font-bold text-[#e3e0f9] mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#d0bcff]" />
            Filtrar por Idade
          </h2>
          <div className="flex flex-wrap gap-3">
            {ageGroups.map((age) => (
              <motion.button
                key={age.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setAgeGroup(age.id)}
                className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all ${
                  ageGroup === age.id 
                    ? 'bg-[#d0bcff]/15 border border-[#d0bcff]/30 text-[#d0bcff]' 
                    : 'bg-white/5 border border-white/10 text-[#e3e0f9]/60 hover:text-[#e3e0f9] hover:border-white/20'
                }`}
              >
                <span className="text-xl">{age.icon}</span>
                <div className="text-left">
                  <div className="font-bold text-sm">{age.label}</div>
                  <div className="text-[10px] opacity-60">{age.age}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.section>

        <AnimatePresence>
          {totalSelected > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-4 bg-[#FFB0CD]/10 border border-[#FFB0CD]/30 rounded-xl"
            >
              <p className="text-[#FFB0CD] font-bold">
                {totalSelected} categoria{totalSelected !== 1 ? 's' : ''} selecionada{totalSelected !== 1 ? 's' : ''}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <section>
          <h2 className="text-lg font-bold text-[#e3e0f9] mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#d0bcff]" />
            Todas as Categorias
          </h2>
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
                  transition={{ delay: 0.03 * i }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleCategory(cat.name)}
                  className={`bg-[#1e1e30]/80 backdrop-blur-xl rounded-2xl border p-5 flex flex-col items-start transition-all duration-300 cursor-pointer ${
                    isSelected 
                      ? `border-[#FFB0CD]/50 shadow-[0_0_25px_rgba(255,176,205,0.15)]` 
                      : 'border-white/10 hover:border-white/20 hover:shadow-[0_0_20px_rgba(208,188,255,0.1)]'
                  }`}
                >
                  <div className={`${styles.bg} p-3 rounded-xl mb-3 ${styles.text} border ${styles.border}`}>
                    <cat.icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-[#e3e0f9]">{cat.name}</h3>
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="w-5 h-5 rounded-full bg-[#FFB0CD] flex items-center justify-center"
                        >
                          <Check className="w-3 h-3 text-[#121223]" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <p className="text-[#e3e0f9]/50 text-sm mb-3">{cat.desc}</p>
                  <div className="mt-auto flex items-center justify-between w-full">
                    <span className="text-[#e3e0f9]/40 text-xs">
                      {countsLoading ? (
                        <span className="inline-flex items-center gap-1">
                          <span className="w-3 h-3 border border-white/20 border-t-[#d0bcff] rounded-full animate-spin" />
                          a carregar...
                        </span>
                      ) : (
                        `${count} perguntas`
                      )}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="mt-8">
          <AnimatePresence>
            {catError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-3 p-3 bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 rounded-xl text-[#FF6B6B] text-sm text-center"
              >
                {catError}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button
            whileHover={{ scale: totalSelected > 0 ? 1.02 : 1 }}
            whileTap={{ scale: totalSelected > 0 ? 0.98 : 1 }}
            onClick={handlePlay}
            disabled={totalSelected === 0}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
              totalSelected > 0
                ? 'bg-[#d0bcff] text-[#3c0091] shadow-[0_0_30px_rgba(208,188,255,0.3)]'
                : 'bg-white/10 text-[#e3e0f9]/30 cursor-not-allowed'
            }`}
          >
            {totalSelected > 0 ? `Jogar com ${totalSelected} Categorias` : 'Seleciona uma Categoria'}
          </motion.button>
        </section>

        <section className="mt-6">
          <div className="bg-[#1e1e30]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-6 opacity-50">
            <div className="flex items-center gap-2 text-[#e3e0f9]/60 mb-4">
              <Sparkles className="w-5 h-5 text-[#d0bcff]" />
              <p className="font-bold">Tema personalizado</p>
            </div>
            <p className="text-[#e3e0f9]/40 mb-4 text-sm">Brevemente disponível!</p>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Ex: Anime, Videojogos..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#e3e0f9] placeholder-[#e3e0f9]/30 focus:outline-none focus:border-[#d0bcff]/50"
                disabled
              />
              <button className="px-6 py-3 bg-[#d0bcff]/30 text-[#e3e0f9]/50 font-bold rounded-xl cursor-not-allowed" disabled>
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