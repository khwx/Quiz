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
  const [localLives, setLocalLives] = useState(3);
  const [tournamentId, setTournamentId] = useState<string | null>(null);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [blindMode, setBlindMode] = useState(false);

  useEffect(() => {
    const connectToGame = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const queryGameId = urlParams.get("gameId");
      const queryCategories = urlParams.get("categories");
      const queryAge = urlParams.get("age");
      const queryTournament = urlParams.get("tournament");
      const queryTeam = urlParams.get("team");

      if (queryTournament) {
        setTournamentId(queryTournament);
        // Fetch tournament settings and apply them
        const { data: tData } = await supabase
          .from("tournaments")
          .select("settings")
          .eq("id", queryTournament)
          .single();
        if (tData?.settings) {
          if (tData.settings.timer) setTimerDuration(tData.settings.timer);
          if (tData.settings.questions) setQuestionCount(tData.settings.questions);
          if (tData.settings.blind_mode) setBlindMode(tData.settings.blind_mode);
        }
      }
      if (queryTeam) setTeamId(queryTeam);

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
        const pinArray = new Uint32Array(1);
        crypto.getRandomValues(pinArray);
        const newPin = String(100000 + (pinArray[0] % 900000));
        const insertData: Record<string, unknown> = { pin: newPin, status: "LOBBY" };
        if (queryTournament) insertData.tournament_id = queryTournament;
        if (queryTeam) insertData.team_id = queryTeam;

        const { data } = await supabase
          .from("games")
          .insert([insertData])
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

  const saveTournamentScore = useCallback(async (finalScore: number) => {
    if (!tournamentId || !teamId) return;
    try {
      await supabase
        .from("tournament_teams")
        .update({ score: finalScore })
        .eq("tournament_id", tournamentId)
        .eq("team_id", teamId);
    } catch (e) {
      console.error("Failed to save tournament score:", e);
    }
  }, [tournamentId, teamId]);

  const advanceTournament = useCallback(async (newStatus: string) => {
    if (!tournamentId) return;
    try {
      await supabase
        .from("tournaments")
        .update({ status: newStatus })
        .eq("id", tournamentId);
    } catch (e) {
      console.error("Failed to advance tournament:", e);
    }
  }, [tournamentId]);

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
    localLives,
    setLocalLives,
    tournamentId,
    teamId,
    blindMode,
    setBlindMode,
    saveTournamentScore,
    advanceTournament,
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