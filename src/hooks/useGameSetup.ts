"use client";

import { useState, useEffect, useCallback } from "react";
import { useGame } from "@/context/GameContext";
import { supabase } from "@/lib/supabase";

export function useGameSetup() {
  const { gameId, setGameId, status, updateStatus, gameSettings } = useGame();
  const [pin, setPin] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [round, setRound] = useState(1);
  const [topic, setTopic] = useState<string[]>(["Cultura Geral"]);
  const [customTopic, setCustomTopic] = useState("");
  const [ageGroup, setAgeGroup] = useState("adults");
  const [timerDuration, setTimerDuration] = useState(20);
  const [questionCount, setQuestionCount] = useState(5);
  const [localMode, setLocalMode] = useState(false);
  const [localScore, setLocalScore] = useState(0);

  useEffect(() => {
    const connectToGame = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const queryGameId = urlParams.get("gameId");
      const queryCategories = urlParams.get("categories");
      const queryAge = urlParams.get("age");

      if (queryCategories) {
        const cats = queryCategories.split(",");
        setTopic(cats);
      }

      if (queryAge) {
        const ageMap: Record<string, string> = { "8": "kids", "12": "teens", "18": "adults" };
        setAgeGroup(ageMap[queryAge] || "adults");
      }

      if (queryGameId) {
        setGameId(queryGameId);
        const { data } = await supabase.from("games").select("pin").eq("id", queryGameId).single();
        if (data) setPin(data.pin);
        setLoading(false);
        return;
      }

      if (!gameId) {
        const newPin = Math.floor(100000 + Math.random() * 900000).toString();
        const { data } = await supabase
          .from("games")
          .insert([{ pin: newPin, status: "LOBBY" }])
          .select()
          .single();

        if (data) {
          setPin(newPin);
          setGameId(data.id);
        }

        try {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          await supabase.from("games").delete().lt("created_at", yesterday.toISOString());
        } catch (e) {
          console.error("Failed to clean up old rooms:", e);
        }
      }
      setLoading(false);
    };

    connectToGame();
  }, []);

  const resetToLobby = useCallback(() => {
    setGameId(null);
    setRound(1);
    window.location.reload();
  }, [setGameId]);

  return {
    pin,
    loading,
    round,
    setRound,
    topic,
    setTopic,
    customTopic,
    setCustomTopic,
    ageGroup,
    setAgeGroup,
    timerDuration,
    setTimerDuration,
    questionCount,
    setQuestionCount,
    localMode,
    setLocalMode,
    localScore,
    setLocalScore,
    resetToLobby,
  };
}

export const CATEGORIES = [
  { name: "Cultura Geral", icon: "Globe", dbName: "CULTURA_GERAL" },
  { name: "Capitais do Mundo", icon: "Zap", dbName: "CAPITAIS_DO_MUNDO" },
  { name: "Bandeiras", icon: "Flag", dbName: "Bandeiras" },
  { name: "Cinema", icon: "Film", dbName: "CINEMA" },
  { name: "Desporto", icon: "Trophy", dbName: "DESPORTO" },
  { name: "Ciência", icon: "Atom", dbName: "CIENCIA" },
  { name: "Animais", icon: "PawPrint", dbName: "ANIMAIS" },
  { name: "Geografia", icon: "Map", dbName: "GEOGRAFIA" },
  { name: "História", icon: "History", dbName: "HISTORIA" },
  { name: "Música", icon: "Music", dbName: "MUSICA" },
  { name: "Arte", icon: "Palette", dbName: "ARTE" },
  { name: "Gastronomia", icon: "Utensils", dbName: "GASTRONOMIA" },
  { name: "Tecnologia", icon: "Cpu", dbName: "TECNOLOGIA" },
  { name: "Matemática", icon: "GraduationCap", dbName: "MATEMATICA" },
  { name: "Política", icon: "Crown", dbName: "POLITICA" },
] as const;