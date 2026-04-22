"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useState, useEffect } from "react";

export default function SoundEnableButton() {
    const [soundEnabled, setSoundEnabled] = useState(false);
    const [show, setShow] = useState(true);

    useEffect(() => {
        // Check if sound was already enabled in this session
        const wasEnabled = sessionStorage.getItem("soundEnabled") === "true";
        if (wasEnabled) {
            setSoundEnabled(true);
            setShow(false);
        }
    }, []);

    const enableSound = async () => {
        try {
            // Try to create and resume audio context
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContext) {
                const ctx = new AudioContext();
                if (ctx.state === "suspended") {
                    await ctx.resume();
                }
                // Play a silent sound to fully unlock audio
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                gain.gain.value = 0;
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.1);
            }
            sessionStorage.setItem("soundEnabled", "true");
            setSoundEnabled(true);
            setShow(false);
            console.log("🔊 Som ativado!");
        } catch (e) {
            console.log("Erro ao ativar som:", e);
        }
    };

    // Auto-hide after 5 seconds if user hasn't clicked
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!soundEnabled) {
                setShow(false);
            }
        }, 8000);
        return () => clearTimeout(timer);
    }, [soundEnabled]);

    if (!show) return null;

    return (
        <button
            onClick={enableSound}
            className="fixed bottom-24 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-violet-600/90 text-white rounded-full shadow-lg hover:bg-violet-500 transition-all animate-pulse"
            style={{ boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)" }}
        >
            <Volume2 className="w-5 h-5" />
            <span className="text-sm font-medium">Ativar Som</span>
        </button>
    );
}