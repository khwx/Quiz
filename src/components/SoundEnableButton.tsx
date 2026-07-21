"use client";

import { Volume2 } from "lucide-react";
import { useState, useEffect } from "react";
import { unlockAudio } from "@/lib/audio";
import { GAME_CONSTANTS } from "@/lib/constants";

export default function SoundEnableButton() {
    const [soundEnabled, setSoundEnabled] = useState(false);
    const [show, setShow] = useState(true);

    useEffect(() => {
        const wasEnabled = sessionStorage.getItem("soundEnabled") === "true";
        if (wasEnabled) {
            setSoundEnabled(true);
            setShow(false);
        }
    }, []);

    const enableSound = async () => {
        try {
            await unlockAudio();
            sessionStorage.setItem("soundEnabled", "true");
            setSoundEnabled(true);
            setShow(false);
        } catch (e) {
            // Silent fail
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!soundEnabled) {
                setShow(false);
            }
        }, GAME_CONSTANTS.SOUND_PROMPT_AUTOHIDE_MS);
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