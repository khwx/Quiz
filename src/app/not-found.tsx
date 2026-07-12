"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121223] p-6">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-[#d0bcff]/10 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-[#FFB0CD]/10 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 glass-panel p-8 rounded-2xl border border-white/10 max-w-md w-full text-center"
      >
        <div className="text-8xl font-black text-white/10 mb-4" style={{ fontFamily: "Space Grotesk" }}>
          404
        </div>
        <div className="w-16 h-16 rounded-2xl bg-[#d0bcff]/20 flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8 text-[#d0bcff]" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "Space Grotesk" }}>
          Página não encontrada
        </h2>
        <p className="text-white/50 mb-6">
          O link que seguiste não existe ou foi movido.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#d0bcff] hover:bg-[#d0bcff]/80 text-[#121223] rounded-xl transition-colors font-bold"
        >
          <Home className="w-5 h-5" />
          Voltar ao Início
        </Link>
      </motion.div>
    </div>
  );
}
