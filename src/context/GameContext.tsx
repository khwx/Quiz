"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
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
    joinSpectator: (gameId: string) => Promise<void>;
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

    const fetchPlayersVersionRef = useRef(0);
    const gameStateRef = useRef<GameState>({
        gameId: null,
        status: 'LOBBY',
        currentQuestionIndex: 0,
        currentQuestionId: null,
        players: [],
        gameSettings: {},
        currentQuestion: null,
    });

    useEffect(() => {
        gameStateRef.current = gameState;
    }, [gameState]);

    const fetchPlayers = useCallback(async (id: string) => {
        const version = ++fetchPlayersVersionRef.current;
        const { data } = await supabase.from('players').select('*').eq('game_id', id);
        if (data && version === fetchPlayersVersionRef.current) {
            setGameState(prev => ({ ...prev, players: data }));
        }
    }, []);

    useEffect(() => {
        if (!gameState.gameId) return;

        const currentGameId = gameState.gameId;

        const channel = supabase
            .channel(`game-${currentGameId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'games', filter: `id=eq.${currentGameId}` }, (payload) => {
                const data = payload.new as Record<string, unknown>;
                setGameState(prev => ({
                    ...prev,
                    status: data.status as GameStatus,
                    currentQuestionIndex: data.current_question_index as number,
                    currentQuestionId: (data.settings as GameSettings)?.current_question_id as string || null,
                    gameSettings: (data.settings as GameSettings) || {}
                }));
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'players', filter: `game_id=eq.${currentGameId}` }, () => {
                fetchPlayers(currentGameId);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel).catch(() => {});
        };
    }, [gameState.gameId, fetchPlayers]);

    const setGameId = useCallback((id: string | null) => {
        setGameState(prev => ({ ...prev, gameId: id }));
        if (id) fetchPlayers(id);
    }, [fetchPlayers]);

    const setPlayers = useCallback((players: Player[]) => {
        setGameState(prev => ({ ...prev, players }));
    }, []);

    const updateStatus = useCallback(async (status: GameStatus) => {
        const gameId = gameStateRef.current?.gameId;
        if (!gameId) return;
        setGameState(prev => ({ ...prev, status }));
        await supabase.from('games').update({ status }).eq('id', gameId);
    }, []);

    const nextQuestion = useCallback(async (questionId?: string, correctOption?: number) => {
        const current = gameStateRef.current;
        if (!current?.gameId) return;
        const nextIndex = current.currentQuestionIndex + 1;
        let nextId = questionId;
        if (!nextId && current.gameSettings?.question_ids) {
            nextId = current.gameSettings.question_ids[nextIndex - 1];
        }
        if (!nextId) return;
        setGameState(prev => ({
            ...prev,
            currentQuestionIndex: nextIndex,
            currentQuestionId: nextId,
            status: 'QUESTION',
            gameSettings: {
                ...prev.gameSettings,
                current_question_id: nextId,
                current_correct_option: correctOption !== undefined ? correctOption : prev.gameSettings?.current_correct_option
            }
        }));
        await supabase.from('games').update({
            current_question_index: nextIndex,
            settings: {
                ...current.gameSettings,
                current_question_id: nextId,
                current_correct_option: correctOption !== undefined ? correctOption : current.gameSettings?.current_correct_option
            },
            status: 'QUESTION'
        }).eq('id', current.gameId);
    }, []);

    const joinGame = useCallback(async (gameId: string, playerName: string) => {
        const avatar = getRandomAvatar();
        const color = getRandomColor();

        const { data: { user } } = await supabase.auth.getUser();

        const { data, error } = await supabase.from('players').insert([
            {
                game_id: gameId,
                name: playerName,
                score: 0,
                avatar: avatar,
                color: color,
                user_id: user?.id || null,
                lives: 3,
                eliminated: false
            }
        ]).select();

        if (error) {
            throw error;
        }

        if (data) {
            setGameId(gameId);
        }
    }, [setGameId]);

    const joinSpectator = useCallback(async (gameId: string) => {
        setGameId(gameId);
    }, [setGameId]);

    return (
        <GameContext.Provider value={{ ...gameState, setGameId, setPlayers, updateStatus, nextQuestion, joinGame, joinSpectator }}>
            {children}
        </GameContext.Provider>
    );
}

export const useGame = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error("useGame must be used within a GameProvider");
    }
    return context;
};
