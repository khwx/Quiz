"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, MessageCircle } from "lucide-react";
import { createContextLogger } from "@/lib/logger";

const log = createContextLogger("TVChat");
import { UserRole } from "@/lib/constants";

interface ChatMessage {
  id: string;
  player_name: string;
  message: string;
  created_at: string;
}

interface TVChatProps {
  gameId: string;
}

export default function TVChat({ gameId }: TVChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/chat?gameId=${gameId}&limit=50`);
        const data = await res.json();
        if (data.messages) {
          setMessages(data.messages);
        }
      } catch (e) {
        log.error("Failed to fetch messages", { error: String(e) });
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    const channel = new BroadcastChannel(`chat-${gameId}`);
    channel.onmessage = (event) => {
      if (event.data.type === "new_message") {
        setMessages((prev) => {
          if (prev.some((m) => m.id === event.data.message.id)) return prev;
          return [...prev, event.data.message];
        });
      }
    };

    return () => {
      channel.close();
    };
  }, [isOpen, gameId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId,
          playerId: UserRole.HOST,
          playerName: "Anfitrião",
          message: newMessage.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
        setNewMessage("");

        const channel = new BroadcastChannel(`chat-${gameId}`);
        channel.postMessage({ type: "new_message", message: data.message });
        channel.close();
      }
    } catch (e) {
      log.error("Failed to send message", { error: String(e) });
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 z-50 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full shadow-lg"
          title="Chat"
        >
          <MessageCircle className="w-5 h-5" />
          {messages.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#FF6B6B] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {messages.length > 9 ? "9+" : messages.length}
            </span>
          )}
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed top-4 right-4 z-50 w-80 bg-[#1e1e30]/95 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col shadow-2xl"
            style={{ height: "400px" }}
          >
            <div className="flex items-center justify-between p-3 border-b border-white/10">
              <h3 className="text-white font-bold text-sm">Chat</h3>
              <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`flex flex-col ${i % 2 === 0 ? "items-end" : "items-start"}`}>
                      <div className={`h-2 w-12 rounded bg-white/10 animate-pulse ${i % 2 === 0 ? "ml-auto" : ""}`} />
                      <div className={`h-8 w-24 rounded-xl bg-white/5 animate-pulse mt-1 ${i % 2 === 0 ? "ml-auto" : ""}`} />
                    </div>
                  ))}
                </div>
              ) : messages.length === 0 ? (
                <p className="text-white/30 text-center text-xs py-8">Nenhuma mensagem</p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.player_name === "Anfitrião" ? "items-end" : "items-start"}`}
                  >
                    <span className="text-[10px] text-white/40 mb-0.5">{msg.player_name}</span>
                    <div
                      className={`max-w-[85%] px-2.5 py-1.5 rounded-xl text-xs ${
                        msg.player_name === "Anfitrião"
                          ? "bg-[#d0bcff] text-[#121223]"
                          : "bg-white/10 text-white"
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Mensagem..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#d0bcff] text-xs"
                  maxLength={500}
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="p-1.5 bg-[#d0bcff] text-[#121223] rounded-lg disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
