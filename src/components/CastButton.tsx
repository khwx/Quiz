"use client";

import React, { useEffect, useState } from 'react';
import { Cast } from 'lucide-react';

declare global {
    interface Window {
        __onGCastApiAvailable: (isAvailable: boolean) => void;
        cast: any;
        chrome: any;
    }
}

export default function CastButton() {
    const [isApiAvailable, setIsApiAvailable] = useState(false);
    const [isSessionConnected, setIsSessionConnected] = useState(false);

    useEffect(() => {
        // 1. Check if API is already available (re-renders)
        if (window.cast && window.cast.framework) {
            initializeCast();
        }

        // 2. Setup Callback
        window.__onGCastApiAvailable = (isAvailable) => {
            if (isAvailable) {
                initializeCast();
            }
        };

        function initializeCast() {
            try {
                const context = window.cast.framework.CastContext.getInstance();

                context.setOptions({
                    receiverApplicationId: window.chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
                    autoJoinPolicy: window.chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
                });

                setIsApiAvailable(true);

                // Listen for connection changes to toggle button style
                context.addEventListener(
                    window.cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
                    (event: any) => {
                        const sessionState = event.sessionState;
                        const SESSION_STARTED = window.cast.framework.SessionState.SESSION_STARTED;
                        setIsSessionConnected(sessionState === SESSION_STARTED);
                    }
                );

            } catch (e) {
                console.error("Cast Error:", e);
            }
        }
    }, []);

    const handleCastClick = () => {
        if (window.cast && window.cast.framework) {
            window.cast.framework.CastContext.getInstance().requestSession()
                .then(() => console.log("Cast Session Started"))
                .catch((err: any) => console.error("Cast Session Failed", err));
        } else {
            console.warn("Cast API not ready");
        }
    };

    // Always render something to debug, but maybe dim if not ready
    if (!isApiAvailable) {
        // Return a ghost button or nothing? Let's return nothing to be clean
        // but if user says "not appearing", maybe we show a disabled one?
        // Let's hide it until API is ready to avoid confusion.
        return null;
    }

    return (
        <button
            onClick={handleCastClick}
            className={`p-3 rounded-full transition-all duration-300 shadow-lg ${isSessionConnected
                    ? "bg-pink-500 text-white animate-pulse"
                    : "bg-white text-gray-800 hover:bg-gray-100"
                }`}
            title="Transmitir para TV"
        >
            <Cast size={24} />
        </button>
    );
}
