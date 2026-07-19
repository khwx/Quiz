"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X } from "lucide-react";

interface ChatMessage {
  id: string;
  player_name: string;
  message: string;
  created_at: string;
}

interface MobileChatProps {
  gameId: string;
  playerId: string;
  playerName: string;
}

export default function MobileChat({ gameId, playerId, playerName }: MobileChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [sending, setSending] = useState(false);
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
        console.error("Failed to fetch messages:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    const channel = new BroadcastChannel(`chat-${gameId}`);
    channel.onmessage = (event) => {
      if (event.data.type === "new_message") {
        setMessages((prev) => [...prev, event.data.message]);
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
    if (!newMessage.trim() || sending) return;
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId,
          playerId,
          playerName,
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
      console.error("Failed to send message:", e);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Chat toggle button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 z-50 p-3 bg-[#d0bcff] text-[#121223] rounded-full shadow-lg flex items-center gap-2"
        >
          <Send className="w-5 h-5" />
          {messages.length > 0 && (
            <span className="bg-[#121223] text-[#d0bcff] text-xs font-bold px-2 py-0.5 rounded-full">
              {messages.length}
            </span>
          )}
        </button>
      )}

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-[#1e1e30]/95 backdrop-blur-xl border-t border-white/10 rounded-t-2xl flex flex-col"
            style={{ height: "60vh" }}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-white font-bold">Chat</h3>
              <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`flex flex-col ${i % 2 === 0 ? "items-end" : "items-start"}`}>
                      <div className={`h-3 w-16 rounded bg-white/10 animate-pulse ${i % 2 === 0 ? "ml-auto" : ""}`} />
                      <div className={`h-10 w-32 rounded-2xl bg-white/5 animate-pulse mt-1 ${i % 2 === 0 ? "ml-auto" : ""}`} />
                    </div>
                  ))}
                </div>
              ) : messages.length === 0 ? (
                <p className="text-white/30 text-center text-sm py-8">Nenhuma mensagem ainda</p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.player_name === playerName ? "items-end" : "items-start"}`}
                  >
                    <span className="text-[10px] text-white/40 mb-1">{msg.player_name}</span>
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                        msg.player_name === playerName
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

            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Escreve uma mensagem..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#d0bcff] text-sm"
                  maxLength={500}
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || sending}
                  className="p-2 bg-[#d0bcff] text-[#121223] rounded-xl disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
