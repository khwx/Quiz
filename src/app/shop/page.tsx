"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Crown, Star, Zap, Award, Gift, ShoppingCart, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import ToastContainer from "@/components/Toast";
import MobileNav from "@/components/MobileNav";
import { createContextLogger } from "@/lib/logger";

const log = createContextLogger("ShopPage");

interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: string;
  icon: string;
  data?: Record<string, unknown>;
}

export default function ShopPage() {
  const router = useRouter();
  const { toasts, show } = useToast();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [userXp, setUserXp] = useState(0);
  const [purchased, setPurchased] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [rewardsRes, profileRes] = await Promise.all([
        fetch("/api/rewards"),
        fetch("/api/profile/get"),
      ]);

      const rewardsData = await rewardsRes.json();
      const profileData = await profileRes.json();

      if (rewardsData.rewards) {
        setRewards(rewardsData.rewards);
      }
      if (profileData.profile) {
        setUserXp(profileData.profile.xp || 0);
      }

      const { data: { user } } = await (await import("@/lib/supabase")).supabase.auth.getUser();
      if (user) {
        const { data: userRewards } = await (await import("@/lib/supabase")).supabase
          .from("user_rewards")
          .select("reward_id")
          .eq("user_id", user.id);
        if (userRewards) {
          setPurchased(new Set(userRewards.map((r: { reward_id: string }) => r.reward_id)));
        }
      }
    } catch (e) {
      log.error("Failed to load shop", { error: String(e) });
    } finally {
      setLoading(false);
    }
  };

  const purchaseReward = async (rewardId: string, cost: number) => {
    if (userXp < cost) {
      show("XP insuficiente!", "error");
      return;
    }

    try {
      const res = await fetch("/api/rewards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rewardId }),
      });

      const data = await res.json();
      if (res.ok) {
        show("Recompensa comprada!", "success");
        setUserXp(data.newXp);
        setPurchased((prev) => new Set(prev).add(rewardId));
      } else {
        show(data.error || "Erro ao comprar", "error");
      }
    } catch (e) {
      show("Erro ao comprar recompensa", "error");
    }
  };

  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      crown: <Crown className="w-8 h-8" />,
      star: <Star className="w-8 h-8" />,
      zap: <Zap className="w-8 h-8" />,
      award: <Award className="w-8 h-8" />,
      gift: <Gift className="w-8 h-8" />,
    };
    return icons[iconName] || <Gift className="w-8 h-8" />;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "cosmetic": return "from-[#d0bcff] to-[#a078ff]";
      case "powerup": return "from-[#FFB0CD] to-[#FF6B6B]";
      case "badge": return "from-[#FFD700] to-[#FFA500]";
      default: return "from-gray-400 to-gray-600";
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#d0bcff] border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden pb-24">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#4a007f] blur-[150px] opacity-40 rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#aa0266] blur-[150px] opacity-30 rounded-full" />
      </div>

      <header className="sticky top-0 z-50 bg-[#121223]/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-4xl mx-auto">
          <h1 className="text-lg font-bold text-[#e3e0f9]">Loja de Recompensas</h1>
          <div className="flex items-center gap-2 bg-[#FFD700]/10 px-4 py-2 rounded-full border border-[#FFD700]/20">
            <Star className="w-4 h-4 text-[#FFD700]" />
            <span className="text-[#FFD700] font-bold">{userXp} XP</span>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward, idx) => {
            const isPurchased = purchased.has(reward.id);
            const canAfford = userXp >= reward.cost;
            return (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`glass-panel p-6 rounded-2xl relative overflow-hidden ${
                  isPurchased ? "border-green-400/30" : ""
                }`}
              >
                {isPurchased && (
                  <div className="absolute top-3 right-3 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Comprado
                  </div>
                )}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${getTypeColor(reward.type)} flex items-center justify-center text-white mb-4 shadow-lg`}>
                  {getIcon(reward.icon)}
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{reward.name}</h3>
                <p className="text-sm text-white/60 mb-4">{reward.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 bg-[#FFD700]/10 px-3 py-1.5 rounded-full">
                    <Star className="w-4 h-4 text-[#FFD700]" />
                    <span className="text-[#FFD700] font-bold text-sm">{reward.cost} XP</span>
                  </div>
                  {!isPurchased && (
                    <button
                      onClick={() => purchaseReward(reward.id, reward.cost)}
                      disabled={!canAfford}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                        canAfford
                          ? "bg-[#d0bcff] text-[#121223] hover:shadow-[0_0_15px_rgba(208,188,255,0.3)]"
                          : "bg-white/5 text-white/30 cursor-not-allowed"
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Comprar
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {rewards.length === 0 && (
          <div className="text-center py-12">
            <Gift className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/40">Nenhuma recompensa disponível de momento.</p>
          </div>
        )}
      </div>

      <MobileNav />
      <div className="h-20 md:hidden" />
      <ToastContainer toasts={toasts} onDismiss={() => {}} />
    </main>
  );
}
