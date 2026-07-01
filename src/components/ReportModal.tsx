"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flag, X } from "lucide-react";

const REPORT_REASONS = [
  "Pergunta com erro",
  "Resposta incorreta",
  "Pergunta ofensiva",
  "Texto confuso",
  "Imagem inadequada",
  "Outro"
];

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

export default function ReportModal({ isOpen, onClose, onSubmit }: ReportModalProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [customReason, setCustomReason] = useState("");

  const handleSubmit = () => {
    const reason = selected === "Outro" ? customReason : selected;
    if (!reason) return;
    onSubmit(reason);
    setSelected(null);
    setCustomReason("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9998] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-card w-full max-w-md p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 rounded-xl">
                  <Flag className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Reportar Pergunta</h3>
              </div>
              <button onClick={onClose} className="p-1 text-white/40 hover:text-white/70 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {REPORT_REASONS.map((reason) => (
                <button
                  key={reason}
                  onClick={() => setSelected(reason)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                    selected === reason
                      ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
                      : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            {selected === "Outro" && (
              <textarea
                placeholder="Descreve o problema..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors resize-none h-20"
              />
            )}

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-white/5 text-white/60 font-medium hover:bg-white/10 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selected || (selected === "Outro" && !customReason)}
                className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                  selected && (selected !== "Outro" || customReason)
                    ? "bg-amber-500 text-black hover:brightness-110"
                    : "bg-white/10 text-white/30 cursor-not-allowed"
                }`}
              >
                Enviar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
