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
        // 1. Initial check
        if (typeof window !== 'undefined' && window.cast && window.cast.framework) {
            initializeCast();
        }

        // 2. Setup Callback
        window.__onGCastApiAvailable = (isAvailable) => {
            // console.log("Cast API Available:", isAvailable);
            if (isAvailable) {
                initializeCast();
            }
        };

        function initializeCast() {
            if (isApiAvailable) return; // Already init

            try {
                const context = window.cast.framework.CastContext.getInstance();
                context.setOptions({
                    receiverApplicationId: window.chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
                    autoJoinPolicy: window.chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
                });

                setIsApiAvailable(true);

                // Check initial state
                // const session = context.getCurrentSession();
                // setIsSessionConnected(!!session);

                context.addEventListener(
                    window.cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
                    (event: any) => {
                        const sessionState = event.sessionState;
                        const SESSION_STARTED = window.cast.framework.SessionState.SESSION_STARTED;
                        setIsSessionConnected(sessionState === SESSION_STARTED);
                    }
                );
            } catch (e) {
                console.error("Cast Init Error:", e);
            }
        }
    }, []);

    const handleCastClick = () => {
        if (isApiAvailable && window.cast && window.cast.framework) {
            window.cast.framework.CastContext.getInstance().requestSession()
                .then(() => console.log("Session Request Success"))
                .catch((err: any) => {
                    if (err !== 'cancel') console.error("Session Request Failed", err);
                });
        } else {
            alert("O serviço Google Cast ainda não está pronto. Verifique se tem a extensão instalada ou tente atualizar a página.");
        }
    };

    // FORCE RENDER: Show button even if not ready (dimmed) so user knows it exists.
    return (
        <button
            onClick={handleCastClick}
            className={`p-3 rounded-full transition-all duration-300 shadow-lg flex items-center justify-center ${isSessionConnected
                    ? "bg-pink-500 text-white animate-pulse"
                    : isApiAvailable
                        ? "bg-white text-gray-800 hover:bg-gray-100"
                        : "bg-gray-400 text-gray-200 cursor-not-allowed opacity-50"
                }`}
            title={isApiAvailable ? "Transmitir para TV" : "A aguardar Serviço Google Cast..."}
        >
            <Cast size={24} />
        </button>
    );
}
