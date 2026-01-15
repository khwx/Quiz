"use client";

import React, { useEffect } from 'react';

declare global {
    interface Window {
        __onGCastApiAvailable: (isAvailable: boolean) => void;
        cast: any;
        chrome: any;
    }
}

export default function CastButton() {
    useEffect(() => {
        // Define the callback the Google Cast SDK looks for
        window.__onGCastApiAvailable = (isAvailable) => {
            if (isAvailable && window.cast) {
                try {
                    // Initialize Cast Context
                    // We use the Default Application ID if you don't have a custom one
                    // DEFAULT_MEDIA_RECEIVER_APP_ID: 'CC1AD845'
                    window.cast.framework.CastContext.getInstance().setOptions({
                        receiverApplicationId: window.chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
                        autoJoinPolicy: window.chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
                    });
                } catch (e) {
                    console.error("Error initializing Cast Context:", e);
                }
            }
        };
    }, []);

    return (
        <div className="relative z-50">
            {/* 
        The web component <google-cast-launcher> is provided by the SDK.
        It manages its own visibility (hidden if no devices found).
        We style it to look good in our UI.
      */}
            <google-cast-launcher
                style={{
                    width: '40px',
                    height: '40px',
                    display: 'block',
                    cursor: 'pointer',
                    '--connected-color': '#EC4899', // Pink-500 matches our theme
                    '--disconnected-color': '#A78BFA' // Violet-400
                } as any}
            ></google-cast-launcher>
        </div>
    );
}
