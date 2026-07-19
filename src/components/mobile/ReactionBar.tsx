"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Laugh, Flame, Hand, ThumbsUp } from "lucide-react";

interface Reaction {
  id: string;
  emoji: string;
  playerName: string;
  timestamp: number;
}

interface ReactionBarProps {
  gameId: string;
  playerName: string;
}

const REACTIONS = [
  { emoji: "🔥", label: "Fogo", icon: Flame },
  { emoji: "❤️", label: "Coração", icon: Heart },
  { emoji: "😂", label: "Rir", icon: Laugh },
  { emoji: "👏", label: "Palmas", icon: Hand },
  { emoji: "👍", label: "Gosto", icon: ThumbsUp },
];

export default function ReactionBar({ gameId, playerName }: ReactionBarProps) {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [showBar, setShowBar] = useState(false);

  useEffect(() => {
    const channel = new BroadcastChannel(`reactions-${gameId}`);
    channel.onmessage = (event) => {
      if (event.data.type === "reaction") {
        const reaction: Reaction = {
          ...event.data.reaction,
          timestamp: Date.now(),
        };
        setReactions((prev) => [...prev, reaction]);
        setTimeout(() => {
          setReactions((prev) => prev.filter((r) => r.id !== reaction.id));
        }, 3000);
      }
    };
    return () => channel.close();
  }, [gameId]);

  const sendReaction = (emoji: string) => {
    const reaction: Reaction = {
      id: `${Date.now()}-${Math.random()}`,
      emoji,
      playerName,
      timestamp: Date.now(),
    };
    setReactions((prev) => [...prev, reaction]);
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== reaction.id));
    }, 3000);

    const channel = new BroadcastChannel(`reactions-${gameId}`);
    channel.postMessage({ type: "reaction", reaction });
    channel.close();
  };

  return (
    <>
      {/* Floating reactions */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <AnimatePresence>
          {reactions.map((reaction, idx) => (
            <motion.div
              key={reaction.id}
              initial={{ opacity: 0, scale: 0, y: 100, x: `${20 + idx * 15}%` }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0, y: -200 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute bottom-24 text-4xl"
              style={{ left: `${15 + (idx % 5) * 15}%` }}
            >
              {reaction.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Toggle button */}
      {!showBar && (
        <button
          onClick={() => setShowBar(true)}
          className="fixed bottom-24 right-4 z-50 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full shadow-lg"
          title="Reações"
        >
          <Heart className="w-5 h-5" />
        </button>
      )}

      {/* Reaction bar */}
      <AnimatePresence>
        {showBar && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 right-4 z-50 bg-[#1e1e30]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-3 flex gap-2 shadow-2xl"
          >
            {REACTIONS.map((r) => (
              <button
                key={r.emoji}
                onClick={() => sendReaction(r.emoji)}
                className="w-10 h-10 flex items-center justify-center text-2xl hover:scale-125 transition-transform rounded-full bg-white/5"
                title={r.label}
              >
                {r.emoji}
              </button>
            ))}
            <button
              onClick={() => setShowBar(false)}
              className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white rounded-full bg-white/5"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
