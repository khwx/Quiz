import { useCallback, useRef, useEffect, useState } from 'react';

type SoundType = 'tick' | 'correct' | 'wrong' | 'win';

export function useSound() {
    const audioContextRef = useRef<AudioContext | null>(null);
    const [soundEnabled, setSoundEnabled] = useState(false);

    const unlockAudio = useCallback(() => {
        try {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            if (audioContextRef.current?.state === 'suspended') {
                audioContextRef.current.resume();
            }
            setSoundEnabled(true);
            console.log('🔊 Som ativado!');
        } catch (e) {
            console.log('Audio unlock failed:', e);
        }
    }, []);

    // Auto-unlock on first user interaction
    useEffect(() => {
        const unlock = () => {
            unlockAudio();
            console.log('👆 Unlock via interação');
        };
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
        // Resume if suspended
        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }
        return audioContextRef.current;
    }, []);

    const playSound = useCallback((type: SoundType) => {
        try {
            const ctx = getAudioContext();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            // Configure sound based on type
            switch (type) {
                case 'tick':
                    oscillator.frequency.value = 800;
                    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
                    oscillator.start(ctx.currentTime);
                    oscillator.stop(ctx.currentTime + 0.1);
                    break;

                case 'correct':
                    oscillator.frequency.setValueAtTime(523, ctx.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(784, ctx.currentTime + 0.2);
                    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                    oscillator.start(ctx.currentTime);
                    oscillator.stop(ctx.currentTime + 0.3);
                    break;

                case 'wrong':
                    oscillator.frequency.setValueAtTime(400, ctx.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3);
                    oscillator.type = 'sawtooth';
                    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                    oscillator.start(ctx.currentTime);
                    oscillator.stop(ctx.currentTime + 0.3);
                    break;

                case 'win':
                    const notes = [523, 659, 784, 1047];
                    notes.forEach((freq, i) => {
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.connect(gain);
                        gain.connect(ctx.destination);

                        osc.frequency.value = freq;
                        gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.15);
                        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.3);

                        osc.start(ctx.currentTime + i * 0.15);
                        osc.stop(ctx.currentTime + i * 0.15 + 0.3);
                    });
                    return;
            }
        } catch (e) {
            console.log('Play sound error:', e);
        }
    }, [getAudioContext]);

    return { playSound, unlockAudio };
}
