"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Rocket, Mail, Lock, Eye, EyeOff, ArrowRight, User, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (isLogin) {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (signInError) throw signInError;
        
        window.location.href = "/profile";
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name }
          }
        });
        
        if (signUpError) throw signUpError;
        
        setSuccess("Conta criada! Verifica o teu email para ativar.");
      }
    } catch (err: any) {
      setError(err.message || "Erro ao autenticar");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/profile`,
        }
      });
      
      if (googleError) throw googleError;
    } catch (err: any) {
      setError(err.message || "Erro ao entrar com Google");
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      <div className="fixed inset-0 z-0 bg-[#0c0c1d]">
        <div className="absolute inset-0 nebula-bg" />
        <div className="absolute inset-0 star-field" />
      </div>

      <header className="fixed top-0 w-full z-50 flex items-center justify-center px-6 h-20">
        <Link href="/">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#d0bcff] to-[#FFB0CD] tracking-widest uppercase">
            QuizVerse
          </h1>
        </Link>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md bg-[#1e1e30]/80 backdrop-blur-xl rounded-[2rem] p-8 border border-[#d0bcff]/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]"
      >
        <div className="relative flex bg-white/5 rounded-2xl p-1 mb-8">
          <motion.div
            layout
            className="absolute inset-y-1 w-[calc(50%-4px)] bg-[#d0bcff]/20 border border-[#d0bcff]/30 rounded-xl"
            animate={{ x: isLogin ? 0 : "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          <button
            onClick={() => setIsLogin(true)}
            className="relative z-10 flex-1 py-3 text-sm font-semibold tracking-wide transition-colors duration-300"
          >
            <span className={isLogin ? "text-[#d0bcff]" : "text-white/50 hover:text-white"}>Entrar</span>
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className="relative z-10 flex-1 py-3 text-sm font-semibold tracking-wide transition-colors duration-300"
          >
            <span className={!isLogin ? "text-[#d0bcff]" : "text-white/50 hover:text-white"}>Registar</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                key="name"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <label className="block text-[10px] font-medium text-[#cbc3d7] uppercase tracking-widest mb-2 ml-1">
                  Nome de Utilizador
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#958ea0] group-focus-within:text-[#d0bcff] transition-colors pointer-events-none z-10" />
                  <input
                    type="text"
                    placeholder="O teu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#0c0c1d]/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-[#958ea0] focus:outline-none focus:border-[#d0bcff]/50 focus:shadow-[0_0_10px_rgba(160,120,255,0.3)] transition-all"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-[10px] font-medium text-[#cbc3d7] uppercase tracking-widest mb-2 ml-1">
              Endereço de Email
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#958ea0] group-focus-within:text-[#d0bcff] transition-colors pointer-events-none z-10" />
              <input
                type="email"
                placeholder="astronauta@quizverse.gal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0c0c1d]/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-[#958ea0] focus:outline-none focus:border-[#d0bcff]/50 focus:shadow-[0_0_10px_rgba(160,120,255,0.3)] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-[#cbc3d7] uppercase tracking-widest mb-2 ml-1">
              Código de Acesso
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#958ea0] group-focus-within:text-[#FFB0CD] transition-colors pointer-events-none z-10" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0c0c1d]/40 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white placeholder:text-[#958ea0] focus:outline-none focus:border-[#d0bcff]/50 focus:shadow-[0_0_10px_rgba(160,120,255,0.3)] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#958ea0] hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {isLogin && (
            <div className="flex justify-end -mt-2">
              <button type="button" onClick={async () => {
                if (!email) {
                  setError("Insere o teu email primeiro.");
                  return;
                }
                try {
                  const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/login`,
                  });
                  if (resetError) throw resetError;
                  setSuccess("Email de recuperação enviado!");
                } catch (err: any) {
                  setError(err.message || "Erro ao enviar email de recuperação");
                }
              }} className="text-xs font-semibold text-[#d0bcff]/80 hover:text-[#d0bcff] transition-colors uppercase tracking-wider">
                Recuperar Trajectória
              </button>
            </div>
          )}

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3 bg-[#ffb4ab]/10 border border-[#ffb4ab]/30 rounded-xl text-[#ffb4ab] text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3 bg-[#4CAF50]/10 border border-[#4CAF50]/30 rounded-xl text-[#4CAF50] text-sm flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={isLoading || !email || !password || (!isLogin && !name)}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className={`w-full relative group overflow-hidden rounded-xl p-[2px] transition-transform ${
              isLoading || !email || !password || (!isLogin && !name)
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#d0bcff] to-[#FFB0CD] group-hover:from-[#d0bcff] group-hover:to-[#FFB0CD]" />
            <div className="relative bg-[#0c0c1d]/10 rounded-[10px] flex items-center justify-center gap-3 py-4 text-white font-bold tracking-widest uppercase">
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>{isLogin ? "Entrar na Galáxia" : "Criar Conta"}</span>
                  <Rocket className="w-5 h-5" />
                </>
              )}
            </div>
          </motion.button>
        </form>

        <div className="flex items-center gap-4 py-4 mt-4">
          <div className="h-[1px] flex-1 bg-white/10" />
          <span className="text-[10px] font-bold text-[#958ea0] uppercase tracking-[0.2em]">OU ACEDER VIA</span>
          <div className="h-[1px] flex-1 bg-white/10" />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-xl py-4 text-sm font-medium hover:bg-white/10 transition-all duration-300 disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
          </svg>
          <span className="tracking-wide text-white/80">Continuar com Google</span>
        </motion.button>

        <div className="mt-8 text-center">
          <Link href="/" className="flex items-center justify-center gap-2 text-[#958ea0] hover:text-white/60 transition-colors text-sm">
            <ArrowRight className="w-4 h-4 rotate-180" />
            Voltar ao Início
          </Link>
        </div>
      </motion.div>

      <footer className="fixed bottom-0 w-full pb-8 text-center z-10">
        <p className="text-[10px] text-[#958ea0]/60 uppercase tracking-widest">
          Protocolo Seguro QuizVerse © 2026
        </p>
      </footer>
    </main>
  );
}