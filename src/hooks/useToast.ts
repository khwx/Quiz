"use client";

import { useState, useCallback, useRef } from "react";

export interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

let globalId = 0;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timeoutRef = useRef<Map<number, NodeJS.Timeout>>(new Map());

  const show = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = ++globalId;
    setToasts((prev) => [...prev, { id, message, type }]);

    const timeout = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      timeoutRef.current.delete(id);
    }, type === "error" ? 4000 : 2500);

    timeoutRef.current.set(id, timeout);
  }, []);

  const dismiss = useCallback((id: number) => {
    clearTimeout(timeoutRef.current.get(id));
    timeoutRef.current.delete(id);
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, show, dismiss };
}
