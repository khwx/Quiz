"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
          <h1 className="text-4xl font-black text-white">Algo correu mal</h1>
          <p className="text-white/60">Ocorreu um erro inesperado. Tenta recarregar a página.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#d0bcff] text-[#121223] rounded-xl font-bold"
          >
            Recarregar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
