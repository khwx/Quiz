import { useCallback, useRef, useEffect, useState } from 'react';

type SoundType = 'tick' | 'correct' | 'wrong' | 'win' | 'streak' | 'lose_life';

export function useSound() {
    const audioContextRef = useRef<AudioContext | null>(null);
    const [soundEnabled, setSoundEnabled] = useState(false);
    const [masterVolume, setMasterVolume] = useState(0.5);
    const bgMusicRef = useRef<{ source: OscillatorNode | null; gain: GainNode | null }>({ source: null, gain: null });

    const unlockAudio = useCallback(() => {
        try {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            if (audioContextRef.current?.state === 'suspended') {
                audioContextRef.current.resume();
            }
            setSoundEnabled(true);
        } catch (e) {
            // Silent fail
        }
    }, []);

    useEffect(() => {
        const unlock = () => unlockAudio();
        document.addEventListener('click', unlock, { once: true });
        document.addEventListener('touchstart', unlock, { once: true });
        document.addEventListener('keydown', unlock, { once: true });
        return () => {
            document.removeEventListener('click', unlock);
            document.removeEventListener('touchstart', unlock);
            document.removeEventListener('keydown', unlock);
        };
    }, [unlockAudio]);

    const getAudioContext = useCallback(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }
        return audioContextRef.current;
    }, []);

    const playTone = useCallback((freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) => {
        try {
            const ctx = getAudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(volume * masterVolume, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + duration);
        } catch {}
    }, [getAudioContext, masterVolume]);

    const playSound = useCallback((type: SoundType) => {
        if (!soundEnabled) return;
        switch (type) {
            case 'tick':
                playTone(880, 0.08, 'sine', 0.15);
                break;
            case 'correct':
                playTone(523, 0.1, 'sine', 0.25);
                setTimeout(() => playTone(659, 0.1, 'sine', 0.25), 80);
                setTimeout(() => playTone(784, 0.2, 'sine', 0.3), 160);
                break;
            case 'wrong':
                playTone(300, 0.15, 'sawtooth', 0.2);
                setTimeout(() => playTone(250, 0.2, 'sawtooth', 0.15), 120);
                break;
            case 'win':
                [523, 659, 784, 1047].forEach((freq, i) => {
                    setTimeout(() => playTone(freq, 0.25, 'sine', 0.3), i * 120);
                });
                break;
            case 'streak':
                playTone(1200, 0.1, 'sine', 0.2);
                setTimeout(() => playTone(1400, 0.15, 'sine', 0.25), 80);
                break;
            case 'lose_life':
                playTone(400, 0.1, 'triangle', 0.2);
                setTimeout(() => playTone(300, 0.2, 'triangle', 0.15), 100);
                break;
        }
    }, [soundEnabled, playTone]);

    const startBgMusic = useCallback(() => {
        if (!soundEnabled || !audioContextRef.current) return;
        try {
            const ctx = audioContextRef.current;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(220, ctx.currentTime);
            gain.gain.setValueAtTime(0.05 * masterVolume, ctx.currentTime);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            bgMusicRef.current = { source: osc, gain };
        } catch {}
    }, [soundEnabled, masterVolume]);

    const stopBgMusic = useCallback(() => {
        if (bgMusicRef.current.source) {
            try {
                bgMusicRef.current.source.stop();
            } catch {}
            bgMusicRef.current = { source: null, gain: null };
        }
    }, []);

    useEffect(() => {
        return () => stopBgMusic();
    }, [stopBgMusic]);

    return { playSound, unlockAudio, soundEnabled, setSoundEnabled, masterVolume, setMasterVolume, startBgMusic, stopBgMusic };
}
