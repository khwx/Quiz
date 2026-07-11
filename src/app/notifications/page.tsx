"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Rocket, Trophy, Users, Award, Bell, Settings, Check, X } from "lucide-react";
import MobileNav from "@/components/MobileNav";

interface Notification {
  id: string;
  type: "tournament" | "achievement" | "friend" | "reward" | "system";
  title: string;
  description: string;
  time: string;
  read: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "tournament",
    title: "Novo Torneio: Nebula Championship",
    description: "A competição começou! Desafia os melhores pilotos da galáxia e ganha itens exclusivos.",
    time: "Agora",
    read: false,
    actionLabel: "Participar",
  },
  {
    id: "2",
    type: "reward",
    title: "Recompensa Estelar: +500 Coins",
    description: "Ganhaste 500 Stellar Coins por completar a missão diária!",
    time: "Há 2h",
    read: false,
  },
  {
    id: "3",
    type: "friend",
    title: "Pedido de Amizade: Pilot_X",
    description: "Quer adicionar-te à tripulação estelar.",
    time: "Há 3h",
    read: false,
    actionLabel: "Aceitar",
  },
  {
    id: "4",
    type: "achievement",
    title: "Conquista Desbloqueada: Explorador de Nebulosas",
    description: "Completaste 50 jogos em diferentes categorias!",
    time: "Ontem",
    read: true,
  },
  {
    id: "5",
    type: "system",
    title: "Atualização do Núcleo v2.4",
    description: "Otimizações de performance aplicadas aos motores de propulsão.",
    time: "Há 2 dias",
    read: true,
  },
];

const TYPE_CONFIG = {
  tournament: { icon: Rocket, color: "text-[#d0bcff]", bg: "bg-[#d0bcff]/10", border: "border-[#d0bcff]/20" },
  achievement: { icon: Award, color: "text-[#FFD700]", bg: "bg-[#FFD700]/10", border: "border-[#FFD700]/20" },
  friend: { icon: Users, color: "text-[#FFB0CD]", bg: "bg-[#FFB0CD]/10", border: "border-[#FFB0CD]/20" },
  reward: { icon: Trophy, color: "text-[#4CAF50]", bg: "bg-[#4CAF50]/10", border: "border-[#4CAF50]/20" },
  system: { icon: Settings, color: "text-[#e3e0f9]/50", bg: "bg-white/5", border: "border-white/10" },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filtered = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;
  const today = filtered.filter((n) => n.time === "Agora" || n.time.startsWith("Há"));
  const earlier = filtered.filter((n) => n.time !== "Agora" && !n.time.startsWith("Há"));

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <main className="min-h-screen relative overflow-hidden pb-24">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[60vw] h-[60vw] bg-[#d0bcff]/10 blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-[#FFB0CD]/10 blur-[150px]" />
      </div>

      <header className="sticky top-0 z-50 bg-[#121223]/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-4xl mx-auto">
          <Link href="/" className="text-sm text-[#e3e0f9]/60 hover:text-[#e3e0f9] transition-colors flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-lg font-bold text-[#e3e0f9]">Notificações</h1>
          <button onClick={markAllRead} className="text-sm text-[#d0bcff] hover:text-[#d0bcff]/80">
            Ler todas
          </button>
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto p-6">
        {/* Filter chips */}
        <div className="flex gap-2 mb-6">
          {(["all", "unread"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                filter === f
                  ? "bg-[#d0bcff]/15 text-[#d0bcff] border border-[#d0bcff]/30"
                  : "text-[#e3e0f9]/50 border border-white/10 hover:border-white/20"
              }`}
            >
              {f === "all" ? "Todas" : "Não lidas"}
            </button>
          ))}
        </div>

        {/* Today section */}
        {today.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-bold text-[#e3e0f9]/50 uppercase tracking-widest mb-4 flex items-center gap-3">
              Hoje
              <span className="h-px flex-grow bg-gradient-to-r from-[#d0bcff]/30 to-transparent" />
            </h2>
            <div className="space-y-3">
              {today.map((notification, idx) => {
                const config = TYPE_CONFIG[notification.type];
                const Icon = config.icon;
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`glass-panel rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 group hover:border-[#d0bcff]/30 transition-all ${
                      !notification.read ? "border-[#d0bcff]/20 bg-[#d0bcff]/5" : ""
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full ${config.bg} flex items-center justify-center border ${config.border} shrink-0`}>
                      <Icon className={`w-6 h-6 ${config.color}`} />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-bold text-[#e3e0f9] text-sm">{notification.title}</h3>
                      <p className="text-[#e3e0f9]/50 text-sm mt-1">{notification.description}</p>
                      <p className="text-[10px] text-[#e3e0f9]/30 mt-1">{notification.time}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {notification.actionLabel && (
                        <button className="px-4 py-2 bg-[#d0bcff] text-[#3c0091] rounded-full text-sm font-bold hover:opacity-90 active:scale-95 transition-all shadow-[0_0_15px_rgba(208,188,255,0.4)]">
                          {notification.actionLabel}
                        </button>
                      )}
                      <button
                        onClick={() => dismissNotification(notification.id)}
                        className="p-2 text-[#e3e0f9]/30 hover:text-[#FF6B6B] transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* Earlier section */}
        {earlier.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-[#e3e0f9]/50 uppercase tracking-widest mb-4 flex items-center gap-3">
              Anterior
              <span className="h-px flex-grow bg-gradient-to-r from-[#494454]/30 to-transparent" />
            </h2>
            <div className="space-y-3 opacity-80">
              {earlier.map((notification, idx) => {
                const config = TYPE_CONFIG[notification.type];
                const Icon = config.icon;
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + idx * 0.05 }}
                    className="glass-panel rounded-xl p-4 flex items-center gap-4 group hover:border-[#d0bcff]/30 transition-all"
                  >
                    <div className={`w-12 h-12 rounded-full ${config.bg} flex items-center justify-center border ${config.border} shrink-0`}>
                      <Icon className={`w-6 h-6 ${config.color}`} />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-bold text-[#e3e0f9] text-sm">{notification.title}</h3>
                      <p className="text-[10px] text-[#e3e0f9]/30 mt-1">{notification.time}</p>
                    </div>
                    <button
                      onClick={() => dismissNotification(notification.id)}
                      className="p-2 text-[#e3e0f9]/30 hover:text-[#FF6B6B] transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Bell className="w-12 h-12 text-[#e3e0f9]/20 mx-auto mb-4" />
            <p className="text-[#e3e0f9]/50">Sem notificações</p>
          </div>
        )}
      </div>

      <MobileNav />
      <div className="h-20 md:hidden" />
    </main>
  );
}
