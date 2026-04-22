"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Rocket, Mail, Lock, Eye, EyeOff, Globe, Gamepad2, ArrowRight, User, Facebook } from "lucide-react";
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
        
        alert("Conta criada! Verifica o teu email para ativar.");
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

  const handleDiscordLogin = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const { error: discordError } = await supabase.auth.signInWithOAuth({
        provider: "discord",
        options: {
          redirectTo: `${window.location.origin}/profile`,
        }
      });
      
      if (discordError) throw discordError;
    } catch (err: any) {
      setError(err.message || "Erro ao entrar com Discord");
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const { error: facebookError } = await supabase.auth.signInWithOAuth({
        provider: "facebook",
        options: {
          redirectTo: `${window.location.origin}/profile`,
        }
      });
      
      if (facebookError) throw facebookError;
    } catch (err: any) {
      setError(err.message || "Erro ao entrar com Facebook");
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden flex items-center justify-center p-6">
      {/* Cosmic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 mix-blend-screen" 
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920")' }} 
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-950/90 via-purple-950/60 to-slate-950/90" />
        <div className="absolute top-0 left-0 w-full h-[512px] bg-violet-500/10 blur-[100px] rounded-full -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[50vw] h-[512px] bg-pink-500/10 blur-[120px] rounded-full translate-y-1/3 translate-x-1/3" />
      </div>

      {/* Main Glass Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md glass-panel p-8"
      >
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-500 mb-2" style={{ fontFamily: 'Space Grotesk' }}>
            QUIZVERSE
          </h1>
          <p className="text-white/50 text-sm">
            {isLogin ? "Welcome back, commander!" : "Begin your journey"}
          </p>
        </header>

        {/* Tab Toggle */}
        <div className="flex p-1 bg-white/5 rounded-lg mb-6 border border-white/10">
          <button 
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 text-center rounded-md text-sm font-medium transition-all ${
              isLogin 
                ? "bg-violet-500/15 text-violet-400 border border-violet-400/30 shadow-[0_0_10px_rgba(139,92,246,0.1)]" 
                : "text-white/40 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 text-center rounded-md text-sm font-medium transition-all ${
              !isLogin 
                ? "bg-violet-500/15 text-violet-400 border border-violet-400/30 shadow-[0_0_10px_rgba(139,92,246,0.1)]" 
                : "text-white/40 hover:text-white"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="text-xs font-medium text-white/40 uppercase tracking-widest mb-2 ml-1 block">
                Username
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-violet-400 transition-colors pointer-events-none z-10" />
                <input
                  type="text"
                  placeholder="Commander"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full glass-input pl-12 pr-4"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-white/40 uppercase tracking-widest mb-2 ml-1 block">
              Transmission Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-violet-400 transition-colors pointer-events-none z-10" />
              <input
                type="email"
                placeholder="commander@nebula.net"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass-input pl-12 pr-4"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-white/40 uppercase tracking-widest mb-2 ml-1 block">
              Security Codes
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-pink-400 transition-colors pointer-events-none z-10" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-input pl-12 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {isLogin && (
            <div className="flex justify-end -mt-2">
              <button type="button" className="text-xs text-pink-400 hover:text-pink-300 transition-colors">
                Lost trajectory?
              </button>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !email || !password || (!isLogin && !name)}
            className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all ${
              isLoading || !email || !password || (!isLogin && !name)
                ? "bg-white/5 text-white/30 cursor-not-allowed"
                : "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:scale-[0.98] active:scale-[0.95]"
            }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {isLogin ? "Enter the Galaxy" : "Create Account"}
                <Rocket className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-8 mb-6 flex items-center">
          <div className="flex-grow border-t border-white/10" />
          <span className="mx-4 text-white/30 text-xs uppercase tracking-widest">or dock via</span>
          <div className="flex-grow border-t border-white/10" />
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-violet-400/40 hover:text-violet-400 transition-all text-sm text-white/60 disabled:opacity-50"
          >
            <Globe className="w-5 h-5" />
            Google
          </button>
          <button 
            onClick={handleFacebookLogin}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-violet-400/40 hover:text-violet-400 transition-all text-sm text-white/60 disabled:opacity-50"
          >
            <Facebook className="w-5 h-5" />
            Facebook
          </button>
          <button 
            onClick={handleDiscordLogin}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-violet-400/40 hover:text-violet-400 transition-all text-sm text-white/60 disabled:opacity-50"
          >
            <Gamepad2 className="w-5 h-5" />
            Discord
          </button>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link href="/" className="flex items-center justify-center gap-2 text-white/40 hover:text-white/60 transition-colors text-sm">
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </main>
  );
}