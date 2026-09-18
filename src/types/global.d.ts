export { };

declare global {
    interface Window {
        __onGCastApiAvailable: (isAvailable: boolean) => void;
        cast: {
            framework: {
                CastContext: {
                    getInstance: () => {
                        setOptions: (options: { receiverApplicationId: string; autoJoinPolicy: number }) => void;
                        addEventListener: (eventType: string, listener: (event: { sessionState: string }) => void) => void;
                        getCurrentSession: () => unknown;
                        requestSession: () => Promise<void>;
                    };
                };
                CastContextEventType: {
                    SESSION_STATE_CHANGED: string;
                };
                SessionState: {
                    SESSION_STARTED: string;
                };
            };
        };
        chrome: {
            cast: {
                media: {
                    DEFAULT_MEDIA_RECEIVER_APP_ID: string;
                };
                AutoJoinPolicy: {
                    ORIGIN_SCOPED: number;
                };
            };
        };
    }
}
