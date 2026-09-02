"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Rocket, Trophy, Users, Award, Bell, Settings, Check, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import MobileNav from "@/components/MobileNav";
import ToastContainer from "@/components/Toast";
import { useToast } from "@/hooks/useToast";

interface Notification {
  id: string;
  type: "tournament" | "achievement" | "friend" | "reward" | "system";
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const TYPE_CONFIG = {
  tournament: { icon: Rocket, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
  achievement: { icon: Award, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" },
  friend: { icon: Users, color: "text-secondary", bg: "bg-secondary/10", border: "border-secondary/20" },
  reward: { icon: Trophy, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
  system: { icon: Settings, color: "text-on-surface/50", bg: "bg-white/5", border: "border-white/10" },
};

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [loading, setLoading] = useState(true);
  const { toasts, show: showToast, dismiss } = useToast();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      const realNotifications = (data || []).map((n) => ({
        id: n.id,
        type: n.type as Notification["type"],
        title: n.title,
        description: n.description || "",
        time: new Date(n.created_at).toLocaleDateString("pt-PT", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }),
        read: n.read,
      }));

      setNotifications(realNotifications);
    } catch {
      showToast("Erro ao carregar notificações.", "error");
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;
  const today = filtered.filter((n) => n.time === "Agora" || n.time.startsWith("Há"));
  const earlier = filtered.filter((n) => n.time !== "Agora" && !n.time.startsWith("Há"));

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dismissNotification = async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <main className="min-h-screen relative overflow-hidden pb-24">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[60vw] h-[60vw] bg-primary/10 blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-secondary/10 blur-[150px]" />
      </div>

      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-4xl mx-auto">
          <Link href="/" className="text-sm text-on-surface/60 hover:text-on-surface transition-colors flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-lg font-bold text-on-surface">Notificações</h1>
          <button onClick={markAllRead} className="text-sm text-primary hover:text-primary/80">
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
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "text-on-surface/50 border border-white/10 hover:border-white/20"
              }`}
            >
              {f === "all" ? "Todas" : "Não lidas"}
            </button>
          ))}
        </div>

        {/* Today section */}
        {today.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-bold text-on-surface/50 uppercase tracking-widest mb-4 flex items-center gap-3">
              Hoje
              <span className="h-px flex-grow bg-gradient-to-r from-primary/30 to-transparent" />
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
                    className={`glass-panel rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 group hover:border-primary/30 transition-all ${
                      !notification.read ? "border-primary/20 bg-primary/5" : ""
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full ${config.bg} flex items-center justify-center border ${config.border} shrink-0`}>
                      <Icon className={`w-6 h-6 ${config.color}`} />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-bold text-on-surface text-sm">{notification.title}</h3>
                      <p className="text-on-surface/50 text-sm mt-1">{notification.description}</p>
                      <p className="text-[10px] text-on-surface/30 mt-1">{notification.time}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => dismissNotification(notification.id)}
                        className="p-2 text-on-surface/30 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
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
            <h2 className="text-sm font-bold text-on-surface/50 uppercase tracking-widest mb-4 flex items-center gap-3">
              Anterior
              <span className="h-px flex-grow bg-gradient-to-r from-outline-variant/30 to-transparent" />
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
                    className="glass-panel rounded-xl p-4 flex items-center gap-4 group hover:border-primary/30 transition-all"
                  >
                    <div className={`w-12 h-12 rounded-full ${config.bg} flex items-center justify-center border ${config.border} shrink-0`}>
                      <Icon className={`w-6 h-6 ${config.color}`} />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-bold text-on-surface text-sm">{notification.title}</h3>
                      <p className="text-[10px] text-on-surface/30 mt-1">{notification.time}</p>
                    </div>
                    <button
                      onClick={() => dismissNotification(notification.id)}
                      className="p-2 text-on-surface/30 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
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
            <Bell className="w-12 h-12 text-on-surface/20 mx-auto mb-4" />
            <p className="text-on-surface/50">Sem notificações</p>
          </div>
        )}
      </div>

      <MobileNav />
      <div className="h-20 md:hidden" />
    </main>
  );
}
