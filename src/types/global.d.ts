export { };

declare global {
    interface Window {
        __onGCastApiAvailable: (isAvailable: boolean) => void;
        cast: any;
        chrome: any;
    }
}
