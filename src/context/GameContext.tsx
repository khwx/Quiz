"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getRandomAvatar } from '@/lib/avatars';
import { getRandomColor } from '@/lib/colors';

export type GameStatus = 'LOBBY' | 'STARTING' | 'QUESTION' | 'REVEAL' | 'LEADERBOARD' | 'FINAL' | 'PODIUM';

interface GameState {
    gameId: string | null;
    status: GameStatus;
    currentQuestionIndex: number;
    currentQuestionId: string | null;
    players: any[];
    gameSettings: any;
    currentQuestion: any;
}

interface GameContextType extends GameState {
    setGameId: (id: string | null) => void;
    setPlayers: (players: any[]) => void;
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
                const data = payload.new as any;
                setGameState(prev => ({
                    ...prev,
                    status: data.status,
                    currentQuestionIndex: data.current_question_index,
                    currentQuestionId: data.settings?.current_question_id || null,
                    gameSettings: data.settings || {}
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

    const setPlayers = (players: any[]) => {
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
            // Note: nextIndex is 1-based (question 1, 2, 3...)
            // Array is 0-based. So question 1 is at index 0.
            // When moving to question 2 (nextIndex=2), we want index 1.
            nextId = gameState.gameSettings.question_ids[nextIndex - 1]; // nextIndex is 1-based usually? wait.
            // Let's verify index logic. 
            // Start: index 0. Next: index 1.
            // If current is 1, next is 2.
            // Arrays are 0-indexed.
            // Logic in TV: nextQuestion(questionsToUse[0].id) -> sets index to 1?
            // Let's check update: current_question_index: nextIndex.
            // If existing is 0 -> next is 1. We want array[0].
            // If existing is 1 -> next is 2. We want array[1].

            // Correction: The array is 0-indexed. The index in DB is likely 1-indexed (Question 1, 2...).
            // So if we are going to Question 2, we want array index 1.
            if (gameState.gameSettings.question_ids[nextIndex - 1]) {
                nextId = gameState.gameSettings.question_ids[nextIndex - 1];
            }
        }

        await supabase.from('games').update({
            current_question_index: nextIndex,
            settings: {
                ...gameState.gameSettings,
                current_question_id: nextId, // Important: Update this so Mobile knows!
                current_correct_option: nextCorrectOption !== undefined ? nextCorrectOption : gameState.gameSettings?.current_correct_option
            },
            status: 'QUESTION'
        }).eq('id', gameState.gameId);
    };

    const joinGame = async (gameId: string, playerName: string) => {
        const avatar = getRandomAvatar();
        const color = getRandomColor();

        const { data, error } = await supabase.from('players').insert([
            {
                game_id: gameId,
                name: playerName,
                score: 0,
                avatar: avatar,
                color: color
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
