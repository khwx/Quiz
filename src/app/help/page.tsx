"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, ChevronDown, Search, HelpCircle, MessageCircle, BookOpen, Star } from "lucide-react";
import MobileNav from "@/components/MobileNav";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "Como crio um jogo?",
    answer: "Acede ao menu 'Host' e clica em 'Criar Novo Jogo'. Escolhe as categorias, define o tempo por pergunta e o número de questões. Um PIN de 6 dígitos será gerado para os jogadores se juntarem.",
  },
  {
    question: "Como entro num jogo com PIN?",
    answer: "Abre a app no telemóvel, vai a 'Jogar' e insere o PIN de 6 dígitos que o anfitrião partilhou. Escreve o teu nome e clica em 'Entrar no Jogo'.",
  },
  {
    question: "Como funcionam as equipas?",
    answer: "Vai a 'Equipas' e cria uma nova equipa ou entra com o código partilhado. O anfitrião pode criar jogos específicos para equipas, onde todos os membros competem juntos.",
  },
  {
    question: "Como é calculada a pontuação?",
    answer: "A pontuação baseia-se na velocidade e precisão. Respostas corretas mais rápidas ganham mais pontos (máximo 100 por pergunta). Sequências de acertos dão bónus extras.",
  },
  {
    question: "Posso reportar uma pergunta?",
    answer: "Sim! Durante o jogo, clica no botão 'Reportar' no canto inferior direito. Escolhe o motivo (resposta errada, conteúdo inadequado, etc.) e envia. Os nossos moderadores irão analisar.",
  },
  {
    question: "O que são as conquistas?",
    answer: "Conquistas são objetivos que desbloqueias ao jogar: primeira vitória, 10 jogos perfeitos, 100 jogos jogados, etc. Visita o teu perfil para ver todas as conquistas disponíveis.",
  },
];

const QUICK_LINKS = [
  { icon: BookOpen, label: "Guia de Iniciante", color: "#FFD700" },
  { icon: MessageCircle, label: "Fórum da Comunidade", color: "#d0bcff" },
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Geral");

  const categories = ["Geral", "Conta", "Técnico", "Recompensas"];

  const filteredFAQ = FAQ_DATA.filter((item) => {
    if (searchQuery) {
      return (
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="min-h-screen relative overflow-hidden pb-32">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 nebula-bg" />

      <header className="sticky top-0 z-50 bg-[#121223]/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-4xl mx-auto">
          <Link href="/" className="text-sm text-[#e3e0f9]/60 hover:text-[#e3e0f9] transition-colors flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-lg font-bold text-[#e3e0f9]">Ajuda</h1>
          <Search className="w-5 h-5 text-[#e3e0f9]/40" />
        </div>
      </header>

      <div className="relative z-10 max-w-2xl mx-auto p-6 space-y-8">
        {/* Search */}
        <div className="glass-panel rounded-xl p-2 flex items-center gap-3 border border-white/10 focus-within:border-[#d0bcff]/50 transition-all">
          <Search className="w-5 h-5 text-[#e3e0f9]/40 ml-2" />
          <input
            type="text"
            placeholder="Pesquisar ajuda..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none focus:ring-0 w-full text-[#e3e0f9] placeholder:text-[#e3e0f9]/30"
          />
        </div>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all ${
                activeCategory === cat
                  ? "bg-[#d0bcff]/15 text-[#d0bcff] border border-[#d0bcff]/30"
                  : "text-[#e3e0f9]/50 border border-white/10 hover:text-[#d0bcff] hover:border-[#d0bcff]/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#d0bcff]">Perguntas Frequentes</h2>
          <div className="space-y-3">
            {filteredFAQ.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-panel rounded-xl border border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left group"
                >
                  <span className="font-bold text-[#e3e0f9] group-hover:text-[#d0bcff] transition-colors pr-4">
                    {item.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === idx ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0"
                  >
                    <ChevronDown className="w-5 h-5 text-[#d0bcff]" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5">
                        <p className="text-[#e3e0f9]/60 leading-relaxed">{item.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Support */}
        <section className="mt-12 text-center space-y-6">
          <div className="glass-panel p-8 rounded-3xl border border-white/5 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FFB0CD]/20 rounded-full blur-3xl" />
            <h3 className="text-xl font-bold text-[#e3e0f9] relative z-10 mb-2">Ainda precisas de ajuda?</h3>
            <p className="text-[#e3e0f9]/50 mb-8 relative z-10">
              Os nossos navegadores de suporte estão disponíveis 24/7.
            </p>
            <button className="w-full py-4 bg-gradient-to-r from-[#deb7ff] to-[#a078ff] text-[#3c0091] font-bold rounded-xl active:scale-95 transition-transform shadow-[0_0_20px_rgba(208,188,255,0.4)] relative z-10 flex items-center justify-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Contactar Suporte
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {QUICK_LINKS.map((link, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="glass-panel p-4 rounded-xl border border-white/10 hover:border-[#d0bcff]/30 transition-all cursor-pointer text-center"
              >
                <link.icon className="w-6 h-6 mx-auto mb-2" style={{ color: link.color }} />
                <p className="text-sm font-bold text-[#e3e0f9]">{link.label}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      <MobileNav />
      <div className="h-20 md:hidden" />
    </main>
  );
}
