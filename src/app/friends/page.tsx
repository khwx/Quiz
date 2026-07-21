"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, UserPlus, Check, X, Search, UserX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import ToastContainer from "@/components/Toast";
import MobileNav from "@/components/MobileNav";
import { supabase } from "@/lib/supabase";
import { createContextLogger } from "@/lib/logger";

const log = createContextLogger("FriendsPage");

interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  status: string;
  created_at: string;
  profiles?: {
    username: string;
    avatar: string;
  };
}

export default function FriendsPage() {
  const router = useRouter();
  const { toasts, show } = useToast();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    getUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;
    loadFriends();
  }, [userId]);

  const loadFriends = async () => {
    try {
      const res = await fetch(`/api/friends?userId=${userId}`);
      const data = await res.json();
      if (data.friends) {
        const friendsWithProfiles = await Promise.all(
          data.friends.map(async (friend: Friend) => {
            const otherId = friend.user_id === userId ? friend.friend_id : friend.user_id;
            const { data: profile } = await supabase
              .from("profiles")
              .select("username, avatar")
              .eq("id", otherId)
              .single();
            return { ...friend, profiles: profile };
          })
        );
        setFriends(friendsWithProfiles);
      }
    } catch (e) {
      log.error("Failed to load friends", { error: String(e) });
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async () => {
    if (!searchQuery.trim()) return;
    try {
      const { data } = await supabase
        .from("profiles")
        .select("id, username, avatar")
        .ilike("username", `%${searchQuery}%`)
        .limit(10);
      setSearchResults(data || []);
    } catch (e) {
      log.error("Search failed", { error: String(e) });
    }
  };

  const sendFriendRequest = async (friendId: string) => {
    if (!userId) return;
    try {
      const res = await fetch("/api/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, friendId }),
      });
      if (res.ok) {
        show("Pedido de amizade enviado!", "success");
        loadFriends();
      }
    } catch (e) {
      show("Erro ao enviar pedido", "error");
    }
  };

  const acceptFriend = async (friendId: string) => {
    if (!userId) return;
    try {
      await fetch("/api/friends", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, friendId, status: "accepted" }),
      });
      show("Pedido aceite!", "success");
      loadFriends();
    } catch (e) {
      show("Erro ao aceitar pedido", "error");
    }
  };

  const removeFriend = async (friendId: string) => {
    if (!confirm("Remover amigo?")) return;
    if (!userId) return;
    try {
      await fetch("/api/friends", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, friendId }),
      });
      show("Amigo removido", "success");
      loadFriends();
    } catch (e) {
      show("Erro ao remover amigo", "error");
    }
  };

  const pendingFriends = friends.filter((f) => f.status === "pending" && f.friend_id === userId);
  const acceptedFriends = friends.filter((f) => f.status === "accepted");

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
          <h1 className="text-lg font-bold text-[#e3e0f9]">Amigos</h1>
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto p-6 space-y-6">
        {/* Search */}
        <div className="glass-panel p-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Procurar utilizadores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchUsers()}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#d0bcff]"
              />
            </div>
            <button
              onClick={searchUsers}
              className="px-6 py-3 bg-[#d0bcff] text-[#121223] rounded-xl font-bold"
            >
              Procurar
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="mt-4 space-y-2">
              {searchResults.map((user) => (
                <div key={user.id} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#d0bcff] to-[#FFB0CD] flex items-center justify-center font-bold text-[#3c0091]">
                      {user.avatar || "👤"}
                    </div>
                    <span className="text-white font-medium">{user.username}</span>
                  </div>
                  <button
                    onClick={() => sendFriendRequest(user.id)}
                    className="p-2 bg-[#d0bcff]/20 text-[#d0bcff] rounded-lg hover:bg-[#d0bcff]/30"
                  >
                    <UserPlus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending requests */}
        {pendingFriends.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-white mb-4">Pedidos Pendentes</h2>
            <div className="space-y-3">
              {pendingFriends.map((friend) => (
                <div key={friend.id} className="glass-panel p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#d0bcff] to-[#FFB0CD] flex items-center justify-center font-bold text-[#3c0091] text-lg">
                      {friend.profiles?.avatar || "👤"}
                    </div>
                    <div>
                      <p className="text-white font-bold">{friend.profiles?.username || "Utilizador"}</p>
                      <p className="text-white/40 text-sm">Quer ser teu amigo</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => acceptFriend(friend.user_id)}
                      className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => removeFriend(friend.user_id)}
                      className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Friends list */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Amigos ({acceptedFriends.length})</h2>
          {acceptedFriends.length === 0 ? (
            <div className="glass-panel p-8 text-center">
              <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/40">Ainda não tens amigos. Procura utilizadores para adicionar!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {acceptedFriends.map((friend) => (
                <div key={friend.id} className="glass-panel p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#d0bcff] to-[#FFB0CD] flex items-center justify-center font-bold text-[#3c0091] text-lg">
                      {friend.profiles?.avatar || "👤"}
                    </div>
                    <div>
                      <p className="text-white font-bold">{friend.profiles?.username || "Utilizador"}</p>
                      <p className="text-green-400 text-xs">Amigo</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFriend(friend.user_id === userId ? friend.friend_id : friend.user_id)}
                    className="p-2 bg-white/5 text-white/40 rounded-lg hover:text-red-400 hover:bg-red-500/10"
                    aria-label="Remover amigo"
                  >
                    <UserX className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <MobileNav />
      <div className="h-20 md:hidden" />
      <ToastContainer toasts={toasts} onDismiss={() => {}} />
    </main>
  );
}
