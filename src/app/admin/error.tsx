"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCcw, Home } from "lucide-react";
import { createContextLogger } from "@/lib/logger";

const log = createContextLogger("AdminPage");

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    log.error("Admin page error", { error: error.message, digest: error.digest });
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 text-center">
      <div className="text-6xl mb-4">🛡️</div>
      <h2 className="text-3xl font-black text-white">Erro no Admin</h2>
      <p className="text-white/60 max-w-md">
        Ocorreu um erro no painel de administração. Tenta novamente.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="flex items-center gap-2 px-6 py-3 bg-[#d0bcff] text-[#121223] rounded-xl font-bold hover:shadow-[0_0_20px_rgba(208,188,255,0.3)] transition-all"
        >
          <RefreshCcw className="w-5 h-5" />
          Tentar Novamente
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-all"
        >
          <Home className="w-5 h-5" />
          Início
        </Link>
      </div>
    </div>
  );
}
