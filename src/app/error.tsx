"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Home, RefreshCcw, AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121223] p-6">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-[#FF6B6B]/10 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-[#FFB0CD]/10 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 glass-panel p-8 rounded-2xl border border-[#FF6B6B]/30 max-w-md w-full text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-[#FF6B6B]/20 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-[#FF6B6B]" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "Space Grotesk" }}>
          Algo correu mal
        </h2>
        <p className="text-white/50 mb-6">
          Ocorreu um erro inesperado. Tenta novamente.
        </p>
        {error.digest && (
          <p className="text-white/30 text-xs mb-4 font-mono">Erro: {error.digest}</p>
        )}
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors font-bold"
          >
            <RefreshCcw className="w-5 h-5" />
            Tentar Novamente
          </button>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#d0bcff] hover:bg-[#d0bcff]/80 text-[#121223] rounded-xl transition-colors font-bold"
          >
            <Home className="w-5 h-5" />
            Início
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
