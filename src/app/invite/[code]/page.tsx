"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { UserPlus, Check, Copy, Loader2, ArrowLeft, LogIn } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/useToast";
import ToastContainer from "@/components/Toast";
import MobileNav from "@/components/MobileNav";

export default function InvitePage({ params }: { params: { code: string } }) {
  const { toasts, show } = useToast();
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState<{ id: string; username: string; avatar: string } | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [alreadyFriend, setAlreadyFriend] = useState(false);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const code = params.code?.toUpperCase();

  useEffect(() => {
    load();
  }, [code]);

  const load = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUser(user.id);

      const res = await fetch(`/api/invite?code=${encodeURIComponent(code)}`);
      if (!res.ok) {
        setTarget(null);
        return;
      }
      const data = await res.json();
      setTarget(data.profile);

      if (user && data.profile) {
        const { data: friends } = await supabase
          .from("friends")
          .select("id, status")
          .or(`and(user_id.eq.${user.id},friend_id.eq.${data.profile.id}),and(user_id.eq.${data.profile.id},friend_id.eq.${user.id})`);
        if (friends && friends.length > 0) {
          setAlreadyFriend(true);
          if (friends.some((f: { status: string }) => f.status === "accepted")) {
            setSent(true);
          }
        }
      }
    } catch {
      setTarget(null);
    } finally {
      setLoading(false);
    }
  };

  const inviteLink = typeof window !== "undefined" ? `${window.location.origin}/invite/${code}` : "";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      show("Link copiado!", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      show("Não foi possível copiar.", "error");
    }
  };

  const addFriend = async () => {
    if (!currentUser || !target) return;
    if (currentUser === target.id) {
      show("Não podes adicionar-te a ti próprio.", "error");
      return;
    }
    try {
      const res = await fetch("/api/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser, friendId: target.id }),
      });
      if (res.status === 409) {
        show("Já enviaste um pedido.", "info");
        setSent(true);
        return;
      }
      if (res.ok) {
        show("Pedido de amizade enviado!", "success");
        setSent(true);
        setAlreadyFriend(true);
      } else {
        show("Erro ao enviar pedido.", "error");
      }
    } catch {
      show("Erro ao enviar pedido.", "error");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#121223]">
        <Loader2 className="w-8 h-8 animate-spin text-[#d0bcff]" />
      </main>
    );
  }

  return (
    <main className="min-h-screen relative overflow-x-hidden pb-24">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[60vw] h-[60vw] bg-[#d0bcff]/10 blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-[#FFB0CD]/10 blur-[150px]" />
      </div>

      <header className="sticky top-0 z-50 bg-[#121223]/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-4xl mx-auto">
          <Link href="/" className="text-sm text-[#e3e0f9]/60 hover:text-[#e3e0f9] transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>
          <h1 className="text-lg font-bold text-[#e3e0f9]">Convite</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="relative z-10 max-w-md mx-auto p-6">
        {!target ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1e1e30]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-8 text-center mt-10"
          >
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-[#e3e0f9]/60 mb-2">Código de convite inválido</p>
            <p className="text-[#e3e0f9]/40 text-sm mb-6">O código &quot;{code}&quot; não corresponde a nenhum jogador.</p>
            <Link href="/" className="inline-block px-6 py-3 bg-[#d0bcff] text-[#121223] rounded-xl font-bold">
              Ir para o início
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1e1e30]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-8 text-center mt-10"
          >
            <div className="w-28 h-28 rounded-full bg-gradient-to-r from-[#d0bcff] to-[#FFB0CD] flex items-center justify-center text-5xl font-bold text-[#3c0091] mx-auto mb-4 shadow-[0_0_30px_rgba(208,188,255,0.3)]">
              {target.avatar || "🎮"}
            </div>
            <h2 className="text-2xl font-bold text-[#e3e0f9] mb-1">{target.username || "Jogador"}</h2>
            <p className="text-[#e3e0f9]/40 text-sm mb-6">Convida-te para jogar no QuizVerse</p>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-center mb-6">
              <QRCodeSVG value={inviteLink || "https://quizverse.app"} size={140} bgColor="#1e1e30" fgColor="#d0bcff" />
            </div>

            <div className="flex flex-col gap-3">
              {!currentUser ? (
                <Link href={`/login?redirect=/invite/${code}`} className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-[#d0bcff] to-[#FFB0CD] text-[#121223] rounded-xl font-bold hover:opacity-90 transition-opacity">
                  <LogIn className="w-5 h-5" /> Entrar para adicionar
                </Link>
              ) : currentUser === target.id ? (
                <div className="px-5 py-3 bg-white/5 text-[#e3e0f9]/50 rounded-xl font-medium">
                  Este é o teu próprio código
                </div>
              ) : (
                <button
                  onClick={addFriend}
                  disabled={sent}
                  className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-[#d0bcff] to-[#FFB0CD] text-[#121223] rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {sent ? <Check className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                  {sent ? (alreadyFriend ? "Pedido enviado" : "Adicionado") : "Adicionar como amigo"}
                </button>
              )}

              <button
                onClick={copyLink}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-white/5 border border-white/10 text-[#e3e0f9] rounded-xl font-medium hover:border-white/20 transition-colors"
              >
                {copied ? <Check className="w-5 h-5 text-[#4CAF50]" /> : <Copy className="w-5 h-5" />}
                {copied ? "Copiado!" : "Copiar link de convite"}
              </button>

              <Link href="/modes" className="text-[#e3e0f9]/50 hover:text-[#d0bcff] text-sm transition-colors">
                Ou começa um jogo tu próprio →
              </Link>
            </div>
          </motion.div>
        )}
      </div>

      <MobileNav />
      <ToastContainer toasts={toasts} onDismiss={() => {}} />
      <div className="h-20 md:hidden" />
    </main>
  );
}
