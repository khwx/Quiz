export { };

declare global {
    interface Window {
        __onGCastApiAvailable: (isAvailable: boolean) => void;
        cast: Record<string, unknown>;
        chrome: Record<string, unknown>;
    }
}
