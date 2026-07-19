"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Reaction {
  id: string;
  emoji: string;
  playerName: string;
  timestamp: number;
}

interface TVReactionsProps {
  gameId: string;
}

const REACTION_EMOJIS = ["🔥", "❤️", "😂", "👏", "👍"];

export default function TVReactions({ gameId }: TVReactionsProps) {
  const [reactions, setReactions] = useState<Reaction[]>([]);

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

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      <AnimatePresence>
        {reactions.map((reaction, idx) => (
          <motion.div
            key={reaction.id}
            initial={{ opacity: 0, scale: 0, y: 100, x: `${10 + (idx % 8) * 10}%` }}
            animate={{ opacity: 1, scale: 1, y: `${20 + (idx % 5) * 15}%` }}
            exit={{ opacity: 0, scale: 0, y: -200 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute text-6xl"
            style={{ left: `${5 + (idx % 6) * 15}%`, bottom: "10%" }}
          >
            {reaction.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
