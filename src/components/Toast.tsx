"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import type { Toast } from "@/hooks/useToast";

const icons = {
  success: <CheckCircle2 className="w-5 h-5 text-green-400" />,
  error: <XCircle className="w-5 h-5 text-red-400" />,
  info: <Info className="w-5 h-5 text-blue-400" />,
};

const bgColors = {
  success: "bg-green-500/10 border-green-500/30",
  error: "bg-red-500/10 border-red-500/30",
  info: "bg-blue-500/10 border-blue-500/30",
};

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl max-w-sm ${bgColors[toast.type]}`}
          >
            {icons[toast.type]}
            <span className="text-white text-sm font-medium flex-1">{toast.message}</span>
            <button onClick={() => onDismiss(toast.id)} className="text-white/40 hover:text-white/70 transition-colors shrink-0">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
