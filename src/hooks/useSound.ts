import { useCallback, useRef, useEffect, useState } from 'react';
import { createAudioContext } from '@/lib/audio';
import { SOUND_TYPES, SOUND_CONFIG, type SoundType } from '@/lib/constants';

export function useSound() {
    const audioContextRef = useRef<AudioContext | null>(null);
    const [soundEnabled, setSoundEnabled] = useState(false);
    const [masterVolume, setMasterVolume] = useState(0.5);
    const bgMusicRef = useRef<{ source: OscillatorNode | null; gain: GainNode | null }>({ source: null, gain: null });

    const unlockAudio = useCallback(() => {
        try {
            const ctx = createAudioContext();
            if (ctx) {
                audioContextRef.current = ctx;
                setSoundEnabled(true);
            }
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
            audioContextRef.current = createAudioContext();
        }
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }
        return audioContextRef.current;
    }, []);

    const playTone = useCallback((freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) => {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const audioCtx = ctx;
            const osc = audioCtx.createOscillator();
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
        const config = SOUND_CONFIG[type];
        if (Array.isArray(config)) {
            config.forEach((note) => {
                setTimeout(() => playTone(note.freq, note.duration, note.type, note.volume), note.delay ?? 0);
            });
        } else if (config && "freq" in config) {
            playTone(config.freq, config.duration, config.type, config.volume);
        }
    }, [soundEnabled, playTone]);

    const startBgMusic = useCallback(() => {
        if (!soundEnabled || !audioContextRef.current) return;
        try {
            const ctx = audioContextRef.current;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(SOUND_CONFIG.bgMusic.freq, ctx.currentTime);
            gain.gain.setValueAtTime(SOUND_CONFIG.bgMusic.volume * masterVolume, ctx.currentTime);
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
