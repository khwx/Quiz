export const AVATARS = [
    "🦁", "🐼", "🦊", "🐸", "🦄",
    "🐙", "🎨", "🚀", "⭐", "🌈",
    "🐯", "🐨", "🐺", "🐢", "🦋",
    "🎭", "🎪", "🎯", "🎲", "🎸",
    "🌸", "🌺", "🌻", "🌼", "🌷"
];

export function getRandomAvatar(): string {
    return AVATARS[Math.floor(Math.random() * AVATARS.length)];
}

export function getAvatarByIndex(index: number): string {
    return AVATARS[index % AVATARS.length];
}
