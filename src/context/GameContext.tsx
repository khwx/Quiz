"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getRandomAvatar } from '@/lib/avatars';
import { getRandomColor } from '@/lib/colors';
import type { Player, GameSettings } from '@/types';

export type GameStatus = 'LOBBY' | 'STARTING' | 'QUESTION' | 'REVEAL' | 'LEADERBOARD' | 'FINAL' | 'PODIUM';

interface GameState {
    gameId: string | null;
    status: GameStatus;
    currentQuestionIndex: number;
    currentQuestionId: string | null;
    players: Player[];
    gameSettings: GameSettings;
    currentQuestion: { id: string; correct_option: number } | null;
}

interface GameContextType extends GameState {
    setGameId: (id: string | null) => void;
    setPlayers: (players: Player[]) => void;
    updateStatus: (status: GameStatus) => Promise<void>;
    nextQuestion: (questionId?: string, correctOption?: number) => Promise<void>;
    joinGame: (gameId: string, playerName: string) => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
    const [gameState, setGameState] = useState<GameState>({
        gameId: null,
        status: 'LOBBY',
        currentQuestionIndex: 0,
        currentQuestionId: null,
        players: [],
        gameSettings: {},
        currentQuestion: null,
    });

    // Supabase subscription logic here in a real app
    useEffect(() => {
        if (!gameState.gameId) return;

        // Simulate Realtime for now or subscribe to Supabase
        const channel = supabase
            .channel(`game-${gameState.gameId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'games', filter: `id=eq.${gameState.gameId}` }, (payload) => {
                const data = payload.new as Record<string, unknown>;
                setGameState(prev => ({
                    ...prev,
                    status: data.status as GameStatus,
                    currentQuestionIndex: data.current_question_index as number,
                    currentQuestionId: (data.settings as GameSettings)?.current_question_id as string || null,
                    gameSettings: (data.settings as GameSettings) || {}
                }));
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'players', filter: `game_id=eq.${gameState.gameId}` }, (payload) => {
                // Refresh players list
                fetchPlayers(gameState.gameId!);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [gameState.gameId]);

    const fetchPlayers = async (id: string) => {
        const { data } = await supabase.from('players').select('*').eq('game_id', id);
        if (data) setGameState(prev => ({ ...prev, players: data }));
    };

    const setGameId = (id: string | null) => {
        setGameState(prev => ({ ...prev, gameId: id }));
        if (id) fetchPlayers(id);
    };

    const setPlayers = (players: Player[]) => {
        setGameState(prev => ({ ...prev, players }));
    };

    const updateStatus = async (status: GameStatus) => {
        if (!gameState.gameId) return;
        await supabase.from('games').update({ status }).eq('id', gameState.gameId);
    };

    const nextQuestion = async (questionId?: string, correctOption?: number) => {
        const nextIndex = gameState.currentQuestionIndex + 1;

        let nextId = questionId;
        let nextCorrectOption = correctOption;

        // Fallback: If no ID provided (Host Control), try to find it in settings playlist
        if (!nextId && gameState.gameSettings?.question_ids) {
            if (gameState.gameSettings.question_ids[nextIndex - 1]) {
                nextId = gameState.gameSettings.question_ids[nextIndex - 1];
            }
        }

        await supabase.from('games').update({
            current_question_index: nextIndex,
            settings: {
                ...gameState.gameSettings,
                current_question_id: nextId,
                current_correct_option: nextCorrectOption !== undefined ? nextCorrectOption : gameState.gameSettings?.current_correct_option
            },
            status: 'QUESTION'
        }).eq('id', gameState.gameId);
    };

    const joinGame = async (gameId: string, playerName: string) => {
        const avatar = getRandomAvatar();
        const color = getRandomColor();

        // Get current auth user (if logged in)
        const { data: { user } } = await supabase.auth.getUser();

        const { data, error } = await supabase.from('players').insert([
            {
                game_id: gameId,
                name: playerName,
                score: 0,
                avatar: avatar,
                color: color,
                user_id: user?.id || null
            }
        ]).select();

        if (error) {
            console.error("Erro ao entrar no jogo:", error.message);
            throw error;
        }

        if (data) {
            setGameId(gameId);
        }
    };

    return (
        <GameContext.Provider value={{ ...gameState, setGameId, setPlayers, updateStatus, nextQuestion, joinGame }}>
            {children}
        </GameContext.Provider>
    );
}

export const useGame = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
